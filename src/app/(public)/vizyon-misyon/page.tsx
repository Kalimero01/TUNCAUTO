import { SectionedCmsContent } from "@/components/cms/sectioned-content";
import { PageHeroBackground } from "@/components/layout/page-hero-background";
import { getVisionMission } from "@/lib/cms";
import { VISION_MISSION_DEFAULTS } from "@/lib/cms-defaults";
import { MERCEDES_G_CLASS_BG } from "@/lib/page-backgrounds";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata.visionMission;

export const dynamic = "force-dynamic";

export default async function VisionMissionPage() {
  const data = await getVisionMission();

  return (
    <div>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Startseite", path: "/" },
          { name: "Vision & Mission", path: "/vizyon-misyon" },
        ])}
      />

      <PageHeroBackground
        imageSrc={MERCEDES_G_CLASS_BG}
        kicker="Vision & Mission"
        title={data?.title ?? "Vision & Mission"}
      />

      <section className="relative mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="rounded-sm border border-zinc-800/80 bg-zinc-950/60 p-8 backdrop-blur-sm sm:p-10">
          <SectionedCmsContent content={data?.content ?? VISION_MISSION_DEFAULTS.content} />
        </div>
      </section>
    </div>
  );
}
