import { Fragment } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import type { FunnelStep } from "@/lib/dashboard";
import { cn } from "@/lib/cn";

/** Visit → inquiry → reservation funnel with a note between the steps. */
export function FunnelCard({ steps }: { steps: FunnelStep[] }) {
  return (
    <Card className="flex min-w-0 flex-col gap-[18px] p-6">
      <CardHeader
        title="Od návštěvy k rezervaci"
        description="Jak se návštěvníci mění v zájemce"
      />

      <ol className="flex flex-col gap-3.5">
        {steps.map((step, index) => (
          <Fragment key={step.label}>
            <li className="flex items-end gap-2.5">
              <span
                className={cn(
                  "font-title leading-none font-medium tracking-[-0.5px] text-fg",
                  index === 0 ? "text-4xl" : "text-3xl",
                )}
              >
                {step.value}
              </span>
              <span className="pb-[3px] font-text text-sm leading-[1.4] text-fg-2">
                {step.label}
              </span>
            </li>
            {step.note && (
              <li className="flex items-center gap-2.5 pl-0.5">
                <span className="h-[18px] w-px shrink-0 bg-line" />
                <span className="font-text text-xs leading-[1.4] text-fg-3">
                  {step.note}
                </span>
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </Card>
  );
}
