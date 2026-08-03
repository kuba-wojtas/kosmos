import Link from "next/link";
import { requireSession } from "@/lib/session";
import { getStatusCounts, getTickets } from "@/lib/tickets";
import { isAdmin } from "@/lib/permissions";
import { filtersSchema } from "@/lib/validation";
import { TicketList } from "@/components/TicketList";
import { TicketFilters } from "@/components/TicketFilters";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ZgloszeniaPage({ searchParams }: Props) {
  const user = await requireSession();
  const admin = isAdmin(user);
  const filters = filtersSchema.parse(await searchParams);

  const [tickets, counts] = await Promise.all([
    getTickets(user, filters),
    getStatusCounts(user, filters),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-fg">
            {admin ? "Wszystkie zgłoszenia" : "Moje zgłoszenia"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {admin
              ? "Przeglądaj zgłoszenia wszystkich użytkowników i zmieniaj ich status."
              : "Zgłoszenia, które utworzyłeś, wraz z ich aktualnym statusem."}
          </p>
        </div>
        <Link
          href="/zgloszenia/nowe"
          className="rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
        >
          Nowe zgłoszenie
        </Link>
      </div>

      <div className="mt-6">
        <TicketFilters counts={counts} showSearch={admin} />
      </div>

      <div className="mt-4">
        <TicketList tickets={tickets} showAuthor={admin} />
      </div>
    </div>
  );
}
