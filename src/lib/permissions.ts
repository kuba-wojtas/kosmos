import type { Role } from "@/generated/prisma/client";

// Jedyne miejsce w projekcie, gdzie porownuje sie role. Czyste funkcje bez
// dostepu do bazy i bez znajomosci requestu, dzieki czemu testy nie mockuja nic.
export type SessionUser = { id: string; role: Role };

export function isAdmin(user: SessionUser): boolean {
  return user.role === "ADMIN";
}

export function canViewTicket(user: SessionUser, ticket: { authorId: string }): boolean {
  return isAdmin(user) || ticket.authorId === user.id;
}

export function canChangeStatus(user: SessionUser): boolean {
  return isAdmin(user);
}
