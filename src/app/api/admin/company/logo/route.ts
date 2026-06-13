import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonData, jsonError, requireAdmin } from "@/lib/api-helpers";
import { saveUpload, deleteUploadFile } from "@/lib/uploads";
import { isAllowedImageFile } from "@/lib/upload-constants";
import { DEFAULT_LOGO_URL } from "@/lib/logo";

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const formData = await request.formData();
  const file = formData.get("logo");

  if (!(file instanceof File) || file.size === 0) {
    return jsonError("Logo-Datei erforderlich.", 400);
  }

  if (!isAllowedImageFile(file)) {
    return jsonError("Ungültiges Logo-Format. PNG, JPG, WEBP oder AVIF erlaubt.", 400);
  }

  const existing = await prisma.company.findUnique({ where: { id: "company" } });

  try {
    const saved = await saveUpload(file, "IMAGE");

    if (existing?.logoFile) {
      await deleteUploadFile(existing.logoFile);
    }

    const company = await prisma.company.upsert({
      where: { id: "company" },
      update: { logoFile: saved.filename },
      create: {
        id: "company",
        name: "Tunc Automobile",
        owner: "Serkan Tunc",
        street: "Südstr. 48a",
        postalCode: "59227",
        city: "Ahlen",
        address: "Südstr. 48a\n59227 Ahlen\nDeutschland",
        phone: "01787306033",
        email: "tuncautomobile2022@gmail.com",
        taxId: "DE349004935",
        impressum: "—",
        privacyPolicy: "—",
        logoFile: saved.filename,
      },
    });

    return jsonData({
      logoFile: company.logoFile,
      logoUrl: `/api/uploads/${company.logoFile}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Logo-Upload fehlgeschlagen.";
    return jsonError(message, 400);
  }
}

export async function DELETE() {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const existing = await prisma.company.findUnique({ where: { id: "company" } });
  if (!existing?.logoFile) {
    return jsonData({ logoFile: null, logoUrl: DEFAULT_LOGO_URL });
  }

  await deleteUploadFile(existing.logoFile);
  const company = await prisma.company.update({
    where: { id: "company" },
    data: { logoFile: null },
  });

  return jsonData({ logoFile: company.logoFile, logoUrl: DEFAULT_LOGO_URL });
}
