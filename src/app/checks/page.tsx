import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Checks — ACP Watchtower",
  description: "Complete list of 27+ validation checks ACP Watchtower runs against your manifest, organized by category.",
};

const categories = [
  {
    name: "Schema Completeness",
    color: "cyan",
    checks: [
      { name: "Manifest name present", severity: "critical", detail: "Top-level name or title field must exist." },
      { name: "Actions array defined", severity: "critical", detail: "Manifest must have at least one action." },
      { name: "Action IDs present", severity: "warning", detail: "Each action should have a stable, unique id." },
      { name: "Duplicate action IDs", severity: "critical", detail: "No two actions can share the same id." },
      { name: "Parameter schema defined", severity: "info", detail: "Actions should define input.properties or parameters." },
      { name: "Required fields specified", severity: "info", detail: "Actions with parameters should mark essential ones as required." },
    ],
  },
  {
    name: "Action Clarity",
    color: "amber",
    checks: [
      { name: "Description present", severity: "warning", detail: "Every action needs a description of at least 24 characters." },
      { name: "Description not too short", severity: "warning", detail: "Very short descriptions reduce agent confidence." },
      { name: "Description not too verbose", severity: "info", detail: "Descriptions over 500 characters add noise without clarity." },
      { name: "No placeholder text", severity: "warning", detail: "TODO, TBD, placeholder, and lorem patterns are flagged." },
    ],
  },
  {
    name: "Discoverability",
    color: "violet",
    checks: [
      { name: "Top-level description", severity: "warning", detail: "Manifest should explain its purpose before agents inspect actions." },
      { name: "Action title/name present", severity: "warning", detail: "Agents need a friendly label to select the right tool." },
      { name: "Examples provided", severity: "info", detail: "At least one realistic invocation example per action." },
    ],
  },
  {
    name: "Safety & Guardrails",
    color: "rose",
    checks: [
      { name: "Sensitive action detection", severity: "warning", detail: "Actions with delete, destroy, admin, override, or unsafe keywords are flagged." },
      { name: "Safety notes present", severity: "warning", detail: "Sensitive actions should include safetyNotes explaining constraints." },
    ],
  },
  {
    name: "Maintainability",
    color: "emerald",
    checks: [
      { name: "Version metadata", severity: "warning", detail: "Semantic version string helps with diff tracking and monitoring." },
      { name: "Metadata block", severity: "info", detail: "Owner, contact, and docsUrl improve operational reliability." },
      { name: "Stable ID format", severity: "warning", detail: "IDs should be lowercase kebab-case or dot-separated." },
      { name: "Action surface size", severity: "warning", detail: "Manifests with more than 25 actions should be split." },
    ],
  },
];

function severityBadge(severity: string) {
  const colors: Record<string, string> = {
    critical: "border-rose-400/30 bg-rose-400/10 text-rose-200",
    warning: "border-amber-400/30 bg-amber-400/10 text-amber-200",
    info: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
  };
  return colors[severity] || colors.info;
}

export default function ChecksPage() {
  const totalChecks = categories.reduce((sum, cat) => sum + cat.checks.length, 0);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:px-10">
        <Link href="/" className="text-sm text-cyan-400 hover:text-cyan-300">← Back to home</Link>

        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white">All validation checks</h1>
        <p className="mt-4 text-lg text-slate-300">
          ACP Watchtower runs {totalChecks}+ deterministic checks across {categories.length} categories. Here&apos;s everything we look for.
        </p>

        <div className="mt-12 space-y-10">
          {categories.map((cat) => (
            <section key={cat.name}>
              <h2 className="text-xl font-semibold text-white">{cat.name}</h2>
              <div className="mt-4 space-y-3">
                {cat.checks.map((check) => (
                  <div key={check.name} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${severityBadge(check.severity)}`}>
                      {check.severity}
                    </span>
                    <div>
                      <h3 className="font-medium text-white">{check.name}</h3>
                      <p className="mt-1 text-sm text-slate-400">{check.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-8 text-center">
          <h2 className="text-2xl font-semibold text-white">See them in action</h2>
          <p className="mt-2 text-slate-300">Paste a manifest and see which checks pass or fail.</p>
          <Link href="/" className="mt-4 inline-block rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950">
            Open validator
          </Link>
        </div>
      </div>
    </main>
  );
}
