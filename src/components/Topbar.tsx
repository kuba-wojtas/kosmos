import Image from "next/image";
import Link from "next/link";
import type { Session } from "next-auth";
import { signOut } from "@/lib/auth";
import { isAdmin } from "@/lib/permissions";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";

type Props = {
  user: Session["user"];
};

// Dwie litery z imienia i nazwiska, a gdy jest tylko jedno slowo (np. sam
// e-mail jako fallback), dwa pierwsze znaki tego slowa.
function initials(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function Topbar({ user }: Props) {
  const admin = isAdmin(user);
  const displayName = user.name ?? user.email ?? "";

  return (
    // Belka jest na pelna szerokosc, ale jej zawartosc siedzi w tym samym
    // kontenerze co reszta strony, wiec logo stoi w jednej linii z lewa
    // krawedzia tabeli, a blok uzytkownika z prawa.
    <header className="border-b border-line bg-surface">
      {/* Trzy kolumny zamiast justify-between: skrajne rosna rowno, wiec przycisk
          w srodkowej stoi na osi strony, a nie posrodku tego, co zostalo. */}
      <div className="mx-auto grid max-w-5xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-4">
        <Link href="/zgloszenia" className="justify-self-start">
          {/* Logo jest biale na przezroczystosci, wiec siedzi na ciemnym tle bez
              zadnej obrobki. Wysokosc sterowana klasa, szerokosc dobiera sie sama. */}
          <Image
            src="/content/KOSMOS_logo_header03.png"
            alt="Kosmos"
            width={900}
            height={300}
            priority
            className="h-8 w-auto"
          />
        </Link>

        <Button variant="ghost" href="/zgloszenia" className="justify-self-center">
          {admin ? "Wszystkie zgłoszenia" : "Moje zgłoszenia"}
        </Button>

        <div className="flex items-center justify-self-end gap-4">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-xs font-semibold text-white">
            {initials(displayName)}
          </span>
          <span className="hidden text-sm font-semibold text-fg sm:inline">{displayName}</span>
          {admin && <Chip active>ADMIN</Chip>}
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button variant="ghost" type="submit">
              Wyloguj
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
