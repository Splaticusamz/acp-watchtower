"use client";

import { useState } from "react";
import type { StoredReport } from "@/lib/watchtower";

export default function ReportActions({ report }: { report: StoredReport }) {
  const [copied, setCopied] = useState(false);

  function copySummary() {
    navigator.clipboard.writeText(report.analysis.copySummary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.slug}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button onClick={copySummary} className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2.5 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/40">
        {copied ? "✓ Copied!" : "Copy summary"}
      </button>
      <button onClick={downloadJson} className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-2.5 text-sm font-semibold text-emerald-100 transition hover:border-emerald-300/40">
        Download JSON
      </button>
    </div>
  );
}
