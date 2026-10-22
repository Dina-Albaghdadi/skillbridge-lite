import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/profile", label: "My Profile" },
  { to: "/opportunities", label: "Opportunities" },
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <Link to="/" className="font-display text-lg font-bold text-foreground">
            SkillBridge <span className="text-primary">Lite</span>
          </Link>
          <nav className="flex gap-1 text-sm">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-10 md:py-14">{children}</main>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-border bg-card p-6 shadow-card ${className}`}>{children}</div>;
}

export const btnPrimary =
  "inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition-colors hover:bg-primary/90";
export const btnSecondary =
  "inline-flex items-center justify-center rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary";

export function SkillTag({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "good" | "gap" }) {
  const t = tone === "good" ? "bg-success/15 text-success" : tone === "gap" ? "bg-warning/20 text-warning-foreground" : "bg-secondary text-secondary-foreground";
  return <span className={`rounded-full px-3 py-1 text-xs font-medium ${t}`}>{children}</span>;
}
