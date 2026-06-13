import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonData, jsonError, requireAdmin } from "@/lib/api-helpers";
import { chatMessageSchema } from "@/lib/validations";
import sanitizeHtml from "sanitize-html";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  const conversation = await prisma.chatConversation.findUnique({
    where: { id },
    select: { id: true, customerName: true, createdAt: true },
  });
  if (!conversation) return jsonError("Chat nicht gefunden.", 404);

  const messages = await prisma.chatMessage.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: "asc" },
  });

  await prisma.chatMessage.updateMany({
    where: { conversationId: id, senderType: "CUSTOMER", isRead: false },
    data: { isRead: true },
  });

  return jsonData({ conversation, messages });
}

export async function POST(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  const body = await request.json();
  const parsed = chatMessageSchema.safeParse(body);
  if (!parsed.success) return jsonError("Ungültige Nachricht.", 400);

  const conversation = await prisma.chatConversation.findUnique({ where: { id } });
  if (!conversation) return jsonError("Chat nicht gefunden.", 404);

  const content = sanitizeHtml(parsed.data.content, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();

  const message = await prisma.chatMessage.create({
    data: {
      conversationId: id,
      senderType: "ADMIN",
      senderName: "TUNC AUTO",
      content,
    },
  });

  await prisma.chatConversation.update({
    where: { id },
    data: { updatedAt: new Date() },
  });

  return jsonData(message, 201);
}
