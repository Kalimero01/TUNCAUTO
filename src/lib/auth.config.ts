import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isAdminRoute = pathname.startsWith("/admin");
      const publicAdminPaths = ["/admin/login", "/admin/change-password"];
      const isApiAdminRoute =
        pathname.startsWith("/api/admin") ||
        (pathname.startsWith("/api/vehicles") &&
          ["POST", "PATCH", "DELETE"].includes(request.method)) ||
        (pathname.startsWith("/api/submissions") && request.method !== "POST");

      if (isApiAdminRoute) {
        return !!auth?.user;
      }

      if (isAdminRoute) {
        const isLoggedIn = !!auth?.user;
        const mustChangePassword = auth?.user?.mustChangePassword;

        if (!isLoggedIn && !publicAdminPaths.includes(pathname)) {
          return false;
        }

        if (
          isLoggedIn &&
          mustChangePassword &&
          pathname !== "/admin/change-password" &&
          pathname !== "/admin/login"
        ) {
          return Response.redirect(new URL("/admin/change-password", request.nextUrl));
        }

        if (isLoggedIn && !mustChangePassword && pathname === "/admin/change-password") {
          return Response.redirect(new URL("/admin", request.nextUrl));
        }

        if (isLoggedIn && pathname === "/admin/login") {
          return Response.redirect(new URL("/admin", request.nextUrl));
        }
      }

      return true;
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.mustChangePassword = user.mustChangePassword;
      }

      if (trigger === "update" && session?.mustChangePassword === false) {
        token.mustChangePassword = false;
      }

      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.id as string,
          username: token.username as string,
          email: token.email as string,
          name: session.user?.name ?? null,
          mustChangePassword: Boolean(token.mustChangePassword),
        },
      };
    },
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
} satisfies NextAuthConfig;
