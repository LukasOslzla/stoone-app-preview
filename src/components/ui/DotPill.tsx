import { cn } from "@/lib/cn";

type DotPillProps = {
  label: string;
  /** Any CSS colour of the dot. */
  color: string;
  /** `sm` = 24px (tables), `md` = 26px (page titles). */
  size?: "sm" | "md";
  /** `tinted` colours the pill and its label with the dot colour. */
  tone?: "neutral" | "tinted";
  className?: string;
};

/** Neutral pill with a coloured status dot. */
export function DotPill({
  label,
  color,
  size = "sm",
  tone = "neutral",
  className,
}: DotPillProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 font-text text-xs leading-none font-semibold whitespace-nowrap",
        tone === "neutral" && "bg-control text-fg-2",
        size === "md" ? "h-[26px]" : "h-6",
        className,
      )}
      style={
        tone === "tinted"
          ? {
              color,
              backgroundColor: `color-mix(in srgb, ${color} 8%, transparent)`,
            }
          : undefined
      }
    >
      <span
        className={cn(
          "shrink-0 rounded-full",
          size === "md" ? "size-[7px]" : "size-1.5",
        )}
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}
