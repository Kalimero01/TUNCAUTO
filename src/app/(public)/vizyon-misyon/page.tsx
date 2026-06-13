import Image from "next/image";
import { getVisionMission, cmsImageUrl } from "@/lib/cms";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata.visionMission;

export const dynamic = "force-dynamic";

export default async function VisionMissionPage() {
  const data = await getVisionMission();
  const imageUrl = cmsImageUrl(data?.imageFile);

  return (
    <div>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Startseite", path: "/" },
          { name: "Vision & Mission", path: "/vizyon-misyon" },
        ])}
      />
      {imageUrl && (
        <div className="relative h-64 w-full overflow-hidden sm:h-96">
          <Image
            src={imageUrl}
            alt={data?.title ?? "Vision & Mission"}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>
      )}

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-metallic">Vision & Mission</p>
        <h1 className="mt-4 text-3xl font-light text-white sm:text-4xl">
          {data?.title ?? "Vision & Mission"}
        </h1>
        <div className="mt-8 whitespace-pre-wrap text-lg leading-relaxed text-zinc-400">
          {data?.content ?? "Unsere Vision und Mission werden in Kürze veröffentlicht."}
        </div>
      </section>
    </div>
  );
}
