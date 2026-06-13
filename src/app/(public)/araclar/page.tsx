import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { VehicleListRow } from "@/components/vehicles/vehicle-list-row";
import { VehicleFilters } from "@/components/vehicles/vehicle-filters";
import { PageHeroBackground } from "@/components/layout/page-hero-background";
import { serializeVehicle } from "@/lib/api-helpers";
import { MERCEDES_G_CLASS_BG } from "@/lib/page-backgrounds";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import type { Prisma } from "@prisma/client";

export const metadata = pageMetadata.vehicles;

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ q?: string; fuel?: string; transmission?: string }>;
};

export default async function VehiclesPage({ searchParams }: Props) {
  const { q, fuel, transmission } = await searchParams;

  const where: Prisma.VehicleWhereInput = { status: "AVAILABLE" };

  if (q?.trim()) {
    where.OR = [
      { make: { contains: q.trim(), mode: "insensitive" } },
      { model: { contains: q.trim(), mode: "insensitive" } },
    ];
  }
  if (fuel) where.fuelType = { equals: fuel, mode: "insensitive" };
  if (transmission) where.transmission = { equals: transmission, mode: "insensitive" };

  const vehicles = await prisma.vehicle.findMany({
    where,
    include: { files: true, equipment: true },
    orderBy: [{ make: "asc" }, { model: "asc" }],
  });

  return (
    <div>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Startseite", path: "/" },
          { name: "Fahrzeuge", path: "/araclar" },
        ])}
      />

      <PageHeroBackground
        imageSrc={MERCEDES_G_CLASS_BG}
        kicker="Fahrzeuge"
        title="Fahrzeuge"
        subtitle="Premium Gebrauchtwagen in Ahlen — für Hamm, Beckum und ganz Deutschland"
        compact
      />

      <section className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
        <Suspense fallback={<p className="mb-8 text-sm text-zinc-500">Wird geladen...</p>}>
          <VehicleFilters total={vehicles.length} />
        </Suspense>

        {vehicles.length === 0 ? (
          <div className="rounded-sm border border-dashed border-zinc-700 p-16 text-center text-zinc-500">
            Keine Fahrzeuge gefunden.
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/80">
            {vehicles.map((v) => (
              <VehicleListRow key={v.id} vehicle={serializeVehicle(v) as never} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
