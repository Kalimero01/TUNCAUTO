import { prisma } from "@/lib/prisma";
import { vehicleSchema } from "@/lib/validations";
import {
  formatFirstRegistration,
  parseYearFromFirstRegistration,
} from "@/lib/vehicle-constants";
import { vehicleSlug } from "@/lib/utils";

function emptyToNull(value: FormDataEntryValue | null): string | null {
  if (value == null) return null;
  const s = String(value).trim();
  return s || null;
}

export function parseVehicleFormBody(formData: FormData) {
  const equipmentFeatures = formData
    .getAll("equipmentFeatures")
    .map((v) => String(v).trim())
    .filter(Boolean);

  const firstRegMonth = emptyToNull(formData.get("firstRegistrationMonth"));
  const firstRegYear = emptyToNull(formData.get("firstRegistrationYear"));
  const firstRegistration = formatFirstRegistration(firstRegMonth ?? "", firstRegYear ?? "");
  const yearFromReg = parseYearFromFirstRegistration(firstRegistration);
  const year = yearFromReg ?? new Date().getFullYear();

  return {
    make: formData.get("make"),
    model: formData.get("model"),
    year,
    price: formData.get("price"),
    firstRegistration,
    mileage: formData.get("mileage") || null,
    fuelType: formData.get("fuelType") || null,
    transmission: formData.get("transmission") || null,
    horsepower: formData.get("horsepower") || null,
    engineDisplacement: formData.get("engineDisplacement") || null,
    exteriorColor: formData.get("exteriorColor") || null,
    interiorColor: formData.get("interiorColor") || null,
    upholstery: formData.get("upholstery") || null,
    doors: formData.get("doors") || null,
    seats: formData.get("seats") || null,
    financingUrl: formData.get("financingUrl") || null,
    status: formData.get("status") || undefined,
    equipmentFeatures,
  };
}

function normalizeVehicleData(data: ReturnType<typeof vehicleSchema.parse>) {
  return {
    make: data.make,
    model: data.model,
    year: data.year,
    price: data.price,
    firstRegistration: data.firstRegistration || null,
    mileage: data.mileage ?? null,
    fuelType: data.fuelType || null,
    transmission: data.transmission || null,
    horsepower: data.horsepower ?? null,
    engineDisplacement: data.engineDisplacement ?? null,
    exteriorColor: data.exteriorColor || null,
    interiorColor: data.interiorColor || null,
    upholstery: data.upholstery || null,
    doors: data.doors || null,
    seats: data.seats ?? null,
    financingUrl: data.financingUrl || null,
    status: data.status,
    equipmentFeatures: data.equipmentFeatures ?? [],
  };
}

export async function updateVehicleRecord(
  id: string,
  data: ReturnType<typeof vehicleSchema.parse>
) {
  const existing = await prisma.vehicle.findUnique({ where: { id } });
  if (!existing) return null;

  const normalized = normalizeVehicleData(data);
  const slug = vehicleSlug(normalized.make, normalized.model, normalized.year, id);

  return prisma.vehicle.update({
    where: { id },
    data: {
      ...normalized,
      slug,
    },
    include: { files: true, equipment: true },
  });
}

export const MAX_VEHICLE_IMAGES = 10;
