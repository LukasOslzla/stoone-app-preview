import { cn } from "@/lib/cn";

type ProgressTicksProps = {
  /** 0–100. */
  percent: number;
  /** Accessible name, e.g. "Průběh konfigurace". */
  label: string;
  className?: string;
};

/**
 * Progress bar: the finished part is a solid gradient (beige → copper in
 * dark, camel → olive in light), the rest is drawn as small ticks.
 */
export function ProgressTicks({
  percent,
  label,
  className,
}: ProgressTicksProps) {
  const value = Math.min(100, Math.max(0, percent));

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("flex h-2 gap-1", className)}
    >
      {value > 0 && (
        <span
          className="bg-progress h-full rounded-full"
          style={{ width: `${value}%` }}
        />
      )}
      <span
        className="h-full min-w-0 flex-1"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, color-mix(in srgb, var(--color-tint) 14%, transparent) 0 2px, transparent 2px 6px)",
        }}
      />
    </div>
  );
}
