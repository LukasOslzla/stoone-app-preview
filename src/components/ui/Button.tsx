import type { ButtonHTMLAttributes } from "react";
import { SpinnerIcon } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/cn";

export const buttonBase =
  "flex items-center justify-center gap-2 rounded-full font-text leading-none font-bold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg";

export const buttonSizes = {
  /** Full-width 52px button (sign-in screens). */
  lg: "h-[52px] w-full text-[15px]",
  /** Compact 40px button sized by its label (page actions). */
  md: "h-10 px-5 text-sm",
  /** 44px main action of a list page ("Přidat byty"). */
  action: "h-11 px-5 text-sm",
} as const;

export const buttonVariants = {
  primary: "bg-beige text-ink hover:bg-copper active:bg-copper-deep",
  outline:
    "border border-line bg-transparent text-fg hover:bg-white/5 active:bg-white/10",
  /** Destructive confirmation ("Smazat soubor"). */
  danger: "bg-red text-white hover:brightness-110 active:brightness-95",
} as const;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  loading?: boolean;
  /** Label shown next to the spinner while `loading`. */
  loadingLabel?: string;
};

export function Button({
  variant = "primary",
  size = "lg",
  loading = false,
  loadingLabel,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        buttonBase,
        buttonSizes[size],
        buttonVariants[variant],
        loading && "pointer-events-none gap-2.5 opacity-85",
        disabled && !loading && "pointer-events-none opacity-35",
        className,
      )}
      {...props}
    >
      {loading && (
        <SpinnerIcon weight="fill" className="size-[18px] animate-spin" />
      )}
      {loading && loadingLabel ? loadingLabel : children}
    </button>
  );
}
