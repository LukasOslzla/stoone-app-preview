import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/ssr";

type PaginationProps = {
  /** Current page, starting at 1. */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Text on the left, e.g. "Zobrazeno 1–12 z 240 bytů". */
  summary?: string;
};

const buttonClass =
  "flex size-[34px] items-center justify-center rounded-full border border-line-soft text-fg-2 transition-colors enabled:hover:bg-tint/5 enabled:hover:text-fg disabled:opacity-40 focus-visible:outline-[1.5px] focus-visible:outline-beige";

/** Previous / next pager with a "1 / 20" indicator. */
export function Pagination({
  page,
  pageCount,
  onPageChange,
  summary,
}: PaginationProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-1">
      <p className="font-text text-[13px] leading-[1.4] text-fg-3">{summary}</p>

      <nav aria-label="Stránkování" className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Předchozí stránka"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={buttonClass}
        >
          <CaretLeftIcon weight="fill" className="size-3" />
        </button>
        <span className="min-w-[35px] text-center font-text text-[13px] leading-[1.4] font-semibold whitespace-nowrap text-fg-2">
          {page} / {Math.max(pageCount, 1)}
        </span>
        <button
          type="button"
          aria-label="Další stránka"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          className={buttonClass}
        >
          <CaretRightIcon weight="fill" className="size-3" />
        </button>
      </nav>
    </div>
  );
}
