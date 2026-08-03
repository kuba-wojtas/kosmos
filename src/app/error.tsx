"use client";

import { Button } from "@/components/ui/Button";

// Trescia bledu celowo nie pokazujemy: komunikaty wyjatkow potrafia zawierac
// fragmenty zapytan i nazwy kolumn.
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto grid min-h-screen max-w-md place-items-center p-6 text-center">
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">
          Coś poszło nie tak
        </h1>
        <p className="mt-3 text-muted">
          Nie udało się wczytać tej strony. Spróbuj jeszcze raz.
        </p>
        <Button onClick={reset} className="mt-6">
          Spróbuj ponownie
        </Button>
      </div>
    </main>
  );
}
