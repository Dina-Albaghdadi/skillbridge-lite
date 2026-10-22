import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell, Card, btnPrimary } from "@/components/SiteShell";
import { useProfile, type Profile } from "@/lib/skillbridge";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "My Profile — SkillBridge Lite" },
      { name: "description", content: "Edit your skills, projects, and experience." },
      { property: "og:title", content: "My Profile — SkillBridge Lite" },
      { property: "og:description", content: "Edit your skills, projects, and experience." },
    ],
  }),
  component: ProfilePage,
});

const fields: { key: keyof Profile; label: string; area?: boolean; hint?: string }[] = [
  { key: "name", label: "Name" },
  { key: "headline", label: "Headline" },
  { key: "about", label: "About", area: true },
  { key: "skills", label: "Skills", hint: "Separate skills with commas" },
  { key: "projects", label: "Projects", area: true },
  { key: "experience", label: "Experience", area: true },
];

function ProfilePage() {
  const { profile, isSample, save } = useProfile();
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);
  const input = "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <SiteShell>
      <h1 className="font-display text-3xl font-bold text-foreground">My Profile</h1>
      <p className="mt-2 text-muted-foreground">Your details are kept only for this session.</p>
      {isSample && (
        <div className="mt-6 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-foreground">
          <strong>Sample profile.</strong> This is placeholder data, not your information. Replace it with your own details and save.
        </div>
      )}
      <Card className="mt-6">
        <form
          className="grid gap-5"
          onSubmit={(e) => { e.preventDefault(); save(form); setSaved(true); }}
        >
          {fields.map((f) => (
            <label key={f.key} className="block text-sm font-medium text-foreground">
              {f.label}
              {f.area ? (
                <textarea rows={4} className={input} value={form[f.key]} onChange={(e) => { setForm({ ...form, [f.key]: e.target.value }); setSaved(false); }} />
              ) : (
                <input className={input} value={form[f.key]} onChange={(e) => { setForm({ ...form, [f.key]: e.target.value }); setSaved(false); }} />
              )}
              {f.hint && <span className="mt-1 block text-xs font-normal text-muted-foreground">{f.hint}</span>}
            </label>
          ))}
          <div className="flex items-center gap-4">
            <button type="submit" className={btnPrimary}>Save profile</button>
            {saved && <span className="text-sm text-success">Profile saved.</span>}
          </div>
        </form>
      </Card>
    </SiteShell>
  );
}
