import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { analyzeFit } from "@/lib/fit-analysis.functions";
import { validateFitResult } from "@/lib/fit-analysis";
import { FitAnalysisPanel, AnalysisUnavailableError, AnalysisInsufficientError, type AnalysisRequest } from "@/components/FitAnalysisPanel";
import { OPPORTUNITIES, useProfile } from "@/lib/skillbridge";

export const Route = createFileRoute("/opportunities/$id/analysis")({
  loader: ({ params }) => {
    const o = OPPORTUNITIES.find((x) => x.id === params.id);
    if (!o) throw notFound();
    return o;
  },
  head: ({ loaderData }) => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: loaderData ? `Fit Analysis: ${loaderData.title} — SkillBridge Lite` : "Fit Analysis — SkillBridge Lite" },
      { name: "description", content: "Relevant skills, potential gaps, and recommended next steps." },
      { property: "og:title", content: "AI Fit Analysis — SkillBridge Lite" },
      { property: "og:description", content: "Relevant skills, potential gaps, and recommended next steps." },
    ],
  }),
  component: Analysis,
});

function Analysis() {
  const opportunity = Route.useLoaderData();
  const { profile, isSample } = useProfile();

  const callAnalysis = useServerFn(analyzeFit);
  const request = useCallback<AnalysisRequest>(async (savedProfile, selectedOpportunity) => {
    const response = await callAnalysis({ data: { profile: savedProfile, opportunityId: selectedOpportunity.id } });
    if (response.status === "unavailable") throw new AnalysisUnavailableError(response.message);
    if (response.status === "insufficient") throw new AnalysisInsufficientError(response.message);
    if (response.status === "error") throw new Error(response.message);
    if (response.status === "success") return validateFitResult(response.result);
    throw new Error(response.message);
  }, [callAnalysis]);

  return (
    <SiteShell>
      <Link to="/opportunities/$id" params={{ id: opportunity.id }} className="text-sm text-muted-foreground hover:text-foreground">← Back to {opportunity.title}</Link>
      <h1 className="mt-4 font-display text-3xl font-bold text-foreground">AI Fit Analysis</h1>
      <p className="mt-2 text-muted-foreground">
        {opportunity.title} at {opportunity.company} · Profile: {profile.name || "Unnamed"} {isSample && <span className="text-warning-foreground">(sample profile)</span>}
      </p>
      <FitAnalysisPanel
        request={request}
        profile={profile}
        opportunity={opportunity}
        profileLink={<Button asChild><Link to="/profile">Complete My Profile</Link></Button>}
      />
    </SiteShell>
  );
}
