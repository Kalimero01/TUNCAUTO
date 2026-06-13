import Link from "next/link";
import Image from "next/image";
import { formatMileage, formatPrice } from "@/lib/utils";

export type VehicleListItem = {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  price: string;
  mileage: number | null;
  fuelType: string | null;
  transmission: string | null;
  horsepower: number | null;
  status: string;
  images: Array<{ url: string; originalName: string }>;
};

export function VehicleListRow({ vehicle }: { vehicle: VehicleListItem }) {
  const image = vehicle.images[0];

  return (
    <Link
      href={`/araclar/${vehicle.slug}`}
      className="group flex flex-col gap-6 py-8 transition hover:bg-zinc-900/20 sm:flex-row sm:items-center"
    >
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-sm bg-zinc-900 sm:w-72">
        {image ? (
          <Image
            src={image.url}
            alt={`${vehicle.make} ${vehicle.model}`}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="288px"
            loading="lazy"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-700">—</div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-widest text-metallic">{vehicle.make}</p>
        <h3 className="mt-1 text-xl font-medium text-white group-hover:text-metallic transition-colors">
          {vehicle.model}
        </h3>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500">
          <span>{vehicle.year}</span>
          <span>{formatMileage(vehicle.mileage)}</span>
          {vehicle.fuelType && <span>{vehicle.fuelType}</span>}
          {vehicle.transmission && <span>{vehicle.transmission}</span>}
          {vehicle.horsepower && <span>{vehicle.horsepower} PS</span>}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-2xl font-light text-metallic">{formatPrice(vehicle.price)}</p>
        <p className="mt-2 text-xs tracking-widest text-zinc-600 group-hover:text-zinc-400">
          DETAILS →
        </p>
      </div>
    </Link>
  );
}

// Keep card for backward compat in tests
export { VehicleListRow as VehicleCard };
