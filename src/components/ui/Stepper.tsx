import { Fragment } from "react";
import { CheckCircleIcon } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/cn";

type StepperProps = {
  steps: string[];
  /** Index of the current step, starting at 0. */
  current: number;
};

/** Numbered steps of a wizard with completed / current / upcoming states. */
export function Stepper({ steps, current }: StepperProps) {
  return (
    <ol className="flex flex-wrap items-center gap-3.5">
      {steps.map((label, index) => {
        const done = index < current;
        const active = index === current;

        return (
          <Fragment key={label}>
            {index > 0 && (
              <li
                aria-hidden
                className={cn(
                  "h-px w-12",
                  index <= current ? "bg-beige" : "bg-line",
                )}
              />
            )}
            <li
              aria-current={active ? "step" : undefined}
              className="flex items-center gap-2.5"
            >
              <span
                className={cn(
                  "flex size-7 items-center justify-center rounded-full border font-text text-xs leading-none font-bold",
                  active && "border-beige bg-beige text-ink",
                  done && "border-beige bg-[#CAC3B826] text-beige",
                  !active && !done && "border-line text-fg-3",
                )}
              >
                {done ? (
                  <CheckCircleIcon weight="fill" className="size-3.5" />
                ) : (
                  index + 1
                )}
              </span>
              <span
                className={cn(
                  "font-text text-sm leading-[1.4]",
                  active
                    ? "font-semibold text-fg"
                    : done
                      ? "font-medium text-fg-2"
                      : "font-medium text-fg-3",
                )}
              >
                {label}
              </span>
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
