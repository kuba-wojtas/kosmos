"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";
import type { ActionResult } from "@/lib/action-result";

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

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // Przy logowaniu nie zdradzamy, czy konto istnieje. Tutaj musimy, bo inaczej
    // formularz rejestracji przestaje dzialac po ludzku. Swiadomy kompromis.
    return {
      ok: false,
      error: "Konto z tym adresem już istnieje.",
      fieldErrors: { email: ["Konto z tym adresem już istnieje."] },
    };
  }

  // Rola zawsze USER. Nie ma zadnej sciezki w aplikacji podnoszacej uprawnienia.
  await prisma.user.create({
    data: { name, email, passwordHash: await bcrypt.hash(password, 12) },
  });

  return { ok: true, data: undefined };
}
