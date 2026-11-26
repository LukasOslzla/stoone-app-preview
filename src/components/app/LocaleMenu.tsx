"use client";

import { useState } from "react";
import { GlobeIcon } from "@phosphor-icons/react";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { cn } from "@/lib/cn";
import { languageOptions } from "@/lib/user";

/**
 * Language of the administration. Mock: only Czech texts exist, so the other
 * languages are listed but cannot be chosen yet.
 */
export function LocaleMenu() {
  const [value] = useState("cs");

  return (
    <DropdownMenu
      label="Jazyk administrace"
      align="end"
      width="w-[200px]"
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
          aria-label="Jazyk"
          title="Jazyk"
          {...props}
          className={cn(
            "flex size-10 items-center justify-center rounded-xl transition-colors hover:bg-white/5 hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-beige",
            open ? "bg-white/5 text-fg" : "text-fg-2",
          )}
        >
          <GlobeIcon weight="fill" className="size-5" />
        </button>
      )}
    />
  );
}
