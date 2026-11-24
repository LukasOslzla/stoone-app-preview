import type { Icon } from "@phosphor-icons/react";
import {
  CaretRightIcon,
  ClockIcon,
  EyeSlashIcon,
  ProhibitIcon,
} from "@phosphor-icons/react/ssr";
import { Card, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { UnitAlert } from "@/lib/dashboard";

const icons: Record<UnitAlert["kind"], Icon> = {
  noInquiries: ProhibitIcon,
  noViews: EyeSlashIcon,
  expiring: ClockIcon,
};

/** Units that need someone's attention. Rows will link to the unit detail. */
export function AlertsCard({ alerts }: { alerts: UnitAlert[] }) {
  return (
    <Card className="flex min-w-0 flex-col gap-4 p-6">
      <CardHeader
        title="Vyžaduje pozornost"
        description="Jednotky, které potřebují zásah"
        action={
          alerts.length > 0 && (
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#F2C94C1F] px-1.5 font-text text-xs leading-none font-bold text-yellow">
              {alerts.length}
            </span>
          )
        }
      />

      <ul className="flex flex-col gap-2.5">
        {alerts.map((alert) => {
          const IconComponent = icons[alert.kind];
          const critical = alert.severity === "critical";

          return (
            <li key={`${alert.unit}-${alert.kind}`}>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-[14px] border border-line-soft bg-inset p-3.5 text-left transition-colors hover:border-line focus-visible:outline-[1.5px] focus-visible:outline-beige"
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-[10px]",
                    critical
                      ? "bg-[#F0524B1F] text-red"
                      : "bg-[#F2C94C1F] text-yellow",
                  )}
                >
                  <IconComponent weight="fill" className="size-4" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="font-text text-sm leading-[1.4] font-bold text-fg">
                    {alert.unit}
                  </span>
                  <span className="font-text text-[13px] leading-[1.4] text-fg-2">
                    {alert.message}
                  </span>
                </span>
                <CaretRightIcon
                  weight="fill"
                  className="size-4 shrink-0 text-fg-3"
                />
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
