import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      role: "admin" | "user";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: "admin" | "user";
    id: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "admin" | "user";
  }
}
