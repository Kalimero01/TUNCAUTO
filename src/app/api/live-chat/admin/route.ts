import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonData, jsonError, requireAdmin } from "@/lib/api-helpers";
import { chatMessageSchema } from "@/lib/validations";
import sanitizeHtml from "sanitize-html";

export async function GET() {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const conversations = await prisma.chatConversation.findMany({
    where: { isActive: true },
    include: {
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
      _count: {
        select: {
          messages: { where: { senderType: "CUSTOMER", isRead: false } },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  return jsonData(conversations);
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const body = await request.json();
  const { conversationId, content } = body;
  if (!conversationId || !content) return jsonError("conversationId und content erforderlich.", 400);

  const parsed = chatMessageSchema.safeParse({ content });
  if (!parsed.success) return jsonError("Ungültige Nachricht.", 400);

  const conversation = await prisma.chatConversation.findUnique({
    where: { id: conversationId },
  });
  if (!conversation) return jsonError("Chat nicht gefunden.", 404);

  const sanitized = sanitizeHtml(parsed.data.content, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();

  const message = await prisma.chatMessage.create({
    data: {
      conversationId,
      senderType: "ADMIN",
      senderName: "TUNC AUTO",
      content: sanitized,
    },
  });

  await prisma.chatConversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  return jsonData(message, 201);
}
