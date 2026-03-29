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
    value: "91%",
    width: 91,
    tone: "from-cyan-400 to-sky-500",
  },
  {
    label: "Automation readiness",
    value: "86%",
    width: 86,
    tone: "from-violet-400 to-fuchsia-500",
  },
  {
    label: "Revenue confidence",
    value: "43%",
    width: 43,
    tone: "from-emerald-400 to-lime-400",
  },
];

const statCards = [
  { label: "ICP", value: "ACP builders", note: "Devtools + AI infra teams" },
  { label: "Free → paid", value: "Validator → monitoring", note: "Saved history + nightly checks + alerts" },
  { label: "Expected first revenue", value: "7–21 days", note: "Design partner or paid pilot" },
  { label: "Risk level", value: "Medium", note: "Depends on ACP adoption velocity" },
];

const milestones = [
  {
    title: "Landing + positioning",
    status: "shipped",
    width: 100,
    note: "Homepage now matches the actual validator, diff, and automation story.",
  },
  {
    title: "Private operator dashboard",
    status: "shipped",
    width: 100,
    note: "Dashboard reflects tonight's real implementation status and monetization arc.",
  },
  {
    title: "Validator engine",
    status: "shipped",
    width: 100,
    note: "Manifest parsing, lint checks, scoring, and fix suggestions are live.",
  },
  {
    title: "Diff mode + release risk",
    status: "shipped",
    width: 100,
    note: "Old-vs-new manifest drift detection and release summaries are live.",
  },
  {
    title: "Hosted report pages",
    status: "shipped",
    width: 100,
    note: "Reports persist locally and get a shareable hosted route.",
  },
  {
    title: "Automation hooks",
    status: "shipped",
    width: 92,
    note: "API routes, webhook schema, and Vercel Cron re-check endpoint are in place.",
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
    { hour: 20, label: "Infrastructure shell", detail: "Repo, Vercel, docs, and positioning done." },
    { hour: 21, label: "Validator engine", detail: "Deterministic analysis + readiness scoring shipped." },
    { hour: 22, label: "Report UX", detail: "Severity cards, recommendations, and copyable summary shipped." },
    { hour: 23, label: "Diff mode", detail: "Release-risk compare flow shipped." },
    { hour: 0, label: "Hosted reports", detail: "Saved report pages and report API shipped." },
    { hour: 1, label: "Monitoring hooks", detail: "Webhook stub and cron re-check endpoint shipped." },
    { hour: 2, label: "Monetization layer", detail: "Homepage and dashboard frame free vs Pro vs design partner path." },
    { hour: 3, label: "Polish pass", detail: "Sample manifests, docs, and changelog shipped." },
    { hour: 4, label: "Final tightening", detail: "Lint, build, commit, push, and deployment verification." },
    { hour: 5, label: "Morning brief prep", detail: "Prepare short what/why/when-profit handoff." },
    { hour: 6, label: "Scrape handoff", detail: "Feed learnings into next-night review cycle." },
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
                <p className="text-sm uppercase tracking-[0.34em] text-cyan-200/70">ACP Watchtower · nightly hustle control room</p>
                <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  The MVP is shipped. Now it’s about proving the monitoring wedge.
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                  Internal-only dashboard for ACP Watchtower: what’s built, what’s automated already, and where the first-money path comes from.
                </p>
              </div>
            </div>
            <div className="grid gap-3 rounded-3xl border border-white/10 bg-slate-950/60 p-5 text-sm text-slate-200 lg:min-w-[320px]">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400">Current status</span>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200">MVP shipped</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400">Live Pacific time</span>
                <span className="font-medium text-white">{pacificNow}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400">Tonight’s wedge</span>
                <span className="font-medium text-white">Validator → reports → monitoring</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400">Primary monetization bet</span>
                <span className="font-medium text-white">Pro monitoring + design partner</span>
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
                    <div className="h-3 w-24 overflow-hidden rounded-full bg-slate-800">
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
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5">
                  <p className="text-sm uppercase tracking-[0.22em] text-cyan-100">Free wedge</p>
                  <p className="mt-3 text-lg font-medium text-white">Manual validation + report generation</p>
                  <p className="mt-3 text-sm leading-7 text-cyan-50/90">Let builders paste a manifest, get value instantly, and share a credible report with their team.</p>
                </div>
                <div className="rounded-3xl border border-violet-400/20 bg-violet-400/10 p-5">
                  <p className="text-sm uppercase tracking-[0.22em] text-violet-100">Paid path</p>
                  <p className="mt-3 text-lg font-medium text-white">Scheduled re-checks + webhook alerts</p>
                  <p className="mt-3 text-sm leading-7 text-violet-50/90">Recurring monitoring creates the durable product moat instead of a one-off grading toy.</p>
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Dev status</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Implementation tracker</h2>
                </div>
              </div>
              <div className="mt-5 grid gap-4">
                {milestones.map((milestone) => (
                  <div key={milestone.title} className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-medium text-white">{milestone.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-slate-300">{milestone.note}</p>
                      </div>
                      <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">{milestone.status}</span>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" style={{ width: `${milestone.width}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="grid gap-6">
            <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Current stack signals</p>
              <div className="mt-4 grid gap-4">
                {statCards.map((card) => (
                  <div key={card.label} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <div className="text-sm text-slate-400">{card.label}</div>
                    <div className="mt-2 text-xl font-semibold text-white">{card.value}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-300">{card.note}</div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Night schedule</p>
              <div className="mt-4 grid gap-3">
                {tracker.map((item) => (
                  <div key={`${item.hour}-${item.label}`} className={`rounded-2xl border p-4 ${statusTone(item.status)}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm uppercase tracking-[0.22em]">{item.hour}</div>
                        <div className="mt-2 text-lg font-semibold">{item.label}</div>
                        <div className="mt-2 text-sm leading-6 opacity-90">{item.detail}</div>
                      </div>
                      <span className="rounded-full border border-current/20 px-3 py-1 text-[11px] uppercase tracking-[0.22em]">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>
      </section>
    </main>
  );
}
