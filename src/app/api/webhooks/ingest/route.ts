import { NextResponse } from "next/server";
import { analyzeManifest, saveReport, buildWebhookPayload } from "@/lib/watchtower";

type IngestBody = {
  manifest?: string;
  sourceLabel?: string;
  notifyUrl?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as IngestBody;

    if (!body.manifest) {
      return NextResponse.json(
        { error: "manifest field is required" },
        { status: 400 },
      );
    }

    const analysis = analyzeManifest(body.manifest);
    const report = await saveReport({
      analysis,
      diff: null,
      sourceLabel: body.sourceLabel || "webhook-ingest",
    });

    const baseUrl = process.env.BASE_URL || "https://acp-watchtower.vercel.app";
    const webhookPayload = buildWebhookPayload(report);

    // Fire-and-forget notification if notifyUrl provided
    if (body.notifyUrl) {
      fetch(body.notifyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(webhookPayload),
        signal: AbortSignal.timeout(10000),
      }).catch(() => {
        // Best-effort notification
      });
    }

    return NextResponse.json({
      ok: true,
      report: {
        id: report.id,
        url: `${baseUrl}/report/${report.id}`,
        score: analysis.score,
        issues: analysis.issues.length,
        verdict: analysis.verdict,
      },
      webhookPayload,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process manifest" },
      { status: 400 },
    );
  }
}
