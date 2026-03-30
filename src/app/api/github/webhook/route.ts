import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

function verifySignature(payload: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const expected = `sha256=${createHmac("sha256", secret).update(payload).digest("hex")}`;
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

interface PushCommit {
  added?: string[];
  modified?: string[];
  removed?: string[];
  message?: string;
}

interface PushEvent {
  ref?: string;
  commits?: PushCommit[];
  repository?: { full_name?: string; html_url?: string };
  pusher?: { name?: string };
}

export async function POST(request: Request) {
  const event = request.headers.get("x-github-event");
  const signature = request.headers.get("x-hub-signature-256");
  const rawBody = await request.text();

  // Verify webhook secret if configured
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (secret) {
    if (!verifySignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  if (event !== "push") {
    return NextResponse.json({ status: "ignored", reason: `event type '${event}' not handled` });
  }

  const payload: PushEvent = JSON.parse(rawBody);
  const allFiles = (payload.commits ?? []).flatMap((c) => [
    ...(c.added ?? []),
    ...(c.modified ?? []),
  ]);

  const manifestChanged = allFiles.some(
    (f) => f === "acp-manifest.json" || f.endsWith("/acp-manifest.json"),
  );

  if (!manifestChanged) {
    return NextResponse.json({
      status: "ok",
      manifestChanged: false,
      message: "No ACP manifest changes detected",
    });
  }

  // TODO: Fetch the updated manifest from the repo and run full analysis
  return NextResponse.json({
    status: "ok",
    manifestChanged: true,
    repository: payload.repository?.full_name,
    message: "ACP manifest change detected — analysis queued",
    // Future: post analysis as PR comment via GitHub API
  });
}
