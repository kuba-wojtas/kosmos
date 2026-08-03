import type { Role } from "@/generated/prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    // DefaultUser oznacza id jako opcjonalne (przez adaptery bez wlasnego id),
    // ale authorize() zawsze zwraca id z Prismy, wiec tutaj jest wymagane.
    id: string;
    role: Role;
  }
  interface Session {
    user: { id: string; role: Role } & DefaultSession["user"];
  }
}

// next-auth/jwt.d.ts re-exportuje typ JWT z @auth/core/jwt zamiast go
// deklarowac lokalnie, wiec rozszerzenie samego "next-auth/jwt" nie laczy sie
// z typem uzywanym faktycznie w sygnaturach callbackow. Trzeba rozszerzyc zrodlo.
declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}
