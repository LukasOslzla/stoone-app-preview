import { Fragment } from "react";
import { QuestionIcon } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/cn";

type SiteStatusBarProps = {
  online: boolean;
  domain: string;
  /** Label / value pairs shown after the status. */
  facts: { label: string; value: string }[];
  /** Help link on the right; shown when both are given. */
  helpLabel?: string;
  onHelp?: () => void;
};

/** Strip with the state of the public web and a few key numbers. */
export function SiteStatusBar({
  online,
  domain,
  facts,
  helpLabel,
  onHelp,
}: SiteStatusBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-[18px] border border-line-soft bg-card px-5 py-4">
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-full",
            online ? "bg-green/12" : "bg-red/12",
          )}
        >
          <span
            className={cn(
              "size-2 rounded-full",
              online ? "bg-green" : "bg-red",
            )}
          />
        </span>
        <div className="flex flex-col gap-px">
          <p className="font-text text-sm leading-[1.4] font-semibold text-fg">
            {online ? "Web je online" : "Web je offline"}
          </p>
          <p className="font-text text-[13px] leading-[1.4] text-beige">
            {domain}
          </p>
        </div>
      </div>

      {facts.map((fact) => (
        <Fragment key={fact.label}>
          <span aria-hidden className="hidden h-8 w-px bg-line-soft sm:block" />
          <div className="flex flex-col gap-px">
            <p className="font-text text-xs leading-[1.4] text-fg-3">
              {fact.label}
            </p>
            <p className="font-text text-sm leading-[1.4] font-semibold text-fg">
              {fact.value}
            </p>
          </div>
        </Fragment>
      ))}

      {helpLabel && onHelp && (
        <button
          type="button"
          onClick={onHelp}
          className="ml-auto flex items-center gap-2 rounded-md font-text text-[13px] leading-[1.4] font-semibold text-fg-2 transition-colors hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige"
        >
          <QuestionIcon weight="fill" className="size-4 text-fg-3" />
          {helpLabel}
        </button>
      )}
    </div>
  );
}
