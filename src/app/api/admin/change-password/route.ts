import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jsonData, jsonError } from "@/lib/api-helpers";
import { changePasswordSchema } from "@/lib/validations";
import { hashPassword, validatePasswordStrength, verifyPassword } from "@/lib/password";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return jsonError("Yetkisiz erişim.", 401);

  const ip = getClientIp(request);
  const limit = rateLimit(`change-password:${ip}`, 5, 300_000);
  if (!limit.success) return jsonError("Çok fazla deneme. Lütfen bekleyin.", 429);

  const body = await request.json();
  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? "Doğrulama hatası.", 400);
  }

  const strengthError = validatePasswordStrength(parsed.data.newPassword);
  if (strengthError) return jsonError(strengthError, 400);

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return jsonError("Kullanıcı bulunamadı.", 404);

  const valid = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
  if (!valid) return jsonError("Mevcut şifre hatalı.", 400);

  const samePassword = await verifyPassword(parsed.data.newPassword, user.passwordHash);
  if (samePassword) return jsonError("Yeni şifre mevcut şifreden farklı olmalıdır.", 400);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hashPassword(parsed.data.newPassword),
      mustChangePassword: false,
    },
  });

  return jsonData({ success: true, mustChangePassword: false });
}
