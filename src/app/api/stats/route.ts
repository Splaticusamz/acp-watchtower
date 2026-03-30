import { NextResponse } from "next/server";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { StoredReport } from "@/lib/watchtower";

const REPORT_DIR = path.join(process.cwd(), "data", "reports");
const WAITLIST_FILE = path.join(process.cwd(), "data", "waitlist.json");

export async function GET() {
  let reportCount = 0;
  let totalScore = 0;
  let totalIssues = 0;
  let waitlistCount = 0;

  try {
    const files = await readdir(REPORT_DIR).catch(() => [] as string[]);
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      try {
        const raw = await readFile(path.join(REPORT_DIR, file), "utf8");
        const r = JSON.parse(raw) as StoredReport;
        reportCount++;
        totalScore += r.analysis.score;
        totalIssues += r.analysis.issues.length;
      } catch { /* skip */ }
    }
  } catch { /* no reports dir */ }

  try {
    const raw = await readFile(WAITLIST_FILE, "utf8");
    waitlistCount = JSON.parse(raw).length;
  } catch { /* no waitlist */ }

  return NextResponse.json({
    reports: reportCount,
    averageScore: reportCount > 0 ? Math.round(totalScore / reportCount) : null,
    totalIssuesFound: totalIssues,
    waitlistSignups: waitlistCount,
    checksPerAnalysis: "27+",
    categories: 5,
  });
}
