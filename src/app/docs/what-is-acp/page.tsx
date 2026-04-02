import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What is ACP? Agent Communication Protocol Explained — ACP Watchtower",
  description:
    "A beginner-friendly guide to the Agent Communication Protocol (ACP). Learn what ACP is, why it matters for AI agents, and how to validate your manifests.",
};

const faqs = [
  {
    q: "What is ACP?",
    a: "The Agent Communication Protocol (ACP) is a standard that defines how AI agents advertise their capabilities. An ACP manifest is a JSON document that lists an agent's actions, parameters, authentication methods, and metadata — making it possible for other agents and tools to discover and call it correctly.",
  },
  {
    q: "Why does ACP validation matter?",
    a: "An invalid or incomplete manifest means other agents can't reliably use your agent. Missing parameter descriptions cause integration failures. Vague action names make discovery impossible. Validation catches these issues before they hit production.",
  },
  {
    q: "What's in an ACP manifest?",
    a: "At minimum: a name, description, version, and one or more actions. Each action defines what it does, what parameters it accepts, and what it returns. Production manifests also include authentication config, rate limits, error schemas, and safety guardrails.",
  },
  {
    q: "How is ACP different from OpenAPI?",
    a: "OpenAPI describes REST APIs for humans and code generators. ACP describes agent capabilities for other AI agents. ACP manifests include agent-specific metadata like safety policies, action intent descriptions, and inter-agent communication patterns that OpenAPI doesn't cover.",
  },
  {
    q: "Do I need ACP if I'm building a single agent?",
    a: "Yes — even solo agents benefit from a well-structured manifest. It serves as documentation, enables tool-use frameworks (like LangChain, CrewAI, or AutoGen) to call your agent, and future-proofs you for multi-agent systems.",
  },
];

const exampleManifest = `{
  "name": "weather-agent",
  "description": "Provides current weather and 5-day forecasts for any city worldwide.",
  "version": "1.2.0",
  "actions": [
    {
      "name": "get_forecast",
      "description": "Returns a 5-day weather forecast for a given city.",
      "parameters": {
        "type": "object",
        "properties": {
          "city": {
            "type": "string",
            "description": "City name (e.g. 'San Francisco, CA')"
          },
          "units": {
            "type": "string",
            "enum": ["celsius", "fahrenheit"],
            "description": "Temperature unit preference"
          }
        },
        "required": ["city"]
      }
    }
  ]
}`;

export default function WhatIsAcpPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-20 sm:px-10">
        <Link href="/docs" className="text-sm text-cyan-400 hover:text-cyan-300">
          ← Back to docs
        </Link>

        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          What is ACP? A Beginner&apos;s Guide
        </h1>
        <p className="mt-4 text-lg text-slate-400">
          Everything you need to know about the Agent Communication Protocol — what it is, why it matters, and how to get started.
        </p>

        <div className="mt-16 space-y-12">
          {/* FAQ Section */}
          <section>
            <h2 className="text-2xl font-semibold text-white">Frequently Asked Questions</h2>
            <div className="mt-6 space-y-8">
              {faqs.map((faq) => (
                <div key={faq.q}>
                  <h3 className="text-lg font-medium text-cyan-300">{faq.q}</h3>
                  <p className="mt-2 text-slate-300 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Example Manifest */}
          <section>
            <h2 className="text-2xl font-semibold text-white">Example ACP Manifest</h2>
            <p className="mt-3 text-slate-300">
              Here&apos;s a minimal but valid ACP manifest for a weather agent:
            </p>
            <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-[#020617] p-6 text-sm leading-7 text-slate-200">
              {exampleManifest}
            </pre>
            <p className="mt-4 text-slate-400 text-sm">
              This scores well on schema completeness and action clarity. To score higher, add authentication config, error schemas, and safety metadata.
            </p>
          </section>

          {/* Validation Steps */}
          <section>
            <h2 className="text-2xl font-semibold text-white">How to Validate Your Manifest</h2>
            <ol className="mt-6 list-decimal list-inside space-y-4 text-slate-300">
              <li>
                <strong className="text-white">Paste your manifest</strong> into the{" "}
                <Link href="/" className="text-cyan-400 hover:text-cyan-300">
                  ACP Watchtower analyzer
                </Link>
              </li>
              <li>
                <strong className="text-white">Review your readiness score</strong> — we check 20+ rules across 5 categories
              </li>
              <li>
                <strong className="text-white">Fix severity-tagged findings</strong> — each issue comes with a specific fix recommendation
              </li>
              <li>
                <strong className="text-white">Use diff mode</strong> to compare manifest versions and catch action drift before releasing
              </li>
              <li>
                <strong className="text-white">Automate with CI</strong> — use our{" "}
                <Link href="/docs" className="text-cyan-400 hover:text-cyan-300">
                  API endpoints
                </Link>{" "}
                in GitHub Actions for continuous validation
              </li>
            </ol>
          </section>

          {/* CTA */}
          <section className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-8 text-center">
            <h2 className="text-2xl font-semibold text-white">
              Ready to validate your first manifest?
            </h2>
            <p className="mt-2 text-slate-300">
              Paste your ACP manifest and get a readiness score in seconds — free, no signup required.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-gray-950"
            >
              Try ACP Watchtower →
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
