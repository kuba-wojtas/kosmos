# Style guide

Krótki opis tego, co jest w `src/app/globals.css`. Jedyne miejsce z wartościami
hex w projekcie - tu jest tylko ich opis i uzasadnienie. Jeśli token nie jest
wymieniony poniżej, nie istnieje i nie należy go dopisywać ad hoc w komponencie.

## Typografia

Dwa kroje, oba z Fontshare, hostowane lokalnie przez `next/font/local`
(`src/lib/fonts.ts`):

- **Cabinet Grotesk** (`font-display`, zmienna `--font-cabinet`) - nagłówki.
  Zwarty, kanciasty krój do miejsc, gdzie tekstu jest mało, a ma się wyróżniać:
  `h1`, `h2`, tytuły kart. Grubości 700 i 800.
- **Switzer** (`font-sans`, zmienna `--font-switzer`) - wszystko inne: treść,
  formularze, przyciski, etykiety. Grubości 400, 500, 600, 700. To domyślny
  krój `body`.

Skala rozmiarów to standardowa skala Tailwinda (`text-xs` przez `text-sm`,
`text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`) - nie ma
osobnych tokenów rozmiaru w `globals.css`. Nagłówek strony to `text-4xl
font-extrabold`, etykiety statusów to `text-xs font-semibold`.

## Kolory

Wszystkie tokeny są zdefiniowane w bloku `@theme` w `globals.css`. Tailwind v4
generuje z nich klasy automatycznie: `bg-{token}`, `text-{token}`,
`border-{token}` (np. `--color-brand` daje `bg-brand`, `text-brand`,
`border-brand`).

| Token | Wartość | Zastosowanie |
|---|---|---|
| `--color-bg` | `#08070c` | tło strony |
| `--color-surface` | `#121120` | tło kart, sekcji |
| `--color-raised` | `#1a1930` | tło elementów uniesionych nad surface: menu, modale, hover na wierszu |
| `--color-line` | `#262541` | separatory, krawędzie kart - dekoracja, nie kontrolka |
| `--color-field` | `#5d5a96` | obramowania pól formularzy i kontrolek interaktywnych |
| `--color-fg` | `#ececf4` | główny tekst |
| `--color-muted` | `#9a99b5` | tekst drugorzędny: opisy, metadane, placeholdery |
| `--color-brand` | `#6165b2` | kolor marki: przyciski, linki, aktywna nawigacja |
| `--color-brand-hover` | `#4e518e` | stan hover elementów w kolorze marki |
| `--color-ring` | `#aeadff` | obrys fokusu |
| `--color-status-new` | `#aeadff` | tekst badge'a statusu "nowe" |
| `--color-status-new-bg` | `#1b1a38` | tło badge'a statusu "nowe" |
| `--color-status-progress` | `#e8b04b` | tekst badge'a statusu "w trakcie" |
| `--color-status-progress-bg` | `#241e10` | tło badge'a statusu "w trakcie" |
| `--color-status-resolved` | `#4fc98c` | tekst badge'a statusu "rozwiązane" |
| `--color-status-resolved-bg` | `#10241a` | tło badge'a statusu "rozwiązane" |
| `--color-priority-low` | `#7e7c99` | kreska/etykieta priorytetu niskiego |
| `--color-priority-medium` | `#e0844f` | kreska/etykieta priorytetu średniego |
| `--color-priority-high` | `#e8484a` | kreska/etykieta priorytetu wysokiego |
| `--color-danger` | `#ff9a96` | tekst komunikatów błędu |
| `--color-danger-bg` | `#1e1113` | tło komunikatów błędu |
| `--color-danger-line` | `#4a1f22` | obramowanie komunikatów błędu |

## Status kontra priorytet

Dwa różne wymiary, dwa różne sposoby kodowania kolorem:

- **Status to kategoria.** Trzy stany bez wzajemnego porządku (nowe, w trakcie,
  rozwiązane), więc trzy niepowiązane ze sobą barwy: barwinek, bursztyn,
  zieleń. Pokazywany jako wypełniony badge - kolorowy tekst na przygaszonym
  tle tego samego odcienia.
- **Priorytet to skala.** Rośnie (niski, średni, wysoki), więc jedna rodzina
  barw o rosnącym natężeniu: stonowany szaro-fiolet, pomarańcz, czerwień.
  Priorytet nie dostaje osobnego tła jak status - czyta się go po natężeniu
  koloru i wysokości kreski, nie po przynależności do kategorii.

Rozdzielenie tych dwóch skal jest świadome: gdyby priorytet dostał te same
nasycone, niepowiązane barwy co status, oba badge w jednym wierszu
konkurowałyby o uwagę i nie byłoby jasne, które kodowanie znaczy co.

## Kontrast

Wszystkie pary tekst/tło policzone wg WCAG 2.1, próg 4.5:1 dla tekstu.
Najciaśniejsza para to `--color-priority-high` (`#e8484a`) na
`--color-surface` (`#121120`) - `4.84:1`, więc przechodzi z zapasem.

Kontrolki (obramowania pól, nie tekst) mają niższy próg, 3:1 z WCAG 1.4.11.
Stąd rozdział na dwa osobne tokeny obramowań:

- `--color-line` (`#262541`) daje tylko `1.26:1` względem tła - i tak nie jest
  używany jako kontrolka, tylko jako czysto dekoracyjny separator czy krawędź
  karty, więc WCAG go nie obejmuje.
- `--color-field` (`#5d5a96`) daje `3.22:1` na tle strony - to jedyny token
  obramowania używany na polach formularzy i innych kontrolkach, właśnie
  dlatego, że próg 3:1 przechodzi.

Wniosek praktyczny: obramowanie karty czy separator wiersza - `border-line`.
Obramowanie inputu, selecta, przycisku z obrysem - `border-field`.

## Odstępy

Wyłącznie skala Tailwinda (`p-1`, `p-2`, `p-2.5`, `p-3`... w krokach 0.25rem).
Bez wartości arbitralnych w nawiasach kwadratowych (`p-[13px]`) - jeśli żaden
krok skali nie pasuje, to znak, że trzeba dobrać najbliższy, a nie wymyślać
nowy.

## Fokus

`:focus-visible` w `globals.css` ustawia widoczny obrys na każdym elemencie:
`outline: 2px solid var(--color-ring)` z odstępem `2px`. Dotyczy to całej
aplikacji, bo reguła jest globalna, nie per-komponent. Nigdy nie wyłączać
outline'u (`outline: none`) bez podstawienia w to miejsce czegoś równie
widocznego - klawiaturowa nawigacja musi zawsze pokazywać, gdzie jest fokus.
