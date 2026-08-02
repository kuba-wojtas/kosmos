import type { Status } from "@/generated/prisma/client";
import { STATUS_LABELS } from "@/lib/labels";

const style: Record<Status, string> = {
  NEW: "bg-status-new-bg text-status-new",
  IN_PROGRESS: "bg-status-progress-bg text-status-progress",
  RESOLVED: "bg-status-resolved-bg text-status-resolved",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-block rounded-md px-2.5 py-1 text-xs font-semibold ${style[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
