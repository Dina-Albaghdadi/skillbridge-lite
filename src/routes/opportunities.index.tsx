import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell, Card, SkillTag, btnSecondary } from "@/components/SiteShell";
import { OPPORTUNITIES } from "@/lib/skillbridge";

export const Route = createFileRoute("/opportunities/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Opportunities — SkillBridge Lite" },
      { name: "description", content: "Browse sample early-career opportunities." },
      { property: "og:title", content: "Opportunities — SkillBridge Lite" },
      { property: "og:description", content: "Browse sample early-career opportunities." },
    ],
  }),
  component: List,
});

function List() {
  return (
    <SiteShell>
      <h1 className="font-display text-3xl font-bold text-foreground">Opportunities</h1>
      <p className="mt-2 text-muted-foreground">Three sample opportunities to compare against your profile.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {OPPORTUNITIES.map((o) => (
          <Card key={o.id} className="flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">{o.company}</p>
            <h2 className="mt-2 font-display text-xl font-semibold text-foreground">{o.title}</h2>
            <p className="mt-3 flex-1 text-sm text-muted-foreground">{o.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {o.skills.map((s) => <SkillTag key={s}>{s}</SkillTag>)}
            </div>
            <Link to="/opportunities/$id" params={{ id: o.id }} className={`${btnSecondary} mt-6`}>View details</Link>
          </Card>
        ))}
      </div>
    </SiteShell>
  );
}
