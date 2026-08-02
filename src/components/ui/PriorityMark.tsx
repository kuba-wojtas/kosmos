type Priority = "LOW" | "MEDIUM" | "HIGH";

// Kreska rosnie razem z waga, zeby priorytet dalo sie odczytac takze bez
// rozrozniania kolorow. Przy protanopii czerwien i pomarancz sie zlewaja.
const style: Record<Priority, { kolor: string; wysokosc: string }> = {
  LOW: { kolor: "text-priority-low", wysokosc: "h-1.5" },
  MEDIUM: { kolor: "text-priority-medium", wysokosc: "h-2.5" },
  HIGH: { kolor: "text-priority-high", wysokosc: "h-3.5" },
};

const etykiety: Record<Priority, string> = {
  LOW: "Niski",
  MEDIUM: "Średni",
  HIGH: "Wysoki",
};

export function PriorityMark({ priority }: { priority: Priority }) {
  const { kolor, wysokosc } = style[priority];
  return (
    <span className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${kolor}`}>
      <span aria-hidden className={`w-1 rounded-sm bg-current ${wysokosc}`} />
      {etykiety[priority]}
    </span>
  );
}
