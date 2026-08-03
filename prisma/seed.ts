// Skrypt CLI uruchamiany przez "prisma db seed" (patrz prisma.config.ts).
// Plik lezy poza src/, wiec alias "@/" nie jest tu pewny - importy wzgledne.
import "dotenv/config";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  type Priority,
  type Role,
  type Status,
} from "../src/generated/prisma/client";

// console.log jest tu dopuszczalny wprost przez CLAUDE.md: to jedyne miejsce
// w projekcie, gdzie skrypt raportuje wynik do konsoli.

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("Brak zmiennej srodowiskowej DATABASE_URL.");
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

// Ten sam koszt co registerUser w src/actions/auth.ts, zeby hashe z demo
// i z rejestracji byly rownowazne pod wzgledem bezpieczenstwa.
const BCRYPT_COST = 12;
const DEMO_PASSWORD = "demo1234";

const now = new Date();
const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000);
const daysAgo = (days: number) => hoursAgo(days * 24);

type SeedUser = {
  email: string;
  name: string;
  role: Role;
  password: string;
};

// Dwa konta demo z hasel advertised na stronie logowania, plus trzej
// dodatkowi autorzy z losowymi haslami, potrzebni tylko po to, zeby widok
// admina realnie roznil sie od widoku pojedynczego usera.
const users: SeedUser[] = [
  { email: "admin@kosmos.pl", name: "Tomasz Kaczmarek", role: "ADMIN", password: DEMO_PASSWORD },
  { email: "user@kosmos.pl", name: "Piotr Nowak", role: "USER", password: DEMO_PASSWORD },
  {
    email: "katarzyna.wisniewska@kosmos.pl",
    name: "Katarzyna Wiśniewska",
    role: "USER",
    password: randomBytes(12).toString("base64url"),
  },
  {
    email: "marek.zielinski@kosmos.pl",
    name: "Marek Zieliński",
    role: "USER",
    password: randomBytes(12).toString("base64url"),
  },
  {
    email: "agnieszka.lewandowska@kosmos.pl",
    name: "Agnieszka Lewandowska",
    role: "USER",
    password: randomBytes(12).toString("base64url"),
  },
];

type SeedTicket = {
  number: number;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  authorEmail: string;
  createdAt: Date;
};

// 15 zgloszen z kontekstu szkoly, rozlozone na wszystkich piecioro autorow.
// createdAt rozrzucone od kilku godzin do kilku tygodni wstecz, zeby lista
// nie wygladala na wygenerowana w jednej sekundzie.
const tickets: SeedTicket[] = [
  {
    number: 1,
    title: "Drukarka w sekretariacie nie drukuje",
    description:
      "Drukarka HP w sekretariacie zacina papier przy każdej próbie wydruku dokumentów dla rodziców. Wymiana kartridża nie pomogła.",
    priority: "HIGH",
    status: "RESOLVED",
    authorEmail: "katarzyna.wisniewska@kosmos.pl",
    createdAt: daysAgo(35),
  },
  {
    number: 2,
    title: "Projektor w sali 14 nie wyświetla obrazu z laptopa",
    description:
      "Po podłączeniu kablem HDMI projektor pokazuje tylko niebieski ekran, dźwięk działa poprawnie. Sprawdzony inny laptop dał ten sam efekt.",
    priority: "MEDIUM",
    status: "RESOLVED",
    authorEmail: "marek.zielinski@kosmos.pl",
    createdAt: daysAgo(30),
  },
  {
    number: 3,
    title: "Brak dostępu do Wi-Fi w bibliotece",
    description:
      "Od dwóch dni sieć szkolna w bibliotece nie jest widoczna na żadnym urządzeniu, uczniowie nie mogą korzystać z czytników elektronicznych.",
    priority: "HIGH",
    status: "RESOLVED",
    authorEmail: "agnieszka.lewandowska@kosmos.pl",
    createdAt: daysAgo(28),
  },
  {
    number: 4,
    title: "Konto domenowe dla nowego stażysty",
    description:
      "Od poniedziałku zaczyna pracę stażysta w dziale kadr, potrzebuje konta domenowego z dostępem do dysku współdzielonego kadr.",
    priority: "MEDIUM",
    status: "RESOLVED",
    authorEmail: "admin@kosmos.pl",
    createdAt: daysAgo(26),
  },
  {
    number: 5,
    title: "Prośba o licencję na pakiet biurowy",
    description:
      "Nowy laptop służbowy nie ma zainstalowanego pakietu biurowego, potrzebna licencja do przygotowywania materiałów na lekcje.",
    priority: "LOW",
    status: "RESOLVED",
    authorEmail: "user@kosmos.pl",
    createdAt: daysAgo(24),
  },
  {
    number: 6,
    title: "Nie działa skaner w pokoju nauczycielskim",
    description:
      "Skaner podłączony do komputera w pokoju nauczycielskim przestał być wykrywany przez system po ostatniej aktualizacji Windows.",
    priority: "MEDIUM",
    status: "RESOLVED",
    authorEmail: "katarzyna.wisniewska@kosmos.pl",
    createdAt: daysAgo(21),
  },
  {
    number: 7,
    title: "Tablica interaktywna w sali 7 nie reaguje na dotyk",
    description:
      "Tablica interaktywna reaguje na pisak tylko w górnej części ekranu, w dolnej części dotyk jest całkowicie ignorowany.",
    priority: "HIGH",
    status: "RESOLVED",
    authorEmail: "marek.zielinski@kosmos.pl",
    createdAt: daysAgo(18),
  },
  {
    number: 8,
    title: "Zablokowane konto w dzienniku elektronicznym",
    description:
      "Konto w systemie dziennika elektronicznego zostało zablokowane po kilku nieudanych próbach logowania, potrzebny reset dostępu.",
    priority: "HIGH",
    status: "RESOLVED",
    authorEmail: "agnieszka.lewandowska@kosmos.pl",
    createdAt: daysAgo(15),
  },
  {
    number: 9,
    title: "Wolno działający komputer w sekretariacie",
    description:
      "Komputer w sekretariacie uruchamia się kilka minut i mocno zwalnia przy otwieraniu arkuszy kalkulacyjnych z dużą ilością danych.",
    priority: "LOW",
    status: "RESOLVED",
    authorEmail: "user@kosmos.pl",
    createdAt: daysAgo(12),
  },
  {
    number: 10,
    title: "Reset hasła do poczty służbowej",
    description:
      "Zapomniane hasło do skrzynki pocztowej uniemożliwia wysłanie wiadomości do rodziców przed jutrzejszą wywiadówką.",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    authorEmail: "user@kosmos.pl",
    createdAt: daysAgo(9),
  },
  {
    number: 11,
    title: "Awaria telefonu stacjonarnego w sekretariacie",
    description:
      "Telefon stacjonarny w sekretariacie nie ma sygnału, rodzice nie mogą się dodzwonić w sprawie odbioru dzieci ze świetlicy.",
    priority: "LOW",
    status: "IN_PROGRESS",
    authorEmail: "marek.zielinski@kosmos.pl",
    createdAt: daysAgo(6),
  },
  {
    number: 12,
    title: "Dodatkowy monitor do sali komputerowej",
    description:
      "Prośba o drugi monitor do stanowiska nauczyciela w sali komputerowej, ułatwi to prezentowanie kodu na lekcjach informatyki.",
    priority: "LOW",
    status: "NEW",
    authorEmail: "admin@kosmos.pl",
    createdAt: daysAgo(3),
  },
  {
    number: 13,
    title: "Nie działają głośniki w sali multimedialnej",
    description:
      "Podczas prezentacji filmów edukacyjnych w sali multimedialnej nie ma żadnego dźwięku, mimo poprawnie podłączonego kabla jack.",
    priority: "MEDIUM",
    status: "NEW",
    authorEmail: "katarzyna.wisniewska@kosmos.pl",
    createdAt: daysAgo(1),
  },
  {
    number: 14,
    title: "Aktualizacja antywirusa na laptopach nauczycielskich",
    description:
      "Licencja programu antywirusowego na laptopach nauczycielskich wygasa w tym miesiącu, potrzebna aktualizacja przed nowym semestrem.",
    priority: "MEDIUM",
    status: "NEW",
    authorEmail: "agnieszka.lewandowska@kosmos.pl",
    createdAt: hoursAgo(10),
  },
  {
    number: 15,
    title: "Drukarka sieciowa na drugim piętrze nie widzi komputerów",
    description:
      "Drukarka sieciowa na drugim piętrze przestała być widoczna w sieci, żaden komputer z tego piętra nie może wysyłać na nią wydruków.",
    priority: "HIGH",
    status: "NEW",
    authorEmail: "user@kosmos.pl",
    createdAt: hoursAgo(3),
  },
];

type HistoryStep = {
  from: Status;
  to: Status;
  changedById: string;
  changedAt: Date;
};

// Droga do biezacego statusu, nie pojedynczy skok: RESOLVED przechodzi przez
// IN_PROGRESS, tak jak w prawdziwym przeplywie pracy admina. changedAt liczone
// jako punkty posrednie miedzy createdAt zgloszenia a chwila uruchomienia seeda.
function buildHistory(ticket: SeedTicket, adminId: string): HistoryStep[] {
  if (ticket.status === "NEW") return [];

  const span = now.getTime() - ticket.createdAt.getTime();
  const toInProgress = new Date(ticket.createdAt.getTime() + span * 0.4);

  if (ticket.status === "IN_PROGRESS") {
    return [{ from: "NEW", to: "IN_PROGRESS", changedById: adminId, changedAt: toInProgress }];
  }

  const toResolved = new Date(ticket.createdAt.getTime() + span * 0.8);
  return [
    { from: "NEW", to: "IN_PROGRESS", changedById: adminId, changedAt: toInProgress },
    { from: "IN_PROGRESS", to: "RESOLVED", changedById: adminId, changedAt: toResolved },
  ];
}

async function main() {
  const userIdByEmail = new Map<string, string>();

  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, BCRYPT_COST);
    const row = await prisma.user.upsert({
      where: { email: user.email },
      create: { email: user.email, name: user.name, role: user.role, passwordHash },
      update: { name: user.name, role: user.role, passwordHash },
    });
    userIdByEmail.set(user.email, row.id);
  }

  const adminId = userIdByEmail.get("admin@kosmos.pl");
  if (!adminId) throw new Error("Konto admin@kosmos.pl nie zostalo utworzone.");

  let historyCount = 0;

  for (const ticket of tickets) {
    const authorId = userIdByEmail.get(ticket.authorEmail);
    if (!authorId) throw new Error(`Nieznany autor zgloszenia: ${ticket.authorEmail}`);

    const row = await prisma.ticket.upsert({
      where: { number: ticket.number },
      create: {
        number: ticket.number,
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        status: ticket.status,
        authorId,
        createdAt: ticket.createdAt,
      },
      update: {
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        status: ticket.status,
        authorId,
        createdAt: ticket.createdAt,
      },
    });

    // StatusChange nie ma naturalnego klucza do upsertu: kasujemy i budujemy
    // historie od nowa, zeby drugie uruchomienie nie dubletowalo wpisow.
    await prisma.statusChange.deleteMany({ where: { ticketId: row.id } });
    const history = buildHistory(ticket, adminId);
    if (history.length > 0) {
      await prisma.statusChange.createMany({
        data: history.map((step) => ({ ...step, ticketId: row.id })),
      });
      historyCount += history.length;
    }
  }

  // number ma @default(autoincrement()), ale tu wstawiamy wartosci wprost.
  // Postgres nie przesuwa przy tym sekwencji, wiec kolejny insert bez podanego
  // numeru (docelowa akcja createTicket) mogliby uderzyc w ten sam numer.
  // Ustawiamy sekwencje na maksimum, zeby dalsze automatyczne numery byly bezpieczne.
  await prisma.$executeRaw`
    SELECT setval(
      pg_get_serial_sequence('"Ticket"', 'number'),
      (SELECT COALESCE(MAX(number), 1) FROM "Ticket")
    )
  `;

  const statusCounts = await prisma.ticket.groupBy({ by: ["status"], _count: true });

  console.log("Seed zakonczony.");
  console.log(`Uzytkownicy: ${users.length} (w tym 2 konta demo, 3 dodatkowych autorow)`);
  console.log(`Zgloszenia: ${tickets.length}`);
  for (const entry of statusCounts) {
    console.log(`  ${entry.status}: ${entry._count}`);
  }
  console.log(`Wpisy w historii statusow: ${historyCount}`);
}

main()
  .catch((error) => {
    console.error("Seed nie powiodl sie:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
