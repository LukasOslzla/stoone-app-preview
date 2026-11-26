"use client";

import { useState } from "react";
import { CaretDownIcon, GlobeIcon } from "@phosphor-icons/react";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { cn } from "@/lib/cn";
import { languageOptions } from "@/lib/user";

/**
 * "Jazyk" row at the bottom of the sidebar. Mock: only Czech texts exist, so
 * the other languages are listed but cannot be chosen yet.
 */
export function LanguageMenu({ collapsed = false }: { collapsed?: boolean }) {
  const [value] = useState("cs");
  const current = languageOptions.find((item) => item.value === value);

  return (
    <DropdownMenu
      label="Jazyk administrace"
      side="top"
      width={collapsed ? "w-[200px]" : "w-full"}
      groups={[
        {
          label: "Jazyk administrace",
          items: languageOptions.map((language) => ({
            id: language.value,
            label: language.label,
            selected: language.value === value,
            disabled: language.value !== value,
            note: language.value !== value ? "připravujeme" : undefined,
          })),
        },
      ]}
      trigger={(props, open) => (
        <button
          type="button"
          aria-label={collapsed ? "Jazyk" : undefined}
          title={collapsed ? "Jazyk" : undefined}
          {...props}
          className={cn(
            "flex shrink-0 items-center transition-colors hover:bg-tint/5 focus-visible:outline-[1.5px] focus-visible:outline-beige",
            collapsed
              ? "size-12 justify-center rounded-[14px]"
              : "h-12 w-full gap-3.5 rounded-[14px] px-3.5 text-left",
            open && "bg-tint/5",
          )}
        >
          <GlobeIcon
            weight="fill"
            className={cn(
              "shrink-0 text-fg-3",
              collapsed ? "size-[22px]" : "size-5",
            )}
          />
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1 truncate font-text text-[15px] leading-[1.4] font-semibold text-fg-2">
                Jazyk
              </span>
              <span className="font-text text-[13px] leading-[1.4] text-fg-3">
                {current?.label}
              </span>
              <CaretDownIcon
                weight="fill"
                className={cn(
                  "size-3 shrink-0 text-fg-3 transition-transform",
                  open && "rotate-180",
                )}
              />
            </>
          )}
        </button>
      )}
    />
  );
}
