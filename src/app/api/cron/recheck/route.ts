import { NextResponse } from "next/server";
import { analyzeManifest, diffManifests, saveReport, getReport } from "@/lib/watchtower";
import { getSources, updateSource } from "@/lib/sources";
import { notifyDiscord } from "@/lib/notify";

type RecheckResult = {
  sourceId: string;
  label: string;
  score: number;
  previousScore: number | null;
  reportId: string;
  issues: number;
  status: "ok" | "error";
  error?: string;
};

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expected = process.env.CRON_SECRET;

  if (expected && authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sources = await getSources();
  const enabled = sources.filter((s) => s.enabled);
  const results: RecheckResult[] = [];
  const baseUrl = process.env.BASE_URL || "https://acp-watchtower.vercel.app";
  const discordWebhook = process.env.DISCORD_WEBHOOK_URL;

  for (const source of enabled) {
    try {
      const res = await fetch(source.url, { signal: AbortSignal.timeout(15000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const manifestString = await res.text();

      const analysis = analyzeManifest(manifestString);

      // Get previous manifest for diff
      let previousManifest: string | null = null;
      if (source.lastReportId) {
        try {
          const prev = await getReport(source.lastReportId);
          if (prev.analysis?.manifest) {
            previousManifest = JSON.stringify(prev.analysis.manifest);
          }
        } catch {
          // No previous report available
        }
      }

      const diff = previousManifest ? diffManifests(previousManifest, manifestString) : null;
      const report = await saveReport({ analysis, diff, sourceLabel: source.label });

      await updateSource(source.id, {
        lastCheckedAt: new Date().toISOString(),
        lastScore: analysis.score,
        lastReportId: report.id,
      });

      results.push({
        sourceId: source.id,
        label: source.label,
        score: analysis.score,
        previousScore: source.lastScore,
        reportId: report.id,
        issues: analysis.issues.length,
        status: "ok",
      });

      // Notify Discord if configured
      if (discordWebhook) {
        await notifyDiscord(discordWebhook, {
          score: analysis.score,
          manifestName: analysis.manifestName,
          issueCount: analysis.issues.length,
          criticalCount: analysis.issues.filter((i) => i.severity === "critical").length,
          reportUrl: `${baseUrl}/report/${report.id}`,
          previousScore: source.lastScore,
        });
      }
    } catch (error) {
      results.push({
        sourceId: source.id,
        label: source.label,
        score: 0,
        previousScore: source.lastScore,
        reportId: "",
        issues: 0,
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return NextResponse.json({
    ok: true,
    ranAt: new Date().toISOString(),
    sourcesChecked: enabled.length,
    results,
  });
}
