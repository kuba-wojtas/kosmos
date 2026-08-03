import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-screen max-w-md place-items-center p-6 text-center">
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">
          Nie ma takiej strony
        </h1>
        <p className="mt-3 text-muted">
          Sprawdź adres albo wróć do listy zgłoszeń.
        </p>
        <Link
          href="/zgloszenia"
          className="mt-6 inline-block rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
        >
          Wróć do zgłoszeń
        </Link>
      </div>
    </main>
  );
}
