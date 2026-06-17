import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonData, jsonError, requireAdmin, serializeTestDriveRequest } from "@/lib/api-helpers";
import { testDriveSchema } from "@/lib/validations";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const admin = request.nextUrl.searchParams.get("admin") === "true";
  if (admin) {
    const authResult = await requireAdmin();
    if (authResult instanceof Response) return authResult;
  } else {
    return jsonError("Nicht autorisiert.", 401);
  }

  const requests = await prisma.testDriveRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return jsonData(requests.map(serializeTestDriveRequest));
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = rateLimit(`probefahrt-post:${ip}`, 5, 60_000);
  if (!limit.success) return jsonError("Zu viele Anfragen. Bitte warten.", 429);

  const formData = await request.formData();

  const raw = {
    customerName: formData.get("customerName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    preferredDateTime: formData.get("preferredDateTime"),
    vehicleModel: formData.get("vehicleModel"),
  };

  const parsed = testDriveSchema.safeParse(raw);
  if (!parsed.success) {
    return jsonError("Formularvalidierung fehlgeschlagen.", 400);
  }

  const created = await prisma.testDriveRequest.create({
    data: {
      customerName: parsed.data.customerName.trim(),
      phone: parsed.data.phone.trim(),
      email: parsed.data.email.trim(),
      preferredDateTime: parsed.data.preferredDateTime.trim(),
      vehicleModel: parsed.data.vehicleModel.trim(),
    },
  });

  return jsonData(serializeTestDriveRequest(created), 201);
}
