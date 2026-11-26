"use client";

import { useEffect, useRef, useState } from "react";
import {
  CaretLeftIcon,
  CaretRightIcon,
  CheckIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

export type PillStep = {
  id: string;
  label: string;
  /** Shows the green check of a finished step. */
  done?: boolean;
};

type PillStepsProps = {
  steps: PillStep[];
  value: string;
  onChange: (id: string) => void;
  /** Accessible name of the group. */
  label: string;
  className?: string;
};

/**
 * Row of pills for the sub-steps of a step. When the pills do not fit, the
 * row scrolls sideways: the cut-off edge fades out and a round arrow button
 * moves the row (the left one appears once it has been scrolled).
 */
export function PillSteps({
  steps,
  value,
  onChange,
  label,
  className,
}: PillStepsProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState({ left: false, right: false });

  function measure() {
    const element = scroller.current;
    if (!element) return;
    const left = element.scrollLeft > 2;
    const right =
      element.scrollLeft + element.clientWidth < element.scrollWidth - 2;
    setOverflow((current) =>
      current.left === left && current.right === right
        ? current
        : { left, right },
    );
  }

  useEffect(() => {
    measure();
    const element = scroller.current;
    if (!element) return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [steps.length]);

  // Keep the current pill in view.
  useEffect(() => {
    scroller.current
      ?.querySelector<HTMLElement>("[aria-pressed=true]")
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [value]);

  const scrollBy = (direction: 1 | -1) =>
    scroller.current?.scrollBy({
      left: direction * scroller.current.clientWidth * 0.7,
      behavior: "smooth",
    });

  const arrow = (direction: 1 | -1) => (
    <button
      type="button"
      aria-label={direction === 1 ? "Další podkroky" : "Předchozí podkroky"}
      title={direction === 1 ? "Další podkroky" : "Předchozí podkroky"}
      onClick={() => scrollBy(direction)}
      className="flex size-[38px] shrink-0 items-center justify-center rounded-full border border-line-soft bg-inset text-fg transition-colors hover:border-line focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-beige"
    >
      {direction === 1 ? (
        <CaretRightIcon weight="fill" className="size-3.5" />
      ) : (
        <CaretLeftIcon weight="fill" className="size-3.5" />
      )}
    </button>
  );

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {overflow.left && arrow(-1)}

      <div className="relative min-w-0 overflow-hidden rounded-full border border-line-soft bg-inset">
        <div
          ref={scroller}
          role="group"
          aria-label={label}
          onScroll={measure}
          className="flex gap-0.5 overflow-x-auto p-[3px] [scrollbar-width:none]"
        >
          {steps.map((step) => {
            const selected = step.id === value;
            return (
              <button
                key={step.id}
                type="button"
                aria-pressed={selected}
                onClick={() => onChange(step.id)}
                className={cn(
                  "flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3.5 font-text text-[13px] leading-none font-semibold whitespace-nowrap transition-colors focus-visible:outline-[1.5px] focus-visible:outline-beige",
                  selected
                    ? "bg-control text-fg"
                    : step.done
                      ? "text-fg-2 hover:text-fg"
                      : "text-fg-3 hover:text-fg",
                )}
              >
                {step.done && !selected && (
                  <CheckIcon weight="bold" className="size-3 text-green" />
                )}
                {step.label}
              </button>
            );
          })}
        </div>
        {overflow.right && (
          <span className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-linear-to-l from-inset to-transparent" />
        )}
        {overflow.left && (
          <span className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-linear-to-r from-inset to-transparent" />
        )}
      </div>

      {overflow.right && arrow(1)}
    </div>
  );
}
