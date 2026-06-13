import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonData, jsonError, requireAdmin } from "@/lib/api-helpers";
import { homeTextSchema } from "@/lib/validations";
import { saveUpload, deleteUploadFile } from "@/lib/uploads";

export async function GET() {
  const [media, texts] = await Promise.all([
    prisma.homeMedia.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.homeText.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  return jsonData({ media, texts });
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const formData = await request.formData();
  const type = formData.get("type");

  if (type === "text") {
    const parsed = homeTextSchema.safeParse({
      title: formData.get("title"),
      content: formData.get("content"),
      sortOrder: formData.get("sortOrder") ?? 0,
    });
    if (!parsed.success) return jsonError("Validierungsfehler.", 400);
    const text = await prisma.homeText.create({ data: parsed.data });
    return jsonData(text, 201);
  }

  const file = formData.get("file");
  const mediaType = formData.get("mediaType");
  if (!(file instanceof File) || file.size === 0) return jsonError("Datei erforderlich.", 400);

  const kind = mediaType === "VIDEO" ? "VIDEO" : "IMAGE";
  const saved = await saveUpload(file, kind);
  const media = await prisma.homeMedia.create({
    data: {
      filename: saved.filename,
      mimeType: saved.mimeType,
      type: kind,
      title: String(formData.get("title") ?? ""),
      subtitle: String(formData.get("subtitle") ?? ""),
      sortOrder: Number(formData.get("sortOrder") ?? 0),
    },
  });
  return jsonData(media, 201);
}

export async function DELETE(request: NextRequest) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");
  const kind = searchParams.get("kind");
  if (!id || !kind) return jsonError("id und kind erforderlich.", 400);

  if (kind === "media") {
    const media = await prisma.homeMedia.findUnique({ where: { id } });
    if (media) {
      await deleteUploadFile(media.filename);
      await prisma.homeMedia.delete({ where: { id } });
    }
  } else if (kind === "text") {
    await prisma.homeText.delete({ where: { id } });
  }

  return jsonData({ ok: true });
}
