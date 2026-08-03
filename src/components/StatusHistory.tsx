import { STATUS_LABELS } from "@/lib/labels";
import type { TicketWithHistory } from "@/lib/tickets";

type Props = {
  history: TicketWithHistory["history"];
  created: { by: string; at: Date };
};

const dateFormat = new Intl.DateTimeFormat("pl-PL", { dateStyle: "short", timeStyle: "short" });

// Oddzielny format od TicketList: tam wystarcza data, tu liczy sie tez godzina
// zmiany, bo kilka zmian tego samego dnia musi dac sie rozroznic.
const itemClass = "relative border-l border-line py-3 pl-4 first:pt-0 last:border-transparent last:pb-0";
const dotClass = "absolute -left-1 top-3.5 h-2 w-2 rounded-full bg-brand";

export function StatusHistory({ history, created }: Props) {
  return (
    <ul>
      {history.map((entry) => (
        <li key={entry.id} className={itemClass}>
          <span aria-hidden className={dotClass} />
          <p className="text-sm font-medium text-fg">
            {STATUS_LABELS[entry.from]} -&gt; {STATUS_LABELS[entry.to]}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {entry.changedBy.name}, {dateFormat.format(entry.changedAt)}
          </p>
        </li>
      ))}

      {/* Utworzenie nie jest zmiana statusu, nie ma wiersza w StatusChange.
          Zawsze na dole osi, budowane z danych zgloszenia, nie z historii. */}
      <li className={itemClass}>
        <span aria-hidden className={dotClass} />
        <p className="text-sm font-medium text-fg">Zgłoszenie utworzone</p>
        <p className="mt-0.5 text-xs text-muted">
          {created.by}, {dateFormat.format(created.at)}
        </p>
      </li>
    </ul>
  );
}
