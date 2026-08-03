"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/FieldError";
import { Input } from "@/components/ui/Input";
import { resolveSafeRedirect } from "@/lib/safe-redirect";
import { loginSchema } from "@/lib/validation";
import type { z } from "zod";

type LoginData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const rawReturnTo = useSearchParams().get("returnTo");
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  async function submit(data: LoginData) {
    setFormError(null);
    const result = await signIn("credentials", { ...data, redirect: false });

    if (result?.error) {
      // Zawsze ten sam komunikat, niezaleznie od tego czy zle bylo haslo czy
      // konto nie istnieje. Inaczej formularz sluzylby do sprawdzania, kto ma konto.
      setFormError("Nieprawidłowy e-mail lub hasło.");
      return;
    }

    // Origin pobrany dopiero tutaj, nie na gorze komponentu: "window" nie
    // istnieje przy renderze serwerowym, a ta funkcja uruchamia sie wylacznie
    // po interakcji uzytkownika w przegladarce.
    router.push(resolveSafeRedirect(rawReturnTo, window.location.origin));
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <label className="mb-1.5 block text-xs font-semibold text-muted" htmlFor="email">
        E-mail
      </label>
      <Input id="email" type="email" autoComplete="email" {...register("email")} />
      <FieldError>{errors.email?.message}</FieldError>

      <label className="mb-1.5 mt-4 block text-xs font-semibold text-muted" htmlFor="password">
        Hasło
      </label>
      <Input id="password" type="password" autoComplete="current-password" {...register("password")} />
      <FieldError>{errors.password?.message}</FieldError>

      {formError && (
        <p className="mt-4 rounded-lg border border-danger-line bg-danger-bg px-3 py-2.5 text-sm text-danger">
          {formError}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="mt-5 w-full">
        {isSubmitting ? "Logowanie..." : "Zaloguj"}
      </Button>
    </form>
  );
}
