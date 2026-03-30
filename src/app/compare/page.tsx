import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why ACP Watchtower — vs. Manual Reviews",
  description: "Compare ACP Watchtower automated validation against manual manifest reviews. Save hours per release.",
};

const rows = [
  { check: "Schema validation", manual: "Manual JSON inspection", watchtower: "Automated, deterministic" },
  { check: "Action clarity scoring", manual: "Subjective review", watchtower: "27+ objective checks" },
  { check: "Release diff detection", manual: "git diff + manual review", watchtower: "Structured risk assessment" },
  { check: "Safety guardrail checks", manual: "Depends on reviewer knowledge", watchtower: "Automated flagging of dangerous patterns" },
  { check: "Readiness scoring", manual: "Not standardized", watchtower: "0-100 score across 5 categories" },
  { check: "Shareable reports", manual: "Copy/paste into Slack", watchtower: "Hosted URL + SVG badge" },
  { check: "CI/CD integration", manual: "Custom scripts per team", watchtower: "One API call, webhook-ready" },
  { check: "Monitoring over time", manual: "Not tracked", watchtower: "Cron re-checks + score trends" },
  { check: "Time per review", manual: "15-45 minutes", watchtower: "Under 2 seconds" },
  { check: "Consistency", manual: "Varies by reviewer", watchtower: "Same checks every time" },
];

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:px-10">
        <Link href="/" className="text-sm text-cyan-400 hover:text-cyan-300">← Back to home</Link>

        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Why automate manifest reviews?
        </h1>
        <p className="mt-4 text-lg text-slate-300">
          Manual ACP manifest reviews are slow, inconsistent, and don&apos;t scale. Here&apos;s how ACP Watchtower compares.
        </p>

        <div className="mt-12 space-y-4">
          <div className="grid grid-cols-3 gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-semibold">
            <span className="text-slate-400">Check</span>
            <span className="text-slate-400">Manual review</span>
            <span className="text-cyan-200">ACP Watchtower</span>
          </div>
          {rows.map((row) => (
            <div key={row.check} className="grid grid-cols-3 gap-4 rounded-2xl border border-white/5 bg-slate-900/30 p-4 text-sm">
              <span className="font-medium text-white">{row.check}</span>
              <span className="text-slate-400">{row.manual}</span>
              <span className="text-emerald-300">{row.watchtower}</span>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { stat: "2s", label: "Average analysis time", detail: "vs 15-45 min manual review" },
            { stat: "27+", label: "Automated checks", detail: "Consistent across every analysis" },
            { stat: "5", label: "Scoring categories", detail: "Schema, clarity, safety, discoverability, maintainability" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <div className="text-4xl font-semibold text-cyan-300">{item.stat}</div>
              <div className="mt-2 font-medium text-white">{item.label}</div>
              <div className="mt-1 text-sm text-slate-400">{item.detail}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-8 text-center">
          <h2 className="text-2xl font-semibold text-white">Try it now</h2>
          <p className="mt-2 text-slate-300">Paste a manifest and see the difference in seconds.</p>
          <Link href="/" className="mt-4 inline-block rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950">
            Open validator
          </Link>
        </div>
      </div>
    </main>
  );
}
