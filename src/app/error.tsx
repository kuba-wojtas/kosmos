"use client";

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
        <button
          onClick={reset}
          className="mt-6 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
        >
          Spróbuj ponownie
        </button>
      </div>
    </main>
  );
}
