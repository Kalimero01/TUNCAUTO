import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonData, jsonError, requireAdmin } from "@/lib/api-helpers";
import { deleteUploadFile } from "@/lib/uploads";

type Params = { params: Promise<{ id: string; imageId: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const { id, imageId } = await params;
  const body = await request.json();
  const sortOrder = typeof body.sortOrder === "number" ? body.sortOrder : null;

  if (sortOrder === null || sortOrder < 0) {
    return jsonError("Ungültige Sortierreihenfolge.", 400);
  }

  const image = await prisma.fileUpload.findFirst({
    where: { id: imageId, vehicleId: id, type: "IMAGE" },
  });

  if (!image) return jsonError("Bild nicht gefunden.", 404);

  const updated = await prisma.fileUpload.update({
    where: { id: imageId },
    data: { sortOrder },
  });

  return jsonData({
    id: updated.id,
    url: `/api/uploads/${updated.filename}`,
    sortOrder: updated.sortOrder,
  });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const { id, imageId } = await params;
  const image = await prisma.fileUpload.findFirst({
    where: { id: imageId, vehicleId: id, type: "IMAGE" },
  });

  if (!image) return jsonError("Bild nicht gefunden.", 404);

  await deleteUploadFile(image.filename);
  await prisma.fileUpload.delete({ where: { id: imageId } });

  return new Response(null, { status: 204 });
}
