"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/Card";
import {
  DataTable,
  sortRows,
  type DataTableColumn,
  type SortState,
} from "@/components/ui/DataTable";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { StatusChip } from "@/components/ui/StatusChip";
import { cn } from "@/lib/cn";
import type { UnitInterest } from "@/lib/dashboard";
import { formatNumber, formatPrice } from "@/lib/format";

const strong = "font-bold text-fg";

const columns: DataTableColumn<UnitInterest>[] = [
  {
    id: "unit",
    header: "Jednotka",
    width: "w-[76px]",
    sortValue: (row) => row.unit,
    cell: (row) => <span className={strong}>{row.unit}</span>,
  },
  {
    id: "floor",
    header: "Patro",
    width: "w-[70px]",
    className: "font-medium",
    sortValue: (row) => row.floor,
    cell: (row) => `${row.floor}. NP`,
  },
  {
    id: "layout",
    header: "Dispozice",
    width: "w-[86px]",
    className: "font-medium",
    cell: (row) => row.layout,
  },
  {
    id: "views",
    header: "Zobrazení",
    sortValue: (row) => row.views,
    cell: (row) => <span className={strong}>{formatNumber(row.views)}</span>,
  },
  {
    id: "inquiries",
    header: "Poptávky",
    width: "w-[86px]",
    sortValue: (row) => row.inquiries,
    cell: (row) => (
      <span
        className={cn(
          "font-bold",
          row.inquiries > 0 ? "text-green" : "text-yellow",
        )}
      >
        {formatNumber(row.inquiries)}
      </span>
    ),
  },
  {
    id: "price",
    header: "Cena",
    width: "w-[124px]",
    align: "right",
    sortValue: (row) => row.price,
    cell: (row) => (
      <span className="font-medium text-fg">{formatPrice(row.price)}</span>
    ),
  },
  {
    id: "status",
    header: "Stav",
    width: "w-[128px]",
    className: "pl-4",
    cell: (row) => <StatusChip status={row.status} />,
  },
];

type UnitsInterestCardProps = {
  units: UnitInterest[];
  /** Target of the "Zobrazit vše" link; hidden when missing. */
  allUnitsHref?: string;
};

/** Units ranked by interest: detail views and inquiries per unit. */
export function UnitsInterestCard({
  units,
  allUnitsHref,
}: UnitsInterestCardProps) {
  const [sort, setSort] = useState<SortState>({
    columnId: "views",
    direction: "desc",
  });

  // The switch is just a shortcut for sorting by views.
  const interestMode =
    sort.columnId !== "views"
      ? ""
      : sort.direction === "desc"
        ? "most"
        : "least";

  return (
    <Card className="flex min-w-0 flex-col gap-4 p-6">
      <CardHeader
        title="Jednotky podle zájmu"
        description="Zobrazení detailu a poptávky na jednotku"
        action={
          <div className="flex items-center gap-4">
            <SegmentedControl
              label="Řazení podle zájmu"
              value={interestMode}
              onChange={(mode) =>
                setSort({
                  columnId: "views",
                  direction: mode === "least" ? "asc" : "desc",
                })
              }
              options={[
                { value: "most", label: "Nejvíce zájmu" },
                { value: "least", label: "Nejméně zájmu" },
              ]}
            />
            {allUnitsHref && (
              <Link
                href={allUnitsHref}
                className="rounded-md font-text text-[13px] leading-[1.4] font-semibold whitespace-nowrap text-beige transition-colors hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige"
              >
                Zobrazit vše
              </Link>
            )}
          </div>
        }
      />

      <DataTable
        size="sm"
        columns={columns}
        rows={sortRows(units, columns, sort)}
        rowKey={(row) => row.unit}
        sort={sort}
        onSortChange={setSort}
        firstSortDirection="desc"
        minWidth={620}
      />
    </Card>
  );
}
