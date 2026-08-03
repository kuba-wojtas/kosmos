import { prisma } from "@/lib/prisma";
import { isAdmin, type SessionUser } from "@/lib/permissions";
import type { Prisma, Status } from "@/generated/prisma/client";
import type { Filters } from "@/lib/validation";

// Zawezenie do wlasnych zgloszen robi zapytanie, nie filtr na wyniku.
// Filtrowanie w pamieci oznaczaloby, ze cudze dane i tak opuscilyby baze.
function scope(user: SessionUser, filters: Filters): Prisma.TicketWhereInput {
  return {
    ...(isAdmin(user) ? {} : { authorId: user.id }),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.priority ? { priority: filters.priority } : {}),
    ...(filters.search
      ? { title: { contains: filters.search, mode: "insensitive" as const } }
      : {}),
  };
}

export async function getTickets(user: SessionUser, filters: Filters) {
  return prisma.ticket.findMany({
    where: scope(user, filters),
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

// Liczniki ignoruja wybrany status, bo same nim steruja. Gdyby go respektowaly,
// po kliknieciu filtra pozostale pokazywalyby zero i nie dalo sie z niego wyjsc.
export async function getStatusCounts(user: SessionUser, filters: Filters) {
  const withoutStatus = { ...filters, status: undefined };
  const groups = await prisma.ticket.groupBy({
    by: ["status"],
    where: scope(user, withoutStatus),
    _count: { _all: true },
  });

  const empty: Record<Status, number> = { NEW: 0, IN_PROGRESS: 0, RESOLVED: 0 };
  const counts = groups.reduce(
    (acc, g) => ({ ...acc, [g.status]: g._count._all }),
    empty,
  );

  return {
    ...counts,
    all: counts.NEW + counts.IN_PROGRESS + counts.RESOLVED,
  };
}

// Zawezenie siedzi w zapytaniu, wiec cudze zgloszenie zwraca null tak samo jak
// nieistniejace. Strona robi z tego 404 i z zewnatrz nie da sie ich odroznic.
export async function getTicketByNumber(user: SessionUser, number: number) {
  return prisma.ticket.findFirst({
    where: {
      number,
      ...(isAdmin(user) ? {} : { authorId: user.id }),
    },
    include: {
      author: { select: { name: true } },
      history: {
        orderBy: { changedAt: "desc" },
        include: { changedBy: { select: { name: true } } },
      },
    },
  });
}

export type TicketListItem = Awaited<ReturnType<typeof getTickets>>[number];
export type TicketWithHistory = NonNullable<Awaited<ReturnType<typeof getTicketByNumber>>>;
