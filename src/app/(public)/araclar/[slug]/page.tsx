import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { serializeVehicle } from "@/lib/api-helpers";
import { formatPrice, getBaseUrl } from "@/lib/utils";
import { VehicleDetailClient } from "@/components/vehicles/vehicle-detail-client";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await prisma.vehicle.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
  });
  if (!vehicle) return { title: "Fahrzeug nicht gefunden" };

  const title = `${vehicle.make} ${vehicle.model} ${vehicle.year}`;
  const description =
    vehicle.description?.slice(0, 160) ??
    `${vehicle.year} ${vehicle.make} ${vehicle.model} — ${formatPrice(vehicle.price.toString())}`;

  return { title, description, openGraph: { title, description, type: "website" } };
}

export default async function VehicleDetailPage({ params }: Props) {
  const { slug } = await params;
  const vehicle = await prisma.vehicle.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
    include: { files: true, equipment: true },
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
    offers: {
      "@type": "Offer",
      price: vehicle.price.toString(),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${baseUrl}/araclar/${vehicle.slug}`,
    },
    image: data.images.map((img) => `${baseUrl}${img.url}`),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VehicleDetailClient
        vehicle={{
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          price: data.price,
          mileage: vehicle.mileage,
          fuelType: vehicle.fuelType,
          transmission: vehicle.transmission,
          horsepower: vehicle.horsepower,
          color: vehicle.color,
          description: vehicle.description,
          financingOffer: vehicle.financingOffer,
          financingUrl: vehicle.financingUrl,
          equipment: data.equipment,
          features: vehicle.features,
          images: data.images,
          videos: data.videos,
        }}
      />
    </>
  );
}
