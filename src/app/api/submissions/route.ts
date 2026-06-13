import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  jsonData,
  jsonError,
  requireAdmin,
  serializeSubmission,
  serializeVehicle,
} from "@/lib/api-helpers";
import { rejectSubmissionSchema, submissionSchema } from "@/lib/validations";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { saveUpload } from "@/lib/uploads";
import { vehicleSlug } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const admin = request.nextUrl.searchParams.get("admin") === "true";
  if (admin) {
    const authResult = await requireAdmin();
    if (authResult instanceof Response) return authResult;
  } else {
    return jsonError("Yetkisiz erişim.", 401);
  }

  const submissions = await prisma.sellerSubmission.findMany({
    include: {
      files: true,
      _count: {
        select: {
          chatMessages: {
            where: { senderType: "SELLER", isRead: false },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return jsonData(submissions.map(serializeSubmission));
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = rateLimit(`submissions-post:${ip}`, 5, 60_000);
  if (!limit.success) return jsonError("Çok fazla istek. Lütfen bekleyin.", 429);

  const formData = await request.formData();

  const raw = {
    sellerName: formData.get("sellerName"),
    sellerEmail: formData.get("sellerEmail"),
    sellerPhone: formData.get("sellerPhone") || null,
    make: formData.get("make"),
    model: formData.get("model"),
    year: formData.get("year"),
    price: formData.get("price"),
    mileage: formData.get("mileage") || null,
    fuelType: formData.get("fuelType") || null,
    transmission: formData.get("transmission") || null,
    color: formData.get("color") || null,
    description: formData.get("description") || null,
  };

  const parsed = submissionSchema.safeParse(raw);
  if (!parsed.success) {
    return jsonError("Form doğrulama hatası. Lütfen tüm alanları kontrol edin.", 400);
  }

  const images = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  const videos = formData.getAll("videos").filter((f): f is File => f instanceof File && f.size > 0);

  if (images.length > 10) return jsonError("En fazla 10 görsel yükleyebilirsiniz.", 400);
  if (videos.length > 3) return jsonError("En fazla 3 video yükleyebilirsiniz.", 400);

  const submission = await prisma.sellerSubmission.create({
    data: parsed.data,
  });

  try {
    for (const file of images) {
      const saved = await saveUpload(file, "IMAGE");
      await prisma.fileUpload.create({
        data: { ...saved, submissionId: submission.id },
      });
    }
    for (const file of videos) {
      const saved = await saveUpload(file, "VIDEO");
      await prisma.fileUpload.create({
        data: { ...saved, submissionId: submission.id },
      });
    }
  } catch (error) {
    await prisma.sellerSubmission.delete({ where: { id: submission.id } });
    const message = error instanceof Error ? error.message : "Dosya yükleme hatası.";
    return jsonError(message, 400);
  }

  const full = await prisma.sellerSubmission.findUnique({
    where: { id: submission.id },
    include: { files: true },
  });

  return jsonData(serializeSubmission(full!), 201);
}
