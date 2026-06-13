import Link from "next/link";
import { MobileNav } from "./mobile-nav";

const nav = [
  { href: "/araclar", label: "Araçlar" },
  { href: "/sat", label: "Aracını Sat" },
  { href: "/hakkimizda", label: "Hakkımızda" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-bold text-white shadow-lg shadow-brand-500/20">
            T
          </span>
          <span className="text-lg font-bold tracking-tight transition-colors group-hover:text-brand-400">
            TUNCAUTO
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/sat"
            className="hidden rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-brand-500/20 transition hover:bg-brand-400 sm:inline-flex"
          >
            Aracını Sat
          </Link>
          <Link
            href="/admin/login"
            className="hidden rounded-full border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 transition hover:border-zinc-500 hover:text-white sm:inline-flex"
          >
            Admin
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
