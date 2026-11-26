"use client";

import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  /** `md` = 640px (choices, forms), `sm` = 480px (confirmations). */
  size?: "md" | "sm";
  /** Rendered above the title, e.g. a round icon of a confirmation. */
  icon?: ReactNode;
  className?: string;
};

/**
 * Dialog over a dimmed, blurred page. Built on the native <dialog>, so focus
 * is trapped and Escape closes it.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  icon,
  className,
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();

    // Next.js keeps the previous page mounted but hidden after a navigation.
    // A modal <dialog> left open there would keep the whole document inert,
    // so always close it when this effect is torn down.
    return () => {
      if (dialog.open) dialog.close();
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      // A click on the backdrop lands on the <dialog> element itself.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={cn(
        "mx-auto mt-[min(220px,12vh)] max-w-[calc(100%-2rem)] rounded-3xl border border-line bg-popover p-0 text-fg shadow-float backdrop:bg-[#0A0A0CB8] backdrop:backdrop-blur-[3px]",
        size === "sm" ? "w-[480px]" : "w-[640px]",
        className,
      )}
    >
      <div
        className={cn("flex flex-col p-7", size === "sm" ? "gap-5" : "gap-6")}
      >
        {icon}
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1.5">
            <h2
              id={titleId}
              className={cn(
                "font-title leading-[1.2] font-medium text-fg",
                size === "sm" ? "text-[22px]" : "text-2xl",
              )}
            >
              {title}
            </h2>
            {description && (
              <p className="font-text text-sm leading-[1.4] text-fg-2">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Zavřít"
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-control text-fg-2 transition-colors hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-beige"
          >
            <X className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
