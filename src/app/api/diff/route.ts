import { NextResponse } from "next/server";
import { diffManifests } from "@/lib/watchtower";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { oldManifest?: string; newManifest?: string };
    if (!body.oldManifest || !body.newManifest) {
      return NextResponse.json({ error: "oldManifest and newManifest are required" }, { status: 400 });
    }
    return NextResponse.json(diffManifests(body.oldManifest, body.newManifest));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to diff manifests" },
      { status: 400 },
    );
  }
}
