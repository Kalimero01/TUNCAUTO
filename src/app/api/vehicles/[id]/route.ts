import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonData, jsonError, requireAdmin, serializeVehicle } from "@/lib/api-helpers";
import { vehicleSchema } from "@/lib/validations";
import { vehicleSlug } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const vehicle = await prisma.vehicle.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: { files: true },
  });

  if (!vehicle) return jsonError("Araç bulunamadı.", 404);
  return jsonData(serializeVehicle(vehicle));
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  const body = await request.json();
  const parsed = vehicleSchema.partial().safeParse(body);
  if (!parsed.success) return jsonError("Doğrulama hatası.", 400);

  const existing = await prisma.vehicle.findUnique({ where: { id } });
  if (!existing) return jsonError("Araç bulunamadı.", 404);

  const slug =
    parsed.data.make || parsed.data.model || parsed.data.year
      ? vehicleSlug(
          parsed.data.make ?? existing.make,
          parsed.data.model ?? existing.model,
          parsed.data.year ?? existing.year,
          id
        )
      : undefined;

  const vehicle = await prisma.vehicle.update({
    where: { id },
    data: { ...parsed.data, ...(slug ? { slug } : {}) },
    include: { files: true },
  });

  return jsonData(serializeVehicle(vehicle));
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  await prisma.vehicle.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
