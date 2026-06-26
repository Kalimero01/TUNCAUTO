import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonData, jsonError, requireAdmin } from "@/lib/api-helpers";
import { aboutSchema } from "@/lib/validations";
import { saveUpload, deleteUploadFile } from "@/lib/uploads";

const DEFAULT_ABOUT_TITLE = "Über uns";

export async function GET() {
  const about = await prisma.about.findUnique({ where: { id: "about" } });
  return jsonData(about);
}

export async function PUT(request: NextRequest) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const formData = await request.formData();
  const raw = {
    title: formData.get("title"),
    content: formData.get("content"),
  };
  const parsed = aboutSchema.safeParse(raw);
  if (!parsed.success) return jsonError("Validierungsfehler.", 400);

  const existing = await prisma.about.findUnique({ where: { id: "about" } });
  let imageFile = existing?.imageFile;
  let imageMime = existing?.imageMime;

  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    const saved = await saveUpload(image, "IMAGE");
    if (existing?.imageFile) await deleteUploadFile(existing.imageFile);
    imageFile = saved.filename;
    imageMime = saved.mimeType;
  }

  const about = await prisma.about.upsert({
    where: { id: "about" },
    update: { ...parsed.data, imageFile, imageMime },
    create: { id: "about", ...parsed.data, imageFile, imageMime },
  });

  return jsonData(about);
}

export async function PATCH(request: NextRequest) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return jsonError("Ungültige Anfrage.", 400);
  }

  const action = (body as { action?: string }).action;

  if (action === "clearContent") {
    const about = await prisma.about.upsert({
      where: { id: "about" },
      update: { content: "" },
      create: { id: "about", title: DEFAULT_ABOUT_TITLE, content: "" },
    });
    return jsonData(about);
  }

  if (action === "clearTitle") {
    const about = await prisma.about.upsert({
      where: { id: "about" },
      update: { title: DEFAULT_ABOUT_TITLE },
      create: { id: "about", title: DEFAULT_ABOUT_TITLE, content: "" },
    });
    return jsonData(about);
  }

  return jsonError("Unbekannte Aktion.", 400);
}
