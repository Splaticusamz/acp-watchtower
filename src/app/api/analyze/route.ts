import { NextResponse } from "next/server";
import { analyzeManifest } from "@/lib/watchtower";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { manifest?: string };
    if (!body.manifest) {
      return NextResponse.json({ error: "manifest is required" }, { status: 400 });
    }
    return NextResponse.json(analyzeManifest(body.manifest));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze manifest" },
      { status: 400 },
    );
  }
}
