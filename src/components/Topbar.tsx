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
    <header className="flex items-center justify-between border-b border-line bg-surface px-6 py-4">
      <div className="flex items-center gap-6">
        <span className="font-display text-lg font-extrabold text-fg">
          Kosmos<span className="text-ring">.</span>Zgłoszenia
        </span>
        <Link href="/zgloszenia" className="text-sm font-semibold text-muted hover:text-fg">
          {admin ? "Wszystkie zgłoszenia" : "Moje zgłoszenia"}
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-xs font-semibold text-white">
          {initials(displayName)}
        </span>
        <span className="text-sm font-semibold text-fg">{displayName}</span>
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
    </header>
  );
}
