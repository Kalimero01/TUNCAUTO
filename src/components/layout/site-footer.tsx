import Link from "next/link";
import { SocialPlatformIcon } from "@/components/icons/social-icons";
import { getCompany, getSocialLinks } from "@/lib/cms";
import {
  SOCIAL_LINK_PENDING_TITLE,
  SOCIAL_PLATFORM_ARIA_LABELS,
  SOCIAL_PLATFORM_LABELS,
} from "@/lib/social";
import { publicNav } from "@/lib/i18n/de";
import { SEO_CONFIG } from "@/lib/seo";

export async function SiteFooter() {
  const [company, social] = await Promise.all([getCompany(), getSocialLinks()]);

  return (
    <footer className="border-t border-zinc-800 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-white">TUNC AUTO</p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              {SEO_CONFIG.localTagline}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Navigation</p>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              {publicNav.map((item) => (
                <Link key={item.href} href={item.href} className="link-hover text-zinc-400 hover:text-metallic">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Social Media</p>
            <div className="mt-4 flex gap-4">
              {social.map((s) => {
                const label = SOCIAL_PLATFORM_LABELS[s.platform];
                const ariaLabel = SOCIAL_PLATFORM_ARIA_LABELS[s.platform];

                if (s.hasUrl) {
                  return (
                    <a
                      key={s.platform}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={ariaLabel}
                      title={label}
                      className="social-icon-hover text-zinc-400 opacity-80 hover:text-metallic"
                    >
                      <SocialPlatformIcon platform={s.platform} className="h-5 w-5" />
                    </a>
                  );
                }

                return (
                  <span
                    key={s.platform}
                    role="img"
                    aria-label={`${label} — ${SOCIAL_LINK_PENDING_TITLE}`}
                    title={SOCIAL_LINK_PENDING_TITLE}
                    className="cursor-default text-zinc-600 opacity-50"
                  >
                    <SocialPlatformIcon platform={s.platform} className="h-5 w-5" />
                  </span>
                );
              })}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Kontakt</p>
            <div className="mt-4 space-y-2 text-sm text-zinc-400">
              <p>{company?.address ?? "—"}</p>
              <p>{company?.phone ?? "—"}</p>
              <a href={`mailto:${company?.email}`} className="link-hover block hover:text-metallic">
                {company?.email ?? "—"}
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-8 sm:flex-row">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} TUNC AUTO. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-6 text-xs text-zinc-600">
            <Link href="/impressum" className="link-hover hover:text-zinc-400">Impressum</Link>
            <Link href="/datenschutz" className="link-hover hover:text-zinc-400">Datenschutz</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
