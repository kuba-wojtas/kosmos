"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Status } from "@/generated/prisma/client";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { updateTicketStatus } from "@/actions/tickets";
import { ALL_STATUSES, STATUS_LABELS } from "@/lib/labels";

type Props = {
  number: number;
  status: Status;
};

export function StatusChanger({ number, status }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<Status>(status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setError(null);
    setSaving(true);
    const result = await updateTicketStatus({ number, status: selected });
    setSaving(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    // Serwer jest zrodlem prawdy dla statusu i historii, wiec zamiast
    // aktualizowac stan lokalnie, odswiezamy dane z serwera.
    router.refresh();
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-muted" htmlFor="status">
        Zmień status
      </label>
      <Select
        id="status"
        value={selected}
        onChange={(event) => setSelected(event.target.value as Status)}
      >
        {ALL_STATUSES.map((value) => (
          <option key={value} value={value}>
            {STATUS_LABELS[value]}
          </option>
        ))}
      </Select>

      <Button
        type="button"
        className="mt-3 w-full"
        disabled={selected === status || saving}
        onClick={save}
      >
        {saving ? "Zapisywanie..." : "Zapisz zmianę"}
      </Button>

      {error && (
        <p className="mt-3 rounded-lg border border-danger-line bg-danger-bg px-3 py-2.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
