"use client";

import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { setTheme, useTheme } from "@/lib/theme";

const options = [
  { value: "light", label: "Světlý režim", icon: SunIcon },
  { value: "dark", label: "Tmavý režim", icon: MoonIcon },
] as const;

/** Light / dark switch in the page header; the choice is remembered. */
export function ThemeSwitcher() {
  const { theme } = useTheme();

  return (
    <div
      role="group"
      aria-label="Barevný režim"
      className="flex h-9 items-center gap-0.5 rounded-full border border-line bg-inset p-[3px]"
    >
      {options.map(({ value, label, icon: IconComponent }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            aria-label={label}
            title={label}
            aria-pressed={active}
            onClick={() => setTheme(value)}
            className={cn(
              "flex h-7 w-[34px] items-center justify-center rounded-full transition-colors focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-beige",
              active ? "bg-beige text-ink" : "text-fg-3 hover:text-fg",
            )}
          >
            <IconComponent weight="fill" className="size-4" />
          </button>
        );
      })}
    </div>
  );
}
