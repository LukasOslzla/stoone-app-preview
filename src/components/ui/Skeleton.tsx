import { cn } from "@/lib/cn";

/** Pulsing placeholder block; size and radius come from `className`. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("block animate-pulse rounded-md bg-tint/6", className)}
    />
  );
}

/** Placeholder rows of a table or list while its data loads. */
export function SkeletonRows({
  rows = 5,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-label="Načítám…"
      className={cn("flex flex-col", className)}
    >
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 border-line-soft py-[15px] not-last:border-b"
        >
          <Skeleton className="h-4 w-[22%]" />
          <Skeleton className="h-4 w-[30%]" />
          <Skeleton className="h-4 w-[14%]" />
          <Skeleton className="ml-auto h-4 w-[10%]" />
        </div>
      ))}
    </div>
  );
}

/** Placeholder tiles of a card grid (files, sectors…). */
export function SkeletonCards({
  count = 5,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-label="Načítám…"
      className={cn(
        "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
        className,
      )}
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="flex flex-col overflow-hidden rounded-2xl border border-line-soft"
        >
          <Skeleton className="h-[140px] rounded-none" />
          <div className="flex flex-col gap-2 px-3.5 py-3.5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Placeholder of a whole page: title, description and a card with rows. */
export function PageSkeleton() {
  return (
    <div className="flex flex-col gap-6 px-8 pt-7 pb-8">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-64 rounded-lg" />
        <Skeleton className="h-4 w-[420px] max-w-full" />
      </div>
      <Skeleton className="h-9 w-80 max-w-full rounded-full" />
      <div className="surface-card rounded-[20px] px-6 py-2">
        <SkeletonRows rows={6} />
      </div>
    </div>
  );
}
