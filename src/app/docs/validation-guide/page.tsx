import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ACP Manifest Validation Guide — ACP Watchtower",
  description:
    "Learn what makes a good ACP manifest. Understand validation rules, common mistakes, readiness scoring, and best practices for shipping production-grade agent manifests.",
};

const categories = [
  {
    name: "Schema Completeness",
    weight: "25%",
    description:
      "Does the manifest include all required top-level fields? Name, description, version, and at least one action are the minimum. Missing fields signal an incomplete or abandoned agent definition.",
    checks: [
      "name — required, non-empty string",
      "description — required, explains what the agent does",
      "version — semantic version string (e.g. 1.0.0)",
      "actions — at least one action defined",
      "Each action has name, description, and parameters schema",
    ],
    fix: "Fill in every required field. Even if your agent only has one action, a clear name and description help discovery tools and humans understand what it does.",
  },
  {
    name: "Action Clarity",
    weight: "25%",
    description:
      "Are actions well-defined enough that another agent (or human) can invoke them correctly without guessing? Vague action descriptions and missing parameter schemas are the #1 cause of integration failures.",
    checks: [
      "Action descriptions explain behavior, not just name",
      "Parameters have types, descriptions, and required flags",
      "Response schema is documented (even if minimal)",
      "No duplicate action names",
      "Action names follow consistent naming convention",
    ],
    fix: 'Write action descriptions as if the caller has never seen your agent before. "Searches the database" is vague; "Searches the product catalog by keyword and returns up to 10 matching items with price and availability" is actionable.',
  },
  {
    name: "Discoverability",
    weight: "20%",
    description:
      "Can other agents and platforms find and understand your agent? Tags, categories, and clear metadata make your agent discoverable in registries and marketplaces.",
    checks: [
      "Tags/categories present and relevant",
      "Homepage or documentation URL provided",
      "Contact or support information included",
      "Logo or icon URL (optional but improves trust)",
    ],
    fix: "Add 3-5 relevant tags. Include a docs URL even if it just points to your README. These small additions dramatically improve how your agent appears in discovery tools.",
  },
  {
    name: "Safety Guardrails",
    weight: "20%",
    description:
      "Does the manifest declare what the agent can and cannot do? Safety metadata helps orchestrators make informed trust decisions and prevents unexpected behavior in multi-agent systems.",
    checks: [
      "Permissions or capability declarations present",
      "Rate limit guidance documented",
      "Error response patterns specified",
      "No overly broad capability claims",
      "Authentication requirements clearly stated",
    ],
    fix: "Explicitly declare what your agent needs access to. If it reads files, say so. If it makes HTTP requests, document which domains. Silence on permissions is treated as a risk signal.",
  },
  {
    name: "Maintainability",
    weight: "10%",
    description:
      "Is the manifest structured for long-term maintenance? Consistent formatting, version tracking, and changelog presence indicate an actively maintained agent.",
    checks: [
      "Version follows semver",
      "Changelog or release notes referenced",
      "No deprecated fields or patterns",
      "Consistent JSON formatting",
    ],
    fix: "Bump your version with every change. Reference a changelog URL so consumers can track what changed between releases.",
  },
];

const commonMistakes = [
  {
    mistake: "Empty or placeholder descriptions",
    example: '"description": "TODO"',
    impact: "Fails schema completeness and action clarity checks. Readiness score drops 20-30 points.",
    fix: "Write real descriptions before publishing. Even one sentence beats a placeholder.",
  },
  {
    mistake: "Missing parameter types",
    example: '"parameters": { "query": {} }',
    impact: "Callers can't validate inputs. Integration failures spike in multi-agent systems.",
    fix: 'Add type, description, and required for every parameter: { "query": { "type": "string", "description": "Search term", "required": true } }',
  },
  {
    mistake: "Overly broad action names",
    example: '"name": "do_stuff"',
    impact: "Agents and routers can't match intent to action. Discoverability drops.",
    fix: "Use specific, verb-noun action names: search_products, create_invoice, get_user_profile.",
  },
  {
    mistake: "No version field",
    example: "Manifest has no version key",
    impact: "Consumers can't pin to a specific release. Breaking changes propagate silently.",
    fix: 'Add "version": "1.0.0" and bump it with every change.',
  },
];

export default function ValidationGuidePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-20 sm:px-10">
        <Link href="/docs" className="text-sm text-cyan-400 hover:text-cyan-300">
          ← Back to docs
        </Link>

        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          ACP Manifest Validation Guide
        </h1>
        <p className="mt-4 text-lg text-slate-300">
          Everything you need to know about what makes a good ACP manifest — and
          how ACP Watchtower scores yours.
        </p>

        {/* What is ACP? */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-white">
            What is ACP (Agent Communication Protocol)?
          </h2>
          <p className="mt-4 text-slate-300 leading-7">
            ACP is an emerging standard for how AI agents describe their
            capabilities to other agents and orchestration platforms. An ACP
            manifest is a structured JSON document that declares what an agent
            can do, what inputs it expects, and what outputs it produces — like
            an OpenAPI spec, but designed for the agent-to-agent world.
          </p>
          <p className="mt-4 text-slate-300 leading-7">
            A well-written manifest enables automatic discovery, safe
            orchestration, and reliable multi-agent workflows. A poorly-written
            one causes integration failures, security gaps, and wasted
            development time.
          </p>
        </section>

        {/* Scoring categories */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-white">
            How Readiness Scoring Works
          </h2>
          <p className="mt-4 text-slate-300 leading-7">
            ACP Watchtower evaluates manifests across five weighted categories.
            Each category contributes to a 0-100 readiness score. Issues are
            tagged as <span className="text-red-400">critical</span>,{" "}
            <span className="text-yellow-400">warning</span>, or{" "}
            <span className="text-slate-400">info</span>.
          </p>

          <div className="mt-8 space-y-8">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">
                    {cat.name}
                  </h3>
                  <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
                    {cat.weight}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {cat.description}
                </p>
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    What we check
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-300">
                    {cat.checks.map((c) => (
                      <li key={c}>• {c}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                  <p className="text-sm text-emerald-200">
                    <strong>How to fix:</strong> {cat.fix}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Common mistakes */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-white">
            Common Mistakes (and How to Fix Them)
          </h2>
          <div className="mt-8 space-y-6">
            {commonMistakes.map((m) => (
              <div
                key={m.mistake}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="font-semibold text-white">{m.mistake}</h3>
                <pre className="mt-3 rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-red-300">
                  {m.example}
                </pre>
                <p className="mt-3 text-sm text-yellow-300">
                  <strong>Impact:</strong> {m.impact}
                </p>
                <p className="mt-2 text-sm text-emerald-300">
                  <strong>Fix:</strong> {m.fix}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-16 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-8 text-center">
          <h2 className="text-2xl font-semibold text-white">
            Validate your manifest now
          </h2>
          <p className="mt-2 text-slate-300">
            Paste your ACP manifest and get a detailed readiness report in
            seconds — free, no signup required.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950"
          >
            Open validator
          </Link>
        </div>
      </div>
    </main>
  );
}
