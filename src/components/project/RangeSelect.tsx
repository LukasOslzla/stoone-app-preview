"use client";

import { useState } from "react";
import { CalendarBlankIcon, CaretDownIcon } from "@phosphor-icons/react";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { cn } from "@/lib/cn";

export const dateRanges = [
  { id: "7d", label: "Posledních 7 dní" },
  { id: "30d", label: "Posledních 30 dní" },
  { id: "90d", label: "Posledních 90 dní" },
  { id: "year", label: "Tento rok" },
  { id: "all", label: "Od začátku prodeje" },
];

type RangeSelectProps = {
  /** Id from `dateRanges`. */
  defaultValue?: string;
  onChange?: (id: string) => void;
};

/**
 * Period the dashboard numbers cover. Mock: the choice is remembered here,
 * the dashboard data does not react to it yet.
 */
export function RangeSelect({
  defaultValue = "30d",
  onChange,
}: RangeSelectProps) {
  const [value, setValue] = useState(defaultValue);
  const current =
    dateRanges.find((range) => range.id === value) ?? dateRanges[1];

  return (
    <DropdownMenu
      label="Období"
      align="end"
      width="w-[220px]"
      groups={[
        {
          items: dateRanges.map((range) => ({
            id: range.id,
            label: range.label,
            selected: range.id === value,
            onSelect: () => {
              setValue(range.id);
              onChange?.(range.id);
            },
          })),
        },
      ]}
      trigger={(props, open) => (
        <button
          type="button"
          {...props}
          className={cn(
            "flex h-9 items-center gap-2 rounded-full border px-3.5 transition-colors hover:bg-tint/5 focus-visible:outline-[1.5px] focus-visible:outline-beige",
            open ? "border-beige" : "border-line",
          )}
        >
          <CalendarBlankIcon weight="fill" className="size-[15px] text-fg-2" />
          <span className="font-text text-[13px] leading-[1.4] font-semibold whitespace-nowrap text-fg">
            {current.label}
          </span>
          <CaretDownIcon
            weight="fill"
            className={cn(
              "size-3.5 text-fg-3 transition-transform",
              open && "rotate-180",
            )}
          />
        </button>
      )}
    />
  );
}
