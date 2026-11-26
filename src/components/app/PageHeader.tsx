import type { ReactNode } from "react";
import { MoonIcon, SunIcon } from "@phosphor-icons/react/ssr";
import { LocaleMenu } from "@/components/app/LocaleMenu";
import { cn } from "@/lib/cn";

type PageHeaderProps = {
  /** Plain page title. Use `leading` instead for custom content. */
  title?: string;
  /** Replaces the title (e.g. the project switcher). */
  leading?: ReactNode;
  /** Page-specific controls rendered before the language/theme buttons. */
  actions?: ReactNode;
  /** `compact` = 20px vertical padding (project pages), default 24px. */
  size?: "default" | "compact";
};

export function PageHeader({
  title,
  leading,
  actions,
  size = "default",
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between gap-4 border-b border-line-soft px-8",
        size === "compact" ? "py-5" : "py-6",
      )}
    >
      {leading ?? (
        <h1 className="font-title text-[26px] leading-[1.2] font-medium tracking-[-0.3px] text-fg">
          {title}
        </h1>
      )}

      <div className="flex shrink-0 items-center gap-4">
        {actions}
        <LocaleMenu />
        <ThemeSwitcher />
      </div>
    </header>
  );
}

/** Only the dark theme is designed so far; the light option is inert. */
export function ThemeSwitcher() {
  return (
    <div
      role="group"
      aria-label="Barevný režim"
      className="flex h-9 items-center gap-0.5 rounded-full border border-line bg-inset p-[3px]"
    >
      <button
        type="button"
        aria-label="Světlý režim"
        aria-pressed={false}
        title="Světlý režim zatím není k dispozici"
        className="flex h-7 w-[34px] items-center justify-center rounded-full text-fg-3 focus-visible:outline-[1.5px] focus-visible:outline-beige"
      >
        <SunIcon weight="fill" className="size-4" />
      </button>
      <button
        type="button"
        aria-label="Tmavý režim"
        aria-pressed
        className="flex h-7 w-[34px] items-center justify-center rounded-full bg-beige text-ink focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-beige"
      >
        <MoonIcon weight="fill" className="size-4" />
      </button>
    </div>
  );
}
