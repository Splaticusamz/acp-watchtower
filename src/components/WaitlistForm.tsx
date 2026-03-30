"use client";

import { useState } from "react";

export default function WaitlistForm({ plan = "pro" }: { plan?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      setStatus("loading");
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage(data.message);
      setStatus("success");
      setEmail("");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-center">
        <p className="text-sm font-semibold text-emerald-200">✓ {message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        required
        className="flex-1 rounded-xl border border-white/10 bg-slate-950/80 px-4 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400/40"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
      >
        {status === "loading" ? "..." : "Join waitlist"}
      </button>
      {status === "error" && <p className="text-xs text-rose-300 mt-1">{message}</p>}
    </form>
  );
}
