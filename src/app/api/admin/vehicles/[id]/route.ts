import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonData, jsonError, requireAdmin, serializeVehicle } from "@/lib/api-helpers";
import { vehicleSchema } from "@/lib/validations";
import { parseVehicleFormBody, updateVehicleRecord } from "@/lib/vehicle-helpers";

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

  const merged = {
    make: parsed.data.make ?? existing.make,
    model: parsed.data.model ?? existing.model,
    year: parsed.data.year ?? existing.year,
    price: parsed.data.price ?? Number(existing.price),
    mileage: parsed.data.mileage !== undefined ? parsed.data.mileage : existing.mileage,
    fuelType: parsed.data.fuelType !== undefined ? parsed.data.fuelType : existing.fuelType,
    transmission:
      parsed.data.transmission !== undefined ? parsed.data.transmission : existing.transmission,
    horsepower:
      parsed.data.horsepower !== undefined ? parsed.data.horsepower : existing.horsepower,
    color: parsed.data.color !== undefined ? parsed.data.color : existing.color,
    description:
      parsed.data.description !== undefined ? parsed.data.description : existing.description,
    financingOffer:
      parsed.data.financingOffer !== undefined
        ? parsed.data.financingOffer
        : existing.financingOffer,
    financingUrl:
      parsed.data.financingUrl !== undefined ? parsed.data.financingUrl : existing.financingUrl,
    status: parsed.data.status ?? existing.status,
    features: parsed.data.features ?? existing.features,
    equipment:
      parsed.data.equipment ??
      (
        await prisma.equipment.findMany({
          where: { vehicleId: id },
          orderBy: { sortOrder: "asc" },
        })
      ).map((e) => e.name),
  };

  const fullParsed = vehicleSchema.safeParse(merged);
  if (!fullParsed.success) return jsonError("Doğrulama hatası.", 400);

  const vehicle = await updateVehicleRecord(id, fullParsed.data);
  if (!vehicle) return jsonError("Araç bulunamadı.", 404);

  return jsonData(serializeVehicle(vehicle));
}
