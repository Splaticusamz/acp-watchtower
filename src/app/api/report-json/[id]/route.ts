import { NextResponse } from "next/server";
import { getReport } from "@/lib/watchtower";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const report = await getReport(id);
    return new NextResponse(JSON.stringify(report, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${report.slug}.json"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }
}
