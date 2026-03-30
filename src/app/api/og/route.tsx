import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const score = searchParams.get("score") || "—";
  const name = searchParams.get("name") || "ACP Watchtower";
  const verdict = searchParams.get("verdict") || "Validate your ACP manifest";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #020617 0%, #0f172a 50%, #020617 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <span style={{ fontSize: "48px" }}>🔭</span>
          <span style={{ fontSize: "32px", color: "#67e8f9", fontWeight: 600 }}>ACP Watchtower</span>
        </div>
        <div style={{ fontSize: "80px", fontWeight: 700, color: "#ffffff", marginBottom: "8px" }}>
          {score}/100
        </div>
        <div style={{ fontSize: "28px", color: "#67e8f9", marginBottom: "16px" }}>
          {verdict}
        </div>
        <div style={{ fontSize: "22px", color: "#94a3b8", maxWidth: "600px", textAlign: "center" }}>
          {name}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
