import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonData, jsonError, requireAdmin } from "@/lib/api-helpers";
import { companySchema } from "@/lib/validations";

export async function GET() {
  const company = await prisma.company.findUnique({ where: { id: "company" } });
  return jsonData(company);
}

export async function PUT(request: NextRequest) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const body = await request.json();
  const parsed = companySchema.safeParse(body);
  if (!parsed.success) return jsonError("Validierungsfehler.", 400);

  const company = await prisma.company.upsert({
    where: { id: "company" },
    update: parsed.data,
    create: { id: "company", ...parsed.data },
  });

  return jsonData(company);
}
