import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expected = process.env.CRON_SECRET;

  if (expected && authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    ranAt: new Date().toISOString(),
    message: "Scheduled re-check hook is live. Attach persisted report sources or remote manifest fetchers next.",
    automation: {
      kind: "nightly-monitor",
      nextStep: "Store tracked manifest sources and replay analysis + diff on schedule.",
    },
  });
}
