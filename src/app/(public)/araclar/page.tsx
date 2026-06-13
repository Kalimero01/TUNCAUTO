import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { VehicleFilters } from "@/components/vehicles/vehicle-filters";
import { serializeVehicle } from "@/lib/api-helpers";
import type { Prisma } from "@prisma/client";

export const metadata: Metadata = {
  title: "Araçlar",
  description: "TUNCAUTO araç ilanları — kaliteli ikinci el ve sıfır araçlar.",
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
    include: { files: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Araç İlanları</h1>
        <p className="mt-2 text-zinc-500">Kaliteli araçlarımızı keşfedin</p>
      </div>

      <Suspense fallback={<p className="mb-8 text-sm text-zinc-500">Filtreler yükleniyor...</p>}>
        <VehicleFilters total={vehicles.length} />
      </Suspense>

      {vehicles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-700 p-16 text-center text-zinc-500">
          {q || fuel || transmission
            ? "Filtrelere uygun araç bulunamadı."
            : "Şu anda listelenen araç bulunmuyor."}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={serializeVehicle(v) as never} />
          ))}
        </div>
      )}
    </div>
  );
}
