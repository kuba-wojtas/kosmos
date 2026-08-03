"use client";

import { useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Input";
import { ALL_STATUSES, STATUS_LABELS } from "@/lib/labels";
import type { Status } from "@/generated/prisma/client";

type Counts = Record<Status, number> & { all: number };

type Props = {
  counts: Counts;
  showSearch: boolean;
};

const dotColor: Record<Status, string> = {
  NEW: "bg-status-new",
  IN_PROGRESS: "bg-status-progress",
  RESOLVED: "bg-status-resolved",
};

const SEARCH_DEBOUNCE_MS = 300;

// Adres jest jedynym zrodlem prawdy dla filtrow: buduje sie go z aktualnych
// searchParams, zeby klikniecie chipa czy wpisanie wyszukiwania nie gubilo
// pozostalych parametrow.
function hrefForStatus(pathname: string, searchParams: URLSearchParams, status?: Status): string {
  const params = new URLSearchParams(searchParams);
  if (status) {
    params.set("status", status.toLowerCase());
  } else {
    params.delete("status");
  }
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function TicketFilters({ counts, showSearch }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentStatus = searchParams.get("status")?.toUpperCase();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      const trimmed = value.trim();
      if (trimmed) {
        params.set("search", trimmed);
      } else {
        params.delete("search");
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    }, SEARCH_DEBOUNCE_MS);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap gap-2">
        <Chip href={hrefForStatus(pathname, searchParams)} active={!currentStatus}>
          <span aria-hidden className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-muted align-middle" />
          Wszystkie
          <span className="ml-1.5 text-muted">{counts.all}</span>
        </Chip>
        {ALL_STATUSES.map((status) => (
          <Chip key={status} href={hrefForStatus(pathname, searchParams, status)} active={currentStatus === status}>
            <span
              aria-hidden
              className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle ${dotColor[status]}`}
            />
            {STATUS_LABELS[status]}
            <span className="ml-1.5 text-muted">{counts[status]}</span>
          </Chip>
        ))}
      </div>

      {showSearch && (
        <Input
          type="search"
          defaultValue={searchParams.get("search") ?? ""}
          onChange={handleSearchChange}
          placeholder="Szukaj po tytule..."
          className="max-w-xs"
        />
      )}
    </div>
  );
}
