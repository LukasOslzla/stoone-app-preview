import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type ChoiceCardProps = {
  title: string;
  description: string;
  /** Short line at the bottom, e.g. "Doporučeno pro 5 a více bytů". */
  note?: string;
  icon: ReactNode;
  /** Highlights the recommended choice. */
  recommended?: boolean;
  /** Without `href` the card is an inert button (target not built yet). */
  href?: string;
  /** Called on click, e.g. to close the dialog the card sits in. */
  onSelect?: () => void;
};

/** Large clickable option used when the user picks one of a few ways forward. */
export function ChoiceCard({
  title,
  description,
  note,
  icon,
  recommended = false,
  href,
  onSelect,
}: ChoiceCardProps) {
  const className = cn(
    "flex min-w-0 flex-1 flex-col gap-3.5 rounded-[18px] p-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-beige",
    recommended
      ? "border-[1.5px] border-beige bg-beige/8 hover:bg-beige/12"
      : "border border-line hover:border-mist/40 hover:bg-tint/3",
  );

  const content = (
    <>
      <span
        className={cn(
          "flex size-11 items-center justify-center rounded-xl",
          recommended ? "bg-beige text-ink" : "bg-control text-fg",
        )}
      >
        {icon}
      </span>
      <span className="flex flex-col gap-1">
        <span className="font-title text-lg leading-[1.25] font-medium text-fg">
          {title}
        </span>
        <span className="font-text text-[13px] leading-[1.45] text-fg-2">
          {description}
        </span>
      </span>
      {note && (
        <span
          className={cn(
            "mt-auto font-text text-xs leading-[1.4] font-semibold",
            recommended ? "text-beige" : "text-fg-3",
          )}
        >
          {note}
        </span>
      )}
    </>
  );

  return href ? (
    <Link href={href} onClick={onSelect} className={className}>
      {content}
    </Link>
  ) : (
    <button type="button" onClick={onSelect} className={className}>
      {content}
    </button>
  );
}
