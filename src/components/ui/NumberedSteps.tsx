import type { ReactNode } from "react";

type NumberedStepsProps = {
  steps: { title: string; text?: ReactNode }[];
};

/** Short how-to: numbered steps with a title and one line of explanation. */
export function NumberedSteps({ steps }: NumberedStepsProps) {
  return (
    <ol className="flex flex-col gap-3.5">
      {steps.map((step, index) => (
        <li key={step.title} className="flex items-start gap-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-control font-text text-[13px] leading-none font-bold text-beige">
            {index + 1}
          </span>
          <span className="flex min-w-0 flex-col gap-0.5 pt-1">
            <span className="font-text text-sm leading-[1.4] font-semibold text-fg">
              {step.title}
            </span>
            {step.text && (
              <span className="font-text text-[13px] leading-[1.5] text-fg-2">
                {step.text}
              </span>
            )}
          </span>
        </li>
      ))}
    </ol>
  );
}
