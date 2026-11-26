"use client";

import { Fragment, useState } from "react";
import type { ReactNode } from "react";
import { DotsSixVerticalIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

type SortableListProps<T extends { id: string }> = {
  items: T[];
  /** Accessible name of the list. */
  label: string;
  /** Name of an item for the drag handle ("Přesunout: Ceník"). */
  itemLabel: (item: T) => string;
  onReorder: (items: T[]) => void;
  selectedId?: string | null;
  /** Content of a row between the drag handle and the right edge. */
  children: (item: T, state: { selected: boolean }) => ReactNode;
  /**
   * Label of the "insert here" divider that appears between rows on hover or
   * keyboard focus. Omit for lists without inserting.
   */
  insertLabel?: string;
  /** Called with the index the new item should get. */
  onInsert?: (index: number) => void;
  /** Index whose divider stays open (while its dialog is open). */
  insertingAt?: number | null;
};

/**
 * Vertical list of 40px rows that can be reordered by dragging the handle or
 * with the arrow keys while the handle is focused.
 */
export function SortableList<T extends { id: string }>({
  items,
  label,
  itemLabel,
  onReorder,
  selectedId,
  children,
  insertLabel,
  onInsert,
  insertingAt,
}: SortableListProps<T>) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  function move(from: number, to: number) {
    if (to < 0 || to >= items.length || from === to) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onReorder(next);
  }

  return (
    <ul aria-label={label} className="flex flex-col">
      {items.map((item, index) => {
        const selected = item.id === selectedId;
        return (
          <Fragment key={item.id}>
            <li
              onDragOver={(event) => {
                if (!dragId) return;
                event.preventDefault();
                setOverId(item.id);
              }}
              onDrop={(event) => {
                event.preventDefault();
                const from = items.findIndex((other) => other.id === dragId);
                if (from !== -1) move(from, index);
                setDragId(null);
                setOverId(null);
              }}
              className={cn(
                "flex h-10 items-center gap-2.5 rounded-[10px] border pr-2.5 pl-1 transition-colors",
                selected
                  ? "border-beige bg-[#CAC3B81F]"
                  : "border-line-soft bg-card hover:border-line",
                dragId === item.id && "opacity-40",
                overId === item.id &&
                  dragId !== item.id &&
                  "border-beige border-dashed",
              )}
            >
              <button
                type="button"
                draggable
                aria-label={`Přesunout: ${itemLabel(item)}`}
                title="Přetáhněte nebo použijte šipky nahoru a dolů"
                onDragStart={(event) => {
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData("text/plain", item.id);
                  setDragId(item.id);
                }}
                onDragEnd={() => {
                  setDragId(null);
                  setOverId(null);
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    move(index, index - 1);
                  }
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    move(index, index + 1);
                  }
                }}
                className="flex h-7 w-6 shrink-0 cursor-grab items-center justify-center rounded-md text-fg-3 transition-colors hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-beige active:cursor-grabbing"
              >
                <DotsSixVerticalIcon weight="bold" className="size-3.5" />
              </button>
              {children(item, { selected })}
            </li>

            {index < items.length - 1 &&
              (insertLabel && onInsert ? (
                <InsertDivider
                  label={insertLabel}
                  open={insertingAt === index + 1}
                  onClick={() => onInsert(index + 1)}
                />
              ) : (
                <li aria-hidden className="h-1.5" />
              ))}
          </Fragment>
        );
      })}
    </ul>
  );
}

function InsertDivider({
  label,
  open,
  onClick,
}: {
  label: string;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <li className="group/insert relative">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex w-full items-center gap-2 overflow-hidden transition-[height,opacity] duration-150 focus-visible:outline-none",
          open
            ? "h-[38px] opacity-100"
            : "h-1.5 opacity-0 group-hover/insert:h-[38px] group-hover/insert:opacity-100 focus-visible:h-[38px] focus-visible:opacity-100",
        )}
      >
        <span className="h-0.5 flex-1 bg-beige" />
        <span className="flex h-[22px] items-center rounded-full bg-beige px-2 font-text text-[11px] leading-none font-bold whitespace-nowrap text-ink group-focus-visible/insert:outline-[1.5px]">
          {label}
        </span>
        <span className="h-0.5 flex-1 bg-beige" />
      </button>
      {/* Taller invisible hover target around the 6px gap. */}
      {!open && (
        <span
          aria-hidden
          onClick={onClick}
          className="absolute inset-x-0 -top-1.5 -bottom-1.5 cursor-pointer group-hover/insert:hidden"
        />
      )}
    </li>
  );
}
