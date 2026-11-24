"use client";

import { cn } from "@/lib/cn";

type SegmentedControlProps<T extends string> = {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name of the group. */
  label: string;
  className?: string;
};

/** Small pill switch between a few mutually exclusive views. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "flex gap-0.5 rounded-[10px] border border-line-soft bg-inset p-[3px]",
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
            onClick={() => onChange(option.value)}
            className={cn(
              "flex h-7 items-center rounded-lg px-3 font-text text-[13px] leading-none font-semibold whitespace-nowrap transition-colors focus-visible:outline-[1.5px] focus-visible:outline-beige",
              selected
                ? "bg-control text-fg ring-1 ring-line-soft ring-inset"
                : "text-fg-2 hover:text-fg",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
