import { Button } from "@/components/ui/Button";

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
        <Button href="/zgloszenia" className="mt-6 inline-block">
          Wróć do zgłoszeń
        </Button>
      </div>
    </main>
  );
}
