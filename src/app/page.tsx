const pillars = [
  {
    title: "Manifest validation",
    description:
      "Validate ACP manifests for structural completeness, metadata quality, and readiness before they hit production.",
  },
  {
    title: "Release diffing",
    description:
      "Compare manifest versions, surface risky changes, and generate short release-risk summaries for teams shipping fast.",
  },
  {
    title: "Shareable reports",
    description:
      "Turn technical findings into polished readiness reports that can be shared across engineering, product, and ops.",
  },
];

const milestones = [
  "Next.js + TypeScript + Tailwind base scaffold",
  "Professional docs and product framing",
  "Vercel-linked deployment target",
  "Repository initialized and ready for build sessions",
  "Validator engine, diff mode, and reports queued for implementation",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16 sm:px-10 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_0.85fr] lg:items-end">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200">
              <span>🔭</span>
              <span>ACP Watchtower</span>
            </div>
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.32em] text-slate-400">
                Agent protocol reliability infrastructure
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Make your ACP app actually agent-ready.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                ACP Watchtower helps teams validate manifests, catch action drift,
                and generate shareable readiness reports before agents break in
                production.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-200">
              <span className="rounded-full border border-slate-800 bg-slate-900 px-4 py-2">
                Manifest validator
              </span>
              <span className="rounded-full border border-slate-800 bg-slate-900 px-4 py-2">
                Readiness scoring
              </span>
              <span className="rounded-full border border-slate-800 bg-slate-900 px-4 py-2">
                Release diff checks
              </span>
              <span className="rounded-full border border-slate-800 bg-slate-900 px-4 py-2">
                Shareable hosted reports
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-cyan-200">
                  Infrastructure status
                </p>
                <p className="text-sm text-slate-400">
                  Night-one build shell, docs, and deployment target are live.
                </p>
              </div>
              <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                INFRA ONLY
              </span>
            </div>
            <div className="space-y-3 text-sm text-slate-200">
              {milestones.map((milestone) => (
                <div
                  key={milestone}
                  className="flex items-start gap-3 rounded-2xl border border-white/5 bg-slate-950/60 px-4 py-3"
                >
                  <span className="mt-0.5 text-emerald-300">✓</span>
                  <span>{milestone}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="grid gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <h2 className="text-xl font-semibold text-white">{pillar.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {pillar.description}
              </p>
            </article>
          ))}
        </section>

        <section className="grid gap-8 rounded-3xl border border-white/10 bg-slate-900/70 p-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
              Revenue model
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Free wedge, then monitoring and team workflows.
            </h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
              <li>• Free: one-off validation, readiness score, basic manifest diffs</li>
              <li>• Pro: saved history, recurring checks, alerting, and score trends</li>
              <li>• Design partner: assisted onboarding, workflow reviews, trust reports</li>
            </ul>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
              Build sequence
            </p>
            <ol className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
              <li>1. Infrastructure and deployment shell</li>
              <li>2. Deterministic validator engine</li>
              <li>3. Report UX with issue severities and fix guidance</li>
              <li>4. Manifest diff mode and release-risk summaries</li>
              <li>5. Shareable hosted report pages and monetization hooks</li>
            </ol>
          </div>
        </section>
      </section>
    </main>
  );
}
