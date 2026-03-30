import WatchtowerWorkbench from "@/components/WatchtowerWorkbench";
import WaitlistForm from "@/components/WaitlistForm";

const pillars = [
  {
    title: "Manifest validation",
    description:
      "Run deterministic structural checks, metadata linting, and readiness scoring before ACP apps hit production.",
  },
  {
    title: "Release diffing",
    description:
      "Compare old vs new manifests, flag risky action drift, and generate a short release-risk summary.",
  },
  {
    title: "Automation hooks",
    description:
      "Persist hosted reports, emit webhook-ready payloads, and expose scheduled re-check endpoints for recurring monitoring.",
  },
];

const milestones = [
  "Validator workbench with manifest paste and demo samples",
  "Readiness scoring with severity cards, category subscores, and fix guidance",
  "Diff mode for action additions, removals, parameter changes, and description drift",
  "Hosted report generation with file-based persistence and shareable URLs",
  "Webhook stub + Vercel Cron-ready scheduled re-check endpoint",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex max-w-7xl flex-col gap-16 px-6 py-16 sm:px-10 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200">
              <span>🔭</span>
              <span>ACP Watchtower</span>
            </div>
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Agent protocol reliability infrastructure</p>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Validate manifests, catch action drift, and automate readiness checks.
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
                ACP Watchtower is the fastest way to turn an ACP manifest into a clear readiness score,
                a release-risk diff, and a shareable report your team can actually act on.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-200">
              <span className="rounded-full border border-slate-800 bg-slate-900 px-4 py-2">Readiness scoring</span>
              <span className="rounded-full border border-slate-800 bg-slate-900 px-4 py-2">Action linting</span>
              <span className="rounded-full border border-slate-800 bg-slate-900 px-4 py-2">Manifest diff mode</span>
              <span className="rounded-full border border-slate-800 bg-slate-900 px-4 py-2">Webhook-ready reports</span>
              <span className="rounded-full border border-slate-800 bg-slate-900 px-4 py-2">Scheduled re-checks</span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-cyan-200">Build status</p>
                <p className="text-sm text-slate-400">Tonight’s MVP stack is live, demoable, and automation-ready.</p>
              </div>
              <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">MVP LIVE</span>
            </div>
            <div className="space-y-3 text-sm text-slate-200">
              {milestones.map((milestone) => (
                <div key={milestone} className="flex items-start gap-3 rounded-2xl border border-white/5 bg-slate-950/60 px-4 py-3">
                  <span className="mt-0.5 text-emerald-300">✓</span>
                  <span>{milestone}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="grid gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold text-white">{pillar.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{pillar.description}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-8 rounded-3xl border border-white/10 bg-slate-900/70 p-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Automation-first revenue path</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Free validator now, monitoring and alerts next.</h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
              <li>• Free: manual validation, readiness scoring, and basic release diffing</li>
              <li>• Pro: saved history, nightly re-checks, webhook alerts, and score trends</li>
              <li>• Design partner: rollout reviews, report customization, and reliability audits</li>
            </ul>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">What ships tonight</p>
            <ol className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
              <li>1. Deterministic validator engine</li>
              <li>2. Score + issues + recommendations UI</li>
              <li>3. Diff mode for release-risk reviews</li>
              <li>4. Hosted report persistence and public report pages</li>
              <li>5. Webhook schema + Vercel Cron monitoring hooks</li>
            </ol>
          </div>
        </section>

        <section className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <h2 className="text-2xl font-semibold text-white">Get early access to Pro</h2>
              <p className="mt-2 text-sm text-slate-300">Scheduled re-checks, webhook alerts, team dashboards, and CI/CD integration. Join the waitlist — we launch soon.</p>
            </div>
            <WaitlistForm plan="pro" />
          </div>
        </section>

        <WatchtowerWorkbench />

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">FAQ</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Common questions</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {[
              { q: "What is ACP?", a: "The Agent Communication Protocol defines how AI agents discover and invoke actions exposed by applications. Think of it as an API contract designed specifically for agent-to-app communication." },
              { q: "Do you store my manifest?", a: "Only if you explicitly create a hosted report. Ad-hoc analyses are stateless — nothing is saved unless you click 'Create hosted report'." },
              { q: "How is the readiness score calculated?", a: "We run deterministic checks across five categories: schema completeness, action clarity, discoverability, safety guardrails, and maintainability. Each issue reduces the category score based on severity." },
              { q: "Can I automate this?", a: "Yes. POST to /api/analyze with your manifest JSON, or set up /api/cron/recheck for scheduled monitoring. GitHub webhook support is also available for CI/CD integration." },
              { q: "Is there a CLI?", a: "Not yet — but the API is fully usable from curl or any HTTP client. A CLI is on the roadmap for Pro users." },
              { q: "What does the badge show?", a: "After creating a hosted report, you get an SVG badge URL showing your readiness score and verdict. Embed it in your README to signal agent-readiness to your users." },
            ].map(({ q, a }) => (
              <div key={q}>
                <h3 className="font-semibold text-white">{q}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">{a}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
