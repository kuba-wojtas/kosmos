import { z } from "zod";

// Te same schematy dzialaja na kliencie i na serwerze. Walidacja po stronie
// klienta to wygoda, nie zabezpieczenie, wiec serwer i tak waliduje od nowa.

// Zod 4 sprawdza format e-maila na surowej wartosci, zanim zdaza zadzialac
// .trim()/.toLowerCase() dolozone za .email(). Kolejnosc odwracamy przez
// .pipe(), zeby przycinanie bialych znakow dzialo sie przed walidacja formatu.
const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: "Podaj poprawny adres e-mail." }));

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Imię i nazwisko musi mieć co najmniej 2 znaki." })
    .max(60, { error: "Imię i nazwisko może mieć najwyżej 60 znaków." }),
  email: emailField,
  password: z.string().min(8, { error: "Hasło musi mieć co najmniej 8 znaków." }),
});

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, { error: "Podaj hasło." }),
});

export const newTicketSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, { error: "Tytuł musi mieć co najmniej 5 znaków." })
    .max(120, { error: "Tytuł może mieć najwyżej 120 znaków." }),
  description: z
    .string()
    .trim()
    .min(20, { error: "Opis musi mieć co najmniej 20 znaków." })
    .max(2000, { error: "Opis może mieć najwyżej 2000 znaków." }),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"], { error: "Wybierz priorytet." }),
});

export const statusChangeSchema = z.object({
  number: z.coerce.number().int().positive(),
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED"], { error: "Nieznany status." }),
});

// Next.js oddaje searchParams jako string | string[] | undefined (powtorzony
// klucz w adresie daje tablice), a reczne pogrzebanie w adresie moze wpisac
// cokolwiek. Normalizujemy kazda wartosc do string | undefined, zanim
// zadziala reszta logiki, zeby filtersSchema nigdy nie rzucalo wyjatku.
const paramToString = z.unknown().optional().transform((value): string | undefined => {
  const candidate = Array.isArray(value) ? value[0] : value;
  return typeof candidate === "string" ? candidate : undefined;
});

// Parametry z adresu moga byc czymkolwiek, wiec niepoprawna wartosc jest
// pomijana zamiast wywalac strone. W adresie enum zapisujemy malymi literami
// (?status=new), zeby link byl czytelny, ale bez osobnej warstwy tlumaczen.
const enumFromParam = <T extends string>(allowed: readonly T[]) =>
  paramToString.transform((value): T | undefined => {
    if (!value) return undefined;
    const upper = value.toUpperCase();
    return (allowed as readonly string[]).includes(upper) ? (upper as T) : undefined;
  });

export const filtersSchema = z.object({
  status: enumFromParam(["NEW", "IN_PROGRESS", "RESOLVED"] as const),
  priority: enumFromParam(["LOW", "MEDIUM", "HIGH"] as const),
  search: paramToString.transform((value) => {
    const trimmed = value?.trim().slice(0, 120);
    return trimmed ? trimmed : undefined;
  }),
});

export type NewTicket = z.infer<typeof newTicketSchema>;
export type Filters = z.infer<typeof filtersSchema>;
