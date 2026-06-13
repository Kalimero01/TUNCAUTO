import Link from "next/link";
import { MobileNav } from "./mobile-nav";

const nav = [
  { href: "/", label: "Home" },
  { href: "/hakkimizda", label: "About Us" },
  { href: "/vizyon-misyon", label: "Vision & Mission" },
  { href: "/araclar", label: "Vehicles" },
  { href: "/sat", label: "Sell Your Vehicle" },
  { href: "/iletisim", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-black/90 backdrop-blur-xl">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-sm border border-metallic/40 bg-anthracite text-xs font-bold tracking-widest text-metallic">
            TA
          </span>
          <span className="text-lg font-semibold tracking-[0.2em] text-white transition-colors group-hover:text-metallic">
            TUNC AUTO
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm tracking-wide text-zinc-400 transition-colors hover:text-metallic"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/araclar"
            className="hidden rounded-sm border border-metallic/50 bg-metallic/10 px-4 py-2 text-sm font-medium tracking-wide text-metallic transition hover:bg-metallic/20 sm:inline-flex"
          >
            Fahrzeuge
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
