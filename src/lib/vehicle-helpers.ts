import { prisma } from "@/lib/prisma";
import { vehicleSchema } from "@/lib/validations";
import { vehicleSlug } from "@/lib/utils";

export function parseEquipmentRaw(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== "string") return [];
  return raw.split("\n").map((s) => s.trim()).filter(Boolean);
}

export function parseFeaturesRaw(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== "string") return [];
  return raw.split("\n").map((s) => s.trim()).filter(Boolean);
}

export function parseVehicleFormBody(formData: FormData) {
  const equipment = parseEquipmentRaw(formData.get("equipment"));
  const features = parseFeaturesRaw(formData.get("features"));

  return {
    make: formData.get("make"),
    model: formData.get("model"),
    year: formData.get("year"),
    price: formData.get("price"),
    mileage: formData.get("mileage") || null,
    fuelType: formData.get("fuelType") || null,
    transmission: formData.get("transmission") || null,
    horsepower: formData.get("horsepower") || null,
    color: formData.get("color") || null,
    description: formData.get("description") || null,
    financingOffer: formData.get("financingOffer") || null,
    financingUrl: formData.get("financingUrl") || null,
    status: formData.get("status") || undefined,
    equipment,
    features,
  };
}

export async function updateVehicleRecord(
  id: string,
  data: ReturnType<typeof vehicleSchema.parse>
) {
  const existing = await prisma.vehicle.findUnique({ where: { id } });
  if (!existing) return null;

  const slug = vehicleSlug(
    data.make ?? existing.make,
    data.model ?? existing.model,
    data.year ?? existing.year,
    id
  );

  const { equipment: equipList, features, ...vehicleData } = data;

  return prisma.vehicle.update({
    where: { id },
    data: {
      ...vehicleData,
      financingUrl: vehicleData.financingUrl || null,
      slug,
      ...(features !== undefined ? { features } : {}),
      ...(equipList
        ? {
            equipment: {
              deleteMany: {},
              create: equipList.map((name, i) => ({ name, sortOrder: i })),
            },
          }
        : {}),
    },
    include: { files: true, equipment: true },
  });
}

export const MAX_VEHICLE_IMAGES = 10;
