import { beforeEach, describe, expect, it, vi } from "vitest";
import { Prisma, type User } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { registerUser } from "./auth";

// prisma jest singletonem laczacym sie z Neonem (patrz src/lib/prisma.ts),
// wiec w testach jednostkowych mockujemy caly modul: chcemy symulowac awarie
// infrastruktury (cold start, wyczerpana pula polaczen), ktorej nie da sie
// wywolac inaczej niz przez odrzucenie obietnicy z klienta Prismy.
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

const findUnique = vi.mocked(prisma.user.findUnique);
const create = vi.mocked(prisma.user.create);

const validInput = {
  name: "Jan Kowalski",
  email: "jan@kosmos.pl",
  password: "haslo1234",
};

const existingUser: User = {
  id: "u1",
  email: validInput.email,
  name: "Istniejacy Uzytkownik",
  passwordHash: "$2b$12$abcdefghijklmnopqrstuv",
  role: "USER",
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
};

function knownRequestError(code: string) {
  return new Prisma.PrismaClientKnownRequestError("blad zapytania", {
    code,
    clientVersion: "test",
  });
}

beforeEach(() => {
  findUnique.mockReset();
  create.mockReset();
});

describe("registerUser", () => {
  it("zwraca blad walidacji bez dotykania bazy przy niepoprawnych danych", async () => {
    const result = await registerUser({ ...validInput, password: "krotkie" });

    expect(result.ok).toBe(false);
    expect(findUnique).not.toHaveBeenCalled();
  });

  it("tworzy konto i zwraca ok:true przy poprawnych danych", async () => {
    findUnique.mockResolvedValue(null);
    create.mockResolvedValue(existingUser);

    const result = await registerUser(validInput);

    expect(result).toEqual({ ok: true, data: undefined });
  });

  it("zwraca blad pola email, gdy konto z takim adresem juz istnieje", async () => {
    findUnique.mockResolvedValue(existingUser);

    const result = await registerUser(validInput);

    expect(result.ok).toBe(false);
    expect(create).not.toHaveBeenCalled();
    if (!result.ok) {
      expect(result.fieldErrors?.email).toEqual(["Konto z tym adresem już istnieje."]);
    }
  });

  it("mapuje P2002 z create na ten sam blad pola email co pre-check (wyscig dwoch rejestracji)", async () => {
    findUnique.mockResolvedValue(null);
    create.mockRejectedValue(knownRequestError("P2002"));

    const result = await registerUser(validInput);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors?.email).toEqual(["Konto z tym adresem już istnieje."]);
    }
  });

  it("nie rzuca, gdy findUnique odrzuca obietnice z powodow infrastrukturalnych", async () => {
    findUnique.mockRejectedValue(new Error("connection timeout"));

    const result = await registerUser(validInput);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("Nie udało się utworzyć konta. Spróbuj ponownie.");
      // Tresc wyjatku infrastrukturalnego nie moze przeciec do uzytkownika.
      expect(result.error).not.toContain("connection timeout");
    }
  });

  it("nie rzuca, gdy create odrzuca obietnice z powodow infrastrukturalnych", async () => {
    findUnique.mockResolvedValue(null);
    create.mockRejectedValue(new Error("pool exhausted"));

    const result = await registerUser(validInput);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("Nie udało się utworzyć konta. Spróbuj ponownie.");
      expect(result.error).not.toContain("pool exhausted");
    }
  });
});
