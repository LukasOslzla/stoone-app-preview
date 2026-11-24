import { Card, CardHeader } from "@/components/ui/Card";
import type { TopPage } from "@/lib/dashboard";
import { formatNumber } from "@/lib/format";

/** Most visited pages as horizontal bars relative to the top one. */
export function TopPagesCard({ pages }: { pages: TopPage[] }) {
  const max = Math.max(...pages.map((page) => page.visits), 1);

  return (
    <Card className="flex min-w-0 flex-col gap-[18px] p-6">
      <CardHeader
        title="Co si lidé prohlížejí"
        description="Nejnavštěvovanější stránky webu"
      />

      <ul className="flex flex-col gap-[18px]">
        {pages.map((page) => (
          <li key={page.name} className="flex flex-col gap-2">
            <div className="flex items-end gap-2">
              <span className="min-w-0 flex-1 truncate font-text text-sm leading-[1.4] font-medium text-fg-2">
                {page.name}
              </span>
              <span className="font-title text-[15px] leading-[1.2] font-medium text-fg">
                {formatNumber(page.visits)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#FFFFFF0F]">
              <div
                className="h-full rounded-full bg-beige"
                style={{ width: `${(page.visits / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
