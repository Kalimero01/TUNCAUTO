import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { loginSchema } from "@/lib/validations";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      email: string;
      name?: string | null;
      mustChangePassword: boolean;
    };
  }

  interface User {
    id: string;
    username: string;
    email: string;
    name?: string | null;
    mustChangePassword: boolean;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    username: string;
    mustChangePassword: boolean;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      credentials: {
        login: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const login = parsed.data.login.trim().toLowerCase();
        const user = await prisma.user.findFirst({
          where: {
            OR: [{ username: login }, { email: login }],
          },
        });

        if (!user) return null;

        const valid = await verifyPassword(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          mustChangePassword: user.mustChangePassword,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.mustChangePassword = user.mustChangePassword;
      }

      if (trigger === "update" && session?.mustChangePassword === false) {
        token.mustChangePassword = false;
      }

      if (trigger === "update" || !user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { mustChangePassword: true },
        });
        if (dbUser) {
          token.mustChangePassword = dbUser.mustChangePassword;
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        username: token.username as string,
        email: token.email as string,
        name: session.user?.name,
        mustChangePassword: Boolean(token.mustChangePassword),
      };
      return session;
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
});
