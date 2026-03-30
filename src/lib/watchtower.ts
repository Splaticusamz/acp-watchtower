import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export type Severity = "critical" | "warning" | "info";
export type Category =
  | "schema-completeness"
  | "action-clarity"
  | "discoverability"
  | "safety-guardrails"
  | "maintainability";

export type Issue = {
  id: string;
  severity: Severity;
  category: Category;
  title: string;
  detail: string;
  recommendation: string;
};

export type CategoryScore = {
  category: Category;
  label: string;
  score: number;
  summary: string;
};

export type ActionManifest = {
  id?: string;
  title?: string;
  name?: string;
  description?: string;
  input?: { properties?: Record<string, unknown>; required?: string[] };
  parameters?: Record<string, unknown>;
  examples?: unknown[];
  safetyNotes?: string[];
  [key: string]: unknown;
};

export type AcpManifest = {
  name?: string;
  title?: string;
  description?: string;
  version?: string;
  metadata?: Record<string, unknown>;
  actions?: ActionManifest[];
  [key: string]: unknown;
};

export type AnalysisResult = {
  manifestName: string;
  version: string;
  analyzedAt: string;
  score: number;
  verdict: string;
  summary: string;
  issues: Issue[];
  categories: CategoryScore[];
  actionCount: number;
  recommendations: string[];
  copySummary: string;
  automation: {
    webhookSchemaVersion: string;
    cronReady: boolean;
    nextCheckRecommendation: string;
  };
  manifest: AcpManifest;
};

export type DiffChange = {
  level: Severity;
  kind: "added" | "removed" | "changed";
  target: string;
  detail: string;
};

export type DiffResult = {
  comparedAt: string;
  oldManifestName: string;
  newManifestName: string;
  releaseRisk: "low" | "medium" | "high";
  summary: string;
  changes: DiffChange[];
  addedActions: string[];
  removedActions: string[];
  changedActions: string[];
};

export type StoredReport = {
  id: string;
  slug: string;
  createdAt: string;
  analysis: AnalysisResult;
  diff?: DiffResult | null;
  sourceLabel?: string;
};

const REPORT_DIR = path.join(process.cwd(), "data", "reports");

function safeJsonParse(raw: string): unknown {
  return JSON.parse(raw);
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "report";
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function readableCategory(category: Category) {
  return {
    "schema-completeness": "Schema completeness",
    "action-clarity": "Action clarity",
    discoverability: "Discoverability",
    "safety-guardrails": "Safety & guardrails",
    maintainability: "Maintainability",
  }[category];
}

function addIssue(issues: Issue[], issue: Omit<Issue, "id">) {
  issues.push({ id: crypto.randomUUID(), ...issue });
}

function getActions(manifest: AcpManifest) {
  return Array.isArray(manifest.actions) ? manifest.actions : [];
}

function getActionLabel(action: ActionManifest, index: number) {
  return action.id || action.name || action.title || `action-${index + 1}`;
}

export function parseManifest(input: string): AcpManifest {
  const parsed = safeJsonParse(input);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Manifest must be a JSON object.");
  }
  return parsed as AcpManifest;
}

export function analyzeManifest(input: string): AnalysisResult {
  const manifest = parseManifest(input);
  const issues: Issue[] = [];
  const actions = getActions(manifest);
  const actionIds = new Map<string, number>();
  const dangerousTerms = [/delete/i, /destroy/i, /admin/i, /override/i, /unsafe/i];
  const placeholderTerms = [/todo/i, /tbd/i, /placeholder/i, /lorem/i];

  if (!isNonEmptyString(manifest.name) && !isNonEmptyString(manifest.title)) {
    addIssue(issues, {
      severity: "critical",
      category: "schema-completeness",
      title: "Manifest is missing a name",
      detail: "Agents need a stable human-readable identity for discovery and report labeling.",
      recommendation: "Add a top-level name or title field.",
    });
  }

  if (!isNonEmptyString(manifest.version)) {
    addIssue(issues, {
      severity: "warning",
      category: "maintainability",
      title: "Version metadata is missing",
      detail: "Without version metadata, release diffs and monitoring history get fuzzy fast.",
      recommendation: "Add a semantic version string like 1.0.0.",
    });
  }

  if (!isNonEmptyString(manifest.description)) {
    addIssue(issues, {
      severity: "warning",
      category: "discoverability",
      title: "Manifest is missing a top-level description",
      detail: "A clear description helps agents understand what this manifest is for before inspecting individual actions.",
      recommendation: "Add a concise description explaining the manifest's purpose and capabilities.",
    });
  }

  if (!manifest.metadata || Object.keys(manifest.metadata).length === 0) {
    addIssue(issues, {
      severity: "info",
      category: "maintainability",
      title: "No metadata block",
      detail: "Metadata (owner, contact, docsUrl) improves operational reliability and team coordination.",
      recommendation: "Add a metadata block with at least owner and contact fields.",
    });
  }

  if (actions.length > 25) {
    addIssue(issues, {
      severity: "warning",
      category: "maintainability",
      title: `Large action surface (${actions.length} actions)`,
      detail: "Manifests with many actions increase agent confusion and selection errors. Consider splitting into multiple manifests.",
      recommendation: "Keep manifests focused — split into domain-specific sub-manifests if possible.",
    });
  }

  if (!Array.isArray(manifest.actions) || actions.length === 0) {
    addIssue(issues, {
      severity: "critical",
      category: "schema-completeness",
      title: "Manifest has no actions",
      detail: "ACP manifests need at least one defined action to be operationally useful.",
      recommendation: "Define one or more actionable entries under actions.",
    });
  }

  actions.forEach((action, index) => {
    const label = getActionLabel(action, index);
    const id = action.id?.trim();

    if (!id) {
      addIssue(issues, {
        severity: "warning",
        category: "schema-completeness",
        title: `Action ${label} is missing a stable id`,
        detail: "Stable ids make diffs, monitoring, and integrations much safer.",
        recommendation: "Add a short, stable id such as search-leads or create-report.",
      });
    } else {
      actionIds.set(id, (actionIds.get(id) ?? 0) + 1);
      if (!/^[a-z0-9-_.]+$/.test(id)) {
        addIssue(issues, {
          severity: "warning",
          category: "maintainability",
          title: `Action id ${id} is not stable-looking`,
          detail: "Ids with spaces or inconsistent casing tend to drift across releases.",
          recommendation: "Use lowercase kebab-case or dot-separated ids.",
        });
      }
    }

    if (!isNonEmptyString(action.title) && !isNonEmptyString(action.name)) {
      addIssue(issues, {
        severity: "warning",
        category: "discoverability",
        title: `Action ${label} is hard to discover`,
        detail: "There is no friendly title or name to help an agent pick the right tool.",
        recommendation: "Add a concise title and optional name.",
      });
    }

    if (!isNonEmptyString(action.description) || action.description!.trim().length < 24) {
      addIssue(issues, {
        severity: "warning",
        category: "action-clarity",
        title: `Action ${label} has a weak description`,
        detail: "Short or vague descriptions reduce agent confidence and increase wrong-tool calls.",
        recommendation: "Write a specific description with intent, input expectations, and outcome.",
      });
    }

    if (isNonEmptyString(action.description) && action.description!.trim().length > 500) {
      addIssue(issues, {
        severity: "info",
        category: "action-clarity",
        title: `Action ${label} has an overly verbose description`,
        detail: "Very long descriptions can confuse agents and increase token costs without improving selection accuracy.",
        recommendation: "Keep descriptions under 300 characters. Move detailed docs to external references.",
      });
    }

    if (placeholderTerms.some((pattern) => pattern.test(action.description ?? ""))) {
      addIssue(issues, {
        severity: "warning",
        category: "action-clarity",
        title: `Action ${label} contains placeholder text`,
        detail: "Placeholder copy is a bad sign for agent reliability and trust.",
        recommendation: "Replace TODO/TBD placeholders with production-quality copy.",
      });
    }

    const parameterCount = action.input?.properties
      ? Object.keys(action.input.properties).length
      : action.parameters
        ? Object.keys(action.parameters).length
        : 0;

    if (parameterCount === 0) {
      addIssue(issues, {
        severity: "info",
        category: "schema-completeness",
        title: `Action ${label} has no parameter schema`,
        detail: "Parameter metadata helps agents understand inputs, validation, and safe usage.",
        recommendation: "Add input.properties or parameters with field descriptions.",
      });
    }

    if (parameterCount > 0 && (!action.input?.required || action.input.required.length === 0)) {
      addIssue(issues, {
        severity: "info",
        category: "schema-completeness",
        title: `Action ${label} has parameters but no required fields`,
        detail: "Without required field hints, agents may omit critical inputs or guess wrong defaults.",
        recommendation: "Mark essential parameters as required in the input schema.",
      });
    }

    if (!Array.isArray(action.examples) || action.examples.length === 0) {
      addIssue(issues, {
        severity: "info",
        category: "discoverability",
        title: `Action ${label} has no examples`,
        detail: "Examples materially improve first-run agent behavior.",
        recommendation: "Add at least one realistic invocation example.",
      });
    }

    if (dangerousTerms.some((pattern) => pattern.test(`${action.id ?? ""} ${action.title ?? ""} ${action.description ?? ""}`)) && !Array.isArray(action.safetyNotes)) {
      addIssue(issues, {
        severity: "warning",
        category: "safety-guardrails",
        title: `Action ${label} looks sensitive but lacks guardrails`,
        detail: "Potentially destructive or privileged actions should say how they are constrained.",
        recommendation: "Add safetyNotes, required approvals, or clearer limitations.",
      });
    }
  });

  for (const [id, count] of actionIds.entries()) {
    if (count > 1) {
      addIssue(issues, {
        severity: "critical",
        category: "maintainability",
        title: `Duplicate action id: ${id}`,
        detail: "Duplicate ids make change tracking and agent routing ambiguous.",
        recommendation: "Make every action id unique and stable across releases.",
      });
    }
  }

  const categories: CategoryScore[] = ([
    "schema-completeness",
    "action-clarity",
    "discoverability",
    "safety-guardrails",
    "maintainability",
  ] as Category[]).map((category) => {
    const relevant = issues.filter((issue) => issue.category === category);
    const penalty = relevant.reduce((sum, issue) => sum + (issue.severity === "critical" ? 28 : issue.severity === "warning" ? 12 : 5), 0);
    const score = Math.max(0, 100 - penalty);
    return {
      category,
      label: readableCategory(category),
      score,
      summary:
        relevant.length === 0
          ? "No meaningful issues found in this category."
          : `${relevant.length} issue${relevant.length === 1 ? "" : "s"} affecting ${readableCategory(category).toLowerCase()}.`,
    };
  });

  const score = Math.max(
    0,
    Math.round(
      categories.reduce((sum, category) => sum + category.score, 0) / categories.length -
        issues.filter((issue) => issue.severity === "critical").length * 4,
    ),
  );

  const verdict = score >= 85 ? "Strong" : score >= 65 ? "Promising" : score >= 40 ? "Needs work" : "High risk";
  const recommendations = issues
    .filter((issue) => issue.severity !== "info")
    .slice(0, 5)
    .map((issue) => issue.recommendation);

  const manifestName = manifest.name || manifest.title || "Unnamed ACP manifest";
  const version = manifest.version || "unversioned";
  const analyzedAt = new Date().toISOString();
  const copySummary = [
    `ACP Watchtower score: ${score}/100 (${verdict}).`,
    `${issues.filter((issue) => issue.severity === "critical").length} critical, ${issues.filter((issue) => issue.severity === "warning").length} warning, ${issues.filter((issue) => issue.severity === "info").length} info issues.`,
    `Top focus: ${recommendations[0] ?? "Ship examples and tighter action metadata."}`,
  ].join(" ");

  return {
    manifestName,
    version,
    analyzedAt,
    score,
    verdict,
    summary: `${manifestName} looks ${verdict.toLowerCase()} for agent use. ${issues.length === 0 ? "No major problems surfaced." : "The biggest gaps are in metadata quality, safe action definitions, and release hygiene."}`,
    issues,
    categories,
    actionCount: actions.length,
    recommendations,
    copySummary,
    automation: {
      webhookSchemaVersion: "2026-03-29",
      cronReady: true,
      nextCheckRecommendation: "Re-run this manifest on every release and nightly for drift detection.",
    },
    manifest,
  };
}

function normalizeActionMap(manifest: AcpManifest) {
  const map = new Map<string, ActionManifest>();
  getActions(manifest).forEach((action, index) => {
    map.set(getActionLabel(action, index), action);
  });
  return map;
}

function stableJson(value: unknown) {
  return JSON.stringify(value, Object.keys((value as Record<string, unknown>) || {}).sort(), 2);
}

export function diffManifests(oldInput: string, newInput: string): DiffResult {
  const oldManifest = parseManifest(oldInput);
  const newManifest = parseManifest(newInput);
  const oldMap = normalizeActionMap(oldManifest);
  const newMap = normalizeActionMap(newManifest);
  const changes: DiffChange[] = [];
  const addedActions: string[] = [];
  const removedActions: string[] = [];
  const changedActions: string[] = [];

  for (const [label, action] of newMap.entries()) {
    if (!oldMap.has(label)) {
      addedActions.push(label);
      changes.push({ level: "info", kind: "added", target: label, detail: `Action ${label} was added.` });
      continue;
    }

    const previous = oldMap.get(label)!;
    const beforeParams = stableJson(previous.input?.properties ?? previous.parameters ?? {});
    const afterParams = stableJson(action.input?.properties ?? action.parameters ?? {});

    if ((previous.description ?? "") !== (action.description ?? "")) {
      changedActions.push(label);
      changes.push({ level: "warning", kind: "changed", target: label, detail: `Description drift detected for ${label}.` });
    }

    if (beforeParams !== afterParams) {
      changedActions.push(label);
      changes.push({ level: "warning", kind: "changed", target: label, detail: `Parameter schema changed for ${label}.` });
    }
  }

  for (const label of oldMap.keys()) {
    if (!newMap.has(label)) {
      removedActions.push(label);
      changes.push({ level: "critical", kind: "removed", target: label, detail: `Action ${label} was removed.` });
    }
  }

  const dedupedChanged = [...new Set(changedActions)];
  const riskScore = removedActions.length * 3 + dedupedChanged.length * 2 + addedActions.length;
  const releaseRisk = riskScore >= 6 ? "high" : riskScore >= 3 ? "medium" : "low";

  return {
    comparedAt: new Date().toISOString(),
    oldManifestName: oldManifest.name || oldManifest.title || "Old manifest",
    newManifestName: newManifest.name || newManifest.title || "New manifest",
    releaseRisk,
    summary:
      releaseRisk === "high"
        ? "High release risk: action removals or major interface changes detected."
        : releaseRisk === "medium"
          ? "Medium release risk: meaningful action or parameter drift detected."
          : "Low release risk: only additive or minor changes detected.",
    changes,
    addedActions,
    removedActions,
    changedActions: dedupedChanged,
  };
}

export async function saveReport(payload: { analysis: AnalysisResult; diff?: DiffResult | null; sourceLabel?: string }) {
  await mkdir(REPORT_DIR, { recursive: true });
  const id = crypto.randomUUID();
  const slug = `${slugify(payload.analysis.manifestName)}-${id.slice(0, 8)}`;
  const stored: StoredReport = {
    id,
    slug,
    createdAt: new Date().toISOString(),
    analysis: payload.analysis,
    diff: payload.diff ?? null,
    sourceLabel: payload.sourceLabel,
  };
  await writeFile(path.join(REPORT_DIR, `${id}.json`), JSON.stringify(stored, null, 2), "utf8");
  return stored;
}

export async function getReport(id: string) {
  const raw = await readFile(path.join(REPORT_DIR, `${id}.json`), "utf8");
  return JSON.parse(raw) as StoredReport;
}

export function buildWebhookPayload(report: StoredReport) {
  return {
    schemaVersion: "2026-03-29",
    event: "acp_watchtower.report.created",
    reportId: report.id,
    createdAt: report.createdAt,
    score: report.analysis.score,
    verdict: report.analysis.verdict,
    summary: report.analysis.copySummary,
    releaseRisk: report.diff?.releaseRisk ?? null,
    recommendations: report.analysis.recommendations,
  };
}
