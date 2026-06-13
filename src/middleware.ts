import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const publicAdminPaths = ["/admin/login", "/admin/change-password"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isApiAdminRoute =
    pathname.startsWith("/api/admin") ||
    (pathname.startsWith("/api/vehicles") &&
      (req.method === "POST" || req.method === "PATCH" || req.method === "DELETE")) ||
    (pathname.startsWith("/api/submissions") && req.method !== "POST") ||
    pathname.startsWith("/api/chat/admin");

  if (isAdminRoute) {
    const isLoggedIn = Boolean(req.auth);
    const mustChangePassword = req.auth?.user?.mustChangePassword;

    if (!isLoggedIn && !publicAdminPaths.includes(pathname)) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    if (
      isLoggedIn &&
      mustChangePassword &&
      pathname !== "/admin/change-password" &&
      pathname !== "/admin/login"
    ) {
      return NextResponse.redirect(new URL("/admin/change-password", req.url));
    }

    if (isLoggedIn && !mustChangePassword && pathname === "/admin/change-password") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (isLoggedIn && pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  if (isApiAdminRoute && !req.auth) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/vehicles/:path*", "/api/submissions/:path*", "/api/chat/admin/:path*"],
};
