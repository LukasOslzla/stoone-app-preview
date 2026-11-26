import type { ReactNode } from "react";
import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

type EmptyStateProps = {
  icon: Icon;
  title: string;
  /** One or two sentences: why it is empty and what to do next. */
  text?: ReactNode;
  /** Buttons or links under the text (usually one `Button size="md"`). */
  action?: ReactNode;
  /**
   * `neutral` = nothing here (yet) or nothing matches the filter,
   * `error` = the content could not be loaded.
   */
  tone?: "neutral" | "error";
  /** `sm` = inside tables, panels and cards; `md` = a whole page section. */
  size?: "md" | "sm";
  className?: string;
};

/**
 * What a list, table or page shows instead of its content: nothing yet,
 * nothing found, or an error with a way to try again.
 */
export function EmptyState({
  icon: IconComponent,
  title,
  text,
  action,
  tone = "neutral",
  size = "md",
  className,
}: EmptyStateProps) {
  const sm = size === "sm";

  return (
    <div
      role={tone === "error" ? "alert" : undefined}
      className={cn(
        "flex flex-col items-center text-center",
        sm ? "gap-2 px-4 py-6" : "gap-3 px-6 py-14",
        className,
      )}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full",
          sm ? "size-10" : "size-14",
          tone === "error" ? "bg-red/12 text-red" : "bg-control text-beige",
        )}
      >
        <IconComponent
          weight="fill"
          className={sm ? "size-[18px]" : "size-6"}
        />
      </span>
      <p
        className={cn(
          "font-title leading-[1.3] font-medium text-fg",
          sm ? "text-[15px]" : "text-xl",
        )}
      >
        {title}
      </p>
      {text && (
        <p
          className={cn(
            "max-w-[420px] font-text leading-[1.5] text-fg-2",
            sm ? "text-[13px]" : "text-sm",
          )}
        >
          {text}
        </p>
      )}
      {action && (
        <div
          className={cn(
            "flex flex-wrap items-center justify-center gap-2.5",
            sm ? "pt-1" : "pt-2",
          )}
        >
          {action}
        </div>
      )}
    </div>
  );
}
