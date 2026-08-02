import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FieldError } from "@/components/ui/FieldError";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityMark } from "@/components/ui/PriorityMark";
import { Chip } from "@/components/ui/Chip";

export default function StyleguidePage() {
  return (
    <main className="mx-auto max-w-3xl p-10">
      <h1 className="font-display text-4xl font-extrabold tracking-tight">Style guide</h1>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold">Przyciski</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button variant="primary">Zapisz</Button>
          <Button variant="ghost">Anuluj</Button>
          <Button variant="primary" disabled>
            Zapisz
          </Button>
          <Button variant="ghost" disabled>
            Anuluj
          </Button>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold">Pola formularza</h2>
        <div className="mt-4 flex max-w-sm flex-col gap-4">
          <Input placeholder="Tytuł zgłoszenia" />
          <Input defaultValue="Nie loguje się do systemu" />
          <Textarea placeholder="Opis problemu" />
          <Textarea defaultValue="Po wpisaniu hasła strona się przeładowuje i wraca do logowania." />
          <div>
            <Input placeholder="Pole z błędem" />
            <FieldError>To pole jest wymagane.</FieldError>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold">Status</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <StatusBadge status="NEW" />
          <StatusBadge status="IN_PROGRESS" />
          <StatusBadge status="RESOLVED" />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold">Priorytet</h2>
        <div className="mt-4 flex flex-wrap gap-4">
          <PriorityMark priority="LOW" />
          <PriorityMark priority="MEDIUM" />
          <PriorityMark priority="HIGH" />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold">Chip</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Chip>Wszystkie</Chip>
          <Chip active>Nowe</Chip>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold">Typografia</h2>
        <div className="mt-4 flex flex-col gap-3">
          <p className="font-display text-4xl font-extrabold">Nagłówek 4xl</p>
          <p className="font-display text-2xl font-bold">Nagłówek 2xl</p>
          <p className="font-display text-xl font-bold">Nagłówek xl</p>
          <p className="font-sans text-base">Tekst podstawowy w rozmiarze base.</p>
          <p className="font-sans text-sm text-muted">Tekst pomocniczy w rozmiarze sm.</p>
          <p className="font-sans text-xs text-muted">Tekst drobny w rozmiarze xs.</p>
        </div>
      </section>
    </main>
  );
}
