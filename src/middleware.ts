import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

export const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isApiAdminRoute =
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/api/live-chat/admin") ||
    (pathname.startsWith("/api/vehicles") &&
      (req.method === "POST" || req.method === "PATCH" || req.method === "DELETE")) ||
    (pathname.startsWith("/api/submissions") && req.method !== "POST") ||
    pathname.startsWith("/api/chat/admin");

  if (isApiAdminRoute && !req.auth) {
    return Response.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/live-chat/admin/:path*",
    "/api/vehicles/:path*",
    "/api/submissions/:path*",
    "/api/chat/admin/:path*",
  ],
};
