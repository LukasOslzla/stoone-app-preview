import { Card, CardHeader } from "@/components/ui/Card";
import type { SalesStatus } from "@/lib/dashboard";
import { formatNumber, plural } from "@/lib/format";
import { unitStatuses, type UnitStatus } from "@/lib/unit-status";

/** Order of the solid segments in the bar. */
const takenOrder: UnitStatus[] = ["sold", "reserved", "preReserved"];
/** Order of the rows in the legend. */
const legendOrder: UnitStatus[] = [
  "free",
  "reserved",
  "preReserved",
  "sold",
  "notForSale",
];

const ticks = (color: string) =>
  `repeating-linear-gradient(90deg, ${color} 0 2px, transparent 2px 6px)`;

/** How many units are still free, with a breakdown by sales status. */
export function SalesStatusCard({ status }: { status: SalesStatus }) {
  const { counts, total } = status;
  const taken = takenOrder.reduce((sum, key) => sum + counts[key], 0);

  return (
    <Card className="flex min-w-0 flex-col gap-5 p-6">
      <CardHeader
        title="Stav prodeje"
        description="Kolik jednotek je ještě volných"
      />

      <p className="flex items-end gap-2.5">
        <span className="font-title text-5xl leading-none font-medium tracking-[-1px] text-fg">
          {formatNumber(counts.free)}
        </span>
        <span className="pb-1.5 font-text text-sm leading-[1.4] text-fg-2">
          {plural(counts.free, ["volná", "volné", "volných"])} z{" "}
          {formatNumber(total)} jednotek
        </span>
      </p>

      {/* Solid segments = taken units, ticks = free and not-for-sale units. */}
      <div aria-hidden className="flex h-2.5 gap-1 overflow-hidden">
        {taken > 0 && (
          <div
            className="flex h-full gap-0.5 overflow-hidden rounded-full"
            style={{ flex: `${taken} 0 0` }}
          >
            {takenOrder.map((key) =>
              counts[key] > 0 ? (
                <span
                  key={key}
                  className="h-full min-w-[3px]"
                  style={{
                    flex: `${counts[key]} 0 0`,
                    backgroundImage: `linear-gradient(90deg, ${unitStatuses[key].color}, color-mix(in srgb, ${unitStatuses[key].color} 80%, transparent))`,
                  }}
                />
              ) : null,
            )}
          </div>
        )}
        <span
          className="h-full"
          style={{
            flex: `${counts.free} 0 0`,
            backgroundImage: ticks(
              "color-mix(in srgb, var(--color-green) 35%, transparent)",
            ),
          }}
        />
        {counts.notForSale > 0 && (
          <span
            className="h-full min-w-0.5"
            style={{
              flex: `${counts.notForSale} 0 0`,
              backgroundImage: ticks(
                "color-mix(in srgb, var(--color-tint) 12%, transparent)",
              ),
            }}
          />
        )}
      </div>

      <dl className="flex flex-col">
        {legendOrder.map((key) => (
          <div
            key={key}
            className="flex items-center gap-3 border-line-soft py-[13px] not-first:border-t"
          >
            <span
              className="size-[9px] shrink-0 rounded-full"
              style={{ backgroundColor: unitStatuses[key].color }}
            />
            <dt className="min-w-0 flex-1 font-text text-sm leading-[1.4] font-medium text-fg-2">
              {unitStatuses[key].label}
            </dt>
            <dd className="font-title text-base leading-[1.4] font-medium text-fg">
              {formatNumber(counts[key])}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
