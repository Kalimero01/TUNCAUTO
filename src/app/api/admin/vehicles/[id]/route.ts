import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonData, jsonError, requireAdmin, serializeVehicle } from "@/lib/api-helpers";
import { vehicleSchema } from "@/lib/validations";
import { parseVehicleFormBody, updateVehicleRecord } from "@/lib/vehicle-helpers";
import { parseYearFromFirstRegistration } from "@/lib/vehicle-constants";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: { files: true, equipment: true },
  });

  if (!vehicle) return jsonError("Araç bulunamadı.", 404);
  return jsonData(serializeVehicle(vehicle));
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  const contentType = request.headers.get("content-type") ?? "";

  let body: unknown;
  if (contentType.includes("multipart/form-data")) {
    body = parseVehicleFormBody(await request.formData());
  } else {
    body = await request.json();
  }

  const parsed = vehicleSchema.partial().safeParse(body);
  if (!parsed.success) return jsonError("Doğrulama hatası.", 400);

  const existing = await prisma.vehicle.findUnique({ where: { id } });
  if (!existing) return jsonError("Araç bulunamadı.", 404);

  const firstRegistration =
    parsed.data.firstRegistration !== undefined
      ? parsed.data.firstRegistration
      : existing.firstRegistration;
  const year =
    parsed.data.year ??
    parseYearFromFirstRegistration(firstRegistration) ??
    existing.year;

  const merged = {
    make: parsed.data.make ?? existing.make,
    model: parsed.data.model ?? existing.model,
    year,
    price: parsed.data.price ?? Number(existing.price),
    firstRegistration,
    mileage: parsed.data.mileage !== undefined ? parsed.data.mileage : existing.mileage,
    fuelType: parsed.data.fuelType !== undefined ? parsed.data.fuelType : existing.fuelType,
    transmission:
      parsed.data.transmission !== undefined ? parsed.data.transmission : existing.transmission,
    horsepower:
      parsed.data.horsepower !== undefined ? parsed.data.horsepower : existing.horsepower,
    engineDisplacement:
      parsed.data.engineDisplacement !== undefined
        ? parsed.data.engineDisplacement
        : existing.engineDisplacement,
    exteriorColor:
      parsed.data.exteriorColor !== undefined
        ? parsed.data.exteriorColor
        : existing.exteriorColor ?? existing.color,
    interiorColor:
      parsed.data.interiorColor !== undefined ? parsed.data.interiorColor : existing.interiorColor,
    upholstery: parsed.data.upholstery !== undefined ? parsed.data.upholstery : existing.upholstery,
    doors: parsed.data.doors !== undefined ? parsed.data.doors : existing.doors,
    seats: parsed.data.seats !== undefined ? parsed.data.seats : existing.seats,
    financingUrl:
      parsed.data.financingUrl !== undefined ? parsed.data.financingUrl : existing.financingUrl,
    status: parsed.data.status ?? existing.status,
    equipmentFeatures:
      parsed.data.equipmentFeatures ??
      (existing.equipmentFeatures.length > 0
        ? existing.equipmentFeatures
        : (
            await prisma.equipment.findMany({
              where: { vehicleId: id },
              orderBy: { sortOrder: "asc" },
            })
          ).map((e) => e.name)),
  };

  const fullParsed = vehicleSchema.safeParse(merged);
  if (!fullParsed.success) return jsonError("Doğrulama hatası.", 400);

  const vehicle = await updateVehicleRecord(id, fullParsed.data);
  if (!vehicle) return jsonError("Araç bulunamadı.", 404);

  return jsonData(serializeVehicle(vehicle));
}
