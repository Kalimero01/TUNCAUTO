import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { serializeVehicle } from "@/lib/api-helpers";
import { formatPrice } from "@/lib/utils";
import { VehicleDetailClient } from "@/components/vehicles/vehicle-detail-client";
import { JsonLd } from "@/components/seo/json-ld";
import {
  buildBreadcrumbJsonLd,
  buildVehicleJsonLd,
  buildVehiclePageMetadata,
} from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await prisma.vehicle.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
  });
  if (!vehicle) return { title: "Fahrzeug nicht gefunden" };

  return buildVehiclePageMetadata(
    vehicle.make,
    vehicle.model,
    vehicle.year,
    formatPrice(vehicle.price.toString()),
    vehicle.slug
  );
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
  const vehicleName = `${vehicle.make} ${vehicle.model}`;

  const structuredData = [
    buildVehicleJsonLd({
      make: vehicle.make,
      model: vehicle.model,
      slug: vehicle.slug,
      year: vehicle.year,
      price: vehicle.price.toString(),
      firstRegistration: vehicle.firstRegistration,
      images: data.images.map((img) => img.url),
    }),
    buildBreadcrumbJsonLd([
      { name: "Startseite", path: "/" },
      { name: "Fahrzeuge", path: "/araclar" },
      { name: vehicleName, path: `/araclar/${vehicle.slug}` },
    ]),
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <VehicleDetailClient
        companyPhone={company?.phone}
        vehicle={{
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
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
