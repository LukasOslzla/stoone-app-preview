"use client";

import { AreaChart } from "@/components/charts/AreaChart";
import { Card, CardHeader } from "@/components/ui/Card";
import { DeltaBadge } from "@/components/ui/DeltaBadge";
import type { VisitsSeries } from "@/lib/dashboard";
import { formatDayMonth, formatNumber, plural } from "@/lib/format";

/** Daily website visits for the selected period. */
export function VisitsCard({ visits }: { visits: VisitsSeries }) {
  const points = visits.days.map((day) => ({
    label: formatDayMonth(day.date),
    value: day.value,
  }));

  // A label every 5 days, like the design (24. 10., 29. 10., …).
  const xLabels = points
    .filter((_, index) => index % 5 === 0)
    .map((point) => point.label);

  const yTicks = [1, 0.75, 0.5, 0.25, 0].map((ratio) =>
    Math.round(visits.max * ratio),
  );

  const peakIndex = points.reduce(
    (best, point, index) => (point.value > points[best].value ? index : best),
    0,
  );

  return (
    <Card className="flex min-w-0 flex-col gap-5 p-6">
      <CardHeader
        title="Návštěvnost webu"
        description={`Počet návštěv za posledních ${visits.days.length - 1} dní`}
      />

      <div className="flex items-end gap-3">
        <p className="font-title text-[34px] leading-none font-medium tracking-[-1px] text-fg">
          {formatNumber(visits.total)}
        </p>
        {visits.delta && <DeltaBadge {...visits.delta} />}
      </div>

      <AreaChart
        label="Graf denní návštěvnosti webu"
        points={points}
        max={visits.max}
        yTicks={yTicks}
        xLabels={xLabels}
        defaultActiveIndex={peakIndex}
        formatValue={(value) =>
          `${formatNumber(value)} ${plural(value, ["návštěva", "návštěvy", "návštěv"])}`
        }
      />
    </Card>
  );
}
