import { NextResponse } from "next/server";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { analyzeManifest, buildWebhookPayload, diffManifests, saveReport } from "@/lib/watchtower";
import type { StoredReport } from "@/lib/watchtower";

const REPORT_DIR = path.join(process.cwd(), "data", "reports");

export async function GET() {
  try {
    const files = await readdir(REPORT_DIR).catch(() => [] as string[]);
    const reports: Array<{ id: string; slug: string; createdAt: string; manifestName: string; score: number; verdict: string; actionCount: number }> = [];
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      try {
        const raw = await readFile(path.join(REPORT_DIR, file), "utf8");
        const r = JSON.parse(raw) as StoredReport;
        reports.push({
          id: r.id,
          slug: r.slug,
          createdAt: r.createdAt,
          manifestName: r.analysis.manifestName,
          score: r.analysis.score,
          verdict: r.analysis.verdict,
          actionCount: r.analysis.actionCount,
        });
      } catch { /* skip corrupt files */ }
    }
    reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json({ reports });
  } catch {
    return NextResponse.json({ reports: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      manifest?: string;
      oldManifest?: string;
      sourceLabel?: string;
    };
    if (!body.manifest) {
      return NextResponse.json({ error: "manifest is required" }, { status: 400 });
    }

    const analysis = analyzeManifest(body.manifest);
    const diff = body.oldManifest ? diffManifests(body.oldManifest, body.manifest) : null;
    const report = await saveReport({ analysis, diff, sourceLabel: body.sourceLabel });

    return NextResponse.json({
      report,
      webhookPreview: buildWebhookPayload(report),
      url: `/report/${report.id}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create report" },
      { status: 400 },
    );
  }
}
