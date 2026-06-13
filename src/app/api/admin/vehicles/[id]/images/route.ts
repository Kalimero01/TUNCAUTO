import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonData, jsonError, requireAdmin } from "@/lib/api-helpers";
import { saveUpload } from "@/lib/uploads";
import { MAX_VEHICLE_IMAGES } from "@/lib/vehicle-helpers";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: { files: { where: { type: "IMAGE" } } },
  });

  if (!vehicle) return jsonError("Fahrzeug nicht gefunden.", 404);

  const formData = await request.formData();
  const images = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);

  if (images.length === 0) return jsonError("Keine Bilder ausgewählt.", 400);

  const currentCount = vehicle.files.length;
  if (currentCount + images.length > MAX_VEHICLE_IMAGES) {
    return jsonError(`Maximal ${MAX_VEHICLE_IMAGES} Bilder pro Fahrzeug.`, 400);
  }

  const maxSort = vehicle.files.reduce((max, f) => Math.max(max, f.sortOrder), -1);
  const created = [];

  for (let i = 0; i < images.length; i++) {
    const saved = await saveUpload(images[i], "IMAGE");
    const record = await prisma.fileUpload.create({
      data: {
        ...saved,
        vehicleId: id,
        sortOrder: maxSort + 1 + i,
      },
    });
    created.push({
      id: record.id,
      url: `/api/uploads/${record.filename}`,
      mimeType: record.mimeType,
      type: record.type,
      originalName: record.originalName,
      sortOrder: record.sortOrder,
    });
  }

  return jsonData(created, 201);
}
