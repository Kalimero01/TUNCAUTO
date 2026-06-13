import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { serializeVehicle } from "@/lib/api-helpers";
import { formatMileage, formatPrice, getBaseUrl } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await prisma.vehicle.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
  });
  if (!vehicle) return { title: "Araç Bulunamadı" };

  const title = `${vehicle.make} ${vehicle.model} ${vehicle.year}`;
  const description =
    vehicle.description?.slice(0, 160) ??
    `${vehicle.year} ${vehicle.make} ${vehicle.model} — ${formatPrice(vehicle.price.toString())}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function VehicleDetailPage({ params }: Props) {
  const { slug } = await params;
  const vehicle = await prisma.vehicle.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
    include: { files: true },
  });

  if (!vehicle || vehicle.status !== "AVAILABLE") notFound();

  const data = serializeVehicle(vehicle);
  const baseUrl = getBaseUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${vehicle.make} ${vehicle.model}`,
    brand: { "@type": "Brand", name: vehicle.make },
    model: vehicle.model,
    vehicleModelDate: String(vehicle.year),
    mileageFromOdometer: vehicle.mileage
      ? { "@type": "QuantitativeValue", value: vehicle.mileage, unitCode: "KMT" }
      : undefined,
    offers: {
      "@type": "Offer",
      price: vehicle.price.toString(),
      priceCurrency: "TRY",
      availability: "https://schema.org/InStock",
      url: `${baseUrl}/araclar/${vehicle.slug}`,
    },
    image: data.images.map((img) => `${baseUrl}${img.url}`),
    description: vehicle.description,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-zinc-800">
            {data.images[0] ? (
              <Image
                src={data.images[0].url}
                alt={`${vehicle.make} ${vehicle.model}`}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-600">Görsel yok</div>
            )}
          </div>
          {data.images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {data.images.slice(1, 5).map((img) => (
                <div key={img.id} className="relative aspect-square overflow-hidden rounded-lg bg-zinc-800">
                  <Image src={img.url} alt="" fill className="object-cover" unoptimized />
                </div>
              ))}
            </div>
          )}
          {data.videos.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="font-medium text-white">Videolar</h3>
              {data.videos.map((vid) => (
                <video
                  key={vid.id}
                  src={vid.url}
                  controls
                  className="w-full rounded-xl bg-black"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-brand-400">{vehicle.year}</p>
          <h1 className="mt-1 text-3xl font-bold text-white">
            {vehicle.make} {vehicle.model}
          </h1>
          <p className="mt-4 text-3xl font-bold text-brand-400">{formatPrice(data.price)}</p>

          <dl className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-zinc-800 p-6">
            <div>
              <dt className="text-xs text-zinc-500">Kilometre</dt>
              <dd className="mt-1 font-medium">{formatMileage(vehicle.mileage)}</dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">Yakıt</dt>
              <dd className="mt-1 font-medium">{vehicle.fuelType ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">Vites</dt>
              <dd className="mt-1 font-medium">{vehicle.transmission ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">Renk</dt>
              <dd className="mt-1 font-medium">{vehicle.color ?? "—"}</dd>
            </div>
          </dl>

          {vehicle.description && (
            <div className="mt-8">
              <h2 className="font-semibold text-white">Açıklama</h2>
              <p className="mt-3 whitespace-pre-wrap text-zinc-400">{vehicle.description}</p>
            </div>
          )}

          {vehicle.features.length > 0 && (
            <div className="mt-8">
              <h2 className="font-semibold text-white">Özellikler</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {vehicle.features.map((f) => (
                  <li
                    key={f}
                    className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
