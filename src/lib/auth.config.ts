import type { NextAuthConfig } from "next-auth";

// Wydzielone z auth.ts: middleware dziala w Edge Runtime i nie moze zaladowac
// Prismy ani bcrypt (Node-only), ktore siedza w providerze Credentials w auth.ts.
// Ta czesc configu nie zna providerow, wiec jest bezpieczna do zaladowania na Edge.
export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/logowanie" },
  providers: [],
  callbacks: {
    // Rola ladujac w tokenie oszczedza zapytanie do bazy przy kazdym renderze.
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
} satisfies NextAuthConfig;
