import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonData, jsonError, requireAdmin } from "@/lib/api-helpers";
import { chatMessageSchema } from "@/lib/validations";
import sanitizeHtml from "sanitize-html";

type Params = { params: Promise<{ submissionId: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const { submissionId } = await params;

  const submission = await prisma.sellerSubmission.findUnique({
    where: { id: submissionId },
    select: { id: true, sellerName: true, sellerEmail: true, make: true, model: true },
  });
  if (!submission) return jsonError("Angebot nicht gefunden.", 404);

  await prisma.chatMessage.updateMany({
    where: { submissionId, senderType: "SELLER", isRead: false },
    data: { isRead: true },
  });

  const messages = await prisma.chatMessage.findMany({
    where: { submissionId },
    orderBy: { createdAt: "asc" },
    take: 500,
  });

  return jsonData({ submission, messages });
}

export async function POST(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const { submissionId } = await params;
  const { session } = authResult;

  const submission = await prisma.sellerSubmission.findUnique({
    where: { id: submissionId },
  });
  if (!submission) return jsonError("Angebot nicht gefunden.", 404);

  const body = await request.json();
  const parsed = chatMessageSchema.safeParse(body);
  if (!parsed.success) return jsonError("Nachrichtenvalidierung fehlgeschlagen.", 400);

  const content = sanitizeHtml(parsed.data.content, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();

  if (!content) return jsonError("Nachricht darf nicht leer sein.", 400);

  const message = await prisma.chatMessage.create({
    data: {
      submissionId,
      senderType: "ADMIN",
      senderName: session.user.name ?? session.user.username,
      content,
    },
  });

  return jsonData(message, 201);
}
