import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell, btnPrimary, btnSecondary } from "@/components/SiteShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "SkillBridge Lite — Understand your fit" },
      { name: "description", content: "See how your skills and projects relate to an opportunity and what to improve next." },
      { property: "og:title", content: "SkillBridge Lite — Understand your fit" },
      { property: "og:description", content: "See how your skills and projects relate to an opportunity and what to improve next." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteShell>
      <section className="py-10 md:py-20 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">SkillBridge Lite</p>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-foreground md:text-6xl">
          Understand Your Fit. Discover Your Next Step.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          For students, recent graduates, and early-career professionals. Compare your documented skills,
          projects, and experience with a professional opportunity — and find out what to improve.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/opportunities" className={btnPrimary}>Explore Opportunities</Link>
          <Link to="/profile" className={btnSecondary}>Complete My Profile</Link>
        </div>
      </section>
    </SiteShell>
  );
}
