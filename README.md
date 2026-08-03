# Kosmos - system zgłoszeń

Prosty helpdesk: użytkownicy zakładają konto, zgłaszają problemy i widzą
tylko swoje. Administrator widzi wszystkie zgłoszenia i zmienia ich status.
Aplikacja: TODO-DEPLOY

## Konta demo

```
admin@kosmos.pl / demo1234
user@kosmos.pl   / demo1234
```

## Zrzuty ekranu

<!-- TODO-DEPLOY: dodać trzy zrzuty ekranu do docs/screenshots/ (ciemny motyw, szerokość 1280 px) i podmienić poniższe odnośniki. -->

![Lista zgłoszeń widziana przez administratora, z filtrami statusu i wyszukiwarką](docs/screenshots/lista-admina.png)

Lista zgłoszeń widziana przez administratora, z filtrami statusu i wyszukiwarką.

![Szczegóły zgłoszenia z historią zmian statusu](docs/screenshots/szczegoly-zgloszenia.png)

Szczegóły zgłoszenia z historią zmian statusu.

![Formularz nowego zgłoszenia](docs/screenshots/nowe-zgloszenie.png)

Formularz nowego zgłoszenia.

## Funkcje

- rejestracja i logowanie (Auth.js, Credentials Provider, hasła hashowane bcryptem)
- middleware chroniący `/zgloszenia/*`, przekierowanie na `/logowanie` z powrotem po zalogowaniu (`returnTo`)
- tworzenie zgłoszenia z priorytetem (niski, średni, wysoki)
- lista zgłoszeń zawężona do właściciela, admin widzi wszystkie
- filtrowanie po statusie i liczniki zgłoszeń w każdym stanie
- wyszukiwanie po tytule, dostępne dla admina
- szczegóły zgłoszenia, dostęp do cudzego zgłoszenia po numerze kończy się 404, nie 403 (patrz `DECISIONS.md`)
- zmiana statusu przez admina, zapis do transakcji razem z wpisem w historii
- historia zmian statusu w widoku szczegółów

Ponad wymagania zadania: historia zmian statusu jako osobna tabela audytowa,
priorytety zgłoszeń, filtry i wyszukiwanie trzymane w adresie URL (działa
back/forward, link da się wysłać dalej), konta demo zasiane od razu.

## Stack

- Next.js 16, App Router - routing plikowy i Server Actions bez osobnej warstwy API
- TypeScript strict - błędy w typach zgłoszeń i sesji wyłapane przed uruchomieniem
- PostgreSQL + Prisma 7 - typowany dostęp do bazy, migracje jako źródło prawdy schematu
- Auth.js (NextAuth v5 beta) - sesja JWT z rolą w tokenie, bez pisania logowania od zera
- Zod 4 - jeden schemat waliduje i formularz na kliencie, i dane wchodzące do Server Action
- react-hook-form - stan formularzy i błędy pól bez ręcznego okablowania
- Tailwind CSS 4 - tokeny kolorów i typografii w jednym miejscu (`STYLE_GUIDE.md`)
- Vitest - testy jednostkowe logiki uprawnień i walidacji, szybkie bez bazy
- Vercel + Neon - deploy Next.js i Postgres bez utrzymywania serwera

## Uruchomienie lokalne

```bash
git clone <adres repozytorium>
cd kosmos
npm install
cp .env.example .env
```

W `.env` wypełnij:

- `DATABASE_URL` - połączenie do Neona przez pooler, używane przez aplikację
- `DIRECT_URL` - połączenie bezpośrednie do Neona, używane przez migracje Prismy
- `AUTH_SECRET` - wygeneruj poleceniem `openssl rand -base64 32`

Dalej:

```bash
npm run fonts
npx prisma migrate dev
npm run seed
npm run dev
```

`npm run fonts` pobiera pliki woff2 (Cabinet Grotesk, Switzer) z Fontshare do
`public/fonts`, potrzebne przed pierwszym buildem. `npm run seed` zakłada
konta demo i 15 zgłoszeń z historią zmian statusu.

Aplikacja rusza pod `http://localhost:3000`.

## Testy

```bash
npm test
```

40 testów w czterech plikach:

- `src/lib/permissions.test.ts` (8) - `isAdmin`, `canViewTicket`, `canChangeStatus`, w tym regresja na warunku, który przepuszczałby każdego zalogowanego zamiast tylko autora
- `src/lib/validation.test.ts` (16) - schematy `registerSchema`, `newTicketSchema`, `filtersSchema`, w tym że `filtersSchema` nigdy nie rzuca wyjątku niezależnie od kształtu `searchParams` (tablice, `null`, liczby, obiekty)
- `src/lib/safe-redirect.test.ts` (10) - `resolveSafeRedirect` odrzuca przekierowania do obcego hosta, adresy protocol-relative, `javascript:`, `\evil.example` i podobne obejścia, przepuszcza tylko własną ścieżkę
- `src/actions/auth.test.ts` (6) - `registerUser` z zamockowanym Prismą: walidacja przed dotknięciem bazy, duplikat e-maila wykryty i przez pre-check, i przez `P2002` z bazy (wyścig dwóch rejestracji), błędy infrastrukturalne nie wyciekają do użytkownika

## Struktura projektu

```
src/actions/        Server Actions (rejestracja, tworzenie zgłoszenia, zmiana statusu)
src/app/             trasy App Routera: auth, lista i szczegóły zgłoszeń, styleguide, API auth
src/components/      komponenty klienckie z interaktywnością (formularze, filtry, zmiana statusu)
src/components/ui/   prymitywy interfejsu (Button, Input, StatusBadge, Chip...)
src/generated/prisma/ klient Prismy wygenerowany przy instalacji, poza kontrolą wersji
src/lib/             logika bez UI: uprawnienia, walidacja, sesja, zapytania do zgłoszeń, fonty
src/types/           rozszerzenie typów Auth.js o rolę w sesji
prisma/              schema.prisma, migracje, seed
scripts/             pobieranie fontów z Fontshare
public/fonts/        pliki woff2 pobrane przez npm run fonts
docs/screenshots/    zrzuty ekranu użyte w README
```

## Decyzje projektowe

Pełny dziennik w `DECISIONS.md`. Kilka najciekawszych:

- **404 zamiast 403 na cudzym zgłoszeniu.** Wejście na numer, który nie
  należy do użytkownika, wygląda identycznie jak wejście na numer, który
  nie istnieje. Zawężenie siedzi w zapytaniu do bazy (`getTicketByNumber`),
  nie w filtrze na wyniku, więc cudze dane nigdy nie opuszczają bazy.
- **Status jako kategoria, priorytet jako skala.** Trzy stany statusu nie
  mają porządku, więc dostały trzy niezależne barwy jako wypełniony badge.
  Priorytet rośnie, więc jedna rodzina kolorów o rosnącym natężeniu plus
  pionowa kreska, która robi się wyższa, czytelna też bez rozróżniania barw.
- **Paleta wyciągnięta ze szkolakosmos.pl.** Zamiast dobierać kolory z
  generatora, zescrapowany CSS strony klienta dał kolor marki `#6165B2`.
  Reszta palety, w tym barwy statusów, dobrana pod dark mode i sprawdzona
  liczbowo pod kątem kontrastu WCAG.
- **Fonty sprawdzone pod polskie znaki przed wyborem.** Zamiast wierzyć
  opisowi na stronie Fontshare, pobrane pliki TTF i przeczytana tablica
  `cmap` skryptem. Sporo ładnych zachodnich krojów kończy się na Latin
  Basic i polskie "ą", "ę", "ź" trafiają na zastępczy glif.

## Czego świadomie nie ma

- **Rate limiting logowania.** Formularz nie ogranicza liczby prób. Do
  wdrożenia to osobna warstwa (np. limit po IP na edge'u) bez wpływu na to,
  co zadanie sprawdza, więc świadomie pominięte.
- **Reset hasła.** Wymaga wysyłki e-maili, których w zadaniu nie ma. Konta
  demo są seedowane, więc w praktyce nie jest to potrzebne do oceny.
- **Weryfikacja adresu e-mail.** Z tego samego powodu co reset hasła: brak
  wysyłki e-maili poza zakresem zadania.
- **Odświeżenie roli w trakcie sesji.** Rola jest zapisana w tokenie JWT
  przy logowaniu. Zmiana roli w bazie (np. degradacja admina) działa dopiero
  po wygaśnięciu tokenu i ponownym zalogowaniu, nie natychmiast. Przy
  Credentials Provider i sesji JWT to standardowe zachowanie Auth.js, a
  odświeżanie roli przy każdym renderze kosztowałoby zapytanie do bazy na
  każdą stronę.
- **Paginacja listy zgłoszeń.** Przy 15 zgłoszeniach z seeda i skali tego
  zadania niepotrzebna. Lista rośnie liniowo z `findMany` bez `take`/`skip`.

## Wdrożenie

1. Zaimportuj repozytorium na [vercel.com](https://vercel.com).
2. Ustaw zmienne środowiskowe `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`,
   te same wartości co lokalnie. Jeśli Auth.js zgłosi problem z callbackiem,
   dopisz `AUTH_URL` z adresem produkcyjnym.
3. Zdeployuj. `postinstall` (`prisma generate`) uruchamia się sam w
   środowisku budowania.
4. Uruchom migrację i seed na bazie produkcyjnej, lokalnie z `DATABASE_URL`
   wskazującym na Neona:

   ```bash
   npx prisma migrate deploy
   npm run seed
   ```

   Neon w darmowym planie ma jedną bazę, więc to ta sama instancja co w dev.
