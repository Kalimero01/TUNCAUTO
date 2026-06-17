import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonData, jsonError, requireAdmin, serializeSubmission } from "@/lib/api-helpers";
import { de } from "@/lib/i18n/de";
import { deleteUploadFile } from "@/lib/uploads";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  const submission = await prisma.sellerSubmission.findUnique({
    where: { id },
    include: { files: true },
  });

  if (!submission) return jsonError("Angebot nicht gefunden.", 404);

  if (!submission.readAt) {
    await prisma.sellerSubmission.update({
      where: { id },
      data: { readAt: new Date() },
    });
    submission.readAt = new Date();
  }

  return jsonData(serializeSubmission(submission));
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  const submission = await prisma.sellerSubmission.findUnique({
    where: { id },
    include: { files: true },
  });
  if (!submission) return jsonError(de.submissionNotFound, 404);

  await prisma.sellerSubmission.delete({ where: { id } });
  await Promise.all(submission.files.map((file) => deleteUploadFile(file.filename)));
  return new Response(null, { status: 204 });
}
