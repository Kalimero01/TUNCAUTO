import { prisma } from "@/lib/prisma";
import { jsonData, requireAdmin } from "@/lib/api-helpers";

export async function GET() {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const [vehicleCount, availableCount, pendingSubmissions, unreadMessages, recentSubmissions] =
    await Promise.all([
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { status: "AVAILABLE" } }),
      prisma.sellerSubmission.count({ where: { status: "PENDING" } }),
      prisma.chatMessage.count({ where: { senderType: "SELLER", isRead: false } }),
      prisma.sellerSubmission.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          sellerName: true,
          make: true,
          model: true,
          year: true,
          createdAt: true,
        },
      }),
    ]);

  return jsonData({
    vehicleCount,
    availableCount,
    pendingSubmissions,
    unreadMessages,
    recentSubmissions,
  });
}
