import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 px-6 py-10 sm:px-10 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span>🔭</span>
          <span>ACP Watchtower</span>
          <span className="text-slate-600">·</span>
          <span>© {new Date().getFullYear()} Pragmasix</span>
        </div>
        <div className="flex gap-6 text-sm text-slate-500">
          <Link href="/pricing" className="transition hover:text-slate-300">Pricing</Link>
          <Link href="/about" className="transition hover:text-slate-300">About</Link>
          <a href="https://github.com/Splaticusamz/acp-watchtower" target="_blank" rel="noopener noreferrer" className="transition hover:text-slate-300">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
