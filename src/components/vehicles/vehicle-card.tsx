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
  status: string;
  images: Array<{ url: string; originalName: string }>;
};

export function VehicleCard({ vehicle }: { vehicle: VehicleListItem }) {
  const image = vehicle.images[0];

  return (
    <Link
      href={`/araclar/${vehicle.slug}`}
      className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 transition hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-500/5"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-800">
        {image ? (
          <Image
            src={image.url}
            alt={`${vehicle.make} ${vehicle.model}`}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-600">
            <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute left-3 top-3 rounded-full bg-zinc-950/80 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
          {vehicle.year}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-white group-hover:text-brand-400 transition-colors">
          {vehicle.make} {vehicle.model}
        </h3>
        <p className="mt-2 text-xl font-bold text-brand-400">{formatPrice(vehicle.price)}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-500">
          <span>{formatMileage(vehicle.mileage)}</span>
          {vehicle.fuelType && <span>• {vehicle.fuelType}</span>}
          {vehicle.transmission && <span>• {vehicle.transmission}</span>}
        </div>
      </div>
    </Link>
  );
}
