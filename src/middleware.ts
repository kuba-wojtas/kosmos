import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Middleware dziala w Edge Runtime, wiec korzysta z lekkiego authConfig bez
// providera Credentials (ten ciagnie za soba Prisme i bcrypt, ktorych Edge nie
// udzwignie). Pelny auth() z @/lib/auth jest tylko dla kodu na Node.js.
const { auth } = NextAuth(authConfig);

// Middleware pilnuje tylko tego, czy jest sesja. Nie widzi danych, wiec nie jest
// autoryzacja: o dostepie do konkretnego zgloszenia decyduje canViewTicket.
export default auth((req) => {
  if (!req.auth) {
    const cel = new URL("/logowanie", req.nextUrl.origin);
    cel.searchParams.set("returnTo", req.nextUrl.pathname + req.nextUrl.search);
    return Response.redirect(cel);
  }
});

export const config = {
  matcher: ["/zgloszenia/:path*"],
};
