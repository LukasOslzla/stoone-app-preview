"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

type DisclosureProps = {
  /** Text of the row that opens the section. */
  label: string;
  /** Icon before the label. */
  icon?: ReactNode;
  defaultOpen?: boolean;
  /** Content shown when open. */
  children: ReactNode;
  className?: string;
};

/** Row that expands a rarely needed part of a form ("Pokročilé…"). */
export function Disclosure({
  label,
  icon,
  defaultOpen = false,
  children,
  className,
}: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className={cn("flex flex-col border-t border-line-soft", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex items-center gap-2.5 rounded-md pt-4 text-left font-text text-[13px] leading-[1.4] font-medium transition-colors hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige [&>svg]:size-3.5 [&>svg]:shrink-0",
          open ? "text-fg" : "text-fg-2",
        )}
      >
        {icon}
        <span className="min-w-0 flex-1">{label}</span>
        <CaretDownIcon
          weight="fill"
          className={cn(
            "!size-[13px] text-fg-3 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      <div id={id} hidden={!open} className="flex flex-col gap-4 pt-4">
        {children}
      </div>
    </div>
  );
}
