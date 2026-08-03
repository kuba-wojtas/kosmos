import { Button } from "@/components/ui/Button";

export default function TicketNotFound() {
  return (
    <div className="rounded-xl border border-line bg-surface px-6 py-16 text-center">
      <h1 className="font-display text-2xl font-extrabold text-fg">Nie ma takiego zgłoszenia</h1>
      <p className="mt-2 text-sm text-muted">
        Zgłoszenie nie istnieje albo nie masz do niego dostępu.
      </p>
      <Button href="/zgloszenia" className="mt-6 inline-block">
        Wróć do zgłoszeń
      </Button>
    </div>
  );
}
