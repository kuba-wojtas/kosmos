# Dziennik decyzji

Krótki zapis tego, co i dlaczego zostało wybrane. Jedna decyzja to jeden wpis.
Jeśli coś odrzuciłem, notuję powód, żeby za miesiąc nie wracać do tego samego
pomysłu i nie odkrywać problemu drugi raz.

---

## 1. Hosting i baza: Vercel + Neon

Neon daje darmowego Postgresa, Vercel deployuje Next.js bez konfiguracji.

**Odrzucone:** Supabase (dokłada warstwę auth i storage, których i tak nie
używamy), VPS z Dockerem (najlepiej trafiałby w ofertę, ale to zadanie
rekrutacyjne, ma pokazać że stack się spina, a nie generować koszt i robotę
przy utrzymaniu serwera).

## 2. Zakres ponad wymagania

Wchodzą cztery rzeczy, wszystkie tanie w implementacji i widoczne od razu:

- **historia zmian statusu**: osobna tabela, kto/kiedy/z czego na co; pokazuje
  myślenie o audytowalności, a nie tylko nadpisanie pola
- **priorytety zgłoszeń**: jedno pole w schemacie, realnie zmienia użyteczność
  listy dla admina
- **filtry i wyszukiwarka trzymane w URL**: działa back/forward, da się wysłać
  komuś link do konkretnego widoku
- **konta demo**: po jednym na rolę, seedowane; rekruter wchodzi na link
  i od razu widzi działającą aplikację zamiast pustego formularza rejestracji

**Odrzucone:** komentarze, załączniki, powiadomienia e-mail, real-time. Poza
zakresem zadania, a każde z nich to osobny kawałek pracy bez wpływu na to, co
jest sprawdzane.

## 3. Język: wszystko po polsku

Interfejs, komentarze w kodzie i README. Oferta i rozmowa są po polsku, więc
projekt też. Nazwy techniczne (enumy Prismy, typy) zostają angielskie, bo
mieszanie `status: NOWE` z `createdAt` wyglądałoby gorzej niż konsekwentnie
angielskie identyfikatory.

## 4. Styl pisania: bez manier AI

Żadnych em-dashy ani en-dashy, tylko zwykły dywiz. Do tego bez pogrubiania co
drugiego wyrażenia, bez emoji w kodzie i commitach, bez podsumowań powtarzających
to, co przed chwilą napisane. Dotyczy kodu, komentarzy, README i tekstów
w interfejsie. Projekt ma wyglądać na napisany przez człowieka, bo taki jest sens
rozmowy rekrutacyjnej o tym, jak korzystałem z AI.

## 5. Paleta: wyciągnięta ze szkolakosmos.pl

Zamiast dobierać kolory z coolors.co, zescrapowałem CSS ich strony
(`zn_dynamic.css`, plik z ustawieniami motywu). Kolor marki to `#6165B2`,
stonowane indygo, 27 wystąpień. Do tego `#4E518E` na hover, `#AEADFF` jasny
barwinek, `#CCCEE9` i `#B9BBD1` lawendowe szarości, `#CD2122` czerwień.

Aplikacja idzie w dark mode, więc paleta wymagała przesunięcia:

- tło `#08070C` zamiast ich `#040201`, bo czysta czerń męczy oczy i zabija
  cienie; lekki odcień indygo wiąże tło z marką
- `#6165B2` zostaje kolorem akcji: przyciski, linki, aktywna nawigacja
- statusy dostają własne barwy, żeby nie zlewać się z marką: barwinek `#AEADFF`
  (nowe), bursztyn `#E8B04B` (w trakcie), zieleń `#4FC98C` (rozwiązane)
- `#CD2122` idzie na wysoki priorytet, nie na markę; czerwień w interfejsie
  powinna znaczyć "pilne", a nie "nasz logotyp"

### Status kontra priorytet

Pierwsza wersja dawała priorytetom "wysoki" czerwień, a "średniemu" i "niskiemu"
ten sam przygaszony szary, więc dwa z trzech wyglądały identycznie. Zamiast
dokładać trzeci przypadkowy kolor rozdzieliłem oba wymiary:

- **status to kategoria**: trzy stany bez porządku, więc trzy różne barwy
  (`#AEADFF`, `#E8B04B`, `#4FC98C`), pokazywane jako wypełniony badge
- **priorytet to skala**: rośnie, więc jedna rodzina z rosnącym natężeniem
  (`#7E7C99`, `#E0844F`, `#E8484A`) plus pionowa kreska, która robi się wyższa

Dzięki temu nie konkurują ze sobą nawet w tym samym wierszu, a priorytet czyta
się również bez rozróżniania kolorów, co ratuje daltonistów.

### Kontrast sprawdzony liczbowo

Napisałem skrypt liczący kontrast wg WCAG 2.1 zamiast oceniać na oko. Wszystkie
pary tekst/tło przechodzą 4.5:1, najciaśniejsza to `#E8484A` na `#121120`
(4.84:1). Przy okazji wyszło, że `#262541` daje tylko 1.26:1, więc obramowania
rozjechały się na dwa tokeny:

- `--border` `#262541` na separatory wierszy i krawędzie kart, czyli dekorację,
  której WCAG nie obejmuje
- `--border-field` `#5D5A96` na pola formularza i kontrolki, gdzie obowiązuje
  próg 3:1 z 1.4.11 (wychodzi 3.22:1 na tle strony)

## 6. Fonty: Cabinet Grotesk (nagłówki) + Switzer (treść)

Oba z [Fontshare](https://www.fontshare.com), darmowe również komercyjnie,
hostowane u nas przez `next/font/local`, więc zero requestów do zewnętrznego
CDN-a w produkcji.

**Dlaczego nie to, co jest na ich stronie:** Space Grotesk i Poppins. Space
Grotesk jest w porządku, ale Poppins przy nim wygląda blado i dokłada drugi plik
bez zysku.

**Dlaczego nie Google Fonts w ogóle:** kroje typu Inter czy Geist są dziś
domyślnym wyborem wszystkiego i od razu to widać.

**Dlaczego nie płatne:** repo ma być publiczne, a licencje komercyjne (PP Neue
Montreal, Söhne, ABC Diatype, Aeonik) zabraniają wrzucania plików fontu do
publicznego repozytorium. Dałoby się to obejść prywatnym CDN-em albo
wstrzykiwaniem przy buildzie, ale to komplikacja w deployu bez realnego zysku.

**Sprawdzone przed wyborem:** pobrałem pliki TTF i przeczytałem tablicę `cmap`
skryptem, zamiast wierzyć opisowi na stronie. Oba kroje mają komplet polskich
znaków (ąćęłńóśźż plus wersaliki). To nie jest oczywiste, bo sporo ładnych
zachodnich krojów kończy się na Latin Basic i "Zgłoszenie" rozjeżdża się na
zastępczym glifie.

**Odrzucone:** Switzer solo (bezbłędny, ale mniej wyrazisty), General Sans
(najbliżej klimatu strony, przegrał z kontrastem duetu), Satoshi (dobry, ale
ostatnio jest w co drugim portfolio).

## 7. Wersje: Next 16, Prisma 7, Zod 4, Auth.js v5 beta

Przed pisaniem planu sprawdziłem realne wersje w rejestrze npm zamiast opierać
się na tym, co pamiętam. Wyszły trzy rozjazdy z pierwotnymi założeniami.

**Next.js 16 zamiast 15.** 16.2.12 jest stabilny. Używamy zwykłego App Routera
bez egzotycznych API, więc ryzyko jest minimalne, a projekt nie wygląda na
wersję wstecz.

**Auth.js v5 mimo bety.** Tag `latest` dla `next-auth` to wciąż v4, która nie
obsługuje App Routera tak, jak potrzebujemy. v5 siedzi w becie od ponad dwóch
lat, ale to de facto standard i połowa ekosystemu jest na niej produkcyjnie.
`next-auth@beta` deklaruje wsparcie dla Next 16 w peer dependencies, sprawdzone.
Adapter Prismy odpada i tak, bo trzymamy sesje w JWT, a przy okazji dobrze się
składa: `@auth/prisma-adapter` ma peer dependency ograniczone do Prismy 6.

**Prisma 7 ma inny generator.** `prisma-client-js` jest oznaczony jako
przestarzały, nowy generator to `prisma-client` z obowiązkowym `output`. Klient
ląduje w `src/generated/prisma` i importuje się stamtąd, nie z `@prisma/client`.
Kod pisany z pamięci wyłożyłby się na pierwszym imporcie.

**Zod 4 zmienił obsługę błędów.** `err.flatten()` ustąpiło miejsca
`z.flattenError(err)`, które zwraca ten sam kształt `{ formErrors, fieldErrors }`.
Spec został poprawiony.

## 8. Architektura

- **Server Actions zamiast API routes.** Nie ma tu nic, co wymaga endpointu.
  Kolejność w każdej mutacji jest ta sama: walidacja Zod, sprawdzenie uprawnień,
  operacja na bazie.
- **Auth.js v5, Credentials + JWT.** Credentials Provider w v5 i tak wymusza
  strategię JWT, więc adapter Prismy do sesji byłby martwym kodem. Rola siedzi
  w tokenie, dzięki czemu `auth()` w komponencie serwerowym zwraca ją bez
  dodatkowego zapytania do bazy.
- **Uprawnienia tylko w `src/lib/permissions.ts`.** Czyste funkcje bez
  zależności od bazy i requestu, więc testy Vitest to zwykłe wywołania bez
  mockowania. Nigdzie indziej nie ma porównania roli.
- **Middleware to nie autoryzacja.** Pilnuje tylko tego, czy jest sesja na
  `/zgloszenia/*`. O widoczności konkretnego zgłoszenia decyduje
  `canViewTicket` w stronie i akcji, bo middleware nie widzi danych.
- **`Ticket.number` osobno od `id`.** `id` to cuid, brzydki w interfejsie
  i w URL-u. `number` daje czytelne `#0142`.
- **Zmiana statusu w transakcji.** Update `Ticket` plus insert do
  `StatusChange`, albo jedno i drugie, albo nic. Historia bez luk to cały sens
  tej tabeli.
- **Rejestracja tworzy wyłącznie konto USER.** Admin powstaje tylko przez seed.
  Endpoint pozwalający samemu zostać adminem to dziura, nie funkcja.
- **Jedna lista zamiast osobnego panelu admina.** `/zgloszenia` adaptuje się do
  roli. Osobna trasa `/admin` byłaby duplikatem tego samego widoku.
- **Priorytet ustawia autor przy tworzeniu i potem jest niezmienny.** Admin
  triażuje statusem. Zmiana priorytetu wymagałaby drugiej tabeli audytu albo
  świadomej niespójności, a o to nikt nie prosił.
- **`src/app/styleguide` zostaje, mimo że nic do niego nie linkuje.** To
  żywy podgląd prymitywów UI (`Button`, `Input`, `StatusBadge`, `Chip`...),
  przydatny przy dalszej pracy nad interfejsem. Nie jest martwym kodem
  w sensie "nieużywany import", tylko route'em bez wejścia z nawigacji, więc
  świadomie go nie usuwam.
