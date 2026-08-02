import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

const warianty = {
  primary: "bg-brand text-white hover:bg-brand-hover",
  ghost: "border border-field text-fg hover:bg-raised",
};

export function Button({ variant = "primary", className = "", ...props }: Props) {
  return (
    <button
      {...props}
      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${warianty[variant]} ${className}`}
    />
  );
}
