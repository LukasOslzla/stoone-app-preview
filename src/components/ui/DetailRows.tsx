import type { ReactNode } from "react";

export type DetailRow = {
  label: string;
  /** Small note under the label. */
  note?: string;
  value: ReactNode;
};

/** Read-only label → value rows separated by hairlines. */
export function DetailRows({ rows }: { rows: DetailRow[] }) {
  return (
    <dl className="flex flex-col">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-center gap-3 border-t border-line-soft py-[13px]"
        >
          <dt className="flex min-w-0 flex-1 flex-col gap-px font-text text-sm leading-[1.4] text-fg-2">
            {row.label}
            {row.note && (
              <span className="text-xs leading-[1.4] text-fg-3">
                {row.note}
              </span>
            )}
          </dt>
          <dd className="shrink-0 font-text text-sm leading-[1.4] font-semibold text-fg">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
