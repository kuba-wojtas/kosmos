"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { registerSchema } from "@/lib/validation";
import type { ActionResult } from "@/lib/action-result";

const DUPLICATE_EMAIL_ERROR = "Konto z tym adresem już istnieje.";

export async function registerUser(data: unknown): Promise<ActionResult> {
  const result = registerSchema.safeParse(data);
  if (!result.success) {
    return {
      ok: false,
      error: "Popraw zaznaczone pola.",
      fieldErrors: z.flattenError(result.error).fieldErrors as Record<string, string[]>,
    };
  }

  const { name, email, password } = result.data;

  // Jeden blok obejmujacy odczyt i zapis: oba to wywolania do bazy, oba moga
  // odrzucic obietnice z powodow infrastrukturalnych (cold start Neona,
  // wyczerpana pula polaczen, chwilowy blad sieci), nie tylko z powodu
  // konfliktu danych. Akcja serwerowa nie moze rzucic w strone UI w zadnym
  // z tych przypadkow.
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      // Przy logowaniu nie zdradzamy, czy konto istnieje. Tutaj musimy, bo inaczej
      // formularz rejestracji przestaje dzialac po ludzku. Swiadomy kompromis.
      return {
        ok: false,
        error: DUPLICATE_EMAIL_ERROR,
        fieldErrors: { email: [DUPLICATE_EMAIL_ERROR] },
      };
    }

    // Rola zawsze USER. Nie ma zadnej sciezki w aplikacji podnoszacej uprawnienia.
    await prisma.user.create({
      data: { name, email, passwordHash: await bcrypt.hash(password, 12) },
    });
  } catch (error) {
    // Sprawdzenie wyzej i insert nie sa atomowe: dwa rownoczesne zgloszenia tego
    // samego adresu (podwojny klik, dwie karty) oba przechodza existence check,
    // a przegrany trafia na unique constraint. P2002 dostaje ten sam komunikat
    // co pre-check, zamiast wywalic obietnice w strone formularza.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        ok: false,
        error: DUPLICATE_EMAIL_ERROR,
        fieldErrors: { email: [DUPLICATE_EMAIL_ERROR] },
      };
    }

    // Nie ujawniamy tresci wyjatku: moze zawierac nazwy kolumn i fragmenty
    // zapytania. Uzytkownik dostaje ogolny komunikat, akcja mimo to nie rzuca.
    return { ok: false, error: "Nie udało się utworzyć konta. Spróbuj ponownie." };
  }

  return { ok: true, data: undefined };
}
