import { TicketForm } from "@/components/TicketForm";

export default function NoweZgloszeniePage() {
  return (
    <div className="max-w-xl">
      <h1 className="font-display text-3xl font-extrabold text-fg">Nowe zgłoszenie</h1>
      <p className="mt-1 text-sm text-muted">
        Opisz problem możliwie konkretnie. Priorytet ustawiasz teraz i później się go nie zmienia.
      </p>

      <div className="mt-6">
        <TicketForm />
      </div>
    </div>
  );
}
