import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export type ManifestSource = {
  id: string;
  label: string;
  url: string;
  lastCheckedAt: string | null;
  lastScore: number | null;
  lastReportId: string | null;
  enabled: boolean;
  createdAt: string;
};

const SOURCES_PATH = path.join(process.cwd(), "data", "sources.json");

async function ensureDir(): Promise<void> {
  await mkdir(path.dirname(SOURCES_PATH), { recursive: true });
}

export async function getSources(): Promise<ManifestSource[]> {
  try {
    const raw = await readFile(SOURCES_PATH, "utf-8");
    return JSON.parse(raw) as ManifestSource[];
  } catch {
    return [];
  }
}

export async function saveSources(sources: ManifestSource[]): Promise<void> {
  await ensureDir();
  await writeFile(SOURCES_PATH, JSON.stringify(sources, null, 2));
}

export async function addSource(label: string, url: string): Promise<ManifestSource> {
  const sources = await getSources();
  const source: ManifestSource = {
    id: crypto.randomUUID(),
    label,
    url,
    lastCheckedAt: null,
    lastScore: null,
    lastReportId: null,
    enabled: true,
    createdAt: new Date().toISOString(),
  };
  sources.push(source);
  await saveSources(sources);
  return source;
}

export async function updateSource(
  id: string,
  patch: Partial<Omit<ManifestSource, "id" | "createdAt">>,
): Promise<ManifestSource | null> {
  const sources = await getSources();
  const idx = sources.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  sources[idx] = { ...sources[idx], ...patch };
  await saveSources(sources);
  return sources[idx];
}

export async function removeSource(id: string): Promise<boolean> {
  const sources = await getSources();
  const filtered = sources.filter((s) => s.id !== id);
  if (filtered.length === sources.length) return false;
  await saveSources(filtered);
  return true;
}
