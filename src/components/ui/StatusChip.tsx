import { DotPill } from "@/components/ui/DotPill";
import { unitStatuses, type UnitStatus } from "@/lib/unit-status";

/** Pill showing the sales status of a unit. */
export function StatusChip({
  status,
  className,
}: {
  status: UnitStatus;
  className?: string;
}) {
  const { label, color } = unitStatuses[status];
  return <DotPill label={label} color={color} className={className} />;
}
