import Link from "next/link";
import { getReport } from "@/lib/watchtower";

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = await getReport(id);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-14 text-slate-100 sm:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/70">Hosted readiness report</p>
            <h1 className="mt-2 text-4xl font-semibold text-white">{report.analysis.manifestName}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">{report.analysis.summary}</p>
          </div>
          <Link href="/" className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
            Back to workbench
          </Link>
        </div>

        <section className="grid gap-6 md:grid-cols-4">
          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6 md:col-span-1">
            <p className="text-sm text-cyan-100">Readiness score</p>
            <div className="mt-3 text-5xl font-semibold text-white">{report.analysis.score}</div>
            <div className="mt-2 text-sm text-cyan-100">{report.analysis.verdict}</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:col-span-3">
            <p className="text-sm text-slate-400">Copyable summary</p>
            <p className="mt-3 text-base leading-8 text-slate-100">{report.analysis.copySummary}</p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Category scores</p>
            <div className="mt-4 grid gap-4">
              {report.analysis.categories.map((category) => (
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
              {report.analysis.recommendations.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
            {report.diff ? (
              <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
                <p className="text-sm uppercase tracking-[0.24em] text-amber-100">Release risk</p>
                <p className="mt-2 text-lg font-semibold text-white">{report.diff.releaseRisk}</p>
                <p className="mt-2 text-sm leading-6 text-amber-50">{report.diff.summary}</p>
              </div>
            ) : null}
          </article>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Issue list</p>
          <div className="mt-4 grid gap-4">
            {report.analysis.issues.map((issue) => (
              <div key={issue.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-slate-400">
                  <span>{issue.severity}</span>
                  <span>{issue.category}</span>
                </div>
                <h2 className="mt-3 text-lg font-semibold text-white">{issue.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-300">{issue.detail}</p>
                <p className="mt-2 text-sm leading-7 text-slate-200">Fix: {issue.recommendation}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
