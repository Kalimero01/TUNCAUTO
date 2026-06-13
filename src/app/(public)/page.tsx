import { HeroSection, FeaturedVehicles } from "@/components/home/hero";
import Link from "next/link";

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
            { title: "Güvenilir Alım", desc: "Her araç detaylı kontrolden geçer." },
            { title: "Hızlı Satış", desc: "Aracınızı kolayca satışa sunun." },
            { title: "Profesyonel Destek", desc: "Uzman ekibimiz yanınızda." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-zinc-800 p-6">
              <h3 className="font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-zinc-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
