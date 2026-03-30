import { NextResponse } from "next/server";
import { getReport } from "@/lib/watchtower";

function badgeColor(score: number) {
  if (score >= 85) return "#10b981";
  if (score >= 65) return "#06b6d4";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

function makeBadgeSvg(label: string, score: number, verdict: string) {
  const color = badgeColor(score);
  const rightText = `${score}/100 ${verdict}`;
  const leftWidth = label.length * 6.8 + 12;
  const rightWidth = rightText.length * 6.5 + 12;
  const totalWidth = leftWidth + rightWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${label}: ${rightText}">
  <title>${label}: ${rightText}</title>
  <linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient>
  <clipPath id="r"><rect width="${totalWidth}" height="20" rx="3" fill="#fff"/></clipPath>
  <g clip-path="url(#r)">
    <rect width="${leftWidth}" height="20" fill="#555"/>
    <rect x="${leftWidth}" width="${rightWidth}" height="20" fill="${color}"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="11">
    <text x="${leftWidth / 2}" y="14" fill="#010101" fill-opacity=".3">${label}</text>
    <text x="${leftWidth / 2}" y="13">${label}</text>
    <text x="${leftWidth + rightWidth / 2}" y="14" fill="#010101" fill-opacity=".3">${rightText}</text>
    <text x="${leftWidth + rightWidth / 2}" y="13">${rightText}</text>
  </g>
</svg>`;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const report = await getReport(id);
    const svg = makeBadgeSvg("ACP Readiness", report.analysis.score, report.analysis.verdict);
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    const svg = makeBadgeSvg("ACP Readiness", 0, "Not Found");
    return new NextResponse(svg, {
      status: 404,
      headers: { "Content-Type": "image/svg+xml" },
    });
  }
}
