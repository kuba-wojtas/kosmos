"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/FieldError";
import { Input } from "@/components/ui/Input";
import { registerUser } from "@/actions/auth";
import { registerSchema } from "@/lib/validation";
import type { z } from "zod";

type RegisterData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({ resolver: zodResolver(registerSchema) });

  async function submit(data: RegisterData) {
    setFormError(null);
    const result = await registerUser(data);

    if (!result.ok) {
      // Bledy walidacji pol trafiaja pod konkretne pole, reszta (np. blad
      // infrastruktury) idzie do banera, bo nie ma pola, przy ktorym ja pokazac.
      const fieldEntries = Object.entries(result.fieldErrors ?? {});
      if (fieldEntries.length > 0) {
        for (const [field, messages] of fieldEntries) {
          setError(field as keyof RegisterData, { type: "server", message: messages[0] });
        }
      } else {
        setFormError(result.error);
      }
      return;
    }

    await signIn("credentials", { email: data.email, password: data.password, redirect: false });
    router.push("/zgloszenia");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <label className="mb-1.5 block text-xs font-semibold text-muted" htmlFor="name">
        Imię i nazwisko
      </label>
      <Input id="name" type="text" autoComplete="name" {...register("name")} />
      <FieldError>{errors.name?.message}</FieldError>

      <label className="mb-1.5 mt-4 block text-xs font-semibold text-muted" htmlFor="email">
        E-mail
      </label>
      <Input id="email" type="email" autoComplete="email" {...register("email")} />
      <FieldError>{errors.email?.message}</FieldError>

      <label className="mb-1.5 mt-4 block text-xs font-semibold text-muted" htmlFor="password">
        Hasło
      </label>
      <Input id="password" type="password" autoComplete="new-password" {...register("password")} />
      <FieldError>{errors.password?.message}</FieldError>

      {formError && (
        <p className="mt-4 rounded-lg border border-danger-line bg-danger-bg px-3 py-2.5 text-sm text-danger">
          {formError}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="mt-5 w-full">
        {isSubmitting ? "Tworzenie konta..." : "Zarejestruj się"}
      </Button>
    </form>
  );
}
