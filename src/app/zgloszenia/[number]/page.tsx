import Link from "next/link";
import { notFound } from "next/navigation";
import { canViewTicket, isAdmin } from "@/lib/permissions";
import { getTicketByNumber } from "@/lib/tickets";
import { requireSession } from "@/lib/session";
import { PriorityMark } from "@/components/ui/PriorityMark";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { StatusHistory } from "@/components/StatusHistory";

const dateFormat = new Intl.DateTimeFormat("pl-PL");

type Props = {
  params: Promise<{ number: string }>;
};

export default async function TicketDetails({ params }: Props) {
  const { number } = await params;
  const user = await requireSession();

  const ticketNumber = Number(number);
  if (!Number.isInteger(ticketNumber) || ticketNumber <= 0) notFound();

  // Zapytanie juz zawezilo zakres do roli, wiec cudze zgloszenie przychodzi
  // jako null. canViewTicket zostaje jako druga bramka: gdyby ktos kiedys
  // rozluznil zapytanie, strona dalej nie pokaze cudzych danych.
  const ticket = await getTicketByNumber(user, ticketNumber);
  if (!ticket || !canViewTicket(user, ticket)) notFound();

  const admin = isAdmin(user);

  return (
    <div>
      <Link href="/zgloszenia" className="text-sm font-semibold text-muted hover:text-fg">
        {admin ? "Wszystkie zgłoszenia" : "Moje zgłoszenia"}
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">#{String(ticket.number).padStart(4, "0")}</p>
          <h1 className="font-display text-3xl font-extrabold text-fg">{ticket.title}</h1>
          <p className="mt-1 text-sm text-muted">
            {ticket.author.name}, {dateFormat.format(ticket.createdAt)}
          </p>
        </div>
        <div className="flex flex-shrink-0 flex-col items-end gap-2">
          <PriorityMark priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[1.6fr_1fr]">
        <div className="rounded-xl border border-line bg-surface p-6">
          <p className="whitespace-pre-wrap text-sm text-fg">{ticket.description}</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-line bg-surface p-6">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
              Historia zmian
            </h2>
            <StatusHistory
              history={ticket.history}
              created={{ by: ticket.author.name, at: ticket.createdAt }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
