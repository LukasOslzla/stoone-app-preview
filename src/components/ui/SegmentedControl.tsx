"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SegmentedControlProps<T extends string> = {
  /** With `icon` the label is only read by screen readers and shown as a tooltip. */
  options: { value: T; label: string; icon?: ReactNode; count?: number }[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name of the group. */
  label: string;
  /**
   * `pill` = fully rounded, for icon-only switches (grid / table);
   * `block` = full-width form control with icon + label (theme picker).
   */
  shape?: "rounded" | "pill" | "block";
  className?: string;
};

/** Small pill switch between a few mutually exclusive views. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  shape = "rounded",
  className,
}: SegmentedControlProps<T>) {
  const pill = shape === "pill";
  const block = shape === "block";

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "flex border border-line-soft bg-inset",
        block ? "w-full gap-1 rounded-[14px] p-1" : "gap-0.5 p-[3px]",
        pill && "rounded-full",
        shape === "rounded" && "rounded-[10px]",
        className,
      )}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            aria-label={option.icon && !block ? option.label : undefined}
            title={option.icon && !block ? option.label : undefined}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex items-center justify-center font-text text-[13px] leading-none font-semibold whitespace-nowrap transition-colors focus-visible:outline-[1.5px] focus-visible:outline-beige",
              pill && "h-8 rounded-full",
              pill && (option.icon ? "w-9" : "gap-2 px-3.5"),
              block && "h-10 min-w-0 flex-1 gap-1.5 rounded-[10px] px-1",
              shape === "rounded" && "h-7 rounded-lg px-3",
              block
                ? selected
                  ? "bg-beige/15 text-fg ring-1 ring-beige/35 ring-inset [&_svg]:text-beige"
                  : "text-fg-2 hover:text-fg [&_svg]:text-fg-3"
                : selected
                  ? cn(
                      "bg-control text-fg",
                      !pill && "ring-1 ring-line-soft ring-inset",
                    )
                  : cn(pill ? "text-fg-3" : "text-fg-2", "hover:text-fg"),
            )}
          >
            {block ? (
              <>
                {option.icon}
                <span className="truncate">{option.label}</span>
              </>
            ) : (
              (option.icon ?? option.label)
            )}
            {option.count !== undefined && (
              <span className="text-xs text-fg-3">{option.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
