"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { canChangeStatus } from "@/lib/permissions";
import { newTicketSchema, statusChangeSchema } from "@/lib/validation";
import type { ActionResult } from "@/lib/action-result";

export async function createTicket(data: unknown): Promise<ActionResult<{ number: number }>> {
  const result = newTicketSchema.safeParse(data);
  if (!result.success) {
    return {
      ok: false,
      error: "Popraw zaznaczone pola.",
      fieldErrors: z.flattenError(result.error).fieldErrors as Record<string, string[]>,
    };
  }

  const user = await requireSession();
  const { title, description, priority } = result.data;

  // Blok obejmujacy zapis do bazy, tak jak w registerUser: tworzenie zgloszenia
  // moze odrzucic obietnice z powodow infrastrukturalnych (cold start Neona,
  // wyczerpana pula polaczen), nie tylko z powodu blednych danych, a akcja
  // serwerowa nie moze wtedy rzucic w strone formularza.
  try {
    // authorId zawsze z sesji, nigdy z wejscia. Jawny literal, nie rozwiniecie
    // zwalidowanych danych: dodatkowe pole w zadaniu nie moze podszyc sie pod
    // innego autora. Status zostaje na domyslnym NEW ze schematu.
    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority,
        authorId: user.id,
      },
      select: { number: true },
    });

    revalidatePath("/zgloszenia");
    return { ok: true, data: { number: ticket.number } };
  } catch {
    // Nie ujawniamy tresci wyjatku: moze zawierac nazwy kolumn i fragmenty
    // zapytania. Uzytkownik dostaje ogolny komunikat, akcja mimo to nie rzuca.
    return { ok: false, error: "Nie udało się utworzyć zgłoszenia. Spróbuj ponownie." };
  }
}

export async function updateTicketStatus(data: unknown): Promise<ActionResult> {
  const result = statusChangeSchema.safeParse(data);
  if (!result.success) {
    return { ok: false, error: "Nieprawidłowe dane zmiany statusu." };
  }

  // Sprawdzenie uprawnien nie moze polegac na tym, ze przycisk jest ukryty
  // w interfejsie: akcja jest wywolywalna wprost, wiec brama musi byc tutaj.
  const user = await requireSession();
  if (!canChangeStatus(user)) {
    return { ok: false, error: "Nie masz uprawnień do zmiany statusu." };
  }

  const { number, status } = result.data;

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { number },
      select: { id: true, status: true },
    });
    if (!ticket) {
      return { ok: false, error: "Nie ma takiego zgłoszenia." };
    }

    // Zapis tego samego statusu zasmiecalby historie wpisami typu NEW -> NEW.
    if (ticket.status === status) {
      return { ok: true, data: undefined };
    }

    // Albo aktualizacja statusu i wpis do historii razem, albo nic: historia
    // z lukami wyglada wiarygodnie, a nie jest.
    await prisma.$transaction([
      prisma.ticket.update({ where: { id: ticket.id }, data: { status } }),
      prisma.statusChange.create({
        data: {
          ticketId: ticket.id,
          from: ticket.status,
          to: status,
          changedById: user.id,
        },
      }),
    ]);

    revalidatePath("/zgloszenia");
    revalidatePath(`/zgloszenia/${number}`);
    return { ok: true, data: undefined };
  } catch {
    return { ok: false, error: "Nie udało się zapisać zmiany statusu. Spróbuj ponownie." };
  }
}
