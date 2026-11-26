"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { DotsThreeIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

export type ActionMenuItem = {
  label: string;
  icon?: ReactNode;
  tone?: "default" | "danger";
  onSelect: () => void;
};

type ActionMenuProps = {
  /** Accessible name of the trigger, e.g. "Akce: Tereza Pilipová". */
  label: string;
  items: ActionMenuItem[];
  /** Classes of the "…" trigger button. */
  className?: string;
};

const MENU_WIDTH = 176;

/**
 * "…" button with a small menu of row actions. The menu is positioned
 * against the viewport, so scrolling containers (tables) do not clip it.
 */
export function ActionMenu({ label, items, className }: ActionMenuProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const open = position !== null;

  useEffect(() => {
    if (!open) return;
    const close = () => setPosition(null);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("pointerdown", close);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", close);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function toggle() {
    if (open) {
      setPosition(null);
      return;
    }
    const rect = triggerRef.current!.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 6,
      left: Math.max(8, rect.right - MENU_WIDTH),
    });
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        // Keep the window listener from closing the menu before the toggle.
        onPointerDown={(event) => event.stopPropagation()}
        onClick={toggle}
        className={cn(
          "inline-flex size-7 items-center justify-center rounded-full text-fg-3 transition-colors hover:bg-tint/5 hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-beige",
          className,
        )}
      >
        <DotsThreeIcon weight="bold" className="size-[18px]" />
      </button>

      {position && (
        <div
          role="menu"
          onPointerDown={(event) => event.stopPropagation()}
          style={{ top: position.top, left: position.left, width: MENU_WIDTH }}
          className="fixed z-50 flex flex-col rounded-xl border border-line bg-popover p-1 shadow-float"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              autoFocus={item === items[0]}
              onClick={() => {
                setPosition(null);
                item.onSelect();
              }}
              className={cn(
                "flex h-9 items-center gap-2 rounded-lg px-2.5 text-left font-text text-[13px] leading-none font-semibold transition-colors hover:bg-tint/5 focus-visible:bg-tint/5 focus-visible:outline-none",
                item.tone === "danger" ? "text-red" : "text-fg",
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
