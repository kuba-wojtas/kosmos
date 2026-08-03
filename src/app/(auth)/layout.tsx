import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

// Logowanie i rejestracja sa dla gosci. Zalogowany, ktory tu trafi (zakladka
// z historii, przycisk wstecz), idzie prosto na liste zamiast na formularz.
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user) redirect("/zgloszenia");

  return (
    <div className="grid min-h-screen place-items-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-8">
        {children}
      </div>
    </div>
  );
}
