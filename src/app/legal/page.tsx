import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal — ACP Watchtower",
  description: "Terms of service and privacy policy for ACP Watchtower.",
};

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-3xl px-6 py-20 sm:px-10">
        <Link href="/" className="text-sm text-cyan-400 hover:text-cyan-300">← Back to home</Link>

        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white">Legal</h1>

        <section className="mt-12 space-y-6 text-sm leading-7 text-slate-300">
          <h2 className="text-2xl font-semibold text-white">Terms of Service</h2>
          <p>
            ACP Watchtower (&ldquo;the Service&rdquo;) is provided by Pragmasix. By using the Service, you agree to these terms.
          </p>
          <p>
            <strong className="text-white">Free tier:</strong> Available at no cost for individual use. We reserve the right to rate-limit or restrict abusive usage.
          </p>
          <p>
            <strong className="text-white">Data handling:</strong> Manifests submitted for analysis are processed server-side and are not stored unless you explicitly create a hosted report. Hosted reports are stored on our infrastructure and accessible via their unique URL.
          </p>
          <p>
            <strong className="text-white">No warranty:</strong> The Service is provided &ldquo;as is&rdquo; without warranty. Readiness scores are advisory and do not guarantee production reliability.
          </p>
          <p>
            <strong className="text-white">Acceptable use:</strong> Do not use the Service for illegal purposes, to submit malicious payloads, or to attempt to disrupt the infrastructure.
          </p>
        </section>

        <section className="mt-12 space-y-6 text-sm leading-7 text-slate-300">
          <h2 className="text-2xl font-semibold text-white">Privacy Policy</h2>
          <p>
            <strong className="text-white">What we collect:</strong> When you use the validator, we process your manifest JSON to generate analysis results. We do not collect personal information unless you join the waitlist (email address only).
          </p>
          <p>
            <strong className="text-white">Waitlist:</strong> If you join the Pro waitlist, we store your email address to notify you when the paid tier launches. We do not share your email with third parties.
          </p>
          <p>
            <strong className="text-white">Hosted reports:</strong> If you create a hosted report, the analysis results are stored and accessible via a unique URL. Reports do not contain personally identifiable information unless your manifest includes it.
          </p>
          <p>
            <strong className="text-white">Analytics:</strong> We may use basic analytics (page views, feature usage) to improve the Service. We do not sell data to third parties.
          </p>
          <p>
            <strong className="text-white">Contact:</strong> For privacy inquiries, email pragmasixco@gmail.com.
          </p>
        </section>
      </div>
    </main>
  );
}
