import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Example Manifests — ACP Watchtower",
  description: "Real-world ACP manifest examples for support agents, e-commerce, CRM, and more. Analyze them instantly.",
};

const examples = [
  {
    name: "Support Agent",
    description: "Triage, escalation, and knowledge base search for customer support teams.",
    actions: ["search-kb", "create-escalation", "draft-renewal-offer"],
    score: "85-95",
    complexity: "Medium",
  },
  {
    name: "E-Commerce Agent",
    description: "Shopify store management — products, orders, inventory, and customer lookup.",
    actions: ["search-products", "get-order", "update-inventory", "create-discount", "lookup-customer"],
    score: "75-90",
    complexity: "High",
  },
  {
    name: "CRM Agent",
    description: "Contact management, deal tracking, and activity logging for sales teams.",
    actions: ["search-contacts", "create-deal", "log-activity", "get-pipeline"],
    score: "70-85",
    complexity: "Medium",
  },
  {
    name: "Content Agent",
    description: "Draft, publish, and schedule content across multiple channels.",
    actions: ["draft-post", "schedule-publish", "get-analytics", "suggest-topics"],
    score: "65-80",
    complexity: "Medium",
  },
  {
    name: "DevOps Agent",
    description: "CI/CD pipeline control, deployment management, and incident response.",
    actions: ["trigger-deploy", "rollback", "get-status", "create-incident", "notify-oncall"],
    score: "60-85",
    complexity: "High",
  },
  {
    name: "Minimal Agent",
    description: "A bare-minimum manifest with one action. Good for testing the validator.",
    actions: ["hello-world"],
    score: "30-50",
    complexity: "Low",
  },
];

export default function ExamplesPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:px-10">
        <Link href="/" className="text-sm text-cyan-400 hover:text-cyan-300">← Back to home</Link>

        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Example manifests
        </h1>
        <p className="mt-4 text-lg text-slate-300">
          Common patterns for ACP manifests across industries. Use these as starting points or paste them into the validator to see how scoring works.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {examples.map((ex) => (
            <div key={ex.name} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-semibold text-white">{ex.name}</h2>
                <span className="shrink-0 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
                  ~{ex.score}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-300">{ex.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {ex.actions.map((action) => (
                  <span key={action} className="rounded-full border border-white/10 bg-slate-900 px-3 py-1 text-xs text-slate-300">
                    {action}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                <span>Complexity: {ex.complexity}</span>
                <span>{ex.actions.length} actions</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-8 text-center">
          <h2 className="text-2xl font-semibold text-white">Try the validator</h2>
          <p className="mt-2 text-slate-300">Paste any manifest and get a readiness score in seconds.</p>
          <Link href="/" className="mt-4 inline-block rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950">
            Open validator
          </Link>
        </div>
      </div>
    </main>
  );
}
