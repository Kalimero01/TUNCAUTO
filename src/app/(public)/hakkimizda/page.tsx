import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "TUNCAUTO hakkında bilgi edinin — güvenilir premium araç galerisi.",
};

const values = [
  {
    title: "Güvenilirlik",
    desc: "Her araç titizlikle incelenir, şeffaf fiyatlandırma sunulur.",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    title: "Profesyonellik",
    desc: "Deneyimli ekibimiz alım-satım sürecinizde yanınızda.",
    icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  {
    title: "Hız",
    desc: "Online başvuru ve hızlı değerlendirme ile zaman kazanın.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent" />
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="text-sm font-medium uppercase tracking-widest text-brand-400">Hakkımızda</p>
          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            Güvenilir araç alım-satım deneyimi
          </h1>
          <p className="mt-6 text-lg text-zinc-400">
            TUNCAUTO, premium araç galerisi olarak müşterilerimize kaliteli araçlar, şeffaf
            fiyatlandırma ve profesyonel hizmet sunmayı hedefliyor.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 transition hover:border-zinc-700"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={v.icon} />
                </svg>
              </div>
              <h2 className="mt-4 font-semibold text-white">{v.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-zinc-800 bg-zinc-900/20">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-white">Aracınızı satmak mı istiyorsunuz?</h2>
          <p className="mt-4 text-zinc-400">
            Online formumuzu doldurun, ekibimiz en kısa sürede sizinle iletişime geçsin.
          </p>
          <Link
            href="/sat"
            className="mt-8 inline-flex rounded-full bg-brand-500 px-8 py-3 text-sm font-semibold text-white hover:bg-brand-400"
          >
            Başvuru Yap
          </Link>
        </div>
      </section>
    </div>
  );
}
