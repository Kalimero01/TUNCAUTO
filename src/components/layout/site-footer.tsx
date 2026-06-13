import Link from "next/link";
import { getCompany, getSocialLinks } from "@/lib/cms";

export async function SiteFooter() {
  const [company, social] = await Promise.all([getCompany(), getSocialLinks()]);

  return (
    <footer className="border-t border-zinc-800 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-white">TUNC AUTO</p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              Premium automobile dealership — elegance, trust, excellence.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Navigation</p>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <Link href="/" className="text-zinc-400 hover:text-metallic">Home</Link>
              <Link href="/hakkimizda" className="text-zinc-400 hover:text-metallic">About Us</Link>
              <Link href="/vizyon-misyon" className="text-zinc-400 hover:text-metallic">Vision & Mission</Link>
              <Link href="/araclar" className="text-zinc-400 hover:text-metallic">Vehicles</Link>
              <Link href="/sat" className="text-zinc-400 hover:text-metallic">Sell Your Vehicle</Link>
              <Link href="/iletisim" className="text-zinc-400 hover:text-metallic">Contact</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Social</p>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              {social.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-metallic"
                >
                  {s.platform === "INSTAGRAM" ? "Instagram" : "TikTok"}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Kontakt</p>
            <div className="mt-4 space-y-2 text-sm text-zinc-400">
              <p>{company?.address ?? "—"}</p>
              <p>{company?.phone ?? "—"}</p>
              <a href={`mailto:${company?.email}`} className="block hover:text-metallic">
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
            <Link href="/impressum" className="hover:text-zinc-400">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-zinc-400">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
