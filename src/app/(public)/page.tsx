import { HeroSection, FeaturedVehicles } from "@/components/home/hero";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Öne Çıkan Araçlar</h2>
            <p className="mt-2 text-zinc-500">En yeni ilanlarımız</p>
          </div>
          <Link href="/araclar" className="text-sm text-brand-400 hover:text-brand-300">
            Tümünü gör →
          </Link>
        </div>
        <FeaturedVehicles />
      </section>

      <section className="border-t border-zinc-800 bg-zinc-900/30">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:grid-cols-3 sm:px-6">
          {[
            {
              title: "Güvenilir Alım",
              desc: "Her araç detaylı kontrolden geçer, ekspertiz raporu sunulur.",
              icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
            },
            {
              title: "Hızlı Satış",
              desc: "Aracınızı online form ile kolayca satışa sunun, hızlı değerlendirme alın.",
              icon: "M13 10V3L4 14h7v7l9-11h-7z",
            },
            {
              title: "Profesyonel Destek",
              desc: "Uzman ekibimiz alım-satım sürecinizde her adımda yanınızda.",
              icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 transition hover:border-zinc-700"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-white">Hayalinizdeki aracı bulun</h2>
          <p className="mx-auto mt-4 max-w-lg text-zinc-500">
            Geniş araç portföyümüzü inceleyin veya aracınızı güvenle satışa sunun.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/araclar"
              className="rounded-full bg-brand-500 px-8 py-3 text-sm font-semibold text-white hover:bg-brand-400"
            >
              Araçları İncele
            </Link>
            <Link
              href="/sat"
              className="rounded-full border border-zinc-700 px-8 py-3 text-sm font-semibold text-zinc-300 hover:border-zinc-500 hover:text-white"
            >
              Aracını Sat
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
