import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center bg-slate-950 px-6 text-center text-slate-100">
      <div className="text-6xl">🔭</div>
      <h1 className="mt-6 text-4xl font-semibold text-white">Page not found</h1>
      <p className="mt-3 text-lg text-slate-400">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950">
          Go to validator
        </Link>
        <Link href="/docs" className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-slate-300">
          Read docs
        </Link>
      </div>
    </main>
  );
}
