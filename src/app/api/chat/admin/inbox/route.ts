import { prisma } from "@/lib/prisma";
import { jsonData, requireAdmin } from "@/lib/api-helpers";

export async function GET() {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const conversations = await prisma.sellerSubmission.findMany({
    where: {
      chatMessages: { some: {} },
    },
    select: {
      id: true,
      sellerName: true,
      sellerEmail: true,
      make: true,
      model: true,
      status: true,
      updatedAt: true,
      chatMessages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      _count: {
        select: {
          chatMessages: {
            where: { senderType: "SELLER", isRead: false },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return jsonData(
    conversations.map((c) => ({
      id: c.id,
      sellerName: c.sellerName,
      sellerEmail: c.sellerEmail,
      vehicle: `${c.make} ${c.model}`,
      status: c.status,
      lastMessage: c.chatMessages[0] ?? null,
      unreadCount: c._count.chatMessages,
      updatedAt: c.updatedAt,
    }))
  );
}
