import type { ReactNode } from "react";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { DotPill } from "@/components/ui/DotPill";
import { TabNav, type TabItem } from "@/components/ui/TabNav";

type DetailScaffoldProps = {
  breadcrumb: BreadcrumbItem[];
  title: string;
  status?: { label: string; color: string };
  /** Extra controls right after the status pill (e.g. previous / next). */
  titleExtra?: ReactNode;
  /** One line under the title. */
  description?: string;
  /** Buttons on the right of the title (e.g. "Uložit změny"). */
  actions?: ReactNode;
  tabs?: TabItem[];
  /** Content of the active tab. */
  children: ReactNode;
};

/**
 * Frame of a detail page (building, floor, unit…): breadcrumb, title with a
 * status pill, actions, tabs and the tab content below.
 */
export function DetailScaffold({
  breadcrumb,
  title,
  status,
  titleExtra,
  description,
  actions,
  tabs,
  children,
}: DetailScaffoldProps) {
  return (
    <div className="flex flex-col gap-5 px-8 pt-7 pb-8">
      <Breadcrumb items={breadcrumb} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-title text-3xl leading-[1.2] font-medium text-fg">
              {title}
            </h1>
            {status && (
              <DotPill label={status.label} color={status.color} size="md" />
            )}
            {titleExtra}
          </div>
          {description && (
            <p className="font-text text-[13px] leading-[1.4] text-fg-3">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2.5">{actions}</div>}
      </div>

      {tabs && <TabNav tabs={tabs} label={`Sekce: ${title}`} />}

      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}
