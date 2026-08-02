import type { Priority, Status } from "@/generated/prisma/client";

// Jedyne miejsce, gdzie NEW spotyka sie z "nowe" (adres) i "Nowe" (interfejs).
export const STATUS_LABELS: Record<Status, string> = {
  NEW: "Nowe",
  IN_PROGRESS: "W trakcie",
  RESOLVED: "Rozwiązane",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: "Niski",
  MEDIUM: "Średni",
  HIGH: "Wysoki",
};

export const ALL_STATUSES = Object.keys(STATUS_LABELS) as Status[];
export const ALL_PRIORITIES = Object.keys(PRIORITY_LABELS) as Priority[];
