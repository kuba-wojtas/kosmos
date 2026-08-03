import { describe, expect, it } from "vitest";
import { z } from "zod";
import { filtersSchema, newTicketSchema, registerSchema } from "./validation";

describe("registerSchema", () => {
  it("przyjmuje poprawne dane i normalizuje e-mail", () => {
    const result = registerSchema.safeParse({
      name: "  Anna Kowalska  ",
      email: "  Anna.Kowalska@Kosmos.PL ",
      password: "tajnehaslo",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("anna.kowalska@kosmos.pl");
      expect(result.data.name).toBe("Anna Kowalska");
    }
  });

  it("odrzuca haslo krotsze niz 8 znakow", () => {
    const result = registerSchema.safeParse({
      name: "Anna",
      email: "a@b.pl",
      password: "krotkie",
    });
    expect(result.success).toBe(false);
  });

  it("odrzuca niepoprawny e-mail", () => {
    const result = registerSchema.safeParse({
      name: "Anna",
      email: "to nie jest e-mail",
      password: "tajnehaslo",
    });
    expect(result.success).toBe(false);
  });
});

describe("newTicketSchema", () => {
  const valid = {
    title: "Drukarka nie odpowiada",
    description: "Od poniedzialku drukarka w sekretariacie nie odbiera zlecen.",
    priority: "HIGH",
  };

  it("przyjmuje poprawne zgloszenie", () => {
    expect(newTicketSchema.safeParse(valid).success).toBe(true);
  });

  it("odrzuca opis krotszy niz 20 znakow", () => {
    const result = newTicketSchema.safeParse({ ...valid, description: "za krotko" });
    expect(result.success).toBe(false);
  });

  it("odrzuca tytul dluzszy niz 120 znakow", () => {
    const result = newTicketSchema.safeParse({ ...valid, title: "x".repeat(121) });
    expect(result.success).toBe(false);
  });

  it("odrzuca priorytet spoza enuma", () => {
    const result = newTicketSchema.safeParse({ ...valid, priority: "PILNE" });
    expect(result.success).toBe(false);
  });

  it("zwraca formError przypisany do konkretnego pola, nie do calego formularza", () => {
    const result = newTicketSchema.safeParse({ ...valid, description: "x" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;
      expect(fieldErrors.description).toBeDefined();
      expect(fieldErrors.title).toBeUndefined();
    }
  });
});

describe("filtersSchema", () => {
  it("przepuszcza pusty zestaw parametrow", () => {
    const result = filtersSchema.parse({});
    expect(result.status).toBeUndefined();
    expect(result.search).toBeUndefined();
  });

  it("ignoruje smieci zamiast wywalac strone", () => {
    const result = filtersSchema.parse({ status: "cokolwiek", priority: "!!!" });
    expect(result.status).toBeUndefined();
    expect(result.priority).toBeUndefined();
  });

  it("przyjmuje wartosci enuma zapisane malymi literami", () => {
    const result = filtersSchema.parse({ status: "in_progress", priority: "high" });
    expect(result.status).toBe("IN_PROGRESS");
    expect(result.priority).toBe("HIGH");
  });

  it("przycina wyszukiwana fraze i pomija pusta", () => {
    expect(filtersSchema.parse({ search: "  drukarka  " }).search).toBe("drukarka");
    expect(filtersSchema.parse({ search: "   " }).search).toBeUndefined();
  });

  it("z tablicy powtorzonego parametru bierze pierwszy element", () => {
    const result = filtersSchema.parse({ status: ["new", "old"] });
    expect(result.status).toBe("NEW");
  });

  it("dla wartosci innych niz string i tablica stringow zwraca undefined", () => {
    expect(filtersSchema.parse({ status: null }).status).toBeUndefined();
    expect(filtersSchema.parse({ status: 42 }).status).toBeUndefined();
    expect(filtersSchema.parse({ status: {} }).status).toBeUndefined();
    expect(filtersSchema.parse({ status: [] }).status).toBeUndefined();
  });

  it("dla wyszukiwania w tablicy bierze pierwszy element", () => {
    expect(filtersSchema.parse({ search: ["drukarka", "inne"] }).search).toBe("drukarka");
  });

  it("nigdy nie rzuca wyjatku, niezaleznie od ksztaltu wartosci parametrow", () => {
    const hostile: Record<string, unknown>[] = [
      {},
      { status: ["new", "old"], priority: ["high", "low"], search: ["a", "b"] },
      { status: null, priority: null, search: null },
      { status: 42, priority: true, search: {} },
      { status: {}, priority: [], search: [] },
      { status: undefined, priority: undefined, search: undefined },
      { status: "smiec", priority: "!!!", search: "   " },
    ];

    for (const input of hostile) {
      expect(() => filtersSchema.parse(input)).not.toThrow();
    }
  });
});
