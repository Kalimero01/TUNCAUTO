import Link from "next/link";
import { MobileNav } from "./mobile-nav";
import { publicNav } from "@/lib/i18n/de";
import { getCompany } from "@/lib/cms";
import { SiteLogoLink, resolveSiteLogo } from "./site-logo";

export async function SiteHeader() {
  const company = await getCompany();
  const { logoUrl, alt } = resolveSiteLogo(company);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-black/90 backdrop-blur-xl">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <SiteLogoLink logoUrl={logoUrl} alt={alt} className="h-12 w-auto max-w-[160px] object-contain sm:h-14 sm:max-w-[200px]" />

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
          {publicNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link text-base tracking-wide text-zinc-400"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
