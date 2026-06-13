import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { serializeVehicle } from "@/lib/api-helpers";

export async function FeaturedVehicles() {
  let vehicles: Awaited<ReturnType<typeof prisma.vehicle.findMany>> = [];

  try {
    vehicles = await prisma.vehicle.findMany({
      where: { status: "AVAILABLE" },
      include: { files: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
  } catch {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-700 p-12 text-center text-zinc-500">
        Araçlar yüklenemedi. Lütfen daha sonra tekrar deneyin.
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-700 p-12 text-center text-zinc-500">
        Henüz listelenen araç bulunmuyor. Yakında yeni araçlar eklenecek.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {vehicles.map((v) => (
        <VehicleCard key={v.id} vehicle={serializeVehicle(v) as never} />
      ))}
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-zinc-800">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-zinc-950" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="max-w-2xl animate-fade-in">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-brand-400">
            Premium Araç Galerisi
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Hayalinizdeki araca
            <span className="text-brand-400"> güvenle </span>
            ulaşın
          </h1>
          <p className="mt-6 text-lg text-zinc-400">
            TUNCAUTO ile seçkin araç koleksiyonumuzu keşfedin veya aracınızı profesyonel
            ekibimize satışa sunun.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/araclar"
              className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-400"
            >
              Araçları İncele
            </Link>
            <Link
              href="/sat"
              className="rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-white"
            >
              Aracını Sat
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
