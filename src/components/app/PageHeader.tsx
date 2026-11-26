import type { ReactNode } from "react";
import { ThemeSwitcher } from "@/components/app/ThemeSwitcher";
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
        <ThemeSwitcher />
      </div>
    </header>
  );
}
