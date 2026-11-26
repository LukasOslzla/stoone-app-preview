"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Icon } from "@phosphor-icons/react";
import {
  CaretRightIcon,
  CheckCircleIcon,
  FileTextIcon,
  HouseIcon,
  InfoIcon,
  LinkSimpleIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  SquareHalfBottomIcon,
  SquareHalfIcon,
  TagIcon,
} from "@phosphor-icons/react";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { plural } from "@/lib/format";

export type EditorTarget = {
  id: string;
  label: string;
  /** Shorter name for the closed picker. */
  shortLabel?: string;
  /** Second line of the trigger, e.g. the page address. */
  sub: string;
  kind: "site" | "page" | "shared";
  /** Shown at the end of the option ("3 weby"). */
  note?: string;
  disabled?: boolean;
};

type TargetSelectProps = {
  targets: EditorTarget[];
  value: string;
  onChange: (id: string) => void;
  projectName: string;
  /** How many pages are listed before "Dalších N stránek". */
  visiblePages?: number;
};

const pageIcons: Record<string, Icon> = {
  "/cs": HouseIcon,
  "/about": InfoIcon,
  "/cs/lokalita": MapPinIcon,
  "/cs/cenik": TagIcon,
};

function targetIcon(target: EditorTarget): Icon {
  if (target.kind === "shared") return LinkSimpleIcon;
  if (target.id === "header") return SquareHalfIcon;
  if (target.id === "footer") return SquareHalfBottomIcon;
  return pageIcons[target.id.replace(/^page:/, "")] ?? FileTextIcon;
}

/** Picker of what is being edited: site header, a page or shared content. */
export function TargetSelect({
  targets,
  value,
  onChange,
  projectName,
  visiblePages = 4,
}: TargetSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [allPages, setAllPages] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const current = targets.find((target) => target.id === value) ?? targets[0];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const needle = query.trim().toLowerCase();
  const matches = (target: EditorTarget) =>
    needle === "" || target.label.toLowerCase().includes(needle);

  const site = targets.filter((t) => t.kind === "site" && matches(t));
  const pages = targets.filter((t) => t.kind === "page" && matches(t));
  const shared = targets.filter((t) => t.kind === "shared" && matches(t));

  // While searching every match is listed.
  const showAllPages = allPages || needle !== "";
  const listedPages = showAllPages ? pages : pages.slice(0, visiblePages);
  const hiddenPages = pages.length - listedPages.length;

  function select(target: EditorTarget) {
    if (target.disabled) return;
    onChange(target.id);
    setOpen(false);
    setQuery("");
  }

  const option = (target: EditorTarget) => {
    const selected = target.id === value;
    const IconComponent = targetIcon(target);
    return (
      <button
        key={target.id}
        type="button"
        role="option"
        aria-selected={selected}
        aria-disabled={target.disabled || undefined}
        title={target.disabled ? "Zatím není k dispozici" : undefined}
        onClick={() => select(target)}
        className={cn(
          "flex h-[38px] w-full shrink-0 items-center gap-2.5 rounded-[9px] px-2.5 text-left transition-colors focus-visible:outline-[1.5px] focus-visible:outline-beige",
          selected ? "bg-[#CAC3B81F]" : "hover:bg-white/5",
          target.disabled && "cursor-default opacity-45 hover:bg-transparent",
        )}
      >
        <IconComponent
          weight="fill"
          className={cn(
            "size-[15px] shrink-0",
            target.kind === "shared"
              ? "text-ai"
              : selected
                ? "text-beige"
                : "text-fg-2",
          )}
        />
        <span
          className={cn(
            "min-w-0 flex-1 truncate font-text text-[13px] leading-[1.4] text-fg",
            selected ? "font-semibold" : "font-medium",
          )}
        >
          {target.label}
        </span>
        {target.note && (
          <span className="shrink-0 font-text text-[11px] leading-[1.4] text-fg-3">
            {target.note}
          </span>
        )}
        {selected && (
          <CheckCircleIcon
            weight="fill"
            className="size-3.5 shrink-0 text-beige"
          />
        )}
      </button>
    );
  };

  const groupLabel = (label: string, sub?: string) => (
    <div className="flex flex-col gap-px px-2.5 pt-3.5 pb-1.5">
      <p className="font-text text-[11px] leading-[1.4] font-bold tracking-[0.8px] text-fg-3 uppercase">
        {label}
      </p>
      {sub && (
        <p className="font-text text-[11px] leading-[1.4] text-fg-3">{sub}</p>
      )}
    </div>
  );

  const empty = site.length + pages.length + shared.length === 0;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex h-10 max-w-[260px] items-center gap-2.5 rounded-xl border bg-card pr-3 pl-3.5 text-left transition-colors focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-beige",
          open ? "border-beige" : "border-line hover:border-[#D2D5C566]",
        )}
      >
        <span className="flex min-w-0 flex-col">
          <span className="truncate font-text text-sm leading-[1.2] font-semibold text-fg">
            {current.shortLabel ?? current.label}
          </span>
          <span
            className={cn(
              "truncate font-text text-[11px] leading-[1.2]",
              current.kind === "shared" ? "text-ai" : "text-fg-3",
            )}
          >
            {current.sub}
          </span>
        </span>
        <ChevronsUpDown className="size-3.5 shrink-0 text-fg-3" />
      </button>

      {open && (
        <div
          id={listId}
          role="listbox"
          aria-label="Co chcete upravit"
          className="absolute top-[46px] left-0 z-30 flex max-h-[min(560px,calc(100dvh-180px))] w-[340px] flex-col gap-0.5 overflow-y-auto rounded-2xl border border-line bg-card p-2.5 shadow-[0_20px_48px_#000000B3]"
        >
          <label className="flex h-[38px] shrink-0 items-center gap-2.5 rounded-[10px] border border-line-soft bg-inset px-3 focus-within:border-beige">
            <MagnifyingGlassIcon
              weight="fill"
              className="size-3.5 shrink-0 text-fg-3"
            />
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Hledat stránku nebo obsah"
              placeholder="Hledat stránku nebo obsah"
              className="h-full min-w-0 flex-1 bg-transparent font-text text-[13px] leading-[1.4] text-fg outline-none placeholder:text-fg-3 [&::-webkit-search-cancel-button]:hidden"
            />
          </label>

          {site.length > 0 && (
            <>
              {groupLabel(`Celý web ${projectName}`)}
              {site.map(option)}
            </>
          )}

          {pages.length > 0 && (
            <>
              {groupLabel("Stránky")}
              {listedPages.map(option)}
              {hiddenPages > 0 && (
                <button
                  type="button"
                  onClick={() => setAllPages(true)}
                  className="flex h-[38px] w-full shrink-0 items-center gap-2.5 rounded-[9px] px-2.5 text-left transition-colors hover:bg-white/5 focus-visible:outline-[1.5px] focus-visible:outline-beige"
                >
                  <CaretRightIcon
                    weight="fill"
                    className="size-[15px] shrink-0 text-fg-2"
                  />
                  <span className="font-text text-[13px] leading-[1.4] font-medium text-fg">
                    {plural(hiddenPages, ["Další", "Další", "Dalších"])}{" "}
                    {hiddenPages}{" "}
                    {plural(hiddenPages, ["stránka", "stránky", "stránek"])}
                  </span>
                </button>
              )}
            </>
          )}

          {shared.length > 0 && (
            <>
              {(site.length > 0 || pages.length > 0) && (
                <div className="mx-0 mt-1 h-px shrink-0 bg-line-soft" />
              )}
              {groupLabel(
                "Společné pro všechny projekty",
                "Změna se projeví na všech vašich webech",
              )}
              {shared.map(option)}
            </>
          )}

          {empty && (
            <p className="px-2.5 py-4 font-text text-[13px] leading-[1.4] text-fg-3">
              Nic takového na webu není.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
