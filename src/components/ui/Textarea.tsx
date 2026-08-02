import type { TextareaHTMLAttributes } from "react";

// Obramowanie z tokenu field, nie line: kontrolki musza miec kontrast 3:1,
// separatory wierszy nie musza.
export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full min-h-28 rounded-lg border border-field bg-bg px-3.5 py-2.5 text-sm text-fg placeholder:text-muted ${className}`}
    />
  );
}
