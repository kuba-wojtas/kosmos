// returnTo pochodzi z parametru adresu, wiec moze wskazywac na obcy host.
// Sprawdzenie samego prefiksu "/" nie wystarcza: "/\evil.example" normalizuje
// sie w parserze URL do "//evil.example" (adres protocol-relative), omijajac
// prosty test stringowy startsWith("//"). Jedyny niezawodny sposob to
// sparsowac adres i porownac cale originy, nie fragmenty stringa.
export function resolveSafeRedirect(raw: string | null | undefined, origin: string): string {
  const fallback = "/zgloszenia";
  if (!raw) return fallback;

  try {
    const url = new URL(raw, origin);
    if (url.origin !== origin) return fallback;
    // Fragment nie jest wysylany do serwera, wiec pomijamy go w celu
    // przekierowania: zostaje sama sciezka i query string.
    return url.pathname + url.search;
  } catch {
    return fallback;
  }
}
