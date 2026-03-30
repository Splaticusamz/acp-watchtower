import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CI/CD Integration — ACP Watchtower",
  description: "Integrate ACP Watchtower into GitHub Actions, GitLab CI, and other CI/CD pipelines for automated manifest validation.",
};

export default function CIDocsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-20 sm:px-10">
        <Link href="/docs" className="text-sm text-cyan-400 hover:text-cyan-300">← Back to docs</Link>

        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white">CI/CD Integration</h1>
        <p className="mt-4 text-lg text-slate-300">
          Validate ACP manifests on every push, PR, or release with a single API call.
        </p>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-white">GitHub Actions</h2>
          <p className="mt-3 text-sm text-slate-300">Add this workflow to validate your manifest on every push:</p>
          <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/80 p-6 text-sm leading-7 text-slate-200">
{`name: ACP Manifest Check
on:
  push:
    paths:
      - 'acp-manifest.json'
  pull_request:
    paths:
      - 'acp-manifest.json'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate ACP manifest
        run: |
          RESULT=$(curl -s -X POST \\
            https://acp-watchtower.vercel.app/api/analyze \\
            -H "Content-Type: application/json" \\
            -d "{\\"manifest\\": $(cat acp-manifest.json | jq -Rs .)}")
          
          SCORE=$(echo $RESULT | jq '.score')
          VERDICT=$(echo $RESULT | jq -r '.verdict')
          echo "## ACP Readiness: $SCORE/100 ($VERDICT)" >> $GITHUB_STEP_SUMMARY
          
          CRITICAL=$(echo $RESULT | jq '[.issues[] | select(.severity=="critical")] | length')
          if [ "$CRITICAL" -gt 0 ]; then
            echo "::error::$CRITICAL critical issues found in ACP manifest"
            exit 1
          fi`}
          </pre>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-white">Diff on PR</h2>
          <p className="mt-3 text-sm text-slate-300">Compare the manifest between base and head to catch risky changes:</p>
          <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/80 p-6 text-sm leading-7 text-slate-200">
{`- name: Diff ACP manifest
  run: |
    git show origin/main:acp-manifest.json > /tmp/old-manifest.json 2>/dev/null || echo '{}' > /tmp/old-manifest.json
    
    DIFF=$(curl -s -X POST \\
      https://acp-watchtower.vercel.app/api/diff \\
      -H "Content-Type: application/json" \\
      -d "{
        \\"oldManifest\\": $(cat /tmp/old-manifest.json | jq -Rs .),
        \\"newManifest\\": $(cat acp-manifest.json | jq -Rs .)
      }")
    
    RISK=$(echo $DIFF | jq -r '.releaseRisk')
    echo "Release risk: $RISK" >> $GITHUB_STEP_SUMMARY
    
    if [ "$RISK" = "high" ]; then
      echo "::warning::High release risk detected in ACP manifest changes"
    fi`}
          </pre>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-white">GitLab CI</h2>
          <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/80 p-6 text-sm leading-7 text-slate-200">
{`acp-validate:
  stage: test
  script:
    - |
      RESULT=$(curl -s -X POST \\
        https://acp-watchtower.vercel.app/api/analyze \\
        -H "Content-Type: application/json" \\
        -d "{\\"manifest\\": $(cat acp-manifest.json | jq -Rs .)}")
      SCORE=$(echo $RESULT | jq '.score')
      echo "ACP Readiness Score: $SCORE/100"
      CRITICAL=$(echo $RESULT | jq '[.issues[] | select(.severity=="critical")] | length')
      test "$CRITICAL" -eq 0 || exit 1
  only:
    changes:
      - acp-manifest.json`}
          </pre>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-white">Generic (curl)</h2>
          <p className="mt-3 text-sm text-slate-300">Works with any CI system:</p>
          <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/80 p-6 text-sm leading-7 text-slate-200">
{`#!/bin/bash
set -e

MANIFEST=$(cat acp-manifest.json)
RESULT=$(curl -sf -X POST \\
  https://acp-watchtower.vercel.app/api/analyze \\
  -H "Content-Type: application/json" \\
  -d "{\\"manifest\\": $(echo "$MANIFEST" | jq -Rs .)}")

SCORE=$(echo "$RESULT" | jq '.score')
CRITICAL=$(echo "$RESULT" | jq '[.issues[] | select(.severity=="critical")] | length')

echo "Score: $SCORE/100"
echo "Critical issues: $CRITICAL"

[ "$CRITICAL" -eq 0 ] || { echo "FAIL: Critical issues found"; exit 1; }`}
          </pre>
        </section>

        <div className="mt-12 rounded-3xl border border-violet-400/20 bg-violet-400/10 p-6">
          <h3 className="font-semibold text-white">Pro tip: GitHub Webhook</h3>
          <p className="mt-2 text-sm text-slate-300">
            Instead of CI scripts, you can configure a GitHub webhook pointing at{" "}
            <code className="rounded bg-slate-800 px-2 py-0.5 text-xs">https://acp-watchtower.vercel.app/api/github/webhook</code>
            {" "}to automatically analyze manifests on every push. No CI configuration needed.
          </p>
        </div>
      </div>
    </main>
  );
}
