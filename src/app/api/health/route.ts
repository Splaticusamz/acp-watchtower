import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "acp-watchtower",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    features: {
      analyze: true,
      diff: true,
      reports: true,
      badges: true,
      cron: true,
      githubWebhook: true,
      waitlist: true,
    },
  });
}
