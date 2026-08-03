"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { FieldError } from "@/components/ui/FieldError";
import { Input } from "@/components/ui/Input";
import { PriorityMark } from "@/components/ui/PriorityMark";
import { Textarea } from "@/components/ui/Textarea";
import { createTicket } from "@/actions/tickets";
import { ALL_PRIORITIES } from "@/lib/labels";
import { newTicketSchema, type NewTicket } from "@/lib/validation";

const TITLE_MAX_LENGTH = 120;

export function TicketForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<NewTicket>({
    resolver: zodResolver(newTicketSchema),
    defaultValues: { title: "", description: "", priority: "MEDIUM" },
  });

  const title = watch("title");
  const priority = watch("priority");

  // Roving tabindex: strzalki przesuwaja wybor i fokus razem, tak jak w
  // natywnej grupie radio. Tab wchodzi w grupe tylko na aktywnym elemencie.
  function selectPriority(index: number) {
    const value = ALL_PRIORITIES[index];
    setValue("priority", value, { shouldValidate: true, shouldDirty: true });
    document.getElementById(`priority-${value}`)?.focus();
  }

  function handlePriorityKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      selectPriority((index + 1) % ALL_PRIORITIES.length);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      selectPriority((index - 1 + ALL_PRIORITIES.length) % ALL_PRIORITIES.length);
    }
  }

  async function submit(data: NewTicket) {
    setFormError(null);
    const result = await createTicket(data);

    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          setError(field as keyof NewTicket, { message: messages[0] });
        }
      } else {
        setFormError(result.error);
      }
      return;
    }

    router.push(`/zgloszenia/${result.data.number}`);
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <label className="mb-1.5 block text-xs font-semibold text-muted" htmlFor="title">
        Tytuł
      </label>
      <Input id="title" aria-invalid={!!errors.title} {...register("title")} />
      <div className="mt-1.5 flex items-center justify-between gap-4">
        <FieldError>{errors.title?.message}</FieldError>
        <span className="whitespace-nowrap text-xs text-muted">
          {title.length} / {TITLE_MAX_LENGTH}
        </span>
      </div>

      <label className="mb-1.5 mt-4 block text-xs font-semibold text-muted" htmlFor="description">
        Opis
      </label>
      <Textarea id="description" aria-invalid={!!errors.description} {...register("description")} />
      <FieldError>{errors.description?.message}</FieldError>

      <span className="mb-1.5 mt-4 block text-xs font-semibold text-muted" id="priority-label">
        Priorytet
      </span>
      <div role="radiogroup" aria-labelledby="priority-label" className="flex flex-wrap gap-2">
        {ALL_PRIORITIES.map((value, index) => (
          <Chip
            key={value}
            id={`priority-${value}`}
            role="radio"
            aria-checked={priority === value}
            tabIndex={priority === value ? 0 : -1}
            active={priority === value}
            onClick={() => selectPriority(index)}
            onKeyDown={(event) => handlePriorityKeyDown(event, index)}
          >
            <PriorityMark priority={value} />
          </Chip>
        ))}
      </div>
      <FieldError>{errors.priority?.message}</FieldError>

      {formError && (
        <p className="mt-4 rounded-lg border border-danger-line bg-danger-bg px-3 py-2.5 text-sm text-danger">
          {formError}
        </p>
      )}

      <div className="mt-6 flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Tworzenie..." : "Utwórz zgłoszenie"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/zgloszenia")}>
          Anuluj
        </Button>
      </div>
    </form>
  );
}
