import { StatusBadge } from "@/components/ui/StatusBadge";

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
        <StatusBadge status="NEW" />
        <StatusBadge status="IN_PROGRESS" />
        <StatusBadge status="RESOLVED" />
      </div>
    </main>
  );
}
