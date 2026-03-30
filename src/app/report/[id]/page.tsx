import Link from "next/link";
import { getReport } from "@/lib/watchtower";
import ReportActions from "./ReportActions";

function severityClasses(severity: string) {
  if (severity === "critical") return "border-rose-400/30 bg-rose-400/10 text-rose-100";
  if (severity === "warning") return "border-amber-400/30 bg-amber-400/10 text-amber-100";
  return "border-cyan-400/30 bg-cyan-400/10 text-cyan-100";
}

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let report;
  try {
    report = await getReport(id);
  } catch {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-20 text-center text-slate-100">
        <h1 className="text-3xl font-semibold text-white">Report not found</h1>
        <p className="mt-3 text-slate-400">This report may have been removed or the ID is invalid.</p>
        <Link href="/" className="mt-6 inline-block rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950">Back to validator</Link>
      </main>
    );
  }

  const { analysis, diff } = report;
  const severityCounts = {
    critical: analysis.issues.filter((i) => i.severity === "critical").length,
    warning: analysis.issues.filter((i) => i.severity === "warning").length,
    info: analysis.issues.filter((i) => i.severity === "info").length,
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-14 text-slate-100 sm:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/70">Hosted readiness report</p>
            <h1 className="mt-2 text-4xl font-semibold text-white">{analysis.manifestName}</h1>
            <p className="mt-1 text-sm text-slate-500">v{analysis.version} · analyzed {new Date(analysis.analyzedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">{analysis.summary}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/history" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-white/20">All reports</Link>
            <Link href="/" className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">New analysis</Link>
          </div>
        </div>

        {/* Score + severity cards */}
        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
            <p className="text-sm text-cyan-100">Readiness score</p>
            <div className="mt-3 text-5xl font-semibold text-white">{analysis.score}</div>
            <div className="mt-2 text-sm text-cyan-100">{analysis.verdict}</div>
          </div>
          {(["critical", "warning", "info"] as const).map((sev) => (
            <div key={sev} className={`rounded-3xl border p-6 ${severityClasses(sev)}`}>
              <p className="text-sm uppercase tracking-[0.24em]">{sev}</p>
              <div className="mt-3 text-4xl font-semibold">{severityCounts[sev]}</div>
            </div>
          ))}
        </section>

        {/* Actions: copy + download + badge */}
        <ReportActions report={report} />

        {/* Category scores */}
        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Category scores</p>
            <div className="mt-4 grid gap-4">
              {analysis.categories.map((category) => (
                <div key={category.category} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-white">{category.label}</span>
                    <span className="text-sm text-cyan-100">{category.score}/100</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" style={{ width: `${category.score}%` }} />
                  </div>
                  <p className="mt-3 text-sm text-slate-300">{category.summary}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Recommended fixes</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-200">
              {analysis.recommendations.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
            {diff ? (
              <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
                <p className="text-sm uppercase tracking-[0.24em] text-amber-100">Release risk</p>
                <p className="mt-2 text-lg font-semibold text-white capitalize">{diff.releaseRisk}</p>
                <p className="mt-2 text-sm leading-6 text-amber-50">{diff.summary}</p>
              </div>
            ) : null}
          </article>
        </section>

        {/* Issue list */}
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Issue checklist ({analysis.issues.length})</p>
          <div className="mt-4 grid gap-4">
            {analysis.issues.map((issue) => (
              <div key={issue.id} className={`rounded-2xl border p-4 ${severityClasses(issue.severity)}`}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-current/20 px-2 py-1 text-[11px] uppercase tracking-[0.22em]">{issue.severity}</span>
                  <span className="text-xs uppercase tracking-[0.22em] opacity-75">{issue.category}</span>
                </div>
                <h2 className="mt-3 text-lg font-semibold">{issue.title}</h2>
                <p className="mt-2 text-sm leading-6">{issue.detail}</p>
                <p className="mt-2 text-sm leading-6 opacity-90">Fix: {issue.recommendation}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Badge embed */}
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Embed badge</p>
          <p className="mt-3 text-sm text-slate-300">Add this to your README:</p>
          <code className="mt-2 block rounded-xl border border-white/10 bg-slate-950/80 p-4 text-xs text-slate-200 break-all">
            {`![ACP Readiness](https://acp-watchtower.vercel.app/api/badge/${report.id})`}
          </code>
        </section>
      </div>
    </main>
  );
}
