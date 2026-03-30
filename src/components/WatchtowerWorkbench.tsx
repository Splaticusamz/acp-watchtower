"use client";

import { useEffect, useMemo, useState } from "react";
import type { AnalysisResult, DiffResult, StoredReport } from "@/lib/watchtower";

type SampleKey = "baseline" | "improved" | "risky" | "ecommerce";

const samples: Record<SampleKey, { label: string; manifest: string }> = {
  baseline: {
    label: "Sample: baseline manifest",
    manifest: `{
  "name": "Acme Support Agent",
  "version": "0.9.0",
  "description": "Agent-facing support toolkit for triage and escalation.",
  "metadata": {
    "owner": "support-platform",
    "contact": "agents@acme.dev"
  },
  "actions": [
    {
      "id": "search-kb",
      "title": "Search knowledge base",
      "description": "Search the support knowledge base using a customer issue query.",
      "input": {
        "properties": {
          "query": { "type": "string", "description": "Customer problem or keywords" },
          "limit": { "type": "number", "description": "Number of results to return" }
        },
        "required": ["query"]
      },
      "examples": [{ "query": "refund policy for annual plan" }]
    },
    {
      "id": "create-escalation",
      "title": "Create escalation ticket",
      "description": "Create an escalation ticket for incidents that need a human support lead.",
      "input": {
        "properties": {
          "accountId": { "type": "string", "description": "Customer account id" },
          "reason": { "type": "string", "description": "Why this escalation is needed" }
        },
        "required": ["accountId", "reason"]
      },
      "examples": [{ "accountId": "acct_123", "reason": "billing lockout" }],
      "safetyNotes": ["Escalations are logged and visible to the support lead queue."]
    }
  ]
}`,
  },
  improved: {
    label: "Sample: improved release",
    manifest: `{
  "name": "Acme Support Agent",
  "version": "1.0.0",
  "description": "Agent-facing support toolkit for triage, escalation, and renewal interventions.",
  "metadata": {
    "owner": "support-platform",
    "contact": "agents@acme.dev",
    "docsUrl": "https://example.com/docs/support-agent"
  },
  "actions": [
    {
      "id": "search-kb",
      "title": "Search knowledge base",
      "description": "Search the support knowledge base with semantic matching and return concise snippets.",
      "input": {
        "properties": {
          "query": { "type": "string", "description": "Customer problem or keywords" },
          "limit": { "type": "number", "description": "Number of results to return" },
          "locale": { "type": "string", "description": "Optional customer locale" }
        },
        "required": ["query"]
      },
      "examples": [{ "query": "refund policy for annual plan", "locale": "en-US" }]
    },
    {
      "id": "create-escalation",
      "title": "Create escalation ticket",
      "description": "Create an escalation ticket for incidents that need a human support lead, including severity and customer impact.",
      "input": {
        "properties": {
          "accountId": { "type": "string", "description": "Customer account id" },
          "reason": { "type": "string", "description": "Why this escalation is needed" },
          "severity": { "type": "string", "description": "incident severity level" }
        },
        "required": ["accountId", "reason", "severity"]
      },
      "examples": [{ "accountId": "acct_123", "reason": "billing lockout", "severity": "high" }],
      "safetyNotes": ["Escalations are logged and visible to the support lead queue."]
    },
    {
      "id": "draft-renewal-offer",
      "title": "Draft renewal offer",
      "description": "Draft a renewal offer suggestion for at-risk accounts before routing to a human approver.",
      "input": {
        "properties": {
          "accountId": { "type": "string", "description": "Customer account id" },
          "riskReason": { "type": "string", "description": "Why the renewal looks at risk" }
        },
        "required": ["accountId", "riskReason"]
      },
      "examples": [{ "accountId": "acct_991", "riskReason": "downgrade signals" }],
      "safetyNotes": ["Draft only. Human approval required before customer send."]
    }
  ]
}`,
  },
  risky: {
    label: "Sample: risky release",
    manifest: `{
  "name": "Acme Support Agent",
  "description": "TODO",
  "actions": [
    {
      "id": "search kb",
      "title": "Search",
      "description": "Find stuff"
    },
    {
      "id": "delete-account",
      "title": "Delete account",
      "description": "Delete a user account permanently"
    }
  ]
}`,
  },
  ecommerce: {
    label: "Sample: e-commerce agent",
    manifest: `{
  "name": "Shopify Store Agent",
  "version": "2.1.0",
  "description": "Agent-operable interface for Shopify store management — products, orders, inventory, and customer lookup.",
  "metadata": { "owner": "ecommerce-platform", "contact": "integrations@example.com" },
  "actions": [
    {
      "id": "search-products",
      "title": "Search products",
      "description": "Search the product catalog by keyword, category, or SKU. Returns matching products with price, stock status, and variants.",
      "input": { "properties": { "query": { "type": "string" }, "inStock": { "type": "boolean" } }, "required": ["query"] },
      "examples": [{ "query": "blue sneakers", "inStock": true }]
    },
    {
      "id": "get-order",
      "title": "Get order details",
      "description": "Retrieve full order details including line items, shipping status, payment method, and customer info.",
      "input": { "properties": { "orderId": { "type": "string" } }, "required": ["orderId"] },
      "examples": [{ "orderId": "ORD-2026-4421" }]
    },
    {
      "id": "update-inventory",
      "title": "Update inventory count",
      "description": "Adjust the available inventory quantity for a specific product variant.",
      "input": { "properties": { "variantId": { "type": "string" }, "adjustment": { "type": "number" } }, "required": ["variantId", "adjustment"] },
      "safetyNotes": ["Inventory changes are logged and reversible within 24 hours."]
    },
    {
      "id": "lookup-customer",
      "title": "Look up customer",
      "description": "Find a customer by email, phone, or customer ID. Returns profile, order history summary, and lifetime value.",
      "input": { "properties": { "email": { "type": "string" }, "customerId": { "type": "string" } } },
      "examples": [{ "email": "jane@example.com" }]
    }
  ]
}`,
  },
};

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data as T;
}

function severityClasses(severity: string) {
  if (severity === "critical") return "border-rose-400/30 bg-rose-400/10 text-rose-100";
  if (severity === "warning") return "border-amber-400/30 bg-amber-400/10 text-amber-100";
  return "border-cyan-400/30 bg-cyan-400/10 text-cyan-100";
}

export default function WatchtowerWorkbench() {
  const [manifest, setManifest] = useState(samples.baseline.manifest);
  const [oldManifest, setOldManifest] = useState(samples.baseline.manifest);
  const [newManifest, setNewManifest] = useState(samples.improved.manifest);
  const [manifestUrl, setManifestUrl] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [diff, setDiff] = useState<DiffResult | null>(null);
  const [report, setReport] = useState<StoredReport | null>(null);
  const [webhookPreview, setWebhookPreview] = useState<Record<string, unknown> | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [autoRan, setAutoRan] = useState(false);

  // Auto-run analysis on first load so visitors see results immediately
  useEffect(() => {
    if (!autoRan) {
      setAutoRan(true);
      postJson<AnalysisResult>("/api/analyze", { manifest: samples.baseline.manifest })
        .then(setAnalysis)
        .catch(() => {});
    }
  }, [autoRan]);

  const severityCounts = useMemo(() => {
    const issues = analysis?.issues ?? [];
    return {
      critical: issues.filter((issue) => issue.severity === "critical").length,
      warning: issues.filter((issue) => issue.severity === "warning").length,
      info: issues.filter((issue) => issue.severity === "info").length,
    };
  }, [analysis]);

  function validateJson(input: string): string | null {
    try {
      const parsed = JSON.parse(input);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return "Manifest must be a JSON object, not an array or primitive.";
      return null;
    } catch (e) {
      return `Invalid JSON: ${e instanceof Error ? e.message : "parse error"}`;
    }
  }

  async function runAnalysis() {
    const jsonError = validateJson(manifest);
    if (jsonError) { setError(jsonError); return; }
    try {
      setBusy("analyze");
      setError(null);
      setAnalysis(await postJson<AnalysisResult>("/api/analyze", { manifest }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setBusy(null);
    }
  }

  async function runDiff() {
    const oldErr = validateJson(oldManifest);
    const newErr = validateJson(newManifest);
    if (oldErr) { setError(`Old manifest: ${oldErr}`); return; }
    if (newErr) { setError(`New manifest: ${newErr}`); return; }
    try {
      setBusy("diff");
      setError(null);
      setDiff(await postJson<DiffResult>("/api/diff", { oldManifest, newManifest }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Diff failed");
    } finally {
      setBusy(null);
    }
  }

  async function createReport() {
    try {
      setBusy("report");
      setError(null);
      const data = await postJson<{ report: StoredReport; webhookPreview: Record<string, unknown> }>("/api/reports", {
        manifest,
        oldManifest,
        sourceLabel: "manual-demo",
      });
      setReport(data.report);
      setWebhookPreview(data.webhookPreview);
      setAnalysis(data.report.analysis);
      if (data.report.diff) setDiff(data.report.diff);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Report creation failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="grid gap-6">
      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/70">Validator workbench</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Analyze a manifest in one pass</h2>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {(Object.keys(samples) as SampleKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setManifest(samples[key].manifest)}
                  className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-cyan-100 transition hover:border-cyan-300/40"
                >
                  {samples[key].label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <input
              type="url"
              value={manifestUrl}
              onChange={(e) => setManifestUrl(e.target.value)}
              placeholder="Or fetch from URL..."
              className="flex-1 rounded-xl border border-white/10 bg-slate-950/80 px-4 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500"
            />
            <button
              onClick={async () => {
                if (!manifestUrl.trim()) return;
                try {
                  setBusy("fetch");
                  setError(null);
                  const res = await fetch(manifestUrl);
                  const text = await res.text();
                  setManifest(text);
                  setManifestUrl("");
                } catch (err) {
                  setError(`Failed to fetch: ${err instanceof Error ? err.message : "unknown error"}`);
                } finally {
                  setBusy(null);
                }
              }}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
            >
              {busy === "fetch" ? "Fetching..." : "Fetch"}
            </button>
          </div>
          <textarea
            value={manifest}
            onChange={(event) => setManifest(event.target.value)}
            className="mt-5 min-h-[360px] w-full rounded-2xl border border-white/10 bg-slate-950/80 p-4 font-mono text-sm text-slate-100 outline-none"
            spellCheck={false}
          />
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={runAnalysis} className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950">
              {busy === "analyze" ? "Analyzing..." : "Run readiness analysis"}
            </button>
            <button onClick={createReport} className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-3 text-sm font-semibold text-emerald-100">
              {busy === "report" ? "Saving..." : "Create hosted report"}
            </button>
          </div>
          {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
        </article>

        <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Automation layer</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Nightly monitoring-ready</h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
            <li>• POST `/api/analyze` for deterministic manifest scoring</li>
            <li>• POST `/api/diff` for release-risk checks before deploys</li>
            <li>• POST `/api/reports` to persist a hosted report snapshot</li>
            <li>• POST `/api/webhooks/ingest` as the results delivery stub</li>
            <li>• GET `/api/cron/recheck` for Vercel Cron-based scheduled monitoring</li>
          </ul>
          <div className="mt-6 rounded-2xl border border-violet-400/20 bg-violet-400/10 p-4 text-sm text-violet-100">
            Good default loop: re-check tracked manifests nightly, diff against previous version, then ship the webhook payload to Slack/Discord/internal queues.
          </div>
          {report ? (
            <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-100">
              Hosted report ready: <a className="underline" href={`/report/${report.id}`}>/report/{report.id}</a>
            </div>
          ) : null}
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Readiness output</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Score, severity, and fixes</h2>
            </div>
            {analysis ? (
              <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-4 text-right">
                <div className="text-4xl font-semibold text-white">{analysis.score}</div>
                <div className="text-sm text-cyan-100">{analysis.verdict}</div>
              </div>
            ) : null}
          </div>

          {analysis ? (
            <div className="mt-6 grid gap-4">
              <div className="grid gap-4 md:grid-cols-3">
                {([
                  ["Critical", severityCounts.critical, "critical"],
                  ["Warnings", severityCounts.warning, "warning"],
                  ["Info", severityCounts.info, "info"],
                ] as const).map(([label, count, severity]) => (
                  <div key={label} className={`rounded-2xl border px-4 py-4 ${severityClasses(severity)}`}>
                    <div className="text-sm uppercase tracking-[0.24em]">{label}</div>
                    <div className="mt-2 text-3xl font-semibold">{count}</div>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-sm text-slate-400">Copyable summary</p>
                  <p className="mt-3 text-sm leading-7 text-slate-100">{analysis.copySummary}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-sm text-slate-400">Top recommendations</p>
                  <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-100">
                    {analysis.recommendations.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-sm text-slate-400">Category scores</p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {analysis.categories.map((category) => (
                    <div key={category.category} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-white">{category.label}</span>
                        <span className="text-sm text-cyan-100">{category.score}/100</span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                        <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" style={{ width: `${category.score}%` }} />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-300">{category.summary}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-sm text-slate-400">Issue checklist</p>
                <div className="mt-4 grid gap-3">
                  {analysis.issues.map((issue) => (
                    <div key={issue.id} className={`rounded-2xl border p-4 ${severityClasses(issue.severity)}`}>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-current/20 px-2 py-1 text-[11px] uppercase tracking-[0.22em]">{issue.severity}</span>
                        <span className="text-xs uppercase tracking-[0.22em] opacity-75">{issue.category}</span>
                      </div>
                      <h3 className="mt-3 text-lg font-semibold">{issue.title}</h3>
                      <p className="mt-2 text-sm leading-6">{issue.detail}</p>
                      <p className="mt-2 text-sm leading-6 opacity-90">Fix: {issue.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : busy === "analyze" ? (
            <div className="mt-6 grid gap-4 animate-pulse">
              <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-2xl bg-slate-800/50" />)}
              </div>
              <div className="h-32 rounded-2xl bg-slate-800/50" />
              <div className="h-48 rounded-2xl bg-slate-800/50" />
            </div>
          ) : (
            <p className="mt-6 text-sm leading-7 text-slate-300">Paste an ACP manifest above and hit &ldquo;Run readiness analysis&rdquo; to see severity cards, category scores, and issue-level fix guidance.</p>
          )}
        </article>

        <div className="grid gap-6">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Diff mode</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Release risk before shipping</h2>
              </div>
              <button onClick={runDiff} className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100">
                {busy === "diff" ? "Comparing..." : "Run diff"}
              </button>
            </div>
            <div className="mt-4 grid gap-4">
              <textarea value={oldManifest} onChange={(e) => setOldManifest(e.target.value)} className="min-h-[150px] w-full rounded-2xl border border-white/10 bg-slate-950/80 p-4 font-mono text-xs text-slate-100" spellCheck={false} />
              <textarea value={newManifest} onChange={(e) => setNewManifest(e.target.value)} className="min-h-[150px] w-full rounded-2xl border border-white/10 bg-slate-950/80 p-4 font-mono text-xs text-slate-100" spellCheck={false} />
            </div>
            {diff ? (
              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-400">Release risk</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${severityClasses(diff.releaseRisk === "high" ? "critical" : diff.releaseRisk === "medium" ? "warning" : "info")}`}>
                      {diff.releaseRisk}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-200">{diff.summary}</p>
                </div>
                {diff.changes.map((change, index) => (
                  <div key={`${change.target}-${index}`} className={`rounded-2xl border p-4 ${severityClasses(change.level)}`}>
                    <p className="text-sm uppercase tracking-[0.24em]">{change.kind} · {change.target}</p>
                    <p className="mt-2 text-sm leading-6">{change.detail}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Webhook preview</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Event payload</h2>
            <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-xs leading-6 text-slate-200">
{JSON.stringify(webhookPreview ?? { message: "Create a report to preview the outbound event schema." }, null, 2)}
            </pre>
          </article>
        </div>
      </div>
    </section>
  );
}
