import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const email = credentials?.email as string | undefined;
          const password = credentials?.password as string | undefined;
          if (!email || !password) return null;

          const cleanInput = email.trim().toLowerCase();
          // Bare usernames ("Admin12") are expanded to the workspace domain.
          const searchEmail = cleanInput.includes("@") ? cleanInput : `${cleanInput}@creatorscore.app`;

          const user = await prisma.user.findUnique({ where: { email: searchEmail } });
          if (!user?.password) return null;

          if (!(await bcrypt.compare(password, user.password))) return null;

          return {
            id: user.id,
            name: user.name ?? "Admin",
            email: user.email,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth authorize error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      try {
        if (user) {
          token.role = (user as { role?: string }).role ?? "TEAM_MEMBER";
          token.id = user.id;
        } else if (token.email && !token.role) {
          const dbUser = await prisma.user.findUnique({ where: { email: token.email } });
          if (dbUser) {
            token.role = dbUser.role;
            token.id = dbUser.id;
          } else {
            token.role = "TEAM_MEMBER";
          }
        }
      } catch (err) {
        console.error("JWT Callback Error:", err);
        if (!token.role) token.role = "TEAM_MEMBER";
      }
      return token;
    },
  },
});
