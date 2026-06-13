import { HeroSection, FeaturedVehicles, HomeTextBlocks } from "@/components/home/hero";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-light tracking-wide text-white">Unsere Fahrzeuge</h2>
          <p className="mt-3 text-zinc-500">Unsere Premium-Auswahl</p>
        </div>
        <FeaturedVehicles />
        <div className="mt-10 text-center">
          <Link
            href="/araclar"
            className="text-sm tracking-widest text-metallic hover:text-white transition"
          >
            Alle anzeigen →
          </Link>
        </div>
      </section>
      <HomeTextBlocks />
    </>
  );
}
