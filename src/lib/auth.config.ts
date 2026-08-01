import type { NextAuthConfig } from "next-auth";

// Edge-compatible base config shared by the full server-side auth instance
// (src/lib/auth.ts) and the lightweight instance used in middleware.ts.
// It must not import Prisma, bcrypt, or any other Node-only dependency —
// middleware runs on the Edge runtime, which can't bundle them.
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "TEAM_MEMBER";
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "ADMIN" | "TEAM_MEMBER") ?? "TEAM_MEMBER";
      }
      return session;
    },
  },
};
