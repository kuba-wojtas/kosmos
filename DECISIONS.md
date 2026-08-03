# Dziennik decyzji

Krótki zapis tego, co i dlaczego zostało wybrane. Jedna decyzja to jeden wpis.
Jeśli coś odrzuciłem, notuję powód, żeby w przyszłości nie wracać do tego samego
pomysłu i nie odkrywać problemu drugi raz.

---

## 1. Hosting i baza: Vercel + Neon

Neon daje darmowego Postgresa, Vercel deployuje Next.js bez konfiguracji.

**Odrzucone:** Supabase (dokłada warstwę auth i storage, których i tak nie
używamy), VPS z Dockerem (najlepiej trafiałby w projekt, ale to zadanie
rekrutacyjne - przerost formy w tym przypadku).

## 2. Zakres rzeczy zrobionych ponad wymagania

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


## 4. Paleta: wyciągnięta ze szkolakosmos.pl

Zamiast samemu tworzyć identyfikacje od nowa i dobierać kolory, zescrapowałem CSS waszej strony (`zn_dynamic.css`, plik z ustawieniami motywu). Kolor marki to `#6165B2`,
indygo. Do tego `#4E518E` na hover, `#AEADFF` jasny, `#CCCEE9` i `#B9BBD1` fioletowe/szarości.

Aplikacja idzie w dark mode, więc paleta wymagała przesunięcia:

- tło `#08070C` zamiast ich `#040201`, bo czysta czerń męczy oczy i zabija
  cienie;
- `#6165B2` zostaje kolorem akcji: przyciski, linki, aktywna nawigacja
- statusy dostają własne barwy, żeby nie zlewać się z marką: `#AEADFF`, `#E8B04B` (w trakcie), `#4FC98C` (rozwiązane)
- `#CD2122` idzie na wysoki priorytet

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
hostowane przez `next/font/local`, więc zero requestów do zewnętrznego
CDN-a w produkcji.

**Dlaczego nie to, co jest stronie:** Space Grotesk i Poppins. Space
Grotesk jest w porządku, ale Poppins przy nim wygląda srednio i dokłada niepotrzebnie drugi plik.

**Dlaczego nie Google Fonts w ogóle:** kroje typu Inter czy Geist są dziś
domyślnym wyborem wszystkiego i od razu to widać.

**Dlaczego nie płatne:** repo ma być publiczne, a licencje komercyjne (PP Neue
Montreal, Söhne, ABC Diatype, Aeonik) zabraniają wrzucania plików fontu do
publicznego repozytorium. Dałoby się to obejść prywatnym CDN-em albo
wstrzykiwaniem przy buildzie, ale to zbędna komplikacja w deployu.

**Sprawdzone przed wyborem:** pobrałem pliki TTF i sprawdziłem tablicę `cmap`. Oba kroje mają komplet polskich znaków (ąćęłńóśźż plus wersaliki). To nie jest oczywiste, bo sporo ładnych zachodnich krojów kończy się na Latin Basic.

**Odrzucone:** Switzer solo (super, ale mniej wyrazisty), General Sans
(najbliżej klimatu strony, ale gorzej wypadł), Satoshi (dobry, ale ostatnio często używany - nudny).

## 7. Wersje: Next 16, Prisma 7, Zod 4, Auth.js v5 beta

**Next.js 16 zamiast 15.** 16.2.12 jest stabilny. Używamy zwykłego App Routera
bez egzotycznych API, więc ryzyko jest minimalne.

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

## 12. Middleware nie moze importowac pelnej konfiguracji Auth.js

Middleware w Next.js dziala w Edge Runtime, ktore nie ma dostepu do modulow
Node'a. Import `@/lib/auth` wciaga za soba Prisme i bcrypta, wiec brama sesji
zamiast przekierowywac na logowanie zwracala 500. Konfiguracja jest rozdzielona
na dwa pliki: `auth.config.ts` trzyma czesc bezpieczna dla Edge, czyli callbacki
`jwt` i `session`, pusta tablice providerow i wylacznie import typu, a `auth.ts`
dokłada Credentials z bcryptem i zapytaniem do bazy. Middleware importuje tylko
ten pierwszy i weryfikuje podpisany token, co nie wymaga ani bazy, ani hashowania.
Sprawdzone grepem po zbudowanym bundlu edge: nie ma w nim ani Prismy, ani bcrypta.

## 13. Walidacja `returnTo`: parsowanie adresu, nie dopasowanie wzorca

Po zalogowaniu wracamy tam, skad uzytkownik przyszedl, a ta sciezka siedzi
w parametrze `returnTo`. Podanie jej wprost do `router.push` otwiera klasyczna
dziure: `?returnTo=https://evil.example` przenosi swiezo zalogowana osobe na
obca strone.

Pierwsza poprawka sprawdzala prefiks (`zaczyna sie od "/" i nie od "//"`) i byla
za slaba. Zapis z backslashem po ukosniku parser URL-i normalizuje, wiec przechodzil przez to sito i konczyl na obcym hoscie.

`resolveSafeRedirect` w `src/lib/safe-redirect.ts` parsuje wartosc przez
`new URL` wzgledem biezacego originu, porownuje origin i zwraca wylacznie
`pathname + search`, a przy jakimkolwiek odrzuceniu `/zgloszenia`. Porownanie originu zamiast ksztaltu tekstu zamyka cala klase obejsc naraz:
backslashe, wielokrotne ukosniki, znaki sterujace, `userinfo` w rodzaju
`https://kosmos.app@evil.example`, hosty-podszywki i schematy o pustym originie.
Kazdy z tych wektorow ma swoj test.