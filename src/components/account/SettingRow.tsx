import type { ReactNode } from "react";
import type { Icon } from "@phosphor-icons/react";

type SettingRowProps = {
  icon: Icon;
  title: string;
  description: string;
  /** Button or link on the right. */
  action?: ReactNode;
};

/** Inset row describing one setting with its action ("Heslo – Změnit heslo"). */
export function SettingRow({
  icon: IconComponent,
  title,
  description,
  action,
}: SettingRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line-soft bg-inset px-3.5 py-3">
      <IconComponent weight="fill" className="size-4 shrink-0 text-fg-3" />
      <div className="flex min-w-[160px] flex-1 flex-col gap-px">
        <p className="font-text text-sm leading-[1.4] font-semibold text-fg">
          {title}
        </p>
        <p className="font-text text-xs leading-[1.4] text-fg-3">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
