import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { serializeVehicle } from "@/lib/api-helpers";

export const metadata: Metadata = {
  title: "Araçlar",
  description: "TUNCAUTO araç ilanları — kaliteli ikinci el ve sıfır araçlar.",
};

export default async function VehiclesPage() {
  const vehicles = await prisma.vehicle.findMany({
    where: { status: "AVAILABLE" },
    include: { files: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">Araç İlanları</h1>
        <p className="mt-2 text-zinc-500">{vehicles.length} araç listeleniyor</p>
      </div>

      {vehicles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-700 p-16 text-center text-zinc-500">
          Şu anda listelenen araç bulunmuyor.
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
