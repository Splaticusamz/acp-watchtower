import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  return NextResponse.json({
    ok: true,
    receivedAt: new Date().toISOString(),
    message: "Webhook stub received payload. Wire this to Slack/Discord/queue infrastructure next.",
    payload,
  });
}
