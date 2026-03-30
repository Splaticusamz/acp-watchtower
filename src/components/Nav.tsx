import Link from "next/link";

const links = [
  { href: "/", label: "Validate" },
  { href: "/history", label: "Reports" },
  { href: "/docs", label: "Docs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 sm:px-10 lg:px-12">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-white">
          <span>🔭</span>
          <span>ACP Watchtower</span>
        </Link>
        <div className="flex items-center gap-6 text-sm text-slate-300">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-cyan-300">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
