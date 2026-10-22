import { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, CircleHelp, Loader2, Sparkles, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { validateFitResult, type FitResult } from "@/lib/fit-analysis";
export type { FitResult } from "@/lib/fit-analysis";
import { hasEnoughData, type Opportunity, type Profile } from "@/lib/skillbridge";

export type AnalysisRequest = (profile: Profile, opportunity: Opportunity) => Promise<FitResult>;
type AnalysisState =
  | { status: "idle" | "analyzing" }
  | { status: "error" | "unavailable" | "insufficient"; message?: string }
  | { status: "success"; result: FitResult };

export class AnalysisUnavailableError extends Error {}
export class AnalysisInsufficientError extends Error {}

export function FitAnalysisPanel({ profile, opportunity, request, profileLink }: {
  profile: Profile;
  opportunity: Opportunity;
  request?: AnalysisRequest;
  profileLink: React.ReactNode;
}) {
  const [state, setState] = useState<AnalysisState>({ status: "idle" });
  const generation = useRef(0);
  const pending = useRef(false);

  useEffect(() => {
    generation.current += 1;
    pending.current = false;
    setState({ status: "idle" });
    return () => { generation.current += 1; };
  }, [profile, opportunity, request]);

  async function analyze() {
    if (pending.current) return;
    if (!hasEnoughData(profile)) {
      setState({ status: "insufficient" });
      return;
    }
    if (!request) {
      setState({ status: "unavailable" });
      return;
    }
    const current = ++generation.current;
    pending.current = true;
    setState({ status: "analyzing" });
    try {
      const result = await request(profile, opportunity);
      if (current !== generation.current) return;
      validateFitResult(result);
      setState({ status: "success", result });
    } catch (error) {
      if (current !== generation.current) return;
      setState({ status: error instanceof AnalysisUnavailableError ? "unavailable" : error instanceof AnalysisInsufficientError ? "insufficient" : "error", message: error instanceof Error ? error.message : "The analysis could not be completed. Please try again." });
    } finally {
      if (current === generation.current) pending.current = false;
    }
  }

  const notices = {
    idle: { icon: CircleHelp, title: "No analysis yet", body: "No AI-generated result has been prepared for this profile and opportunity." },
    analyzing: { icon: Loader2, title: "Analyzing your fit…", body: "Reviewing your skills, projects, and experience against this opportunity." },
    insufficient: { icon: AlertCircle, title: "Not enough profile information", body: "Add your skills and at least one project or experience entry before analyzing your fit." },
    unavailable: { icon: WifiOff, title: "Real AI analysis is unavailable", body: request ? "The AI service is currently unavailable. No analysis was completed. Please try again later." : "No AI service has been configured. No real AI analysis has been performed." },
    error: { icon: AlertCircle, title: "We couldn’t complete your analysis", body: "Something went wrong while contacting the AI service. No result is available. Please try again." },
    success: { icon: CheckCircle2, title: "Analysis complete", body: "Based on your current profile and this opportunity. Potential gaps are areas to explore, not a hiring decision." },
  };
  const notice = notices[state.status];
  const Icon = notice.icon;
  const result = state.status === "success" ? state.result : undefined;

  return (
    <section className="mt-8" aria-label="Fit analysis" aria-busy={state.status === "analyzing"}>
      {!request && state.status !== "unavailable" && (
        <div className="mb-6 flex items-start gap-3 rounded-md border border-warning/40 bg-warning/10 p-4 text-sm text-warning-foreground">
          <WifiOff className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p><strong>Real AI analysis is unavailable.</strong> No AI service has been configured.</p>
        </div>
      )}
      <div role={state.status === "error" ? "alert" : "status"} aria-live="polite" className="flex items-start gap-3">
        <Icon className={`mt-1 size-5 shrink-0 text-primary ${state.status === "analyzing" ? "animate-spin motion-reduce:animate-none" : ""}`} aria-hidden="true" />
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">{notice.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{"message" in state && state.message ? state.message : notice.body}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {(state.status === "idle" || state.status === "analyzing" || state.status === "error" || state.status === "success" || (state.status === "unavailable" && request)) && (
          <Button onClick={analyze} disabled={state.status === "analyzing"}>
            {state.status === "analyzing" ? <Loader2 className="animate-spin motion-reduce:animate-none" /> : <Sparkles />}
            {state.status === "analyzing" ? "Analyzing…" : state.status === "error" ? "Try again" : state.status === "success" ? "Analyze again" : "Analyze My Fit"}
          </Button>
        )}
        {state.status === "insufficient" && profileLink}
      </div>
      <div className="mt-8 grid gap-6 border-t border-border pt-6 md:grid-cols-3">
        <ResultSection title="Relevant Skills" items={result?.relevantSkills?.map((x) => ({ title: x.item, details: [{ label: "Evidence", text: x.evidence }, { label: "Relevance", text: x.relevance }] }))} empty="No relevant skills were identified in the supplied profile." status={state.status} />
        <ResultSection title="Potential Gaps" items={result?.potentialGaps?.map((x) => ({ title: x.requirement, details: [{ label: "Reason", text: x.reason }] }))} empty="No potential gaps were identified in the supplied profile." status={state.status} />
        <ResultSection title="Recommended Next Steps" items={result?.recommendedNextSteps?.map((x) => ({ title: x.action, details: [{ label: "Reason", text: x.reason }] }))} empty="No next steps were returned by the AI service." status={state.status} />
      </div>
    </section>
  );
}

function ResultSection({ title, items, empty, status }: {
  title: string; items: { title: string; details: { label: string; text: string }[] }[] | undefined; empty: string; status: AnalysisState["status"];
}) {
  return (
    <section className="min-w-0" aria-label={title}>
      <h3 className="font-display font-semibold text-foreground">{title}</h3>
      {items ? items.length ? (
        <ul className="mt-4 space-y-5 break-words">
          {items.map((item, i) => <li key={i} className="border-l-2 border-primary/30 pl-3">
            <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
            {item.details.map((detail) => <p key={detail.label} className="mt-2 text-sm text-muted-foreground"><strong className="font-medium text-foreground">{detail.label}: </strong>{detail.text}</p>)}
          </li>)}
        </ul>
      ) : <p className="mt-3 text-sm text-muted-foreground">{empty}</p> : (
        <p className="mt-3 text-sm text-muted-foreground">{status === "analyzing" ? "Awaiting analysis…" : "No analysis result yet."}</p>
      )}
    </section>
  );
}
