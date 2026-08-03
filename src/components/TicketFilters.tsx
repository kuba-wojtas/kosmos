"use client";

import { useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Input";
import { PriorityMark } from "@/components/ui/PriorityMark";
import { ALL_PRIORITIES, ALL_STATUSES, STATUS_LABELS } from "@/lib/labels";
import type { Priority, Status } from "@/generated/prisma/client";

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
function hrefForParam(
  pathname: string,
  searchParams: URLSearchParams,
  key: "status" | "priority",
  value?: string,
): string {
  const params = new URLSearchParams(searchParams);
  if (value) {
    params.set(key, value.toLowerCase());
  } else {
    params.delete(key);
  }
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

// Parametr w adresie moze byc czymkolwiek (recznie wpisany, obcy link), wiec
// wartosc spoza enuma nie moze udawac aktywnego filtra: lista i tak wyswietla
// sie nieprzefiltrowana, wiec aktywny ma zostac "Wszystkie", nie zaden chip.
function currentEnumParam<T extends string>(
  searchParams: URLSearchParams,
  key: string,
  allowed: readonly T[],
): T | undefined {
  const value = searchParams.get(key)?.toUpperCase();
  return value && (allowed as readonly string[]).includes(value) ? (value as T) : undefined;
}

export function TicketFilters({ counts, showSearch }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentStatus = currentEnumParam(searchParams, "status", ALL_STATUSES);
  const currentPriority = currentEnumParam<Priority>(searchParams, "priority", ALL_PRIORITIES);
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
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Chip href={hrefForParam(pathname, searchParams, "status")} active={!currentStatus}>
            <span aria-hidden className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-muted align-middle" />
            Wszystkie
            <span className="ml-1.5 text-muted">{counts.all}</span>
          </Chip>
          {ALL_STATUSES.map((status) => (
            <Chip
              key={status}
              href={hrefForParam(pathname, searchParams, "status", status)}
              active={currentStatus === status}
            >
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
            placeholder="Szukaj po tytule lub autorze..."
            className="max-w-xs"
          />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-muted">Priorytet</span>
        <Chip href={hrefForParam(pathname, searchParams, "priority")} active={!currentPriority}>
          Wszystkie
        </Chip>
        {ALL_PRIORITIES.map((priority) => (
          <Chip
            key={priority}
            href={hrefForParam(pathname, searchParams, "priority", priority)}
            active={currentPriority === priority}
          >
            <PriorityMark priority={priority} />
          </Chip>
        ))}
      </div>
    </div>
  );
}
