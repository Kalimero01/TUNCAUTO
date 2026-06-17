import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  jsonData,
  jsonError,
  requireAdmin,
  serializeSubmission,
} from "@/lib/api-helpers";
import { submissionSchema, parseYesNoWithDetails } from "@/lib/validations";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { saveUpload } from "@/lib/uploads";

export async function GET(request: NextRequest) {
  const admin = request.nextUrl.searchParams.get("admin") === "true";
  if (admin) {
    const authResult = await requireAdmin();
    if (authResult instanceof Response) return authResult;
  } else {
    return jsonError("Nicht autorisiert.", 401);
  }

  const submissions = await prisma.sellerSubmission.findMany({
    include: { files: true },
    orderBy: { createdAt: "desc" },
  });

  return jsonData(submissions.map(serializeSubmission));
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = rateLimit(`submissions-post:${ip}`, 5, 60_000);
  if (!limit.success) return jsonError("Zu viele Anfragen. Bitte warten.", 429);

  const formData = await request.formData();

  const raw = {
    sellerFirstName: formData.get("sellerFirstName"),
    sellerLastName: formData.get("sellerLastName"),
    sellerEmail: formData.get("sellerEmail"),
    sellerPhone: formData.get("sellerPhone"),
    make: formData.get("make"),
    model: formData.get("model"),
    year: formData.get("year"),
    price: formData.get("price") || null,
    desiredPrice: formData.get("desiredPrice") || null,
    mileage: formData.get("mileage") || null,
    fuelType: formData.get("fuelType") || null,
    transmission: formData.get("transmission") || null,
    color: formData.get("color") || null,
    description: formData.get("description") || null,
    hasAccident: parseYesNoWithDetails(
      formData.get("hasAccident"),
      formData.get("accidentDetails")
    ),
    hasRepaint: parseYesNoWithDetails(
      formData.get("hasRepaint"),
      formData.get("repaintDetails")
    ),
    hasPartsReplaced: parseYesNoWithDetails(
      formData.get("hasPartsReplaced"),
      formData.get("partsDetails")
    ),
  };

  const parsed = submissionSchema.safeParse(raw);
  if (!parsed.success) {
    return jsonError("Formularvalidierung fehlgeschlagen.", 400);
  }

  const images = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);

  if (images.length > 8) return jsonError("Maximal 8 Bilder erlaubt.", 400);

  const submission = await prisma.sellerSubmission.create({
    data: {
      sellerName: `${parsed.data.sellerFirstName.trim()} ${parsed.data.sellerLastName.trim()}`,
      sellerEmail: parsed.data.sellerEmail,
      sellerPhone: parsed.data.sellerPhone,
      make: parsed.data.make,
      model: parsed.data.model,
      year: parsed.data.year,
      price: parsed.data.price ?? null,
      desiredPrice: parsed.data.desiredPrice ?? null,
      mileage: parsed.data.mileage,
      fuelType: parsed.data.fuelType,
      transmission: parsed.data.transmission,
      color: parsed.data.color,
      description: parsed.data.description,
      hasAccident: parsed.data.hasAccident.value === "yes",
      accidentDetails:
        parsed.data.hasAccident.value === "yes" ? parsed.data.hasAccident.details : null,
      hasRepaint: parsed.data.hasRepaint.value === "yes",
      repaintDetails:
        parsed.data.hasRepaint.value === "yes" ? parsed.data.hasRepaint.details : null,
      hasPartsReplaced: parsed.data.hasPartsReplaced.value === "yes",
      partsDetails:
        parsed.data.hasPartsReplaced.value === "yes"
          ? parsed.data.hasPartsReplaced.details
          : null,
    },
  });

  try {
    for (let i = 0; i < images.length; i++) {
      const saved = await saveUpload(images[i], "IMAGE");
      await prisma.fileUpload.create({
        data: { ...saved, submissionId: submission.id, sortOrder: i },
      });
    }
  } catch (error) {
    await prisma.sellerSubmission.delete({ where: { id: submission.id } });
    const message = error instanceof Error ? error.message : "Upload-Fehler.";
    return jsonError(message, 400);
  }

  const full = await prisma.sellerSubmission.findUnique({
    where: { id: submission.id },
    include: { files: true },
  });

  return jsonData(serializeSubmission(full!), 201);
}
