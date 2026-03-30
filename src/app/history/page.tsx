import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Report History — ACP Watchtower",
  description: "Browse past ACP manifest analysis reports with scores, verdicts, and shareable links.",
};

type ReportSummary = {
  id: string;
  slug: string;
  createdAt: string;
  manifestName: string;
  score: number;
  verdict: string;
  actionCount: number;
};

async function getReports(): Promise<ReportSummary[]> {
  const { readdir, readFile } = await import("node:fs/promises");
  const path = await import("node:path");
  const dir = path.join(process.cwd(), "data", "reports");
  try {
    const files = await readdir(dir);
    const reports: ReportSummary[] = [];
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      try {
        const raw = await readFile(path.join(dir, file), "utf8");
        const r = JSON.parse(raw);
        reports.push({
          id: r.id,
          slug: r.slug,
          createdAt: r.createdAt,
          manifestName: r.analysis.manifestName,
          score: r.analysis.score,
          verdict: r.analysis.verdict,
          actionCount: r.analysis.actionCount,
        });
      } catch { /* skip */ }
    }
    reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return reports;
  } catch {
    return [];
  }
}

function scoreColor(score: number) {
  if (score >= 85) return "text-emerald-300 border-emerald-400/30 bg-emerald-400/10";
  if (score >= 65) return "text-cyan-300 border-cyan-400/30 bg-cyan-400/10";
  if (score >= 40) return "text-amber-300 border-amber-400/30 bg-amber-400/10";
  return "text-rose-300 border-rose-400/30 bg-rose-400/10";
}

export default async function HistoryPage() {
  const reports = await getReports();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Report history</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white">Past analyses</h1>
          <p className="text-lg text-slate-300">Browse previously generated readiness reports.</p>
        </div>

        {reports.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
            <p className="text-2xl font-semibold text-white">No reports yet</p>
            <p className="mt-3 text-slate-400">Analyze a manifest and create a hosted report to see it here.</p>
            <Link href="/" className="mt-6 inline-block rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950">
              Go to validator
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => (
              <Link
                key={report.id}
                href={`/report/${report.id}`}
                className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-400/30 hover:bg-white/[0.07]"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-semibold text-white group-hover:text-cyan-200 line-clamp-1">{report.manifestName}</h2>
                  <span className={`shrink-0 rounded-full border px-3 py-1 text-sm font-semibold ${scoreColor(report.score)}`}>
                    {report.score}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{report.verdict} · {report.actionCount} action{report.actionCount !== 1 ? "s" : ""}</p>
                <p className="mt-1 text-xs text-slate-500">{new Date(report.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
