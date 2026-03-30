import { NextResponse } from "next/server";
import { getSources, addSource, removeSource } from "@/lib/sources";

export async function GET() {
  const sources = await getSources();
  return NextResponse.json({ sources });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { label?: string; url?: string };
    if (!body.label || !body.url) {
      return NextResponse.json(
        { error: "label and url are required" },
        { status: 400 },
      );
    }
    const source = await addSource(body.label, body.url);
    return NextResponse.json({ ok: true, source }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to add source" },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id query param is required" }, { status: 400 });
  }
  const removed = await removeSource(id);
  if (!removed) {
    return NextResponse.json({ error: "Source not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
