import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonData, jsonError, requireAdmin } from "@/lib/api-helpers";
import { socialLinkSchema } from "@/lib/validations";

export async function GET() {
  const links = await prisma.socialLink.findMany({ orderBy: { platform: "asc" } });
  return jsonData(links);
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const body = await request.json();
  const parsed = socialLinkSchema.safeParse(body);
  if (!parsed.success) return jsonError("Validierungsfehler.", 400);

  const link = await prisma.socialLink.create({ data: parsed.data });
  return jsonData(link, 201);
}

export async function PUT(request: NextRequest) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const body = await request.json();
  const { id, ...rest } = body;
  if (!id) return jsonError("ID erforderlich.", 400);

  const parsed = socialLinkSchema.partial().safeParse(rest);
  if (!parsed.success) return jsonError("Validierungsfehler.", 400);

  const link = await prisma.socialLink.update({ where: { id }, data: parsed.data });
  return jsonData(link);
}
