import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonData, jsonError, requireAdmin, serializeTestDriveRequest } from "@/lib/api-helpers";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  const request = await prisma.testDriveRequest.findUnique({ where: { id } });

  if (!request) return jsonError("Probefahrt-Anfrage nicht gefunden.", 404);

  if (!request.readAt) {
    await prisma.testDriveRequest.update({
      where: { id },
      data: { readAt: new Date() },
    });
    request.readAt = new Date();
  }

  return jsonData(serializeTestDriveRequest(request));
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  await prisma.testDriveRequest.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
