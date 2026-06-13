"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { VehicleForm, type VehicleFormValues } from "@/components/admin/vehicle-form";
import { splitFirstRegistration } from "@/lib/vehicle-constants";

type VehicleData = VehicleFormValues & { id: string; slug: string };

export default function AdminVehicleEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<VehicleData | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch(`/api/admin/vehicles/${id}`);
    const json = await res.json();
    if (!res.ok) {
      setVehicle(null);
      setLoading(false);
      return;
    }
    const v = json.data;
    const firstReg = splitFirstRegistration(v.firstRegistration);
    setVehicle({
      id: v.id,
      slug: v.slug,
      make: v.make,
      model: v.model,
      price: v.price,
      firstRegistrationMonth: firstReg.month,
      firstRegistrationYear: firstReg.year,
      mileage: v.mileage != null ? String(v.mileage) : "",
      horsepower: v.horsepower != null ? String(v.horsepower) : "",
      engineDisplacement: v.engineDisplacement != null ? String(v.engineDisplacement) : "",
      fuelType: v.fuelType ?? "",
      transmission: v.transmission ?? "",
      exteriorColor: v.exteriorColor ?? "",
      interiorColor: v.interiorColor ?? "",
      upholstery: v.upholstery ?? "",
      doors: v.doors ?? "",
      seats: v.seats != null ? String(v.seats) : "",
      financingUrl: v.financingUrl ?? "",
      equipmentFeatures: v.equipmentFeatures ?? v.equipment ?? [],
      status: v.status,
      images: v.images ?? [],
    });
    setLoading(false);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <p className="text-zinc-500">Wird geladen...</p>;
  if (!vehicle) return <p className="text-zinc-500">Fahrzeug nicht gefunden.</p>;

  return (
    <div>
      <Link href="/admin/vehicles" className="text-sm text-metallic hover:underline">
        ← Fahrzeuge
      </Link>
      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          Bearbeiten: {vehicle.make} {vehicle.model}
        </h1>
        <Link
          href={`/araclar/${vehicle.slug}`}
          target="_blank"
          className="text-sm text-metallic hover:underline"
        >
          Öffentliche Seite →
        </Link>
      </div>
      <VehicleForm
        mode="edit"
        vehicleId={vehicle.id}
        initial={vehicle}
        onSuccess={() => {
          load();
          router.refresh();
        }}
        onCancel={() => router.push("/admin/vehicles")}
      />
    </div>
  );
}
