export const metadata = {
  title: "ACP Watchtower — Hustle Dashboard",
  robots: "noindex, nofollow",
};

export default function HustleDashboard() {
  const now = new Date().toISOString();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            🏗️ ACP Watchtower — Hustle Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">Private ops view • Last updated: {now}</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          🟢 ACTIVE
        </span>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Build Status", value: "✅ Clean", color: "emerald" },
          { label: "API Routes", value: "9 active", color: "cyan" },
          { label: "Pages", value: "8 routes", color: "violet" },
          { label: "Revenue", value: "$0 (pre-launch)", color: "slate" },
        ].map((s) => (
          <div
            key={s.label}
            className={`rounded-xl border border-slate-800 bg-slate-900/60 p-4`}
          >
            <p className="text-xs text-slate-500 uppercase tracking-wider">{s.label}</p>
            <p className={`text-lg font-bold mt-1 text-${s.color}-400`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* How It Works — Mermaid-style ASCII */}
      <section className="mb-8 rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-xl font-bold text-cyan-400 mb-4">📐 How ACP Watchtower Works</h2>
        <pre className="text-xs md:text-sm text-emerald-300 font-mono overflow-x-auto leading-relaxed">
{`
  ┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
  │   User / CI/CD  │────▶│  /api/analyze     │────▶│  Scoring Engine │
  │  (paste URL or  │     │  Fetch & validate │     │  Schema check   │
  │   GitHub push)  │     │  ACP manifest     │     │  Action audit   │
  └─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                             │
                          ┌──────────────────┐               │
                          │  Shareable Report │◀──────────────┘
                          │  /report/[id]     │
                          │  Score + details  │
                          └──────────────────┘

  ┌─────────────────────────────────────────────────────────────────┐
  │                    GitHub Webhook (LIVE)                        │
  │                                                                 │
  │  Push event ──▶ /api/github/webhook ──▶ detect manifest change │
  │       ──▶ fetch raw from GitHub ──▶ auto-analyze ──▶ report    │
  └─────────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────────┐
  │                    Vercel Cron (LIVE)                           │
  │                                                                 │
  │  Daily 9am UTC ──▶ /api/cron/recheck ──▶ fetch all sources    │
  │       ──▶ analyze + diff ──▶ save reports ──▶ Discord alerts   │
  └─────────────────────────────────────────────────────────────────┘
`}
        </pre>
      </section>

      {/* Automation Flow */}
      <section className="mb-8 rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-xl font-bold text-cyan-400 mb-4">⚙️ Automation Flow</h2>
        <pre className="text-xs md:text-sm text-amber-300 font-mono overflow-x-auto leading-relaxed">
{`
  ┌──────────┐    ┌────────────┐    ┌──────────────┐    ┌────────────┐
  │ Manifest │───▶│ Fetch JSON │───▶│ Validate     │───▶│ Score 0-100│
  │ URL      │    │ + parse    │    │ schema +     │    │ + grade    │
  └──────────┘    └────────────┘    │ actions +    │    └─────┬──────┘
                                    │ permissions  │          │
                                    └──────────────┘          ▼
                                                     ┌────────────────┐
  ┌──────────┐    ┌────────────┐    ┌──────────────┐ │ Generate       │
  │ Email /  │◀───│ Alert if   │◀───│ Diff against │ │ Report Page    │
  │ Webhook  │    │ score drops│    │ previous ver │ │ /report/[hash] │
  └──────────┘    └────────────┘    └──────────────┘ └────────────────┘
`}
        </pre>
      </section>

      {/* Revenue Timeline */}
      <section className="mb-8 rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-xl font-bold text-cyan-400 mb-4">💰 Revenue Timeline</h2>
        <div className="space-y-4">
          {[
            { phase: "Week 1 (Now)", task: "Deploy MVP, demo flow, shareable reports", status: "🔨 In Progress", pct: 40 },
            { phase: "Week 2", task: "GitHub App integration, first beta users", status: "⏳ Upcoming", pct: 0 },
            { phase: "Week 3-4", task: "Launch on HN/ProductHunt, free tier live", status: "📋 Planned", pct: 0 },
            { phase: "Month 2", task: "Pro tier ($29/mo), 10 paying users = $290 MRR", status: "🎯 Target", pct: 0 },
            { phase: "Month 3+", task: "Enterprise, GitHub Marketplace, $1k+ MRR", status: "🚀 Vision", pct: 0 },
          ].map((r) => (
            <div key={r.phase} className="flex items-center gap-4">
              <div className="w-28 shrink-0 text-sm font-bold text-slate-300">{r.phase}</div>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">{r.task}</span>
                  <span>{r.status}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all"
                    style={{ width: `${r.pct}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-300">
          💡 <strong>Break-even estimate:</strong> ~Month 2 with 10 Pro subscribers at $29/mo = $290 MRR (covers hosting + domain)
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="mb-8 rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-xl font-bold text-cyan-400 mb-4">📊 Pricing & Complementary Stats</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { tier: "Free", price: "$0", features: ["5 analyses/day", "Basic scoring", "Shareable reports"], color: "slate" },
            { tier: "Pro", price: "$29/mo", features: ["Unlimited analyses", "Scheduled re-checks", "Webhook alerts", "Team dashboard"], color: "emerald" },
            { tier: "Enterprise", price: "Custom", features: ["GitHub App", "CI/CD integration", "SLA", "Priority support"], color: "cyan" },
          ].map((t) => (
            <div key={t.tier} className={`rounded-lg border border-${t.color}-500/30 bg-${t.color}-500/5 p-4`}>
              <h3 className={`font-bold text-${t.color}-400`}>{t.tier}</h3>
              <p className="text-2xl font-bold mt-1">{t.price}</p>
              <ul className="mt-3 space-y-1 text-sm text-slate-400">
                {t.features.map((f) => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          {[
            { label: "Target Market", val: "ACP agent teams" },
            { label: "Competitors", val: "~0 direct" },
            { label: "TAM (est)", val: "5K+ teams" },
            { label: "Moat", val: "First mover + GitHub" },
          ].map((s) => (
            <div key={s.label} className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className="text-sm font-bold text-slate-200">{s.val}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dev Status Tracker */}
      <section className="mb-8 rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-xl font-bold text-cyan-400 mb-4">🛠️ Development Status Tracker</h2>
        <div className="space-y-3">
          {[
            { task: "Next.js 16 MVP (routes, scoring, reports)", status: "done", pct: 100 },
            { task: "Landing page + meta tags + OG", status: "done", pct: 100 },
            { task: "About / Docs page", status: "done", pct: 100 },
            { task: "Pricing page placeholder", status: "done", pct: 100 },
            { task: "Cron recheck (daily source monitoring)", status: "done", pct: 100 },
            { task: "GitHub webhook (auto-analyze on push)", status: "done", pct: 100 },
            { task: "Webhook ingest (external submissions)", status: "done", pct: 100 },
            { task: "Source tracking API (/api/sources)", status: "done", pct: 100 },
            { task: "Discord notifications (webhook alerts)", status: "done", pct: 100 },
            { task: "Deploy to Vercel", status: "wip", pct: 60 },
            { task: "Live demo flow (Try It Now)", status: "wip", pct: 20 },
            { task: "Auth + user accounts", status: "planned", pct: 0 },
            { task: "Stripe billing integration", status: "planned", pct: 0 },
            { task: "GitHub Marketplace listing", status: "planned", pct: 0 },
          ].map((t) => (
            <div key={t.task} className="flex items-center gap-3">
              <span className="text-sm w-6">
                {t.status === "done" ? "✅" : t.status === "wip" ? "🔨" : "📋"}
              </span>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className={t.status === "done" ? "text-slate-500 line-through" : "text-slate-200"}>
                    {t.task}
                  </span>
                  <span className="text-xs text-slate-500">{t.pct}%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      t.status === "done"
                        ? "bg-emerald-600"
                        : t.status === "wip"
                        ? "bg-amber-500"
                        : "bg-slate-700"
                    }`}
                    style={{ width: `${t.pct}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-600">Overall progress: ~65% to launch-ready</p>
      </section>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-600 py-4 border-t border-slate-800">
        ACP Watchtower Hustle Dashboard • Private • Do not share
      </footer>
    </main>
  );
}
