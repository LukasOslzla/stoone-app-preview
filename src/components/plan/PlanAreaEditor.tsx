"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent, ReactNode } from "react";
import {
  MinusCircleIcon,
  PencilSimpleIcon,
  PlusCircleIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import {
  isPolygon,
  type PlanArea,
  type PlanItem,
  type PlanPoint,
  type PlanRect,
} from "./types";

type PlanAreaEditorProps = {
  items: PlanItem[];
  /** Item that a newly drawn area is assigned to. */
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** Called when the user finishes drawing an area for the selected item. */
  onAreaChange: (id: string, area: PlanArea) => void;
  /**
   * What the user draws: `rect` = drag a rectangle (floor plans),
   * `polygon` = click point by point around a shape (houses on a render).
   */
  shape?: "rect" | "polygon";
  /** The plan itself: an image or any element filling the canvas. */
  background: ReactNode;
  /** Width / height of the plan, e.g. 716 / 420. */
  aspectRatio?: number;
  /** Rendered left of the zoom buttons (title, hint…). */
  header?: ReactNode;
  /** Set to `false` to hide the zoom buttons (and the header row with them). */
  zoomable?: boolean;
  /** Instruction shown in the corner of the plan while nothing is being drawn. */
  hint?: string;
  className?: string;
};

const ZOOM_LEVELS = [1, 1.5, 2];
/** Smaller drags count as a click. */
const MIN_SIZE = 2;
/** A click this close to the first point closes the outline. */
const CLOSE_DISTANCE = 3;

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

const distance = (a: PlanPoint, b: PlanPoint) =>
  Math.hypot(a.x - b.x, a.y - b.y);

const toSvgPoints = (points: PlanPoint[]) =>
  points.map((point) => `${point.x},${point.y}`).join(" ");

function middle(points: PlanPoint[]): PlanPoint {
  const sum = points.reduce(
    (total, point) => ({ x: total.x + point.x, y: total.y + point.y }),
    { x: 0, y: 0 },
  );
  return { x: sum.x / points.length, y: sum.y / points.length };
}

/**
 * Marks areas on a plan. Select an item (in a list next to the editor or by
 * clicking its area / tag) and draw its area: drag a rectangle, or click
 * around the shape when `shape="polygon"`.
 */
export function PlanAreaEditor({
  items,
  selectedId,
  onSelect,
  onAreaChange,
  shape = "rect",
  background,
  aspectRatio = 716 / 420,
  header,
  zoomable = true,
  hint,
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
  const [outline, setOutline] = useState<{
    id: string;
    points: PlanPoint[];
    cursor: PlanPoint;
  } | null>(null);

  const zoom = ZOOM_LEVELS[zoomIndex];
  // An unfinished outline is dropped when another item gets selected.
  const draftOutline = outline && outline.id === selectedId ? outline : null;
  const outlining = draftOutline !== null;

  useEffect(() => {
    if (!outlining) return;
    const cancel = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOutline(null);
    };
    window.addEventListener("keydown", cancel);
    return () => window.removeEventListener("keydown", cancel);
  }, [outlining]);

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

  function finishOutline() {
    if (!draftOutline || draftOutline.points.length < 3) return;
    onAreaChange(draftOutline.id, { points: draftOutline.points });
    setOutline(null);
  }

  function addOutlinePoint(point: PlanPoint) {
    if (!selectedId) return;
    const points = draftOutline?.points ?? [];
    const last = points[points.length - 1];

    if (points.length >= 3 && distance(point, points[0]) < CLOSE_DISTANCE) {
      finishOutline();
      return;
    }
    // The second click of a double-click lands on the same spot.
    if (last && distance(point, last) < 0.5) return;
    setOutline({ id: selectedId, points: [...points, point], cursor: point });
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    const point = toPercent(event);

    if (shape === "polygon") {
      addOutlinePoint(point);
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag({ startX: point.x, startY: point.y, ...point });
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (draftOutline) setOutline({ ...draftOutline, cursor: toPercent(event) });
    if (drag) setDrag({ ...drag, ...toPercent(event) });
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
      .find(
        (item) =>
          item.area &&
          !isPolygon(item.area) &&
          contains(item.area, drag.x, drag.y),
      );
    if (hit) onSelect(hit.id);
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {(header || zoomable) && (
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">{header}</div>
          {zoomable && (
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
                    className="flex size-[30px] items-center justify-center rounded-full text-fg-2 transition-colors enabled:hover:bg-tint/5 enabled:hover:text-fg disabled:opacity-40 focus-visible:outline-[1.5px] focus-visible:outline-beige"
                  >
                    <IconComponent weight="fill" className="size-4" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="relative">
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
            onDoubleClick={finishOutline}
            className={cn(
              "relative touch-none select-none",
              selectedId ? "cursor-crosshair" : "cursor-default",
            )}
            style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}
          >
            <div className="pointer-events-none absolute inset-0">
              {background}
            </div>

            {/* Outlines (polygons) of the selected item and the one in progress. */}
            <svg
              aria-hidden
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 size-full overflow-visible"
            >
              {items.map(
                (item) =>
                  item.area &&
                  isPolygon(item.area) &&
                  item.id === selectedId &&
                  !draftOutline && (
                    <polygon
                      key={item.id}
                      points={toSvgPoints(item.area.points)}
                      vectorEffect="non-scaling-stroke"
                      className="fill-beige/25 stroke-beige stroke-2"
                    />
                  ),
              )}
              {draftOutline && (
                <polyline
                  points={toSvgPoints([
                    ...draftOutline.points,
                    draftOutline.cursor,
                  ])}
                  vectorEffect="non-scaling-stroke"
                  strokeDasharray="6 4"
                  className="fill-beige/12 stroke-beige stroke-2"
                />
              )}
            </svg>

            {draftOutline?.points.map((point, index) => (
              <span
                key={index}
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
                className={cn(
                  "pointer-events-none absolute -translate-1/2 rounded-full border-2 border-beige",
                  index === 0 ? "size-3 bg-beige" : "size-2 bg-bg",
                )}
              />
            ))}

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

              if (isPolygon(item.area)) {
                const tag = item.tag ?? middle(item.area.points);
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={selected}
                    onPointerDown={(event) => event.stopPropagation()}
                    onDoubleClick={(event) => event.stopPropagation()}
                    onClick={() => onSelect(item.id)}
                    style={{ left: `${tag.x}%`, top: `${tag.y}%` }}
                    className={cn(
                      "absolute flex h-[26px] -translate-1/2 cursor-pointer items-center rounded-full border px-2.5 font-text text-xs leading-none font-bold whitespace-nowrap transition-colors focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-beige",
                      selected
                        ? "border-beige bg-beige text-ink"
                        : "border-line bg-surface/90 text-fg hover:border-beige",
                    )}
                  >
                    {item.name}
                  </button>
                );
              }

              return (
                <div
                  key={item.id}
                  style={toStyle(item.area)}
                  className={cn(
                    "pointer-events-none absolute flex flex-col items-center justify-center gap-0.5 overflow-hidden rounded-[3px] text-center",
                    selected
                      ? "border-2 border-beige bg-beige/20"
                      : "border border-beige/40 bg-beige/8",
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
                className="pointer-events-none absolute rounded-[3px] border-2 border-dashed border-beige bg-beige/12"
              />
            )}
          </div>
        </div>

        {(draftOutline || hint) && (
          <p
            role="status"
            className="pointer-events-none absolute bottom-4 left-4 flex min-h-9 max-w-[calc(100%-32px)] items-center gap-2 rounded-full border border-line bg-surface/90 px-3.5 py-1.5 font-text text-xs leading-[1.3] font-medium text-fg"
          >
            <PencilSimpleIcon
              weight="fill"
              className="size-3.5 shrink-0 text-beige"
            />
            {!draftOutline
              ? hint
              : draftOutline.points.length < 3
                ? "Klikáním přidávejte další body obrysu. Esc obrys zruší."
                : "Dvojklikem nebo kliknutím na první bod tvar uzavřete. Esc ho zruší."}
          </p>
        )}
      </div>
    </div>
  );
}
