import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works — ACP Watchtower",
  description: "Learn how ACP Watchtower validates manifests, scores readiness, diffs releases, and automates monitoring.",
};

const steps = [
  {
    num: "01",
    title: "Paste or upload your ACP manifest",
    detail: "Drop in your manifest JSON — or fetch it from a URL. We accept any valid ACP manifest structure, from minimal definitions to full production specs.",
  },
  {
    num: "02",
    title: "Get a deterministic readiness score",
    detail: "Our engine runs 20+ structural, metadata, and safety checks across five categories: schema completeness, action clarity, discoverability, safety guardrails, and maintainability. Each issue is tagged by severity with a specific fix recommendation.",
  },
  {
    num: "03",
    title: "Compare releases with diff mode",
    detail: "Paste old and new manifests side-by-side. We detect added, removed, and changed actions, flag parameter drift, and generate a release-risk assessment before you ship.",
  },
  {
    num: "04",
    title: "Share hosted reports",
    detail: "Save your analysis as a hosted report with a permanent URL. Share with teammates, embed in PRs, or link from your README with an SVG badge.",
  },
  {
    num: "05",
    title: "Automate with APIs and cron",
    detail: "POST to /api/analyze for on-demand scoring. Set up /api/cron/recheck for nightly monitoring. Wire up /api/github/webhook for CI/CD integration. All responses follow a stable webhook schema.",
  },
];

const integrations = [
  { name: "GitHub Actions", detail: "Trigger analysis on every PR that touches your manifest file." },
  { name: "Vercel Cron", detail: "Schedule nightly re-checks with zero infrastructure." },
  { name: "Discord / Slack", detail: "Get rich notification embeds when scores drop or actions drift." },
  { name: "Webhooks", detail: "POST results to any endpoint with our stable event schema." },
];

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-20 sm:px-10">
        <Link href="/" className="text-sm text-cyan-400 hover:text-cyan-300">← Back to home</Link>

        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          How ACP Watchtower works
        </h1>
        <p className="mt-4 text-lg text-slate-300">
          From paste to production confidence in five steps.
        </p>

        <div className="mt-16 space-y-12">
          {steps.map((step) => (
            <div key={step.num} className="flex gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-lg font-semibold text-cyan-200">
                {step.num}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{step.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-300">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-20">
          <h2 className="text-2xl font-semibold text-white">Integration options</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {integrations.map((item) => (
              <div key={item.name} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="font-semibold text-white">{item.name}</h3>
                <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <h2 className="text-2xl font-semibold text-white">API quick start</h2>
          <pre className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/80 p-6 text-sm leading-7 text-slate-200">
{`# Analyze a manifest
curl -X POST https://acp-watchtower.vercel.app/api/analyze \\
  -H "Content-Type: application/json" \\
  -d '{"manifest": "{\\"name\\": \\"My Agent\\", \\"actions\\": []}"}'

# Diff two manifests
curl -X POST https://acp-watchtower.vercel.app/api/diff \\
  -H "Content-Type: application/json" \\
  -d '{"oldManifest": "...", "newManifest": "..."}'

# Create a hosted report
curl -X POST https://acp-watchtower.vercel.app/api/reports \\
  -H "Content-Type: application/json" \\
  -d '{"manifest": "...", "sourceLabel": "ci-check"}'`}
          </pre>
        </section>

        <section className="mt-20">
          <h2 className="text-2xl font-semibold text-white">More resources</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Link href="/docs/validation-guide" className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-400/30">
              <h3 className="font-semibold text-white">Validation Guide →</h3>
              <p className="mt-2 text-sm text-slate-300">Learn what makes a good ACP manifest: scoring categories, common mistakes, and best practices.</p>
            </Link>
            <Link href="/docs/ci" className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-400/30">
              <h3 className="font-semibold text-white">CI/CD Integration Guide →</h3>
              <p className="mt-2 text-sm text-slate-300">GitHub Actions, GitLab CI, and generic curl examples for automated manifest validation.</p>
            </Link>
            <Link href="/examples" className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-400/30">
              <h3 className="font-semibold text-white">Example Manifests →</h3>
              <p className="mt-2 text-sm text-slate-300">Real-world patterns for support, e-commerce, CRM, DevOps, and more.</p>
            </Link>
            <Link href="/compare" className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-400/30">
              <h3 className="font-semibold text-white">Manual vs Automated →</h3>
              <p className="mt-2 text-sm text-slate-300">See how automated validation compares to manual manifest reviews.</p>
            </Link>
            <Link href="/changelog" className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-400/30">
              <h3 className="font-semibold text-white">Changelog →</h3>
              <p className="mt-2 text-sm text-slate-300">What's new in ACP Watchtower — features, improvements, and fixes.</p>
            </Link>
          </div>
        </section>

        <div className="mt-16 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-8 text-center">
          <h2 className="text-2xl font-semibold text-white">Ready to validate?</h2>
          <p className="mt-2 text-slate-300">Paste a manifest and get your readiness score in seconds.</p>
          <Link href="/" className="mt-4 inline-block rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950">
            Open validator
          </Link>
        </div>
      </div>
    </main>
  );
}
