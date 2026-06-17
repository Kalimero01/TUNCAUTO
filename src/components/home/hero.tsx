import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { VehicleListRow } from "@/components/vehicles/vehicle-list-row";
import { serializeVehicle } from "@/lib/api-helpers";
import { cmsImageUrl } from "@/lib/cms";
import { getFeaturedVehicles } from "@/lib/vehicle-queries";

export async function FeaturedVehicles() {
  let vehicles: Awaited<ReturnType<typeof getFeaturedVehicles>> = [];

  try {
    vehicles = await getFeaturedVehicles();
  } catch {
    return (
      <div className="rounded-sm border border-dashed border-zinc-700 p-12 text-center text-zinc-500">
        Fahrzeuge konnten nicht geladen werden.
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-zinc-700 p-12 text-center text-zinc-500">
        Derzeit keine Fahrzeuge verfügbar.
      </div>
    );
  }

  return (
    <div className="divide-y divide-zinc-800/80">
      {vehicles.map((v) => (
        <VehicleListRow key={v.id} vehicle={serializeVehicle(v) as never} />
      ))}
    </div>
  );
}

export async function HeroSection() {
  const [media, texts] = await Promise.all([
    prisma.homeMedia.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" }, take: 1 }),
    prisma.homeText.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" }, take: 1 }),
  ]);

  const hero = media[0];
  const heroText = texts[0];
  const mediaUrl = hero ? cmsImageUrl(hero.filename) : null;

  return (
    <section className="relative min-h-[85vh] overflow-hidden">
      {hero?.type === "VIDEO" && mediaUrl ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          poster={mediaUrl}
        >
          <source src={mediaUrl} type={hero.mimeType} />
        </video>
      ) : mediaUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center parallax-bg"
          style={{ backgroundImage: `url(${mediaUrl})` }}
        />
      ) : (
        <div className="absolute inset-0 premium-gradient" />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
        <div className="max-w-3xl animate-fade-in">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.35em] text-metallic">
            Premium-Automobile
          </p>
          <h1 className="text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl">
            {hero?.title ?? heroText?.title ?? (
              <>
                <span className="text-gradient-silver">TUNC AUTO</span>
                <br />
                <span className="text-2xl font-normal text-zinc-300 sm:text-3xl">
                  Exklusive Fahrzeuge. Vertrauen. Eleganz.
                </span>
              </>
            )}
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-zinc-400">
            {hero?.subtitle ?? heroText?.content ??
              "Premium Gebrauchtwagen in Ahlen — für Kunden aus Hamm, Beckum und ganz Deutschland."}
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              href="/araclar"
              className="btn-metallic rounded-sm border border-metallic bg-metallic/90 px-8 py-3.5 text-sm font-semibold tracking-wide text-black"
            >
              Fahrzeuge entdecken
            </Link>
            <Link
              href="/sat"
              className="btn-outline rounded-sm border border-zinc-600 px-8 py-3.5 text-sm font-semibold tracking-wide text-zinc-200 hover:text-white"
            >
              Ankauf
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export async function HomeTextBlocks() {
  const texts = await prisma.homeText.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  if (texts.length === 0) return null;

  return (
    <section className="border-t border-zinc-800/80 bg-zinc-950/50">
      <div className="mx-auto max-w-5xl space-y-16 px-4 py-20 text-center sm:px-6">
        {texts.map((block, i) => (
          <div key={block.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
            <h2 className="text-2xl font-light tracking-wide text-white">{block.title}</h2>
            <p className="mx-auto mt-4 max-w-2xl whitespace-pre-wrap text-zinc-400 leading-relaxed">
              {block.content}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
