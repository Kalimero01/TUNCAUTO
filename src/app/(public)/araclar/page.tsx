import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { VehicleListRow } from "@/components/vehicles/vehicle-list-row";
import { VehicleFilters } from "@/components/vehicles/vehicle-filters";
import { serializeVehicle } from "@/lib/api-helpers";
import type { Prisma } from "@prisma/client";

export const metadata: Metadata = {
  title: "Vehicles",
  description: "TUNC AUTO Fahrzeuge — Premium Automobile alphabetisch sortiert.",
};

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
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-metallic">Vehicles</p>
        <h1 className="mt-3 text-3xl font-light text-white">Fahrzeuge</h1>
        <p className="mt-3 text-zinc-500">Alphabetisch nach Marke sortiert</p>
      </div>

      <Suspense fallback={<p className="mb-8 text-sm text-zinc-500">Laden...</p>}>
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
    </div>
  );
}
