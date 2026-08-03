import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type Props = {
  href?: string;
  active?: boolean;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

const stateClasses = {
  inactive: "border-line bg-surface text-muted",
  active: "border-brand bg-[--color-status-new-bg] text-fg",
};

// Bez href i bez onClick chip jest dekoracja (span). Z onClick staje sie
// przyciskiem: tego wariantu potrzebuje wybor priorytetu w formularzu, jako
// grupa radiowa sterowana klawiatura, nie linkiem.
export function Chip({ href, active = false, children, onClick, ...rest }: Props) {
  const className = `rounded-full border px-3 py-1.5 text-xs ${active ? stateClasses.active : stateClasses.inactive}`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick} {...rest}>
        {children}
      </button>
    );
  }

  return <span className={className}>{children}</span>;
}
