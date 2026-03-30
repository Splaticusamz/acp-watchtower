import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — ACP Watchtower",
  description: "Learn how ACP Watchtower helps teams validate agent manifests, catch action drift, and ship reliable AI integrations.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-20 sm:px-10">
        <Link href="/" className="text-sm text-cyan-400 hover:text-cyan-300">← Back to home</Link>

        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          About ACP Watchtower
        </h1>

        <div className="mt-12 space-y-10 text-lg leading-8 text-slate-300">
          <section>
            <h2 className="text-2xl font-semibold text-white">What We Do</h2>
            <p className="mt-4">
              ACP Watchtower is the fastest way to validate Agent Communication Protocol manifests.
              Paste a manifest, get a readiness score, severity-tagged findings, and actionable fix guidance — in seconds.
            </p>
            <p className="mt-3">
              Compare old vs. new manifests to catch risky action drift before it reaches production.
              Generate shareable reports your team can act on immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">Who It&apos;s For</h2>
            <ul className="mt-4 list-inside list-disc space-y-2">
              <li><strong>AI platform teams</strong> — validate agent manifests before deployment</li>
              <li><strong>DevOps &amp; SRE</strong> — automate compliance checks in CI/CD pipelines</li>
              <li><strong>ACP developers</strong> — catch drift, missing fields, and configuration errors early</li>
              <li><strong>Engineering managers</strong> — track readiness across multiple agents with hosted reports</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">How It Works</h2>
            <ol className="mt-4 list-inside list-decimal space-y-2">
              <li>Submit a manifest (paste, upload, or URL)</li>
              <li>Get a readiness score with category subscores</li>
              <li>Review severity-tagged findings with fix guidance</li>
              <li>Share the hosted report with your team</li>
              <li>Set up webhooks for automatic re-checks on every push</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">Pricing</h2>
            <p className="mt-4">
              We offer three tiers to match your needs.{" "}
              <Link href="/pricing" className="text-cyan-400 hover:text-cyan-300 underline">
                See full pricing →
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
