import { NextResponse } from "next/server";
import { analyzeManifest } from "@/lib/watchtower";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const manifestUrl = searchParams.get("url");

    let manifestString: string;

    if (manifestUrl) {
      // Fetch manifest from URL
      const res = await fetch(manifestUrl, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) {
        return NextResponse.json(
          { error: `Failed to fetch manifest from URL: ${res.status} ${res.statusText}` },
          { status: 400 },
        );
      }
      manifestString = await res.text();
    } else {
      const body = (await request.json()) as { manifest?: string };
      if (!body.manifest) {
        return NextResponse.json({ error: "manifest is required (POST body or ?url= param)" }, { status: 400 });
      }
      manifestString = body.manifest;
    }

    return NextResponse.json(analyzeManifest(manifestString));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze manifest" },
      { status: 400 },
    );
  }
}
