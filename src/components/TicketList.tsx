import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityMark } from "@/components/ui/PriorityMark";
import type { TicketListItem } from "@/lib/tickets";

type Props = {
  tickets: TicketListItem[];
  showAuthor: boolean;
};

const dateFormat = new Intl.DateTimeFormat("pl-PL");

// Ten sam szablon gridu w naglowku i w wierszach, zeby kolumny sie
// pokrywaly. Ponizej md zwija sie do tytulu i statusu, reszta znika.
const rowGrid = "grid grid-cols-[1fr_auto] items-center gap-3 md:grid-cols-[66px_1fr_112px_92px_106px]";

export function TicketList({ tickets, showAuthor }: Props) {
  if (tickets.length === 0) {
    return (
      <div className="rounded-xl border border-line bg-surface px-6 py-16 text-center">
        <p className="text-sm text-muted">Nie ma tu jeszcze żadnych zgłoszeń.</p>
        <Link
          href="/zgloszenia/nowe"
          className="mt-4 inline-block text-sm font-semibold text-brand hover:text-brand-hover"
        >
          Utwórz nowe zgłoszenie
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className={`${rowGrid} border-b border-line px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted`}>
        <span className="hidden md:block">Numer</span>
        <span>Tytuł</span>
        <span className="hidden md:block">Priorytet</span>
        <span>Status</span>
        <span className="hidden md:block">Data</span>
      </div>

      {tickets.map((ticket) => (
        <Link
          key={ticket.id}
          href={`/zgloszenia/${ticket.number}`}
          className={`${rowGrid} border-b border-line px-4 py-3 last:border-b-0 hover:bg-raised`}
        >
          <span className="hidden text-sm text-muted md:block">
            #{String(ticket.number).padStart(4, "0")}
          </span>
          <span>
            <span className="block text-sm font-medium text-fg">{ticket.title}</span>
            {showAuthor && <span className="block text-xs text-muted">{ticket.author.name}</span>}
          </span>
          <span className="hidden md:block">
            <PriorityMark priority={ticket.priority} />
          </span>
          <span>
            <StatusBadge status={ticket.status} />
          </span>
          <span className="hidden text-sm text-muted md:block">
            {dateFormat.format(ticket.createdAt)}
          </span>
        </Link>
      ))}
    </div>
  );
}
