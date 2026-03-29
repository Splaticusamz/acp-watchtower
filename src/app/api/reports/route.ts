import { NextResponse } from "next/server";
import { analyzeManifest, buildWebhookPayload, diffManifests, saveReport } from "@/lib/watchtower";

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
