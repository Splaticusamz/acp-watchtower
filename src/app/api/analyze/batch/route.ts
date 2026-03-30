import { NextResponse } from "next/server";
import { analyzeManifest } from "@/lib/watchtower";
import type { AnalysisResult } from "@/lib/watchtower";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { manifests?: string[]; urls?: string[] };

    const results: Array<{ source: string; analysis?: AnalysisResult; error?: string }> = [];

    // Analyze inline manifests
    if (body.manifests && Array.isArray(body.manifests)) {
      for (const [i, manifest] of body.manifests.slice(0, 10).entries()) {
        try {
          results.push({ source: `manifest-${i + 1}`, analysis: analyzeManifest(manifest) });
        } catch (e) {
          results.push({ source: `manifest-${i + 1}`, error: e instanceof Error ? e.message : "Analysis failed" });
        }
      }
    }

    // Fetch and analyze URLs
    if (body.urls && Array.isArray(body.urls)) {
      for (const url of body.urls.slice(0, 10)) {
        try {
          const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
          if (!res.ok) {
            results.push({ source: url, error: `HTTP ${res.status}` });
            continue;
          }
          const text = await res.text();
          results.push({ source: url, analysis: analyzeManifest(text) });
        } catch (e) {
          results.push({ source: url, error: e instanceof Error ? e.message : "Fetch failed" });
        }
      }
    }

    if (results.length === 0) {
      return NextResponse.json({ error: "Provide manifests (array of JSON strings) or urls (array of manifest URLs)" }, { status: 400 });
    }

    const successful = results.filter((r) => r.analysis);
    const avgScore = successful.length > 0
      ? Math.round(successful.reduce((sum, r) => sum + (r.analysis?.score ?? 0), 0) / successful.length)
      : 0;

    return NextResponse.json({
      count: results.length,
      successful: successful.length,
      failed: results.length - successful.length,
      averageScore: avgScore,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Batch analysis failed" },
      { status: 400 },
    );
  }
}
