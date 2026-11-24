import type { ReactNode } from "react";
import type { Icon } from "@phosphor-icons/react";

type InfoStripProps = {
  icon: Icon;
  children: ReactNode;
  /** Text button on the right; without `onClick` it is inert. */
  action?: { label: string; onClick?: () => void };
};

/** Quiet one-line note on the page (hidden items, empty sections…). */
export function InfoStrip({
  icon: IconComponent,
  children,
  action,
}: InfoStripProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-[14px] border border-line-soft bg-inset px-4 py-3 font-text text-[13px] leading-[1.4] text-fg-2">
      <IconComponent weight="fill" className="size-[15px] shrink-0 text-fg-3" />
      <div className="min-w-[240px] flex-1">{children}</div>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="rounded-md font-semibold transition-colors hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
