import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label: string;
  selected?: boolean;
  /** Colour of the status dot before the label. */
  dotColor?: string;
  /** Icon before the label (instead of a dot). */
  icon?: ReactNode;
  /** Small number after the label. */
  count?: number;
  /** `accent` = beige outline used for "needs attention" filters. */
  tone?: "neutral" | "accent";
};

/** Toggleable filter pill. */
export function Chip({
  label,
  selected = false,
  dotColor,
  icon,
  count,
  tone = "neutral",
  className,
  ...props
}: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "flex h-[34px] shrink-0 items-center gap-2 rounded-full border px-3.5 font-text text-[13px] leading-none font-semibold whitespace-nowrap transition-colors focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-beige",
        tone === "accent"
          ? cn(
              "border-beige/35 text-beige",
              selected ? "bg-beige/15" : "hover:bg-beige/8",
            )
          : selected
            ? "border-line-soft bg-control text-fg"
            : "border-line-soft text-fg-2 hover:bg-tint/5 hover:text-fg",
        className,
      )}
      {...props}
    >
      {icon}
      {dotColor && (
        <span
          className="size-[7px] shrink-0 rounded-full"
          style={{ backgroundColor: dotColor }}
        />
      )}
      {label}
      {count !== undefined && (
        <span className="text-xs font-normal text-fg-3">{count}</span>
      )}
    </button>
  );
}
