import type { ReactNode } from "react";
import Link from "next/link";

type Props = {
  href?: string;
  active?: boolean;
  children: ReactNode;
};

const stateClasses = {
  inactive: "border-line bg-surface text-muted",
  active: "border-brand bg-[--color-status-new-bg] text-fg",
};

export function Chip({ href, active = false, children }: Props) {
  const className = `rounded-full border px-3 py-1.5 text-xs ${active ? stateClasses.active : stateClasses.inactive}`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return <span className={className}>{children}</span>;
}
