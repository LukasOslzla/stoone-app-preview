import { TrendDownIcon, TrendUpIcon } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/cn";

type DeltaBadgeProps = {
  label: string;
  /** Shows a trend arrow; omit for plain text badges ("+3 tento měsíc"). */
  trend?: "up" | "down";
  /** Colour of the badge, independent of the arrow direction. */
  tone?: "positive" | "negative";
  className?: string;
};

/** Small pill with a change value, e.g. "+12,4 %". */
export function DeltaBadge({
  label,
  trend,
  tone = "positive",
  className,
}: DeltaBadgeProps) {
  const TrendIcon = trend === "down" ? TrendDownIcon : TrendUpIcon;

  return (
    <span
      className={cn(
        "flex h-6 shrink-0 items-center gap-1 rounded-full px-2 font-text text-xs leading-none font-bold",
        tone === "positive"
          ? "bg-[#6FD13C1F] text-green"
          : "bg-[#F0524B1F] text-red",
        className,
      )}
    >
      {trend && <TrendIcon weight="fill" className="size-[13px]" />}
      {label}
    </span>
  );
}
