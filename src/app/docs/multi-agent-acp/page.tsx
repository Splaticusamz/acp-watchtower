import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ACP in Multi-Agent Systems: Orchestration, Trust & Discovery — ACP Watchtower",
  description:
    "How the Agent Communication Protocol (ACP) enables multi-agent systems to communicate, discover capabilities, and make trust decisions. Practical guide with manifest examples.",
};

const architecturePatterns = [
  {
    name: "Orchestrator → Worker",
    description:
      "A central orchestrator agent parses task requests and delegates subtasks to specialized worker agents. The orchestrator uses ACP manifests to discover what each worker can do and how to call it.",
    example: `// Orchestrator reads worker manifests to plan task routing
const workerCapabilities = await fetchManifest(workerUrl);
const matchingAction = workerCapabilities.actions.find(
  a => a.name === "extract_entities"
);
if (matchingAction) {
  await callAgent(workerUrl, "extract_entities", { text: input });
}`,
    acpBenefit: "Without ACP, the orchestrator needs hardcoded knowledge of every worker. With ACP, it discovers capabilities dynamically and adapts as workers evolve.",
  },
  {
    name: "Peer-to-Peer Agent Mesh",
    description:
      "Agents discover and call each other directly without a central coordinator. Each agent publishes an ACP manifest; others query a registry to find the right collaborator for a given task.",
    example: `// Agent registry lookup pattern
const agents = await registry.search({ tags: ["data-analysis", "csv"] });
const bestMatch = agents.sort((a, b) => b.readinessScore - a.readinessScore)[0];
await bestMatch.invoke("analyze_dataset", { fileUrl: dataUrl });`,
    acpBenefit: "ACP manifests carry tags, capability descriptions, and authentication requirements — giving the registry enough signal to match agents to tasks without human configuration.",
  },
  {
    name: "Human-in-the-Loop Agent",
    description:
      "An AI agent handles most requests autonomously but escalates decisions above a confidence threshold to a human. ACP clarifies which actions require approval and what parameters they accept.",
    example: `{
  "name": "approval-required-action",
  "description": "Sends a financial transfer. Requires human approval above $500.",
  "parameters": { ... },
  "safety": {
    "requiresHumanApproval": true,
    "approvalThreshold": { "field": "amount", "above": 500 }
  }
}`,
    acpBenefit: "Safety guardrails in the ACP manifest tell orchestrators and humans exactly where human oversight is needed — no code inspection required.",
  },
];

const trustLevels = [
  {
    level: "Public",
    icon: "🌐",
    description: "Open to any caller. Suitable for read-only data tools, public search agents, and informational services.",
    manifestSignal: "No auth in manifest, or auth.type: none",
    example: "Weather agent, news summarizer, public database lookup",
  },
  {
    level: "API Key",
    icon: "🔑",
    description: "Requires a shared secret. Good for paid services, rate-limited tools, and semi-trusted integrations.",
    manifestSignal: "auth.type: apiKey in manifest",
    example: "WebSnap API, LLM pricing API, enrichment services",
  },
  {
    level: "OAuth",
    icon: "🛡️",
    description: "Full delegated authorization. User-scoped access with token expiry. For agents that act on behalf of users.",
    manifestSignal: "auth.type: oauth2 with scopes declared",
    example: "Calendar agent, email agent, CRM update agent",
  },
  {
    level: "Internal",
    icon: "🔒",
    description: "Private agent, not in public registries. Trust is established out-of-band (VPN, service mesh, mTLS).",
    manifestSignal: "visibility: internal in manifest",
    example: "Internal DB query agent, proprietary pipeline step",
  },
];

const exampleManifest = `{
  "name": "document-summarizer",
  "description": "Reads a URL or raw text and returns a structured summary with key points, entities, and sentiment.",
  "version": "2.1.0",
  "tags": ["nlp", "summarization", "document-processing"],
  "homepage": "https://agents.example.com/summarizer",
  "auth": {
    "type": "apiKey",
    "in": "header",
    "name": "x-api-key"
  },
  "rateLimit": {
    "requestsPerMinute": 60,
    "requestsPerDay": 10000
  },
  "actions": [
    {
      "name": "summarize_url",
      "description": "Fetches a URL and returns a structured document summary. Supports HTML pages, PDFs, and plain text.",
      "parameters": {
        "type": "object",
        "properties": {
          "url": {
            "type": "string",
            "description": "The URL of the document to summarize"
          },
          "maxPoints": {
            "type": "integer",
            "description": "Maximum key points to return (default: 5, max: 20)",
            "default": 5
          },
          "language": {
            "type": "string",
            "description": "Output language ISO code (default: en)",
            "default": "en"
          }
        },
        "required": ["url"]
      },
      "returns": {
        "type": "object",
        "properties": {
          "summary": { "type": "string" },
          "keyPoints": { "type": "array", "items": { "type": "string" } },
          "entities": { "type": "array" },
          "sentiment": { "type": "string", "enum": ["positive", "neutral", "negative"] }
        }
      }
    }
  ],
  "safety": {
    "contentPolicy": "No PII storage. Documents are processed in-memory and not retained.",
    "dataRetention": "none"
  }
}`;

export default function MultiAgentAcpPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-20 sm:px-10">
        <Link href="/docs" className="text-sm text-cyan-400 hover:text-cyan-300">
          ← Back to docs
        </Link>

        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          ACP in Multi-Agent Systems
        </h1>
        <p className="mt-4 text-lg text-slate-400">
          How agents discover each other, establish trust, and communicate reliably at scale — and why your manifest quality matters more in multi-agent than single-agent setups.
        </p>

        <div className="mt-16 space-y-16">

          {/* Why Multi-Agent Needs ACP */}
          <section>
            <h2 className="text-2xl font-semibold text-white">Why Multi-Agent Systems Break Without ACP</h2>
            <div className="mt-4 space-y-4 text-slate-300">
              <p>
                A single-agent app is simple: you know what it can do, how to call it, and what it returns. As soon as you add a second agent — or a third, or a hundred — the coordination problem explodes.
              </p>
              <p>
                Without a standard like ACP, each agent integration requires custom code. The orchestrator needs hardcoded knowledge of every worker's API shape. When a worker updates its parameters, the orchestrator breaks silently. New agents can't be discovered without manual registration.
              </p>
              <p>
                ACP solves this by making agent capabilities <strong className="text-white">machine-readable and self-describing</strong>. An orchestrator that understands ACP can discover a new agent, understand what it does, verify its readiness score, and start calling it — without human configuration.
              </p>
            </div>
          </section>

          {/* Architecture Patterns */}
          <section>
            <h2 className="text-2xl font-semibold text-white">Common Multi-Agent Architectures</h2>
            <div className="mt-6 space-y-8">
              {architecturePatterns.map((pattern) => (
                <div key={pattern.name} className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
                  <h3 className="text-lg font-semibold text-cyan-300">{pattern.name}</h3>
                  <p className="mt-2 text-sm text-slate-400">{pattern.description}</p>
                  <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-700 bg-[#020617] p-4 text-xs leading-6 text-slate-300">{pattern.example}</pre>
                  <div className="mt-3 rounded-xl border border-cyan-900/40 bg-cyan-950/30 p-3 text-sm text-cyan-200">
                    <span className="font-semibold text-cyan-300">ACP benefit: </span>{pattern.acpBenefit}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Trust Levels */}
          <section>
            <h2 className="text-2xl font-semibold text-white">Agent Trust Levels</h2>
            <p className="mt-2 text-sm text-slate-400">
              Multi-agent systems need to make trust decisions fast. ACP manifests signal trust requirements explicitly so orchestrators can gate access appropriately.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {trustLevels.map((t) => (
                <div key={t.level} className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{t.icon}</span>
                    <span className="font-semibold text-white">{t.level}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{t.description}</p>
                  <p className="mt-3 rounded-lg border border-slate-700 bg-black/30 px-3 py-2 font-mono text-xs text-slate-300">{t.manifestSignal}</p>
                  <p className="mt-2 text-xs text-slate-500">e.g. {t.example}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Production Manifest Example */}
          <section>
            <h2 className="text-2xl font-semibold text-white">Production Manifest Example</h2>
            <p className="mt-2 text-sm text-slate-400">
              A well-structured manifest that earns a high readiness score in multi-agent environments. Note the complete action schema, auth declaration, rate limits, and safety policy.
            </p>
            <pre className="mt-5 overflow-x-auto rounded-2xl border border-slate-700 bg-[#020617] p-5 text-xs leading-6 text-emerald-200">{exampleManifest}</pre>
            <div className="mt-4 flex flex-wrap gap-3 text-xs">
              <span className="rounded-full border border-emerald-700/40 bg-emerald-900/20 px-3 py-1 text-emerald-300">✓ Complete action schema</span>
              <span className="rounded-full border border-emerald-700/40 bg-emerald-900/20 px-3 py-1 text-emerald-300">✓ Auth type declared</span>
              <span className="rounded-full border border-emerald-700/40 bg-emerald-900/20 px-3 py-1 text-emerald-300">✓ Rate limits documented</span>
              <span className="rounded-full border border-emerald-700/40 bg-emerald-900/20 px-3 py-1 text-emerald-300">✓ Returns schema defined</span>
              <span className="rounded-full border border-emerald-700/40 bg-emerald-900/20 px-3 py-1 text-emerald-300">✓ Safety policy present</span>
            </div>
          </section>

          {/* Validation CTA */}
          <section className="rounded-2xl border border-cyan-900/50 bg-cyan-950/20 p-8 text-center">
            <h2 className="text-xl font-semibold text-white">Validate Your Agent for Multi-Agent Deployment</h2>
            <p className="mt-2 text-sm text-slate-400">
              Run your manifest through ACP Watchtower to get a readiness score, fix missing fields, and generate a shareable hosted report for your team.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/"
                className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-gray-950 hover:bg-cyan-300"
              >
                Validate your manifest →
              </Link>
              <Link
                href="/docs/validation-guide"
                className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Read the validation guide
              </Link>
            </div>
          </section>

          {/* Related docs */}
          <section>
            <h2 className="text-lg font-semibold text-white">Related docs</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/docs/what-is-acp" className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-cyan-300 hover:bg-slate-800">
                What is ACP? →
              </Link>
              <Link href="/docs/validation-guide" className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-cyan-300 hover:bg-slate-800">
                Validation guide →
              </Link>
              <Link href="/docs/ci" className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-cyan-300 hover:bg-slate-800">
                CI/CD integration →
              </Link>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
