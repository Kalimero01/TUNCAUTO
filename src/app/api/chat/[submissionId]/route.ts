import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonData, jsonError, requireAdmin } from "@/lib/api-helpers";
import { chatMessageSchema } from "@/lib/validations";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import sanitizeHtml from "sanitize-html";

type Params = { params: Promise<{ submissionId: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { submissionId } = await params;

  const submission = await prisma.sellerSubmission.findUnique({
    where: { id: submissionId },
    select: { id: true, sellerName: true },
  });
  if (!submission) return jsonError("Başvuru bulunamadı.", 404);

  const messages = await prisma.chatMessage.findMany({
    where: { submissionId },
    orderBy: { createdAt: "asc" },
    take: 200,
  });

  return jsonData({ submission, messages });
}

export async function POST(request: NextRequest, { params }: Params) {
  const { submissionId } = await params;
  const ip = getClientIp(request);
  const limit = rateLimit(`chat-post:${ip}`, 30, 60_000);
  if (!limit.success) return jsonError("Çok fazla mesaj. Lütfen bekleyin.", 429);

  const submission = await prisma.sellerSubmission.findUnique({
    where: { id: submissionId },
    select: { id: true, sellerName: true, status: true },
  });
  if (!submission) return jsonError("Başvuru bulunamadı.", 404);

  const body = await request.json();
  const parsed = chatMessageSchema.safeParse(body);
  if (!parsed.success) return jsonError("Mesaj doğrulama hatası.", 400);

  const content = sanitizeHtml(parsed.data.content, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();

  if (!content) return jsonError("Mesaj boş olamaz.", 400);

  const message = await prisma.chatMessage.create({
    data: {
      submissionId,
      senderType: "SELLER",
      senderName: parsed.data.senderName ?? submission.sellerName,
      content,
    },
  });

  return jsonData(message, 201);
}
