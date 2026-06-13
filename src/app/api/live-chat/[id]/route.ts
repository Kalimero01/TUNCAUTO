import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonData, jsonError } from "@/lib/api-helpers";
import { chatMessageSchema } from "@/lib/validations";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import sanitizeHtml from "sanitize-html";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const conversation = await prisma.chatConversation.findUnique({
    where: { id },
    select: { id: true, customerName: true },
  });
  if (!conversation) return jsonError("Chat nicht gefunden.", 404);

  const messages = await prisma.chatMessage.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: "asc" },
    take: 200,
  });

  return jsonData({ conversation, messages });
}

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const ip = getClientIp(request);
  const limit = rateLimit(`live-chat-msg:${ip}`, 40, 60_000);
  if (!limit.success) return jsonError("Zu viele Nachrichten.", 429);

  const conversation = await prisma.chatConversation.findUnique({
    where: { id },
    select: { id: true, customerName: true },
  });
  if (!conversation) return jsonError("Chat nicht gefunden.", 404);

  const body = await request.json();
  const parsed = chatMessageSchema.safeParse(body);
  if (!parsed.success) return jsonError("Ungültige Nachricht.", 400);

  const content = sanitizeHtml(parsed.data.content, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
  if (!content) return jsonError("Nachricht darf nicht leer sein.", 400);

  const message = await prisma.chatMessage.create({
    data: {
      conversationId: id,
      senderType: "CUSTOMER",
      senderName: parsed.data.senderName ?? conversation.customerName,
      content,
    },
  });

  await prisma.chatConversation.update({
    where: { id },
    data: { updatedAt: new Date() },
  });

  return jsonData(message, 201);
}
