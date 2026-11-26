"use client";

import { useEffect, useId, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { SectionType } from "@/lib/editor";
import { cn } from "@/lib/cn";
import { SectionIcon } from "./sectionIcons";

type AddSectionDialogProps = {
  /** Section types offered here (the ones already used on the web). */
  types: SectionType[];
  onAdd: (typeId: string) => void;
  onClose: () => void;
  /** Opens the full gallery of sections. */
  onShowAll: () => void;
};

export function sectionUsage(type: SectionType) {
  return type.usageNote ?? `Použito ${type.usage}× na webu`;
}

/**
 * Quick choice of a new section, shown over the dimmed preview (not a page
 * modal: the rest of the editor stays usable).
 */
export function AddSectionDialog({
  types,
  onAdd,
  onClose,
  onShowAll,
}: AddSectionDialogProps) {
  const [selected, setSelected] = useState(types[0]?.id);
  const titleId = useId();
  const name = types.find((type) => type.id === selected)?.name;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-labelledby={titleId}
      className="flex w-[620px] max-w-full flex-col gap-[18px] rounded-[20px] border border-line bg-card p-6 shadow-[0_24px_64px_#000000A6]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <h2
            id={titleId}
            className="font-title text-xl leading-[1.4] font-medium text-fg"
          >
            Přidat sekci
          </h2>
          <p className="font-text text-[13px] leading-[1.4] text-fg-2">
            Vyberte z toho, co už na webu máte. Vzhled zůstane stejný, změníte
            jen obsah.
          </p>
        </div>
        <button
          type="button"
          autoFocus
          onClick={onClose}
          aria-label="Zavřít"
          className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-control text-fg-2 transition-colors hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-beige"
        >
          <X className="size-[15px]" />
        </button>
      </div>

      <div
        role="radiogroup"
        aria-label="Typ sekce"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3"
      >
        {types.map((type) => {
          const checked = type.id === selected;
          return (
            <button
              key={type.id}
              type="button"
              role="radio"
              aria-checked={checked}
              onClick={() => setSelected(type.id)}
              onDoubleClick={() => onAdd(type.id)}
              className={cn(
                "flex flex-col gap-2.5 rounded-[14px] border p-2.5 text-left transition-colors focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-beige",
                checked
                  ? "border-beige bg-[#CAC3B814]"
                  : "border-line-soft bg-card hover:border-line",
              )}
            >
              <span className="flex h-[84px] items-center justify-center rounded-lg bg-inset">
                <SectionIcon
                  type={type.id}
                  className={cn(
                    "size-[26px]",
                    checked ? "text-beige" : "text-fg-3",
                  )}
                />
              </span>
              <span className="flex flex-col gap-px px-1 pb-0.5">
                <span className="font-text text-[13px] leading-[1.4] font-semibold text-fg">
                  {type.name}
                </span>
                <span className="font-text text-[11px] leading-[1.4] text-fg-3">
                  {sectionUsage(type)}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Not in the design: the way from here to "Galerie sekcí". */}
        <button
          type="button"
          onClick={onShowAll}
          className="rounded-md font-text text-[13px] leading-[1.4] font-semibold text-beige transition-colors hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige"
        >
          Zobrazit všechny sekce
        </button>
        <Button
          size="md"
          disabled={!selected}
          onClick={() => selected && onAdd(selected)}
        >
          Přidat „{name}“
        </Button>
      </div>
    </div>
  );
}
