import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonData, jsonError, requireAdmin, serializeVehicle } from "@/lib/api-helpers";
import { vehicleSchema } from "@/lib/validations";
import { vehicleSlug } from "@/lib/utils";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");
  const admin = searchParams.get("admin") === "true";

  if (admin) {
    const authResult = await requireAdmin();
    if (authResult instanceof Response) return authResult;
  }

  const vehicles = await prisma.vehicle.findMany({
    where: {
      ...(status ? { status: status as "AVAILABLE" | "SOLD" | "RESERVED" } : {}),
      ...(!admin ? { status: "AVAILABLE" } : {}),
    },
    include: { files: true, equipment: true },
    orderBy: admin ? { createdAt: "desc" } : [{ make: "asc" }, { model: "asc" }],
  });

  return jsonData(vehicles.map(serializeVehicle));
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const ip = getClientIp(request);
  const limit = rateLimit(`vehicles-post:${ip}`, 30, 60_000);
  if (!limit.success) return jsonError("Zu viele Anfragen. Bitte warten.", 429);

  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const { parseVehicleFormBody } = await import("@/lib/vehicle-helpers");
    const body = parseVehicleFormBody(formData);

    const parsed = vehicleSchema.safeParse(body);
    if (!parsed.success) return jsonError("Validierungsfehler.", 400);

    const id = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
    const slug = vehicleSlug(parsed.data.make, parsed.data.model, parsed.data.year, id);

    const vehicle = await prisma.vehicle.create({
      data: {
        make: parsed.data.make,
        model: parsed.data.model,
        year: parsed.data.year,
        price: parsed.data.price,
        firstRegistration: parsed.data.firstRegistration || null,
        mileage: parsed.data.mileage ?? null,
        fuelType: parsed.data.fuelType || null,
        transmission: parsed.data.transmission || null,
        horsepower: parsed.data.horsepower ?? null,
        engineDisplacement: parsed.data.engineDisplacement ?? null,
        exteriorColor: parsed.data.exteriorColor || null,
        interiorColor: parsed.data.interiorColor || null,
        upholstery: parsed.data.upholstery || null,
        doors: parsed.data.doors || null,
        seats: parsed.data.seats ?? null,
        financingUrl: parsed.data.financingUrl || null,
        equipmentFeatures: parsed.data.equipmentFeatures ?? [],
        status: parsed.data.status ?? "AVAILABLE",
        slug,
      },
      include: { files: true, equipment: true },
    });

    const images = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
    if (images.length > 10) return jsonError("Maximal 10 Bilder.", 400);

    const { saveUpload } = await import("@/lib/uploads");
    for (let i = 0; i < images.length; i++) {
      const saved = await saveUpload(images[i], "IMAGE");
      await prisma.fileUpload.create({
        data: { ...saved, vehicleId: vehicle.id, sortOrder: i },
      });
    }

    const full = await prisma.vehicle.findUnique({
      where: { id: vehicle.id },
      include: { files: true, equipment: true },
    });

    return jsonData(serializeVehicle(full!), 201);
  }

  const body = await request.json();
  const parsed = vehicleSchema.safeParse(body);
  if (!parsed.success) return jsonError("Validierungsfehler.", 400);

  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  const slug = vehicleSlug(parsed.data.make, parsed.data.model, parsed.data.year, id);

  const vehicle = await prisma.vehicle.create({
    data: {
      make: parsed.data.make,
      model: parsed.data.model,
      year: parsed.data.year,
      price: parsed.data.price,
      firstRegistration: parsed.data.firstRegistration || null,
      mileage: parsed.data.mileage ?? null,
      fuelType: parsed.data.fuelType || null,
      transmission: parsed.data.transmission || null,
      horsepower: parsed.data.horsepower ?? null,
      engineDisplacement: parsed.data.engineDisplacement ?? null,
      exteriorColor: parsed.data.exteriorColor || null,
      interiorColor: parsed.data.interiorColor || null,
      upholstery: parsed.data.upholstery || null,
      doors: parsed.data.doors || null,
      seats: parsed.data.seats ?? null,
      financingUrl: parsed.data.financingUrl || null,
      equipmentFeatures: parsed.data.equipmentFeatures ?? [],
      status: parsed.data.status ?? "AVAILABLE",
      slug,
    },
    include: { files: true, equipment: true },
  });

  return jsonData(serializeVehicle(vehicle), 201);
}
