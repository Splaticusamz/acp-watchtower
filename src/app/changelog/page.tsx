import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog — ACP Watchtower",
  description: "What's new in ACP Watchtower. Feature updates, improvements, and fixes.",
};

const entries = [
  {
    date: "2026-03-30",
    title: "Polish + expansion pass",
    items: [
      "Added shared navigation and footer across all pages",
      "Report history page at /history",
      "SVG badge API for embedding readiness scores in READMEs",
      "Download JSON and Copy Summary buttons on report pages",
      "Client-side JSON validation with friendly error messages",
      "URL fetch — load manifests directly from a URL in the workbench",
      "FAQ section on homepage",
      "Full documentation page with API quickstart and integration guide",
      "Email capture / Pro waitlist on pricing and homepage",
      "SEO: sitemap.xml, robots.txt, JSON-LD structured data",
      "Dynamic OG image API for social sharing",
      "E-commerce sample manifest (Shopify store agent)",
      "Changelog page",
    ],
  },
  {
    date: "2026-03-30",
    title: "Automation stack",
    items: [
      "Source tracking API for monitored manifest URLs",
      "Vercel Cron recheck endpoint for nightly monitoring",
      "GitHub webhook for auto-analysis on push",
      "Webhook ingest endpoint for external integrations",
      "Discord notification embeds with score deltas",
    ],
  },
  {
    date: "2026-03-29",
    title: "MVP launch",
    items: [
      "Validator workbench with manifest paste and sample manifests",
      "Readiness scoring engine with 5 categories and 20+ checks",
      "Severity cards (critical, warning, info) with fix recommendations",
      "Release diff mode — detect action additions, removals, parameter drift",
      "Hosted report generation with shareable URLs",
      "Pricing page with Free, Pro, and Enterprise tiers",
      "About page",
      "Private operator dashboard",
    ],
  },
  {
    date: "2026-03-29",
    title: "Infrastructure",
    items: [
      "Next.js 16 + TypeScript + Tailwind project setup",
      "Deployed to Vercel at acp-watchtower.vercel.app",
      "GitHub repo at github.com/Splaticusamz/acp-watchtower",
      "Professional documentation structure",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-3xl px-6 py-20 sm:px-10">
        <Link href="/" className="text-sm text-cyan-400 hover:text-cyan-300">← Back to home</Link>

        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white">Changelog</h1>
        <p className="mt-3 text-lg text-slate-400">What&apos;s new in ACP Watchtower.</p>

        <div className="mt-12 space-y-12">
          {entries.map((entry, i) => (
            <div key={i} className="relative border-l-2 border-cyan-400/20 pl-6">
              <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-cyan-400/40 bg-slate-950" />
              <p className="text-sm font-medium text-cyan-200">{entry.date}</p>
              <h2 className="mt-1 text-xl font-semibold text-white">{entry.title}</h2>
              <ul className="mt-3 space-y-1.5 text-sm leading-7 text-slate-300">
                {entry.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
