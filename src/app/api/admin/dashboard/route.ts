import { prisma } from "@/lib/prisma";
import { jsonData, requireAdmin } from "@/lib/api-helpers";

export async function GET() {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const [vehicleCount, availableCount, pendingSubmissions, unreadSubmissions, recentSubmissions] =
    await Promise.all([
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { status: "AVAILABLE" } }),
      prisma.sellerSubmission.count({ where: { status: "PENDING" } }),
      prisma.sellerSubmission.count({ where: { readAt: null } }),
      prisma.sellerSubmission.findMany({
        where: { readAt: null },
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
    unreadSubmissions,
    recentSubmissions,
  });
}
