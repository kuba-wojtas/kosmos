// Kazde wejscie na liste to dwa zapytania do bazy, wiec bez tego ekranu
// interfejs stoi bez ruchu az do odpowiedzi serwera i klikniecie wyglada
// na zignorowane. Szkielet pojawia sie natychmiast.
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-56 rounded bg-raised" />
          <div className="h-4 w-80 rounded bg-raised" />
        </div>
        <div className="h-10 w-40 rounded-lg bg-raised" />
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {[64, 88, 96, 112].map((width) => (
          <div key={width} className="h-7 rounded-full bg-raised" style={{ width }} />
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <div className="h-10 border-b border-line bg-raised" />
        {Array.from({ length: 6 }).map((_, row) => (
          <div key={row} className="flex items-center gap-4 border-b border-line px-4 py-3 last:border-b-0">
            <div className="h-4 w-12 rounded bg-raised" />
            <div className="h-4 flex-1 rounded bg-raised" />
            <div className="hidden h-4 w-20 rounded bg-raised md:block" />
            <div className="h-6 w-20 rounded-md bg-raised" />
            <div className="hidden h-4 w-20 rounded bg-raised md:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
