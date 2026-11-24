"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircleIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { PageIntro } from "@/components/app/PageIntro";
import { AddUnitsButton } from "@/components/units/AddUnitsButton";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import {
  DataTable,
  sortRows,
  type DataTableColumn,
  type SortState,
} from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { SearchInput } from "@/components/ui/SearchInput";
import { TabNav } from "@/components/ui/TabNav";
import { formatPrice, plural } from "@/lib/format";
import { unitStatuses, type UnitStatus } from "@/lib/unit-status";
import { formatArea, type Unit, type UnitCounts } from "@/lib/units";

const PAGE_SIZE = 12;

const statusFilters: UnitStatus[] = ["free", "preReserved", "reserved", "sold"];

/** Columns need the project to link each flat to its detail. */
const buildColumns = (base: string): DataTableColumn<Unit>[] => [
  {
    id: "name",
    header: "Byt",
    sortValue: (unit) => unit.name,
    cell: (unit) => (
      <Link
        href={`${base}/${unit.id}`}
        className="rounded-sm text-sm font-semibold text-fg transition-colors hover:text-beige focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-beige"
      >
        {unit.name}
      </Link>
    ),
  },
  {
    id: "floor",
    header: "Patro",
    width: "w-[136px]",
    sortValue: (unit) => unit.floor,
    cell: (unit) => `${unit.floor}. patro · ${unit.building}`,
  },
  {
    id: "layout",
    header: "Dispozice",
    width: "w-[136px]",
    cell: (unit) => unit.layout,
  },
  {
    id: "area",
    header: "Plocha",
    width: "w-[126px]",
    align: "right",
    sortValue: (unit) => unit.area,
    cell: (unit) => formatArea(unit.area),
  },
  {
    id: "price",
    header: "Cena",
    width: "w-[176px]",
    align: "right",
    sortValue: (unit) => unit.price,
    cell: (unit) => (
      <span className="text-sm font-semibold text-fg">
        {formatPrice(unit.price)}
      </span>
    ),
  },
  {
    id: "status",
    header: "Stav",
    width: "w-[186px]",
    cell: (unit) => (
      <span className="flex items-center gap-2">
        <span
          className="size-2 shrink-0 rounded-full"
          style={{ backgroundColor: unitStatuses[unit.status].color }}
        />
        {unitStatuses[unit.status].label}
      </span>
    ),
  },
  {
    id: "floorPlan",
    header: "Půdorys",
    width: "w-[116px]",
    cell: (unit) =>
      unit.hasFloorPlan ? (
        <span className="flex items-center gap-1.5 text-fg-3">
          <CheckCircleIcon weight="fill" className="size-[15px] shrink-0" />
          Nahraný
        </span>
      ) : (
        <span className="flex items-center gap-1.5 text-beige">
          <WarningCircleIcon weight="fill" className="size-[15px] shrink-0" />
          Chybí
        </span>
      ),
  },
];

type UnitsListProps = {
  projectSlug: string;
  units: Unit[];
  counts: UnitCounts;
  /** Whether prices and statuses are synced from Realpad. */
  realpad: boolean;
};

/** "Byty": filterable, sortable and paginated list of the project's flats. */
export function UnitsList({
  projectSlug,
  units,
  counts,
  realpad,
}: UnitsListProps) {
  const [status, setStatus] = useState<UnitStatus | "all">("all");
  const [missingPlanOnly, setMissingPlanOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortState | null>(null);
  const [page, setPage] = useState(1);

  const base = `/projects/${projectSlug}/units`;
  const columns = buildColumns(base);

  const needle = query.trim().toLowerCase();
  const filtered = units.filter(
    (unit) =>
      (status === "all" || unit.status === status) &&
      (!missingPlanOnly || !unit.hasFloorPlan) &&
      (needle === "" || unit.name.toLowerCase().includes(needle)),
  );
  const sorted = sortRows(filtered, columns, sort);
  const pageCount = Math.ceil(sorted.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(pageCount, 1));
  const first = (currentPage - 1) * PAGE_SIZE;
  const rows = sorted.slice(first, first + PAGE_SIZE);
  const missingPlanCount = units.filter((unit) => !unit.hasFloorPlan).length;

  /** Any change of filters goes back to the first page. */
  function resetPage<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  return (
    <div className="flex flex-col gap-5 px-8 pt-7 pb-8">
      <PageIntro
        title="Byty"
        description={
          realpad
            ? "Ceny, plochy, stavy i půdorysy se načítají automaticky z Realpadu. Tady doplňujete dokumenty a texty pro vyhledávače."
            : "Byty spravujete sami. Přidejte je ručně, nebo jich nahrajte víc najednou z Excelu."
        }
        action={<AddUnitsButton projectSlug={projectSlug} />}
      />

      <TabNav
        label="Typ jednotek"
        tabs={[
          { label: "Byty", href: base, count: counts.units },
          { label: "Parkovací stání", count: counts.parking },
          { label: "Sklepy", count: counts.cellars },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Chip
            label="Všechny"
            selected={status === "all"}
            onClick={() => resetPage(setStatus)("all")}
          />
          {statusFilters.map((value) => (
            <Chip
              key={value}
              label={unitStatuses[value].label}
              dotColor={unitStatuses[value].color}
              selected={status === value}
              onClick={() => resetPage(setStatus)(value)}
            />
          ))}
          <span className="h-5 w-px bg-line-soft" />
          <Chip
            tone="accent"
            label="Chybí půdorys"
            count={missingPlanCount}
            icon={<WarningCircleIcon weight="fill" className="size-3.5" />}
            selected={missingPlanOnly}
            onClick={() => resetPage(setMissingPlanOnly)(!missingPlanOnly)}
          />
        </div>

        <SearchInput
          label="Hledat byt"
          placeholder="Hledat byt, např. A.421"
          value={query}
          onChange={(event) => resetPage(setQuery)(event.target.value)}
        />
      </div>

      <Card className="px-6 py-2">
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(unit) => unit.id}
          sort={sort}
          onSortChange={resetPage(setSort)}
          minWidth={980}
          empty="Žádný byt neodpovídá filtru."
        />
      </Card>

      <Pagination
        page={currentPage}
        pageCount={pageCount}
        onPageChange={setPage}
        summary={
          sorted.length === 0
            ? "Žádné byty"
            : `Zobrazeno ${first + 1}–${first + rows.length} z ${sorted.length} ${plural(sorted.length, ["bytu", "bytů", "bytů"])}`
        }
      />
    </div>
  );
}
