import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Brak zmiennej srodowiskowej DATABASE_URL.");
}

// Prisma 7 nie czyta juz DATABASE_URL sama: bez adaptera konstruktor rzuca.
// Tu idzie adres przez pooler, bo tak laczy sie aplikacja w czasie dzialania.
const adapter = new PrismaPg({ connectionString });

// Hot reload w dev tworzylby nowego klienta przy kazdej zmianie pliku
// i baza szybko wyczerpalaby limit polaczen.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
