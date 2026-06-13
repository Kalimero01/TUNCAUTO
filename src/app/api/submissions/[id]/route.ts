import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonData, jsonError, requireAdmin, serializeSubmission } from "@/lib/api-helpers";
import { rejectSubmissionSchema } from "@/lib/validations";
import { vehicleSlug } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  const submission = await prisma.sellerSubmission.findUnique({
    where: { id },
    include: {
      files: true,
      chatMessages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!submission) return jsonError("Angebot nicht gefunden.", 404);
  return jsonData(serializeSubmission(submission));
}

export async function POST(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  const action = request.nextUrl.searchParams.get("action");

  const submission = await prisma.sellerSubmission.findUnique({
    where: { id },
    include: { files: true, vehicle: true },
  });

  if (!submission) return jsonError("Angebot nicht gefunden.", 404);
  if (submission.status !== "PENDING") {
    return jsonError("Dieses Angebot wurde bereits bearbeitet.", 400);
  }

  if (action === "approve") {
    const vehicleId = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
    const slug = vehicleSlug(submission.make, submission.model, submission.year, vehicleId);

    const [vehicle] = await prisma.$transaction([
      prisma.vehicle.create({
        data: {
          make: submission.make,
          model: submission.model,
          year: submission.year,
          price: submission.price,
          mileage: submission.mileage,
          fuelType: submission.fuelType,
          transmission: submission.transmission,
          color: submission.color,
          description: submission.description,
          slug,
          submissionId: submission.id,
        },
      }),
      prisma.sellerSubmission.update({
        where: { id },
        data: { status: "APPROVED" },
      }),
    ]);

    await prisma.fileUpload.updateMany({
      where: { submissionId: id },
      data: { vehicleId: vehicle.id },
    });

    const updated = await prisma.sellerSubmission.findUnique({
      where: { id },
      include: { files: true, vehicle: true },
    });

    return jsonData(serializeSubmission(updated!));
  }

  if (action === "reject") {
    const body = await request.json().catch(() => ({}));
    const parsed = rejectSubmissionSchema.safeParse(body);

    const updated = await prisma.sellerSubmission.update({
      where: { id },
      data: {
        status: "REJECTED",
        adminNotes: parsed.success ? parsed.data.adminNotes : null,
      },
      include: { files: true },
    });

    return jsonData(serializeSubmission(updated));
  }

  return jsonError("Ungültige Aktion.", 400);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  await prisma.sellerSubmission.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
