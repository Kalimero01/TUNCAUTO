import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonData, jsonError, requireAdmin } from "@/lib/api-helpers";
import { aboutSchema } from "@/lib/validations";
import { saveUpload, deleteUploadFile } from "@/lib/uploads";

export async function GET() {
  const data = await prisma.visionMission.findUnique({ where: { id: "vision_mission" } });
  return jsonData(data);
}

export async function PUT(request: NextRequest) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const formData = await request.formData();
  const parsed = aboutSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });
  if (!parsed.success) return jsonError("Validierungsfehler.", 400);

  const existing = await prisma.visionMission.findUnique({ where: { id: "vision_mission" } });
  let imageFile = existing?.imageFile;
  let imageMime = existing?.imageMime;

  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    const saved = await saveUpload(image, "IMAGE");
    if (existing?.imageFile) await deleteUploadFile(existing.imageFile);
    imageFile = saved.filename;
    imageMime = saved.mimeType;
  }

  const data = await prisma.visionMission.upsert({
    where: { id: "vision_mission" },
    update: { ...parsed.data, imageFile, imageMime },
    create: { id: "vision_mission", ...parsed.data, imageFile, imageMime },
  });

  return jsonData(data);
}
