"use client";

import { useEffect, useMemo, useState } from "react";

type TrackerItem = {
  hour: string;
  label: string;
  status: "done" | "active" | "up-next" | "overnight";
  detail: string;
};

const paceCards = [
  {
    label: "MVP surface",
    value: "72%",
    width: 72,
    tone: "from-cyan-400 to-sky-500",
  },
  {
    label: "Automation readiness",
    value: "58%",
    width: 58,
    tone: "from-violet-400 to-fuchsia-500",
  },
  {
    label: "Revenue confidence",
    value: "34%",
    width: 34,
    tone: "from-emerald-400 to-lime-400",
  },
];

const statCards = [
  { label: "ICP", value: "ACP builders", note: "Devtools + AI infra teams" },
  { label: "Free → paid", value: "Validator → monitoring", note: "Clear self-serve expansion path" },
  { label: "Expected first revenue", value: "7–21 days", note: "Design partner or paid pilot" },
  { label: "Risk level", value: "Medium", note: "Depends on protocol adoption speed" },
];

const milestones = [
  {
    title: "Landing + positioning",
    status: "shipped",
    width: 100,
    note: "Homepage, framing, Vercel baseline are already live.",
  },
  {
    title: "Private operator dashboard",
    status: "active",
    width: 95,
    note: "This view tracks the nightly build and monetization arc.",
  },
  {
    title: "Validator engine",
    status: "queued",
    width: 54,
    note: "Schema checks, linting, scoring, and fix suggestions.",
  },
  {
    title: "Diff mode + release risk",
    status: "queued",
    width: 32,
    note: "Old-vs-new manifest delta analysis.",
  },
  {
    title: "Hosted report pages",
    status: "queued",
    width: 24,
    note: "Shareable readiness pages for prospects and teams.",
  },
];

function getPacificNow(now: Date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(now);
}

function buildTracker(now: Date): TrackerItem[] {
  const pacificHour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      hour: "numeric",
      hour12: false,
    }).format(now),
  );

  const timeline = [
    { hour: 20, label: "Infrastructure shell", detail: "Repo, Vercel, docs, frame the product wedge." },
    { hour: 21, label: "Validator engine", detail: "Manifest parsing, lint checks, readiness scoring." },
    { hour: 22, label: "Report UX", detail: "Severity cards, issue checklist, recommended fixes." },
    { hour: 23, label: "Diff mode", detail: "High-risk manifest changes and release summaries." },
    { hour: 0, label: "Shareable reports", detail: "Hosted report pages and permalink structure." },
    { hour: 1, label: "Monetization layer", detail: "Free/Pro framing, CTA paths, trust copy." },
    { hour: 2, label: "Polish pass", detail: "Empty states, examples, limitations, better explanations." },
    { hour: 3, label: "Expansion buffer", detail: "Downloadable report JSON, badge stub, webhook schema." },
    { hour: 4, label: "Final tightening", detail: "QA, copy cleanup, credibility edits, edge-case handling." },
    { hour: 5, label: "Morning brief prep", detail: "Condense what/why/when-profit for handoff." },
    { hour: 6, label: "Scrape handoff", detail: "Feed learnings into the next opportunity review cycle." },
  ];

  return timeline.map((item) => {
    const normalizedCurrent = pacificHour >= 20 ? pacificHour : pacificHour + 24;
    const normalizedItem = item.hour >= 20 ? item.hour : item.hour + 24;

    let status: TrackerItem["status"] = "up-next";
    if (normalizedItem < normalizedCurrent) status = "done";
    if (normalizedItem === normalizedCurrent) status = "active";
    if (normalizedItem > normalizedCurrent + 2) status = "overnight";

    return {
      hour: item.hour === 0 ? "12 AM" : item.hour > 12 ? `${item.hour - 12} AM` : `${item.hour} ${item.hour >= 12 ? "PM" : "AM"}`,
      label: item.label,
      detail: item.detail,
      status,
    };
  });
}

function statusTone(status: TrackerItem["status"]) {
  switch (status) {
    case "done":
      return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
    case "active":
      return "border-cyan-400/40 bg-cyan-400/10 text-cyan-100";
    case "overnight":
      return "border-violet-400/30 bg-violet-400/10 text-violet-100";
    default:
      return "border-white/10 bg-white/5 text-slate-200";
  }
}

export default function DashboardClient() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const interval = setInterval(tick, 60_000);
    return () => clearInterval(interval);
  }, []);

  const tracker = useMemo(() => buildTracker(now ?? new Date()), [now]);
  const pacificNow = useMemo(() => getPacificNow(now ?? new Date()), [now]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 sm:px-10 lg:px-12">
        <div className="overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.22),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(2,6,23,0.92))] p-8 shadow-[0_0_120px_rgba(8,145,178,0.14)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100">
                <span>🛰️</span>
                <span>Private operator dashboard</span>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.34em] text-cyan-200/70">
                  ACP Watchtower · nightly hustle control room
                </p>
                <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Watch the wedge, the build, and the path to first dollars.
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                  Internal-only dashboard for tonight’s ACP Watchtower push: how the hustle works,
                  what gets automated, where the build stands right now, and when this could plausibly turn into revenue.
                </p>
              </div>
            </div>
            <div className="grid gap-3 rounded-3xl border border-white/10 bg-slate-950/60 p-5 text-sm text-slate-200 lg:min-w-[320px]">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400">Current status</span>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200">
                  On schedule
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400">Live Pacific time</span>
                <span className="font-medium text-white">{pacificNow}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400">Tonight’s wedge</span>
                <span className="font-medium text-white">Manifest validator → readiness reports</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400">Primary monetization bet</span>
                <span className="font-medium text-white">Design partner + Pro monitoring</span>
              </div>
            </div>
          </div>
        </div>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-3">
              {paceCards.map((card) => (
                <article key={card.label} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">{card.label}</p>
                      <p className="mt-2 text-3xl font-semibold text-white">{card.value}</p>
                    </div>
                    <div className={`h-3 w-24 overflow-hidden rounded-full bg-slate-800`}>
                      <div className={`h-full rounded-full bg-gradient-to-r ${card.tone}`} style={{ width: `${card.width}%` }} />
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500">How the hustle works</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Business engine</h2>
                </div>
                <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                  Mermaid + ASCII
                </span>
              </div>
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <pre className="overflow-x-auto rounded-2xl border border-cyan-400/20 bg-slate-950/80 p-5 text-[12px] leading-6 text-cyan-100">
{`flowchart LR
  A[ACP teams discover protocol pain] --> B[Paste manifest into ACP Watchtower]
  B --> C[Validator + lint + readiness scoring]
  C --> D[Shareable report page]
  D --> E[Trust / social proof]
  E --> F[Design partner conversation]
  F --> G[Paid monitoring + diff alerts]`}
                </pre>
                <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/80 p-5 text-[12px] leading-6 text-slate-200">
{`Signal source      Product wedge             Revenue layer
------------       ------------------------  -----------------------
ACP adoption  ---> Manifest validation   ---> Free entry point
Protocol drift ---> Diff + risk reports  ---> Pro monitoring plan
Launch anxiety ---> Shareable scorecard  ---> Design partner upsell`}
                </pre>
              </div>
            </article>

            <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Automation flow</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Operator loop</h2>
                </div>
                <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-100">
                  Build → score → share → sell
                </span>
              </div>
              <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <pre className="overflow-x-auto rounded-2xl border border-violet-400/20 bg-slate-950/80 p-5 text-[12px] leading-6 text-violet-100">
{`flowchart TD
  A[User pastes ACP manifest] --> B[Parse JSON / validate shape]
  B --> C[Run lint rules + score engine]
  C --> D[Generate issue list + fixes]
  D --> E[Create report page]
  E --> F[Track upgrades / later re-checks]
  F --> G[Monitored product + alerting roadmap]`}
                </pre>
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
                  <div className="space-y-4 text-sm text-slate-200">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="font-medium text-white">Input</p>
                      <p className="mt-1 text-slate-400">Manifest paste, upload, sample autofill</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="font-medium text-white">Engine</p>
                      <p className="mt-1 text-slate-400">Structural validation, naming heuristics, safety/clarity linting</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="font-medium text-white">Outputs</p>
                      <p className="mt-1 text-slate-400">Readiness score, issue checklist, release-risk summary, hosted report URL</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div className="grid gap-6">
            <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Revenue timeline</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">When this could profit</h2>
              <div className="mt-6 space-y-4">
                {[
                  { phase: "Tonight", pct: 18, note: "Ship credibility: public site + private ops dashboard + narrative." },
                  { phase: "Next 72 hours", pct: 38, note: "Share demos, collect feedback, identify design partners." },
                  { phase: "Week 1", pct: 58, note: "Close first manual pilot or paid setup if ICP resonance is real." },
                  { phase: "Weeks 2–3", pct: 78, note: "Turn recurring checks / diff alerts into a Pro offer." },
                  { phase: "Month 1", pct: 100, note: "Either first cash, or enough signal to pivot without sunk-cost delusion." },
                ].map((item) => (
                  <div key={item.phase}>
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium text-white">{item.phase}</span>
                      <span className="text-slate-400">{item.pct}% to meaningful proof</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500" style={{ width: `${item.pct}%` }} />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{item.note}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Complementary stats</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Signal support</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {statCards.map((card) => (
                  <div key={card.label} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{card.label}</p>
                    <p className="mt-2 text-xl font-semibold text-white">{card.value}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{card.note}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Current development status</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Build tracker</h2>
            <div className="mt-6 space-y-4">
              {milestones.map((milestone) => (
                <div key={milestone.title} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-white">{milestone.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-400">{milestone.note}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                      milestone.status === "shipped"
                        ? "bg-emerald-400/10 text-emerald-200"
                        : milestone.status === "active"
                          ? "bg-cyan-400/10 text-cyan-100"
                          : "bg-slate-800 text-slate-300"
                    }`}>
                      {milestone.status}
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" style={{ width: `${milestone.width}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Hourly update rail</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Auto-highlights the current build window</h2>
              </div>
              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-100">
                Refreshes every minute
              </span>
            </div>
            <div className="mt-6 space-y-3">
              {tracker.map((item) => (
                <div key={`${item.hour}-${item.label}`} className={`rounded-2xl border p-4 ${statusTone(item.status)}`}>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em]">{item.hour}</p>
                      <p className="mt-1 text-lg font-semibold text-white">{item.label}</p>
                    </div>
                    <span className="rounded-full border border-current/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                      {item.status.replace("-", " ")}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.detail}</p>
                </div>
              ))}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
