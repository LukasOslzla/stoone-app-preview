"use client";

import type { ReactNode } from "react";
import { ArrowDownIcon, ArrowUpIcon } from "@phosphor-icons/react";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/cn";

export type SortState = { columnId: string; direction: "asc" | "desc" };

export type DataTableColumn<T> = {
  id: string;
  header: string;
  /** Tailwind width class, e.g. "w-[136px]". Columns without it share the rest. */
  width?: string;
  align?: "right";
  /** Extra classes for the header and body cells of this column. */
  className?: string;
  /** Makes the column sortable; returns the value to sort by. */
  sortValue?: (row: T) => string | number;
  cell: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  sort: SortState | null;
  onSortChange: (sort: SortState) => void;
  /** Shown instead of the rows when there are none. */
  empty?: ReactNode;
  /** Minimum width before the table scrolls horizontally. */
  minWidth?: number;
  /**
   * `md` = roomy list pages (16px between columns), `sm` = tables inside
   * dashboard cards (tighter rows, columns sized exactly by their width).
   */
  size?: "md" | "sm";
  /** Direction used on the first click on a column. */
  firstSortDirection?: "asc" | "desc";
  className?: string;
};

/** Sorts rows by the active column. Use it on the full list before paging. */
export function sortRows<T>(
  rows: T[],
  columns: DataTableColumn<T>[],
  sort: SortState | null,
) {
  const column = columns.find((item) => item.id === sort?.columnId);
  if (!sort || !column?.sortValue) return rows;

  const value = column.sortValue;
  const factor = sort.direction === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    const left = value(a);
    const right = value(b);
    if (typeof left === "number" && typeof right === "number") {
      return (left - right) * factor;
    }
    return (
      String(left).localeCompare(String(right), "cs", { numeric: true }) *
      factor
    );
  });
}

/** Plain data table with sortable column headers. Sorting state is controlled. */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  sort,
  onSortChange,
  empty,
  minWidth = 760,
  size = "md",
  firstSortDirection = "asc",
  className,
}: DataTableProps<T>) {
  const other = firstSortDirection === "asc" ? "desc" : "asc";

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table
        className="w-full table-fixed border-collapse"
        style={{ minWidth }}
      >
        <thead>
          <tr className="border-b border-line-soft">
            {columns.map((column, index) => {
              const active = sort?.columnId === column.id;
              const right = column.align === "right";
              const iconClass = cn(
                "size-3 shrink-0",
                active ? "text-beige" : "text-fg-3",
              );

              return (
                <th
                  key={column.id}
                  scope="col"
                  aria-sort={
                    active
                      ? sort.direction === "desc"
                        ? "descending"
                        : "ascending"
                      : undefined
                  }
                  className={cn(
                    "font-text text-xs leading-[1.4] font-semibold",
                    size === "md" ? "py-[13px]" : "py-2",
                    right ? "text-right" : "text-left",
                    size === "md" && index > 0 && "pl-4",
                    column.width,
                    column.className,
                  )}
                >
                  {column.sortValue ? (
                    <button
                      type="button"
                      onClick={() =>
                        onSortChange({
                          columnId: column.id,
                          direction:
                            active && sort.direction === firstSortDirection
                              ? other
                              : firstSortDirection,
                        })
                      }
                      className={cn(
                        "inline-flex items-center gap-1 rounded-sm font-semibold transition-colors hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-beige",
                        right && "flex-row-reverse",
                        active ? "text-fg" : "text-fg-3",
                      )}
                    >
                      {column.header}
                      {!active ? (
                        <ChevronsUpDown className={iconClass} />
                      ) : sort.direction === "desc" ? (
                        <ArrowDownIcon weight="fill" className={iconClass} />
                      ) : (
                        <ArrowUpIcon weight="fill" className={iconClass} />
                      )}
                    </button>
                  ) : (
                    <span className="text-fg-3">{column.header}</span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className="border-line-soft not-last:border-b"
            >
              {columns.map((column, index) => (
                <td
                  key={column.id}
                  className={cn(
                    "font-text leading-[1.4] text-fg-2",
                    size === "md" ? "py-[13px] text-[13px]" : "py-3 text-sm",
                    column.align === "right" && "text-right",
                    size === "md" && index > 0 && "pl-4",
                    column.className,
                  )}
                >
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="py-10 text-center font-text text-sm leading-[1.4] text-fg-3"
              >
                {empty ?? "Žádné položky."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
