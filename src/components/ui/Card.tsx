import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Dashboard card surface: dark fill with a soft beige glow in the
 * bottom-right corner and a gradient hairline border.
 * Padding and layout come from `className`.
 */
export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("surface-card rounded-[20px]", className)} {...props} />
  );
}

type CardHeaderProps = {
  title: string;
  description?: string;
  /** Controls on the right side (filters, links, counters). */
  action?: ReactNode;
};

/** Title + one-line description used at the top of dashboard cards. */
export function CardHeader({ title, description, action }: CardHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
      <div className="flex min-w-0 flex-col gap-1">
        <h2 className="font-title text-lg leading-[1.25] font-medium text-fg">
          {title}
        </h2>
        {description && (
          <p className="font-text text-[13px] leading-[1.4] text-fg-3">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
