import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import Link from "next/link";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: undefined;
  variant?: "primary" | "ghost";
};

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  variant?: "primary" | "ghost";
};

type Props = ButtonProps | LinkProps;

const variants = {
  primary: "bg-brand text-white hover:bg-brand-hover",
  ghost: "border border-field text-fg hover:bg-raised",
};

const styleFor = (variant: "primary" | "ghost", className: string) =>
  `rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`;

// Z href renderuje next/link, bez href zwykly przycisk: te same klasy w obu
// wariantach, zeby link "Nowe zgloszenie" i przycisk "Zapisz" wygladaly identycznie.
// Zwezenie idzie po calym obiekcie props, bo po destrukturyzacji href przestaje
// dyskryminowac unie i TypeScript nie wie, ktora galaz wybrac.
export function Button(props: Props) {
  if (props.href !== undefined) {
    const { href, variant = "primary", className = "", ...rest } = props;
    return <Link href={href} className={styleFor(variant, className)} {...rest} />;
  }

  const { variant = "primary", className = "", ...rest } = props;
  return <button {...rest} className={styleFor(variant, className)} />;
}
