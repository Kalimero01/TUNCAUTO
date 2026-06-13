import Image from "next/image";
import { getAbout, cmsImageUrl } from "@/lib/cms";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata.about;

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const about = await getAbout();
  const imageUrl = cmsImageUrl(about?.imageFile);

  return (
    <div>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Startseite", path: "/" },
          { name: "Über uns", path: "/hakkimizda" },
        ])}
      />
      {imageUrl && (
        <div className="relative h-64 w-full overflow-hidden sm:h-96">
          <Image
            src={imageUrl}
            alt={about?.title ?? "Über uns"}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>
      )}

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-metallic">Über uns</p>
        <h1 className="mt-4 text-3xl font-light text-white sm:text-4xl">
          {about?.title ?? "Über uns"}
        </h1>
        <div className="mt-8 whitespace-pre-wrap text-lg leading-relaxed text-zinc-400">
          {about?.content ??
            "Tunc Automobile in Ahlen steht für Premium-Gebrauchtwagen, Transparenz und erstklassigen Service — für Kunden aus Hamm, Beckum und ganz Deutschland."}
        </div>
      </section>
    </div>
  );
}
