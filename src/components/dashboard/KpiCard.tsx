import type { Icon } from "@phosphor-icons/react";
import {
  BookmarkSimpleIcon,
  ChartPieSliceIcon,
  ChatCenteredTextIcon,
  EyeIcon,
} from "@phosphor-icons/react/ssr";
import { Card } from "@/components/ui/Card";
import { DeltaBadge } from "@/components/ui/DeltaBadge";
import type { Kpi, KpiIcon } from "@/lib/dashboard";

const icons: Record<KpiIcon, Icon> = {
  visits: EyeIcon,
  inquiries: ChatCenteredTextIcon,
  conversion: ChartPieSliceIcon,
  reserved: BookmarkSimpleIcon,
};

/** Single headline metric with its change against the previous period. */
export function KpiCard({ kpi }: { kpi: Kpi }) {
  const IconComponent = icons[kpi.icon];

  return (
    <Card className="flex flex-col gap-[18px] p-5">
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-[10px] border border-line-soft bg-control">
          <IconComponent weight="fill" className="size-4 text-fg" />
        </div>
        <h3 className="min-w-0 flex-1 truncate font-text text-sm leading-[1.4] font-semibold text-fg-2">
          {kpi.label}
        </h3>
        {kpi.delta && (
          <DeltaBadge
            label={kpi.delta.label}
            trend={kpi.delta.trend}
            tone={kpi.delta.tone}
          />
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="font-title text-[38px] leading-none font-medium tracking-[-1px] whitespace-nowrap text-fg">
          {kpi.value}
        </p>
        <p className="font-text text-[13px] leading-[1.4] text-fg-3">
          {kpi.caption}
        </p>
      </div>
    </Card>
  );
}
