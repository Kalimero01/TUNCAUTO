import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonData, jsonError, requireAdmin } from "@/lib/api-helpers";
import { ensureSocialPlatforms } from "@/lib/social";
import { socialLinkSchema } from "@/lib/validations";

export async function GET() {
  await ensureSocialPlatforms();
  const links = await prisma.socialLink.findMany({ orderBy: { platform: "asc" } });
  return jsonData(links);
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const body = await request.json();
  const parsed = socialLinkSchema.safeParse(body);
  if (!parsed.success) return jsonError("Validierungsfehler.", 400);

  const { platform, url } = parsed.data;
  const isActive = parsed.data.isActive ?? url.trim() !== "";

  const link = await prisma.socialLink.upsert({
    where: { platform },
    create: { platform, url, isActive },
    update: { url, isActive },
  });
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

  const data = { ...parsed.data };
  if (data.url !== undefined && data.isActive === undefined) {
    data.isActive = data.url.trim() !== "";
  }

  const link = await prisma.socialLink.update({ where: { id }, data });
  return jsonData(link);
}
