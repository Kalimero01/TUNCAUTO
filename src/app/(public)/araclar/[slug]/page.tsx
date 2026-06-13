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

  const title = `${vehicle.make} ${vehicle.model}`;
  const description = `${vehicle.make} ${vehicle.model} — ${formatPrice(vehicle.price.toString())}`;

  return { title, description, openGraph: { title, description, type: "website" } };
}

export default async function VehicleDetailPage({ params }: Props) {
  const { slug } = await params;
  const [vehicle, company] = await Promise.all([
    prisma.vehicle.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
      include: { files: true, equipment: true },
    }),
    prisma.company.findUnique({ where: { id: "company" } }),
  ]);

  if (!vehicle || vehicle.status !== "AVAILABLE") notFound();

  const data = serializeVehicle(vehicle);
  const baseUrl = getBaseUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${vehicle.make} ${vehicle.model}`,
    brand: { "@type": "Brand", name: vehicle.make },
    model: vehicle.model,
    vehicleModelDate: vehicle.firstRegistration ?? String(vehicle.year),
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
        companyPhone={company?.phone}
        vehicle={{
          make: vehicle.make,
          model: vehicle.model,
          price: data.price,
          firstRegistration: vehicle.firstRegistration,
          mileage: vehicle.mileage,
          fuelType: vehicle.fuelType,
          transmission: vehicle.transmission,
          horsepower: vehicle.horsepower,
          engineDisplacement: vehicle.engineDisplacement,
          exteriorColor: data.exteriorColor ?? null,
          interiorColor: vehicle.interiorColor,
          upholstery: vehicle.upholstery,
          doors: vehicle.doors,
          seats: vehicle.seats,
          financingUrl: vehicle.financingUrl,
          equipmentFeatures: data.equipmentFeatures,
          images: data.images,
          videos: data.videos,
        }}
      />
    </>
  );
}
