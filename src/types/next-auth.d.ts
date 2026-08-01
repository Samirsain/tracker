import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "TEAM_MEMBER";
    } & DefaultSession["user"];
  }

  interface User {
    role?: "ADMIN" | "TEAM_MEMBER";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "ADMIN" | "TEAM_MEMBER";
  }
}
