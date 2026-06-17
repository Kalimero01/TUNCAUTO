import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonData, jsonError, requireAdmin, serializeContactMessage } from "@/lib/api-helpers";
import { de } from "@/lib/i18n/de";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  const message = await prisma.contactMessage.findUnique({ where: { id } });

  if (!message) return jsonError(de.contactMessageNotFound, 404);

  if (!message.readAt) {
    await prisma.contactMessage.update({
      where: { id },
      data: { readAt: new Date() },
    });
    message.readAt = new Date();
  }

  return jsonData(serializeContactMessage(message));
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  const message = await prisma.contactMessage.findUnique({ where: { id } });
  if (!message) return jsonError(de.contactMessageNotFound, 404);

  await prisma.contactMessage.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
