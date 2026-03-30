import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const WAITLIST_FILE = path.join(process.cwd(), "data", "waitlist.json");

type WaitlistEntry = {
  email: string;
  plan: string;
  createdAt: string;
};

async function getWaitlist(): Promise<WaitlistEntry[]> {
  try {
    const raw = await readFile(WAITLIST_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; plan?: string };
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const list = await getWaitlist();
    if (list.some((e) => e.email.toLowerCase() === body.email!.toLowerCase())) {
      return NextResponse.json({ message: "You're already on the list!", alreadyExists: true });
    }

    list.push({
      email: body.email.toLowerCase().trim(),
      plan: body.plan || "pro",
      createdAt: new Date().toISOString(),
    });

    await mkdir(path.dirname(WAITLIST_FILE), { recursive: true });
    await writeFile(WAITLIST_FILE, JSON.stringify(list, null, 2), "utf8");

    return NextResponse.json({ message: "You're on the list! We'll reach out when Pro launches.", count: list.length });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to join waitlist" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const list = await getWaitlist();
  return NextResponse.json({ count: list.length });
}
