"use client";

import { CheckCircleIcon, CircleIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import type { PlanItem } from "./types";

type PlanChecklistProps = {
  items: PlanItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** Line above the progress bar; defaults to "5 z 6 označeno". */
  summary?: string;
  className?: string;
};

/** Progress bar + list of items to mark; clicking a row selects it for drawing. */
export function PlanChecklist({
  items,
  selectedId,
  onSelect,
  summary,
  className,
}: PlanChecklistProps) {
  const marked = items.filter((item) => item.area).length;
  const progress = items.length > 0 ? (marked / items.length) * 100 : 0;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <p className="-mt-2 font-text text-[13px] leading-[1.4] text-fg-3">
        {summary ?? `${marked} z ${items.length} označeno`}
      </p>

      <div
        role="progressbar"
        aria-label="Označené položky"
        aria-valuemin={0}
        aria-valuemax={items.length}
        aria-valuenow={marked}
        className="h-1.5 overflow-hidden rounded-full bg-tint/8"
      >
        <div
          className="h-full rounded-full bg-beige transition-[width]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ul className="flex flex-col pt-1">
        {items.map((item) => {
          const selected = item.id === selectedId;
          const done = Boolean(item.area);

          return (
            <li key={item.id}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(item.id)}
                className={cn(
                  "flex h-[46px] w-full items-center gap-2.5 rounded-[10px] px-3 text-left transition-colors focus-visible:outline-[1.5px] focus-visible:outline-beige",
                  selected
                    ? "bg-beige/12 ring-1 ring-beige/25 ring-inset"
                    : "hover:bg-tint/5",
                )}
              >
                {done ? (
                  <CheckCircleIcon
                    weight="fill"
                    className={cn(
                      "size-4 shrink-0",
                      selected ? "text-beige" : "text-fg-2",
                    )}
                  />
                ) : (
                  <CircleIcon
                    weight="fill"
                    className={cn(
                      "size-4 shrink-0",
                      selected ? "text-beige" : "text-tint/12",
                    )}
                  />
                )}
                <span className="font-text text-sm leading-[1.4] font-semibold text-fg">
                  {item.name}
                </span>
                <span className="min-w-0 flex-1 truncate font-text text-[13px] leading-[1.4] text-fg-3">
                  {item.detail}
                </span>
                <span
                  className={cn(
                    "shrink-0 font-text text-xs leading-[1.4]",
                    selected ? "text-beige" : "text-fg-3",
                  )}
                >
                  {selected ? "právě upravujete" : done ? "" : "chybí"}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
