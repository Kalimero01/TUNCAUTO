import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonData, jsonError } from "@/lib/api-helpers";
import { liveChatStartSchema } from "@/lib/validations";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = rateLimit(`live-chat-start:${ip}`, 10, 60_000);
  if (!limit.success) return jsonError("Zu viele Anfragen. Bitte warten.", 429);

  const body = await request.json();
  const parsed = liveChatStartSchema.safeParse(body);
  if (!parsed.success) return jsonError("Name erforderlich.", 400);

  const conversation = await prisma.chatConversation.create({
    data: { customerName: parsed.data.customerName },
  });

  return jsonData({ id: conversation.id, customerName: conversation.customerName }, 201);
}
