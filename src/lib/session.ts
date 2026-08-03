import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

// Middleware juz odsial niezalogowanych, ale strona i tak pyta o sesje, bo
// potrzebuje id i roli. Redirect zostaje jako zabezpieczenie na wypadek
// wejscia sciezka nieobjeta matcherem.
export async function requireSession() {
  const session = await auth();
  if (!session?.user) redirect("/logowanie");
  return session.user;
}
