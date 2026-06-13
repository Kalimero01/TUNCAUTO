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
    include: { files: true },
    orderBy: { createdAt: "desc" },
  });

  return jsonData(vehicles.map(serializeVehicle));
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const ip = getClientIp(request);
  const limit = rateLimit(`vehicles-post:${ip}`, 30, 60_000);
  if (!limit.success) return jsonError("Çok fazla istek. Lütfen bekleyin.", 429);

  const body = await request.json();
  const parsed = vehicleSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Doğrulama hatası.", 400);
  }

  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  const slug = vehicleSlug(parsed.data.make, parsed.data.model, parsed.data.year, id);

  const vehicle = await prisma.vehicle.create({
    data: {
      ...parsed.data,
      slug,
      features: parsed.data.features ?? [],
    },
    include: { files: true },
  });

  return jsonData(serializeVehicle(vehicle), 201);
}
