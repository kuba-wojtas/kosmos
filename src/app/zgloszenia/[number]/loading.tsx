// Szkielet w ukladzie szczegolow: opis po lewej, historia po prawej. Dzieki
// temu przejscie z listy nie przeskakuje ukladu, gdy dane juz dojda.
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="mb-3 h-4 w-40 rounded bg-raised" />

      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="h-4 w-16 rounded bg-raised" />
          <div className="h-8 w-96 max-w-full rounded bg-raised" />
          <div className="h-4 w-56 rounded bg-raised" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-4 w-20 rounded bg-raised" />
          <div className="h-6 w-24 rounded-md bg-raised" />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-[1.6fr_1fr]">
        <div className="rounded-xl border border-line bg-surface p-5">
          <div className="mb-3 h-4 w-16 rounded bg-raised" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-raised" />
            <div className="h-4 w-full rounded bg-raised" />
            <div className="h-4 w-4/5 rounded bg-raised" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-line bg-surface p-5">
            <div className="mb-3 h-4 w-28 rounded bg-raised" />
            <div className="space-y-3">
              <div className="h-4 w-40 rounded bg-raised" />
              <div className="h-4 w-44 rounded bg-raised" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
