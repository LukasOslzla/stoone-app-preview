"use client";

import { useId, useState } from "react";
import type { PointerEvent } from "react";
import { cn } from "@/lib/cn";

export type AreaChartPoint = {
  /** Shown in the tooltip, e.g. "3. 11." */
  label: string;
  value: number;
};

type AreaChartProps = {
  points: AreaChartPoint[];
  /** Upper bound of the Y axis. */
  max: number;
  /** Y axis labels from top to bottom, e.g. [200, 150, 100, 50, 0]. */
  yTicks: number[];
  /** X axis labels, spread evenly under the plot. */
  xLabels: string[];
  /** Tooltip text for a value, e.g. (v) => `${v} návštěv`. */
  formatValue: (value: number) => string;
  /** Point highlighted when the chart is not hovered. */
  defaultActiveIndex?: number;
  /** Accessible description of the chart. */
  label: string;
  className?: string;
};

// Virtual drawing size; the SVG stretches to its container.
const WIDTH = 608;
const HEIGHT = 190;

type XY = { x: number; y: number };

/** Smooth curve through the points (Catmull-Rom converted to cubic Béziers). */
function smoothPath(points: XY[]) {
  if (points.length === 0) return "";
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${c1.x.toFixed(1)},${c1.y.toFixed(1)} ${c2.x.toFixed(1)},${c2.y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

/** Line chart with a gradient area, grid, axes and a hover tooltip. */
export function AreaChart({
  points,
  max,
  yTicks,
  xLabels,
  formatValue,
  defaultActiveIndex,
  label,
  className,
}: AreaChartProps) {
  const id = useId();
  const [hovered, setHovered] = useState<number | null>(null);

  const last = Math.max(points.length - 1, 1);
  const coords = points.map((point, index) => ({
    x: (index / last) * WIDTH,
    y: HEIGHT - (Math.min(point.value, max) / max) * HEIGHT,
  }));
  const line = smoothPath(coords);
  const area = `${line} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`;

  const activeIndex = hovered ?? defaultActiveIndex ?? null;
  const active = activeIndex !== null ? points[activeIndex] : undefined;
  const activeXY = activeIndex !== null ? coords[activeIndex] : undefined;
  const tooltipOnLeft = activeIndex !== null && activeIndex / last > 0.7;

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    setHovered(Math.min(last, Math.max(0, Math.round(ratio * last))));
  }

  return (
    <figure className={cn("flex gap-3", className)} aria-label={label}>
      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <div
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHovered(null)}
          className="relative h-[190px] overflow-hidden rounded-[10px] border border-line-soft"
        >
          {[25, 50, 75].map((top) => (
            <span
              key={top}
              className="absolute inset-x-0 h-px bg-[#FFFFFF0D]"
              style={{ top: `${top}%` }}
            />
          ))}

          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            preserveAspectRatio="none"
            aria-hidden
            className="absolute inset-0 size-full"
          >
            <defs>
              <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#CA9377" stopOpacity="0.35" />
                <stop offset="0.55" stopColor="#CAC3B8" stopOpacity="0.15" />
                <stop offset="1" stopColor="#CAC3B8" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id={`${id}-line`}
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="0"
                x2={WIDTH}
                y2="0"
              >
                <stop offset="0" stopColor="#CAC3B8" />
                <stop offset="0.6" stopColor="#CA9377" />
                <stop offset="1" stopColor="#A26D55" />
              </linearGradient>
            </defs>
            <path d={area} fill={`url(#${id}-area)`} />
            <path
              d={line}
              fill="none"
              stroke={`url(#${id}-line)`}
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {active && activeXY && (
            <div
              className="pointer-events-none absolute inset-y-0"
              style={{ left: `${(activeXY.x / WIDTH) * 100}%` }}
            >
              <span className="absolute inset-y-0 -left-px w-px bg-[#FFFFFF2E]" />
              <span
                className="absolute size-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#18181C] bg-copper"
                style={{ top: `${(activeXY.y / HEIGHT) * 100}%` }}
              />
              <div
                className={cn(
                  "absolute flex flex-col gap-[5px] rounded-[10px] border border-line bg-control px-2.5 py-2 whitespace-nowrap",
                  tooltipOnLeft ? "right-3" : "left-3",
                )}
                style={{
                  top: `clamp(6px, calc(${(activeXY.y / HEIGHT) * 100}% + 6px), calc(100% - 50px))`,
                }}
              >
                <span className="font-text text-[11px] leading-none text-fg-3">
                  {active.label}
                </span>
                <span className="font-text text-xs leading-none font-bold text-fg">
                  {formatValue(active.value)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div
          aria-hidden
          className="flex justify-between font-text text-xs leading-none text-fg-3"
        >
          {xLabels.map((xLabel) => (
            <span key={xLabel}>{xLabel}</span>
          ))}
        </div>
      </div>

      <div
        aria-hidden
        className="flex h-[190px] shrink-0 flex-col justify-between font-text text-xs leading-none text-fg-3"
      >
        {yTicks.map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>
    </figure>
  );
}
