"use client";

import { useState } from "react";
import {
  PencilSimpleIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { SortableList } from "@/components/ui/SortableList";
import type { MenuItem } from "@/lib/editor";
import { cn } from "@/lib/cn";
import { PanelAddButton } from "./EditorPanel";

type MenuItemsEditorProps = {
  items: MenuItem[];
  /** `key` groups quick changes (typing a name) into one undo step. */
  onChange: (key: string, items: MenuItem[]) => void;
  /** Accessible name of the list. */
  label: string;
  addLabel: string;
  /** Highlighted item (e.g. the one outlined in the preview). */
  selectedId?: string | null;
  onSelect?: (id: string) => void;
};

/**
 * List of links (menu, footer) that can be reordered, renamed in place,
 * added to and removed from. An item left without a name is removed.
 */
export function MenuItemsEditor({
  items,
  onChange,
  label,
  addLabel,
  selectedId,
  onSelect,
}: MenuItemsEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const remove = (id: string) =>
    onChange(
      "items-remove",
      items.filter((item) => item.id !== id),
    );

  function rename(id: string, name: string) {
    onChange(
      `items-label-${id}`,
      // A renamed item no longer matches its place in the screenshot.
      items.map((item) => (item.id === id ? { id, label: name } : item)),
    );
  }

  function add() {
    const id = `item-${Date.now()}`;
    onChange("items-add", [...items, { id, label: "Nová položka" }]);
    onSelect?.(id);
    setEditingId(id);
  }

  return (
    <>
      <SortableList
        items={items}
        label={label}
        itemLabel={(item) => item.label}
        selectedId={selectedId}
        onReorder={(next) => onChange("items-order", next)}
      >
        {(item, { selected }) =>
          editingId === item.id ? (
            <>
              <input
                autoFocus
                value={item.label}
                aria-label="Název položky"
                onFocus={(event) => event.target.select()}
                onChange={(event) => rename(item.id, event.target.value)}
                onBlur={() => {
                  setEditingId(null);
                  if (item.label.trim() === "") remove(item.id);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === "Escape") {
                    event.currentTarget.blur();
                  }
                }}
                className="h-7 min-w-0 flex-1 rounded-md bg-inset px-2 font-text text-sm leading-[1.4] font-semibold text-fg outline-[1.5px] outline-beige"
              />
              <button
                type="button"
                aria-label={`Odstranit položku ${item.label}`}
                title="Odstranit položku"
                // Runs before the input's blur.
                onPointerDown={(event) => {
                  event.preventDefault();
                  setEditingId(null);
                  remove(item.id);
                }}
                className="flex size-6 shrink-0 items-center justify-center rounded-md text-fg-3 transition-colors hover:text-red focus-visible:outline-[1.5px] focus-visible:outline-beige"
              >
                <TrashIcon weight="fill" className="size-[13px]" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                aria-pressed={onSelect ? selected : undefined}
                onClick={() =>
                  onSelect ? onSelect(item.id) : setEditingId(item.id)
                }
                onDoubleClick={() => setEditingId(item.id)}
                className={cn(
                  "h-full min-w-0 flex-1 truncate rounded-md text-left font-text text-sm leading-[1.4] text-fg focus-visible:outline-[1.5px] focus-visible:outline-beige",
                  selected ? "font-semibold" : "font-medium",
                )}
              >
                {item.label}
              </button>
              <button
                type="button"
                aria-label={`Přejmenovat položku ${item.label}`}
                title="Přejmenovat"
                onClick={() => {
                  onSelect?.(item.id);
                  setEditingId(item.id);
                }}
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-md transition-colors hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-beige",
                  selected ? "text-beige" : "text-fg-3",
                )}
              >
                <PencilSimpleIcon weight="fill" className="size-[13px]" />
              </button>
            </>
          )
        }
      </SortableList>

      <PanelAddButton
        icon={<PlusCircleIcon weight="fill" className="size-[15px]" />}
        onClick={add}
      >
        {addLabel}
      </PanelAddButton>
    </>
  );
}
