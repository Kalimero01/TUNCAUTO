import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonData, jsonError, requireAdmin, serializeContactMessage } from "@/lib/api-helpers";
import { contactMessageSchema } from "@/lib/validations";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const admin = request.nextUrl.searchParams.get("admin") === "true";
  if (admin) {
    const authResult = await requireAdmin();
    if (authResult instanceof Response) return authResult;
  } else {
    return jsonError("Nicht autorisiert.", 401);
  }

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return jsonData(messages.map(serializeContactMessage));
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = rateLimit(`contact-messages-post:${ip}`, 5, 60_000);
  if (!limit.success) return jsonError("Zu viele Anfragen. Bitte warten.", 429);

  const formData = await request.formData();

  const raw = {
    customerName: formData.get("customerName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  const parsed = contactMessageSchema.safeParse(raw);
  if (!parsed.success) {
    return jsonError("Formularvalidierung fehlgeschlagen.", 400);
  }

  const created = await prisma.contactMessage.create({
    data: {
      customerName: parsed.data.customerName.trim(),
      phone: parsed.data.phone.trim(),
      email: parsed.data.email.trim(),
      message: parsed.data.message.trim(),
    },
  });

  return jsonData(serializeContactMessage(created), 201);
}
