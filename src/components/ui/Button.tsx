import type { ButtonHTMLAttributes } from "react";
import { SpinnerIcon } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/cn";

export const buttonBase =
  "flex h-[52px] w-full items-center justify-center gap-2 rounded-full font-text text-[15px] leading-none font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg";

export const buttonVariants = {
  primary: "bg-beige text-ink hover:bg-copper active:bg-copper-deep",
  outline:
    "border border-line bg-transparent text-fg hover:bg-white/5 active:bg-white/10",
} as const;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof buttonVariants;
  loading?: boolean;
  /** Label shown next to the spinner while `loading`. */
  loadingLabel?: string;
};

export function Button({
  variant = "primary",
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
