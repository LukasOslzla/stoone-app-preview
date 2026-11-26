import { Fragment } from "react";
import { CheckCircleIcon, CheckIcon } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/cn";

type StepperProps = {
  steps: string[];
  /** Index of the current step, starting at 0. */
  current: number;
  /**
   * `plain` = number and label (admin wizards), `pills` = the current step
   * sits in a pill (configurator).
   */
  variant?: "plain" | "pills";
  /** Makes finished steps clickable (to go back to them). */
  onSelect?: (index: number) => void;
};

/**
 * Numbered steps of a wizard with completed / current / upcoming states.
 * A completed step always has a green check, in both themes.
 */
export function Stepper({
  steps,
  current,
  variant = "plain",
  onSelect,
}: StepperProps) {
  const pills = variant === "pills";

  return (
    <ol
      className={cn("flex flex-wrap items-center", pills ? "gap-2" : "gap-3.5")}
    >
      {steps.map((label, index) => {
        const done = index < current;
        const active = index === current;
        const clickable = done && onSelect !== undefined;

        const content = (
          <>
            <span
              className={cn(
                "flex shrink-0 items-center justify-center rounded-full border font-text leading-none font-bold",
                pills ? "size-6 text-[11px]" : "size-7 text-xs",
                active && "border-beige bg-beige text-ink",
                done && "border-green bg-green/12 text-green",
                !active && !done && "border-line text-fg-3",
              )}
            >
              {done ? (
                pills ? (
                  <CheckIcon weight="bold" className="size-[13px]" />
                ) : (
                  <CheckCircleIcon weight="fill" className="size-3.5" />
                )
              ) : (
                index + 1
              )}
            </span>
            <span
              className={cn(
                "font-text leading-[1.4]",
                pills ? "text-[13px]" : "text-sm",
                active
                  ? "font-semibold text-fg"
                  : done
                    ? "font-medium text-fg-2"
                    : "font-medium text-fg-3",
              )}
            >
              {label}
            </span>
          </>
        );

        const itemClass = cn(
          "flex items-center",
          pills
            ? cn(
                "h-10 gap-2.5 rounded-full border pr-3.5 pl-2",
                active ? "border-beige/35 bg-beige/10" : "border-transparent",
              )
            : "gap-2.5",
        );

        return (
          <Fragment key={label}>
            {index > 0 && (
              <li
                aria-hidden
                className={cn(
                  "h-px",
                  pills ? "w-6 bg-line" : "w-12",
                  !pills && (index <= current ? "bg-beige" : "bg-line"),
                )}
              />
            )}
            <li aria-current={active ? "step" : undefined}>
              {clickable ? (
                <button
                  type="button"
                  onClick={() => onSelect(index)}
                  className={cn(
                    itemClass,
                    "transition-colors hover:bg-tint/5 focus-visible:outline-[1.5px] focus-visible:outline-beige",
                  )}
                >
                  {content}
                </button>
              ) : (
                <span className={itemClass}>{content}</span>
              )}
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
