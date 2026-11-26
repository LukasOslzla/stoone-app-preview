"use client";

import { cn } from "@/lib/cn";

type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Accessible name; pass `labelledBy` instead when a visible label exists. */
  label?: string;
  labelledBy?: string;
  /** `md` = 36 × 20px, `sm` = 32 × 18px (dense rows). */
  size?: "md" | "sm";
  disabled?: boolean;
};

/** On / off toggle for a setting that applies immediately. */
export function Switch({
  checked,
  onChange,
  label,
  labelledBy,
  size = "md",
  disabled = false,
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-labelledby={labelledBy}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex shrink-0 items-center rounded-full p-0.5 transition-colors focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-beige disabled:opacity-50",
        size === "sm" ? "h-[18px] w-8" : "h-5 w-9",
        checked ? "bg-beige" : "bg-control",
      )}
    >
      <span
        className={cn(
          "rounded-full transition-[translate,background-color]",
          size === "sm" ? "size-3.5" : "size-4",
          checked
            ? cn("bg-ink", size === "sm" ? "translate-x-3.5" : "translate-x-4")
            : "bg-fg-3",
        )}
      />
    </button>
  );
}
