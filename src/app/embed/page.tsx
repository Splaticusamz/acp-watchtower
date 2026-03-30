import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Embed ACP Watchtower",
  description: "Embed the ACP Watchtower validator on your site with a simple iframe.",
  robots: "noindex",
};

export default function EmbedPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-3xl px-6 py-20 sm:px-10">
        <h1 className="text-4xl font-semibold tracking-tight text-white">Embed the validator</h1>
        <p className="mt-4 text-lg text-slate-300">
          Add ACP Watchtower to your documentation, blog, or internal tools with a simple iframe.
        </p>

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-white">Iframe embed</h2>
          <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/80 p-6 text-sm text-slate-200">
{`<iframe
  src="https://acp-watchtower.vercel.app"
  width="100%"
  height="800"
  frameborder="0"
  style="border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);"
></iframe>`}
          </pre>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-white">Badge embed</h2>
          <p className="mt-3 text-sm text-slate-300">After creating a hosted report, embed the score badge:</p>
          <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/80 p-6 text-sm text-slate-200">
{`<!-- Markdown -->
![ACP Readiness](https://acp-watchtower.vercel.app/api/badge/REPORT_ID)

<!-- HTML -->
<img src="https://acp-watchtower.vercel.app/api/badge/REPORT_ID" alt="ACP Readiness Score" />`}
          </pre>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-white">API widget</h2>
          <p className="mt-3 text-sm text-slate-300">Build your own widget using the API:</p>
          <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/80 p-6 text-sm text-slate-200">
{`fetch('https://acp-watchtower.vercel.app/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ manifest: yourManifestString })
})
.then(r => r.json())
.then(result => {
  console.log(result.score, result.verdict);
  console.log(result.issues);
});`}
          </pre>
        </section>
      </div>
    </main>
  );
}
