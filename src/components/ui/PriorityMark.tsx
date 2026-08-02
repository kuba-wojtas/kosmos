type Priority = "LOW" | "MEDIUM" | "HIGH";

// Kreska rosnie razem z waga, zeby priorytet dalo sie odczytac takze bez
// rozrozniania kolorow. Przy protanopii czerwien i pomarancz sie zlewaja.
const style: Record<Priority, { color: string; height: string }> = {
  LOW: { color: "text-priority-low", height: "h-1.5" },
  MEDIUM: { color: "text-priority-medium", height: "h-2.5" },
  HIGH: { color: "text-priority-high", height: "h-3.5" },
};

const labels: Record<Priority, string> = {
  LOW: "Niski",
  MEDIUM: "Średni",
  HIGH: "Wysoki",
};

export function PriorityMark({ priority }: { priority: Priority }) {
  const { color, height } = style[priority];
  return (
    <span className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${color}`}>
      <span aria-hidden className={`w-1 rounded-sm bg-current ${height}`} />
      {labels[priority]}
    </span>
  );
}
