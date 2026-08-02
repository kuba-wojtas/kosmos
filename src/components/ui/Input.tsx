import type { InputHTMLAttributes } from "react";

// Obramowanie z tokenu field, nie line: kontrolki musza miec kontrast 3:1,
// separatory wierszy nie musza.
export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-field bg-bg px-3.5 py-2.5 text-sm text-fg placeholder:text-muted ${className}`}
    />
  );
}
