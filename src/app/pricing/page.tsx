import Link from "next/link";
import type { Metadata } from "next";
import WaitlistForm from "@/components/WaitlistForm";

export const metadata: Metadata = {
  title: "Pricing — ACP Watchtower",
  description: "Simple pricing for ACP manifest validation. Free tier, Pro for teams, Enterprise for CI/CD.",
};

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For individual developers exploring ACP",
    features: [
      "5 manifest analyses per day",
      "Readiness scoring with fix guidance",
      "Release diff comparisons",
      "Shareable report URLs",
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For teams shipping AI agents to production",
    features: [
      "Unlimited manifest analyses",
      "Webhook alerts on score changes",
      "Scheduled re-checks (daily/weekly)",
      "Team dashboard with history",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations with CI/CD and compliance needs",
    features: [
      "Everything in Pro",
      "GitHub App — auto-analyze on every PR",
      "CI/CD pipeline integration",
      "SSO & role-based access",
      "SLA & dedicated support",
      "Custom scoring rules",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
        <Link href="/" className="text-sm text-cyan-400 hover:text-cyan-300">← Back to home</Link>

        <div className="mt-8 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Start free. Upgrade when your team needs more.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border p-8 ${
                tier.highlight
                  ? "border-cyan-400/50 bg-cyan-400/5 shadow-lg shadow-cyan-400/10"
                  : "border-slate-800 bg-slate-900/50"
              }`}
            >
              {tier.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-cyan-400 px-4 py-1 text-xs font-semibold text-slate-950">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-semibold text-white">{tier.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{tier.price}</span>
                <span className="text-slate-400">{tier.period}</span>
              </div>
              <p className="mt-3 text-sm text-slate-400">{tier.description}</p>

              <ul className="mt-8 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="mt-0.5 text-cyan-400">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {tier.name === "Free" ? (
                <Link href="/" className={`mt-8 block w-full rounded-lg border border-slate-700 px-4 py-3 text-center text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white`}>
                  {tier.cta}
                </Link>
              ) : tier.name === "Enterprise" ? (
                <a href="mailto:pragmasixco@gmail.com?subject=ACP%20Watchtower%20Enterprise" className="mt-8 block w-full rounded-lg border border-slate-700 px-4 py-3 text-center text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white">
                  {tier.cta}
                </a>
              ) : (
                <div className="mt-8">
                  <p className="mb-2 text-xs text-slate-400">Join the Pro waitlist:</p>
                  <WaitlistForm plan="pro" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
