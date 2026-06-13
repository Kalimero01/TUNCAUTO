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
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-zinc-950 to-zinc-950" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-brand-600/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="max-w-2xl animate-fade-in">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm font-medium text-brand-400">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
            Premium Araç Galerisi
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Hayalinizdeki araca
            <span className="bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">
              {" "}
              güvenle{" "}
            </span>
            ulaşın
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-zinc-400">
            TUNCAUTO ile seçkin araç koleksiyonumuzu keşfedin veya aracınızı profesyonel
            ekibimize satışa sunun.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/araclar"
              className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-400"
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

        <div className="mt-16 grid gap-6 border-t border-zinc-800/50 pt-10 sm:grid-cols-3">
          {[
            { value: "100%", label: "Şeffaf süreç" },
            { value: "7/24", label: "Online başvuru" },
            { value: "Uzman", label: "Ekip desteği" },
          ].map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <p className="text-2xl font-bold text-brand-400">{stat.value}</p>
              <p className="mt-1 text-sm text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
