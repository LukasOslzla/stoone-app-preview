"use client";

import { useId, useState } from "react";
import {
  PencilSimpleIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { SortableList } from "@/components/ui/SortableList";
import { Switch } from "@/components/ui/Switch";
import {
  headerLinkLabels,
  type HeaderLinks,
  type MenuItem,
  type SiteHeader,
} from "@/lib/editor";
import { cn } from "@/lib/cn";
import {
  EditorPanel,
  PanelAddButton,
  PanelGroupLabel,
  PanelHead,
} from "./EditorPanel";

type HeaderPanelProps = {
  header: SiteHeader;
  /** `key` groups quick changes into one undo step. */
  onChange: (key: string, header: SiteHeader) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

/** "Hlavička webu": menu items (order, names) and the links on the right. */
export function HeaderPanel({
  header,
  onChange,
  selectedId,
  onSelect,
}: HeaderPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const baseId = useId();

  const setMenu = (key: string, menu: MenuItem[]) =>
    onChange(key, { ...header, menu });

  function rename(id: string, label: string) {
    setMenu(
      `menu-label-${id}`,
      // The screenshot no longer matches a renamed item.
      header.menu.map((item) => (item.id === id ? { id, label } : item)),
    );
  }

  function finishEditing(item: MenuItem) {
    setEditingId(null);
    if (item.label.trim() === "") {
      setMenu(
        "menu-remove",
        header.menu.filter((other) => other.id !== item.id),
      );
    }
  }

  function addItem() {
    const id = `item-${Date.now()}`;
    setMenu("menu-add", [...header.menu, { id, label: "Nová položka" }]);
    onSelect(id);
    setEditingId(id);
  }

  return (
    <EditorPanel>
      <PanelHead
        title="Hlavička webu"
        sub="Změny se hned ukážou v náhledu vpravo."
      />

      <PanelGroupLabel>Položky menu</PanelGroupLabel>
      <SortableList
        items={header.menu}
        label="Položky menu"
        itemLabel={(item) => item.label}
        selectedId={selectedId}
        onReorder={(menu) => setMenu("menu-order", menu)}
      >
        {(item, { selected }) =>
          editingId === item.id ? (
            <>
              <input
                autoFocus
                value={item.label}
                aria-label="Název položky menu"
                onFocus={(event) => event.target.select()}
                onChange={(event) => rename(item.id, event.target.value)}
                onBlur={() => finishEditing(item)}
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
                  setMenu(
                    "menu-remove",
                    header.menu.filter((other) => other.id !== item.id),
                  );
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
                aria-pressed={selected}
                onClick={() => onSelect(item.id)}
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
                  onSelect(item.id);
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
        onClick={addItem}
      >
        Přidat položku menu
      </PanelAddButton>

      <PanelGroupLabel>Odkazy vpravo</PanelGroupLabel>
      <div className="flex flex-col gap-[18px]">
        {(Object.keys(headerLinkLabels) as (keyof HeaderLinks)[]).map((key) => (
          <div key={key} className="flex items-center justify-between gap-3">
            <span
              id={`${baseId}-${key}`}
              className="font-text text-sm leading-[1.4] font-medium text-fg-2"
            >
              {headerLinkLabels[key]}
            </span>
            <Switch
              labelledBy={`${baseId}-${key}`}
              checked={header.links[key]}
              onChange={(checked) =>
                onChange(`link-${key}`, {
                  ...header,
                  links: { ...header.links, [key]: checked },
                })
              }
            />
          </div>
        ))}
      </div>
    </EditorPanel>
  );
}
