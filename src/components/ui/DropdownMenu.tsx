"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactElement, ReactNode, Ref } from "react";
import Link from "next/link";
import { CheckCircleIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

export type DropdownItem = {
  id: string;
  label: string;
  /** Second line under the label. */
  description?: string;
  /** Icon or small picture before the label. */
  icon?: ReactNode;
  /** Short text at the end of the row ("3 weby", "brzy"). */
  note?: string;
  /** Marks the current choice with a check. */
  selected?: boolean;
  disabled?: boolean;
  tone?: "default" | "danger";
  /** Makes the item a link; otherwise `onSelect` runs. */
  href?: string;
  onSelect?: () => void;
};

export type DropdownGroup = {
  /** Small heading above the items. */
  label?: string;
  items: DropdownItem[];
};

/** Props to spread on the element that opens the menu. */
export type DropdownTriggerProps = {
  ref: Ref<HTMLButtonElement>;
  "aria-haspopup": "menu";
  "aria-expanded": boolean;
  "aria-controls": string | undefined;
  onClick: () => void;
};

type DropdownMenuProps = {
  /** Accessible name of the menu. */
  label: string;
  /** Groups are separated by a hairline. */
  groups: DropdownGroup[];
  /** Renders the trigger; spread `props` on a <button>. */
  trigger: (props: DropdownTriggerProps, open: boolean) => ReactElement;
  /** Which edge of the trigger the menu lines up with. */
  align?: "start" | "end";
  /** `top` opens the menu above the trigger (controls at the bottom). */
  side?: "bottom" | "top";
  /** Tailwind width class of the menu, e.g. "w-[280px]" or "w-full". */
  width?: string;
  /** Classes of the wrapper around the trigger (it is `relative`). */
  className?: string;
};

/**
 * Menu that opens from a trigger: choices with an optional check, links and
 * actions. Closes on Escape, an outside press or after a choice; arrow keys
 * move between the items.
 */
export function DropdownMenu({
  label,
  groups,
  trigger,
  align = "start",
  side = "bottom",
  width = "w-[260px]",
  className,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    // Start on the current choice, or the first item.
    const items = menuRef.current?.querySelectorAll<HTMLElement>(
      "[role^=menuitem]:not([aria-disabled])",
    );
    const current = menuRef.current?.querySelector<HTMLElement>(
      "[aria-checked=true]",
    );
    (current ?? items?.[0])?.focus();
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function close(refocus = true) {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      close();
      return;
    }
    const step =
      event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
    if (step === 0 && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const items = [
      ...(menuRef.current?.querySelectorAll<HTMLElement>(
        "[role^=menuitem]:not([aria-disabled])",
      ) ?? []),
    ];
    const index = items.indexOf(document.activeElement as HTMLElement);
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? items.length - 1
          : (index + step + items.length) % items.length;
    items[next]?.focus();
  }

  const hasChoice = groups.some((group) =>
    group.items.some((item) => item.selected !== undefined),
  );

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {trigger(
        {
          ref: triggerRef,
          "aria-haspopup": "menu",
          "aria-expanded": open,
          "aria-controls": open ? menuId : undefined,
          onClick: () => setOpen((value) => !value),
        },
        open,
      )}

      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={onKeyDown}
          className={cn(
            "absolute z-50 flex max-h-[min(480px,70dvh)] flex-col overflow-y-auto rounded-2xl border border-line bg-popover p-1.5 shadow-float",
            width,
            align === "end" ? "right-0" : "left-0",
            side === "top" ? "bottom-full mb-2" : "top-full mt-2",
          )}
        >
          {groups.map((group, index) => (
            <div
              key={group.label ?? index}
              role="group"
              aria-label={group.label}
              className={cn(
                "flex flex-col gap-0.5",
                index > 0 && "mt-1.5 border-t border-line-soft pt-1.5",
              )}
            >
              {group.label && (
                <p className="px-2.5 pt-2 pb-1 font-text text-[11px] leading-[1.4] font-bold tracking-[0.8px] text-fg-3 uppercase">
                  {group.label}
                </p>
              )}
              {group.items.map((item) => {
                const itemClass = cn(
                  "flex min-h-[38px] w-full items-center gap-2.5 rounded-[9px] px-2.5 py-1.5 text-left transition-colors focus-visible:outline-[1.5px] focus-visible:-outline-offset-1 focus-visible:outline-beige",
                  item.selected ? "bg-beige/12" : "hover:bg-tint/5",
                  item.disabled &&
                    "cursor-default opacity-45 hover:bg-transparent",
                );
                const content = (
                  <>
                    {item.icon && (
                      <span
                        className={cn(
                          "flex shrink-0 items-center justify-center [&>svg]:size-[15px]",
                          item.tone === "danger"
                            ? "text-red"
                            : item.selected
                              ? "text-beige"
                              : "text-fg-2",
                        )}
                      >
                        {item.icon}
                      </span>
                    )}
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span
                        className={cn(
                          "truncate font-text text-[13px] leading-[1.4]",
                          item.selected ? "font-semibold" : "font-medium",
                          item.tone === "danger" ? "text-red" : "text-fg",
                        )}
                      >
                        {item.label}
                      </span>
                      {item.description && (
                        <span className="truncate font-text text-[11px] leading-[1.4] text-fg-3">
                          {item.description}
                        </span>
                      )}
                    </span>
                    {item.note && (
                      <span className="shrink-0 font-text text-[11px] leading-[1.4] text-fg-3">
                        {item.note}
                      </span>
                    )}
                    {item.selected && (
                      <CheckCircleIcon
                        weight="fill"
                        className="size-3.5 shrink-0 text-beige"
                      />
                    )}
                  </>
                );
                const role =
                  hasChoice && item.selected !== undefined
                    ? "menuitemradio"
                    : "menuitem";
                const shared = {
                  role,
                  "aria-checked":
                    role === "menuitemradio" ? item.selected : undefined,
                  "aria-disabled": item.disabled || undefined,
                  tabIndex: -1,
                  className: itemClass,
                };

                return item.href && !item.disabled ? (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => close(false)}
                    {...shared}
                  >
                    {content}
                  </Link>
                ) : (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.disabled) return;
                      close();
                      item.onSelect?.();
                    }}
                    {...shared}
                  >
                    {content}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
