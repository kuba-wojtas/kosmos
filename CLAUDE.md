# CLAUDE.md

## Cel projektu
Prosty system obsługi zgłoszeń (helpdesk). Użytkownicy zakładają konto, tworzą
zgłoszenia i widzą tylko swoje. Administratorzy widzą wszystkie zgłoszenia,
wchodzą w szczegóły i zmieniają status (nowe → w trakcie → rozwiązane).
Projekt rekrutacyjny/testowy, ma działać solidnie i czytelnie, nie ma być
rozbudowanym produktem.

## Stack
- Next.js 16, App Router, TypeScript strict
- PostgreSQL + Prisma 7 (generator `prisma-client`, klient w `src/generated/prisma`,
  NIE importuj z `@prisma/client`)
- Auth.js (NextAuth v5 beta), Credentials Provider, hasła hashowane bcryptem
- Zod 4: błędy pól przez `z.flattenError(err).fieldErrors`, nie `err.flatten()`
- Zod (walidacja) + react-hook-form
- Tailwind CSS
- Vitest (testy jednostkowe logiki uprawnień)
- Deploy: Vercel + Neon (Postgres)

## Model danych (skrót)
`User (id, email, passwordHash, name, role: USER|ADMIN)`
`Ticket (id, number, title, description, status: NEW|IN_PROGRESS|RESOLVED,
priority: LOW|MEDIUM|HIGH, authorId)`
`StatusChange (ticketId, from, to, changedById, changedAt)`, audyt zmian statusu

`number` to autoincrement osobno od cuid-owego `id`, żeby w UI i w URL-u
pokazywać czytelne `#0142` zamiast ciągu znaków.

Pełny schemat: `prisma/schema.prisma`, to jest źródło prawdy. Nie duplikuj
definicji typów ręcznie, korzystaj z wygenerowanych typów Prisma.

## Zasady pracy
- Server Actions zamiast API routes, chyba że coś naprawdę wymaga endpointu
  (np. webhook w przyszłości).
- Każda mutacja: walidacja Zod na wejściu → sprawdzenie uprawnień → operacja
  na bazie. W tej kolejności, zawsze.
- Logika uprawnień w jednym miejscu: `src/lib/permissions.ts`
  (`isAdmin(user)`, `canViewTicket(user, ticket)`). Nie sprawdzaj ról ręcznie
  rozrzuconymi if-ami po komponentach i akcjach.
- Komponenty serwerowe domyślnie. `"use client"` tylko tam, gdzie jest
  faktyczna interaktywność (formularze, dropdown zmiany statusu).
- Błędy z Server Actions zwracaj jako `{ error: string }`, nie rzucaj
  wyjątków w stronę UI. Formularz ma się ładnie wywrócić, nie appka.
- Middleware chroni wszystko pod `/zgloszenia/*`: brak sesji = redirect na
  `/logowanie`. Middleware nie widzi danych, więc nie jest autoryzacją.
  O dostępie do konkretnego zgłoszenia decyduje `canViewTicket` w stronie
  i w akcji.
- Stylowanie zgodnie ze STYLE_GUIDE.md. Nie wymyślaj kolorów ani spacingu
  ad hoc, sięgaj po tokeny stamtąd.

## Konwencje nazewnictwa
- Komponenty: PascalCase (`TicketList.tsx`)
- Server Actions: czasownik + rzeczownik (`createTicket`, `updateTicketStatus`)
- Routing: kebab-case
- Pliki testów: `*.test.ts` obok testowanego modułu

## Kolejność budowy (żebyś nie gubić kontekstu między sesjami)
1. Scaffold Next.js + Tailwind + Prisma, połączenie z Neon
2. Schema Prisma + migracja + seed (admin, 2 userów, kilka zgłoszeń)
3. Auth.js: rejestracja, logowanie, middleware, sesja z rolą w tokenie
4. `permissions.ts` + testy do niego
5. Server Actions: create/get ticketów, zmiana statusu (z zapisem do StatusChange)
6. UI: auth → lista zgłoszeń → nowe zgłoszenie → szczegóły → panel admina
7. Filtrowanie po statusie, liczniki dla admina, historia zmian w widoku szczegółów
8. Obsługa błędów (error.tsx, not-found.tsx, komunikaty walidacji)
9. README + porządki

## Styl pisania (kod, komentarze, README, teksty w UI)
- ZERO em-dashy (—) i en-dashy (–). Tylko zwykły dywiz (-). Zamiast myślnika
  używaj przecinka, dwukropka albo rozbij na dwa zdania.
- Bez emoji w kodzie, komentarzach, commitach i dokumentacji.
- Komentarze krótkie i konkretne, tłumaczą DLACZEGO, nie powtarzają kodu.
  Jeden-dwa wiersze nad funkcją, nie akapit. Bez JSDoc-owego boilerplate'u
  z @param dla każdego argumentu.
- Bez pogrubiania co drugiego wyrażenia i bez podsumowań powtarzających to,
  co przed chwilą zostało napisane.
- Bez zwrotów typu "warto zauważyć", "nie tylko X, ale i Y". Piszemy wprost.

## Dziennik decyzji
Każdy nieoczywisty wybór (technologia, biblioteka, odrzucona alternatywa) ląduje
w DECISIONS.md: co wybrane, dlaczego, co odrzucone i z jakiego powodu.
Krótko, jeden akapit na decyzję.

## Czego NIE robić
- Bez WebSocketów / real-time, nie jest wymagane, nie dokładaj.
- Bez komentarzy, załączników, powiadomień e-mail, to poza zakresem zadania.
- Bez customowego admin-panelu-frameworka, to 4 widoki, nie potrzeba biblioteki.
- Nie zostawiaj `console.log` i zakomentowanego kodu w finalnej wersji.
- Nie twórz plików "na wszelki wypadek", jeśli coś nie jest używane, usuń.
