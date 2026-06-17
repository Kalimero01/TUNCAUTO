import { HeroSection, FeaturedVehicles, HomeTextBlocks } from "@/components/home/hero";
import { ContactSection } from "@/components/home/contact-section";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata.home;
export const dynamic = "force-dynamic";

export default function HomePage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([{ name: "Startseite", path: "/" }]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
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
            className="link-hover text-sm tracking-widest text-metallic hover:text-white"
          >
            Alle anzeigen →
          </Link>
        </div>
      </section>
      <HomeTextBlocks />
      <ContactSection />
    </>
  );
}
