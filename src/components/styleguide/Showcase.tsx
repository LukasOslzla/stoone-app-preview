import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** One chapter of the styleguide; `id` is the anchor used by the side menu. */
export function Chapter({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="flex scroll-mt-8 flex-col gap-5">
      <div className="flex flex-col gap-1.5 border-b border-line-soft pb-4">
        <h2 className="font-title text-2xl leading-[1.2] font-medium text-fg">
          {title}
        </h2>
        {description && (
          <p className="max-w-[720px] font-text text-sm leading-[1.5] text-fg-2">
            {description}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">{children}</div>
    </section>
  );
}

/** A component with its name, where to import it from and a live example. */
export function Demo({
  name,
  source,
  note,
  wide = false,
  children,
}: {
  name: string;
  /** Path under `src/components`, e.g. "ui/Button", or a full "src/…" path. */
  source?: string;
  /** Which props / variants matter. */
  note?: ReactNode;
  /** Spans both columns. */
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <article
      className={cn(
        "flex min-w-0 flex-col gap-4 rounded-2xl border border-line-soft bg-[#18181C] p-5",
        wide && "xl:col-span-2",
      )}
    >
      <header className="flex flex-col gap-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h3 className="font-text text-[15px] leading-[1.4] font-semibold text-fg">
            {name}
          </h3>
          {source && (
            <code className="font-mono text-[11px] leading-[1.4] text-fg-3">
              {source.startsWith("src/") ? source : `@/components/${source}`}
            </code>
          )}
        </div>
        {note && (
          <p className="font-text text-[13px] leading-[1.5] text-fg-2 [&_code]:rounded [&_code]:bg-white/5 [&_code]:px-1 [&_code]:font-mono [&_code]:text-xs [&_code]:text-fg">
            {note}
          </p>
        )}
      </header>
      <div className="flex min-w-0 flex-col gap-4">{children}</div>
    </article>
  );
}

/** Horizontal row of examples inside a `Demo`. */
export function Row({
  label,
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <p className="font-text text-[11px] leading-[1.4] font-bold tracking-[0.8px] text-fg-3 uppercase">
          {label}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}
