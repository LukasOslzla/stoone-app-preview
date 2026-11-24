import type { ReactNode } from "react";
import Link from "next/link";
import { XCircleIcon } from "@phosphor-icons/react/ssr";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";

type FlowHeaderProps = {
  breadcrumb: BreadcrumbItem[];
  /** Where "Zrušit" leads. */
  cancelHref: string;
  /** The question the screen asks; omit when the content has its own heading. */
  heading?: { title: string; description?: ReactNode } | null;
  /** Rendered between the breadcrumb and the heading (e.g. a stepper). */
  stepper?: ReactNode;
};

/**
 * Top of a focused task ("Nový byt", "Nahrát z Excelu"): breadcrumb with a
 * cancel link, optional stepper and the question the screen asks.
 */
export function FlowHeader({
  breadcrumb,
  cancelHref,
  heading,
  stepper,
}: FlowHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <Breadcrumb items={breadcrumb} />
        <Link
          href={cancelHref}
          className="flex items-center gap-1.5 rounded-md font-text text-[13px] leading-[1.4] font-semibold text-fg-2 transition-colors hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige"
        >
          <XCircleIcon weight="fill" className="size-[15px] text-fg-3" />
          Zrušit
        </Link>
      </div>

      {stepper}

      {heading && (
        <div className="flex flex-col gap-1.5">
          <h1 className="font-title text-[28px] leading-[1.2] font-medium text-fg">
            {heading.title}
          </h1>
          {heading.description && (
            <p className="font-text text-sm leading-[1.4] text-fg-2">
              {heading.description}
            </p>
          )}
        </div>
      )}
    </>
  );
}
