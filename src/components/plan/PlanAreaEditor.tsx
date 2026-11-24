"use client";

import { useRef, useState } from "react";
import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { MinusCircleIcon, PlusCircleIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import type { PlanItem, PlanRect } from "./types";

type PlanAreaEditorProps = {
  items: PlanItem[];
  /** Item that a newly drawn rectangle is assigned to. */
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** Called when the user finishes drawing an area for the selected item. */
  onAreaChange: (id: string, area: PlanRect) => void;
  /** The plan itself: an image or any element filling the canvas. */
  background: ReactNode;
  /** Width / height of the plan, e.g. 716 / 420. */
  aspectRatio?: number;
  /** Rendered left of the zoom buttons (title, hint…). */
  header?: ReactNode;
  className?: string;
};

const ZOOM_LEVELS = [1, 1.5, 2];
/** Smaller drags count as a click. */
const MIN_SIZE = 2;

const toStyle = (rect: PlanRect): CSSProperties => ({
  left: `${rect.x}%`,
  top: `${rect.y}%`,
  width: `${rect.width}%`,
  height: `${rect.height}%`,
});

const contains = (rect: PlanRect, x: number, y: number) =>
  x >= rect.x &&
  x <= rect.x + rect.width &&
  y >= rect.y &&
  y <= rect.y + rect.height;

/**
 * Marks rectangular areas on a plan. Select an item (in a list next to the
 * editor or by clicking its area) and drag on the plan to draw its area.
 */
export function PlanAreaEditor({
  items,
  selectedId,
  onSelect,
  onAreaChange,
  background,
  aspectRatio = 716 / 420,
  header,
  className,
}: PlanAreaEditorProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoomIndex, setZoomIndex] = useState(0);
  const [drag, setDrag] = useState<{
    startX: number;
    startY: number;
    x: number;
    y: number;
  } | null>(null);

  const zoom = ZOOM_LEVELS[zoomIndex];

  function toPercent(event: PointerEvent<HTMLDivElement>) {
    const rect = canvasRef.current!.getBoundingClientRect();
    const clamp = (value: number) => Math.min(100, Math.max(0, value));
    return {
      x: clamp(((event.clientX - rect.left) / rect.width) * 100),
      y: clamp(((event.clientY - rect.top) / rect.height) * 100),
    };
  }

  const draft: PlanRect | null = drag && {
    x: Math.min(drag.startX, drag.x),
    y: Math.min(drag.startY, drag.y),
    width: Math.abs(drag.x - drag.startX),
    height: Math.abs(drag.y - drag.startY),
  };
  const drawing =
    draft !== null && draft.width >= MIN_SIZE && draft.height >= MIN_SIZE;

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = toPercent(event);
    setDrag({ startX: point.x, startY: point.y, ...point });
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!drag) return;
    setDrag({ ...drag, ...toPercent(event) });
  }

  function handlePointerUp() {
    if (!drag || !draft) return;
    setDrag(null);

    if (drawing) {
      if (selectedId) onAreaChange(selectedId, draft);
      return;
    }

    // A click: select the item under the pointer.
    const hit = [...items]
      .reverse()
      .find((item) => item.area && contains(item.area, drag.x, drag.y));
    if (hit) onSelect(hit.id);
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">{header}</div>
        <div className="flex shrink-0 gap-1 rounded-full border border-line-soft bg-inset p-[3px]">
          {[
            { label: "Oddálit", icon: MinusCircleIcon, step: -1 },
            { label: "Přiblížit", icon: PlusCircleIcon, step: 1 },
          ].map(({ label, icon: IconComponent, step }) => {
            const next = zoomIndex + step;
            const disabled = next < 0 || next >= ZOOM_LEVELS.length;
            return (
              <button
                key={label}
                type="button"
                aria-label={label}
                title={label}
                disabled={disabled}
                onClick={() => setZoomIndex(next)}
                className="flex size-[30px] items-center justify-center rounded-full text-fg-2 transition-colors enabled:hover:bg-white/5 enabled:hover:text-fg disabled:opacity-40 focus-visible:outline-[1.5px] focus-visible:outline-beige"
              >
                <IconComponent weight="fill" className="size-4" />
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="overflow-auto rounded-[14px] border border-line-soft bg-inset"
        style={{ aspectRatio }}
      >
        <div
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => setDrag(null)}
          className={cn(
            "relative touch-none select-none",
            selectedId ? "cursor-crosshair" : "cursor-default",
          )}
          style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}
        >
          <div className="pointer-events-none absolute inset-0">
            {background}
          </div>

          {items.map((item) => {
            const selected = item.id === selectedId;

            if (!item.area) {
              return item.placeholder ? (
                <div
                  key={item.id}
                  style={toStyle(item.placeholder)}
                  className={cn(
                    "pointer-events-none absolute flex flex-col items-center justify-center gap-0.5 rounded-[3px] border border-dashed text-center",
                    selected ? "border-beige" : "border-line",
                  )}
                >
                  <span className="font-text text-sm leading-[1.4] font-bold text-fg-3">
                    {item.name}
                  </span>
                  <span className="font-text text-xs leading-[1.4] text-fg-3">
                    neoznačeno
                  </span>
                </div>
              ) : null;
            }

            return (
              <div
                key={item.id}
                style={toStyle(item.area)}
                className={cn(
                  "pointer-events-none absolute flex flex-col items-center justify-center gap-0.5 overflow-hidden rounded-[3px] text-center",
                  selected
                    ? "border-2 border-beige bg-[#CAC3B833]"
                    : "border border-[#CAC3B866] bg-[#CAC3B814]",
                )}
              >
                <span className="font-text text-sm leading-[1.4] font-bold text-fg">
                  {item.name}
                </span>
                {item.detail && (
                  <span className="font-text text-xs leading-[1.4] text-fg-3">
                    {item.detail}
                  </span>
                )}
              </div>
            );
          })}

          {drawing && draft && (
            <div
              style={toStyle(draft)}
              className="pointer-events-none absolute rounded-[3px] border-2 border-dashed border-beige bg-[#CAC3B81F]"
            />
          )}
        </div>
      </div>
    </div>
  );
}
