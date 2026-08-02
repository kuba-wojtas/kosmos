// Akcje nigdy nie rzucaja w strone UI. Formularz ma sie wywrocic, nie aplikacja.
export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };
