import type { SelectHTMLAttributes } from "react";

// Te same klasy co Input: pole formularza, kontrast obramowania liczony
// wobec tokenu field, nie line (patrz komentarz w Input.tsx).
export function Select({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-lg border border-field bg-bg px-3.5 py-2.5 text-sm text-fg ${className}`}
    />
  );
}
