import Image from "next/image";
import { PageHeroBackground } from "@/components/layout/page-hero-background";
import { cmsImageUrl, getAbout } from "@/lib/cms";
import { ABOUT_TUNC_AUTO_IMAGE, MERCEDES_G_CLASS_BG } from "@/lib/page-backgrounds";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata.about;

export const dynamic = "force-dynamic";

const DEFAULT_ABOUT_CONTENT = `TUNC AUTO — Premium-Gebrauchtwagen in Ahlen

Bei Tunc Automobile verbinden wir Leidenschaft für Automobile mit ehrlicher Beratung. In Ahlen und der Region — von Hamm und Beckum bis bundesweit — finden Sie sorgfältig ausgewählte Gebrauchtwagen in gehobener Ausstattung.

Serkan Tunc und unser Team begleiten Sie persönlich: von der ersten Anfrage über die Probefahrt bis zur Übergabe. Kein Callcenter — sondern direkter Ansprechpartner, der Zeit für Ihre Fragen hat.

Transparenz ist für uns selbstverständlich. Wir dokumentieren Zustand und Historie jedes Fahrzeugs offen und fair. Ob Kauf oder Verkauf — bei uns erhalten Sie ehrliche Einschätzungen und realistische Preise.

Besuchen Sie uns in Ahlen oder rufen Sie an. Wir freuen uns auf Sie.`;

export default async function AboutPage() {
  const about = await getAbout();
  const contentImage = cmsImageUrl(about?.imageFile) ?? ABOUT_TUNC_AUTO_IMAGE;

  return (
    <div>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Startseite", path: "/" },
          { name: "Über uns", path: "/hakkimizda" },
        ])}
      />

      <PageHeroBackground
        imageSrc={MERCEDES_G_CLASS_BG}
        kicker="Über uns"
        title={about?.title ?? "Über uns"}
        subtitle="Premium-Gebrauchtwagen in Ahlen — persönlich, transparent, zuverlässig."
      />

      <section className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid min-w-0 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-zinc-800/80 shadow-2xl shadow-black/40">
            <Image
              src={contentImage}
              alt="Tunc Automobile — Premium-Gebrauchtwagen in Ahlen"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          <div className="rounded-sm border border-zinc-800/80 bg-zinc-950/60 p-8 backdrop-blur-sm sm:p-10">
            <div className="whitespace-pre-wrap text-lg leading-relaxed text-zinc-400">
              {about?.content ?? DEFAULT_ABOUT_CONTENT}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
