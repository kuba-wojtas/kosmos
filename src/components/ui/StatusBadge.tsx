type Status = "NEW" | "IN_PROGRESS" | "RESOLVED";

const style: Record<Status, string> = {
  NEW: "bg-status-new-bg text-status-new",
  IN_PROGRESS: "bg-status-progress-bg text-status-progress",
  RESOLVED: "bg-status-resolved-bg text-status-resolved",
};

const etykiety: Record<Status, string> = {
  NEW: "Nowe",
  IN_PROGRESS: "W trakcie",
  RESOLVED: "Rozwiązane",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-block rounded-md px-2.5 py-1 text-xs font-semibold ${style[status]}`}>
      {etykiety[status]}
    </span>
  );
}
