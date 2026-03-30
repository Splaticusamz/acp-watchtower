import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { analyzeManifest, saveReport } from "@/lib/watchtower";

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
  repository?: { full_name?: string; html_url?: string; default_branch?: string };
  pusher?: { name?: string };
}

export async function POST(request: Request) {
  const event = request.headers.get("x-github-event");
  const signature = request.headers.get("x-hub-signature-256");
  const rawBody = await request.text();

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

  const manifestFiles = allFiles.filter(
    (f) => f === "acp-manifest.json" || f.endsWith("/acp-manifest.json"),
  );

  if (manifestFiles.length === 0) {
    return NextResponse.json({
      status: "ok",
      manifestChanged: false,
      message: "No ACP manifest changes detected",
    });
  }

  const repo = payload.repository?.full_name;
  const branch = payload.ref?.replace("refs/heads/", "") || payload.repository?.default_branch || "main";
  const baseUrl = process.env.BASE_URL || "https://acp-watchtower.vercel.app";
  const reports: Array<{ file: string; reportId: string; score: number; reportUrl: string }> = [];

  for (const file of manifestFiles) {
    try {
      const rawUrl = `https://raw.githubusercontent.com/${repo}/${branch}/${file}`;
      const res = await fetch(rawUrl, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) continue;

      const manifestString = await res.text();
      const analysis = analyzeManifest(manifestString);
      const report = await saveReport({
        analysis,
        diff: null,
        sourceLabel: `${repo}/${file}`,
      });

      reports.push({
        file,
        reportId: report.id,
        score: analysis.score,
        reportUrl: `${baseUrl}/report/${report.id}`,
      });
    } catch {
      // Skip files that fail to fetch
    }
  }

  return NextResponse.json({
    status: "ok",
    manifestChanged: true,
    repository: repo,
    branch,
    filesAnalyzed: reports.length,
    reports,
  });
}
