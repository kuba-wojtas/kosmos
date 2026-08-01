export default function Home() {
  return (
    <main className="mx-auto max-w-2xl p-10">
      <h1 className="font-display text-4xl font-extrabold tracking-tight">
        Zgłoszenia
      </h1>
      <p className="mt-3 text-muted">
        Zażółć gęślą jaźń. Sprawdzam ogonki: ĄĆĘŁŃÓŚŹŻ ąćęłńóśźż.
      </p>
      <div className="mt-6 flex gap-3">
        <span className="rounded-md bg-status-new-bg px-2.5 py-1 text-xs font-semibold text-status-new">
          Nowe
        </span>
        <span className="rounded-md bg-status-progress-bg px-2.5 py-1 text-xs font-semibold text-status-progress">
          W trakcie
        </span>
        <span className="rounded-md bg-status-resolved-bg px-2.5 py-1 text-xs font-semibold text-status-resolved">
          Rozwiązane
        </span>
      </div>
    </main>
  );
}
