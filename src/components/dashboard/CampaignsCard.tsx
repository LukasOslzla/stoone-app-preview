import { Card, CardHeader } from "@/components/ui/Card";
import type { Campaign } from "@/lib/dashboard";
import { formatNumber } from "@/lib/format";

/** Paid campaigns: visits they brought and inquiries that came out of them. */
export function CampaignsCard({ campaigns }: { campaigns: Campaign[] }) {
  return (
    <Card className="flex min-w-0 flex-col gap-[18px] p-6">
      <CardHeader
        title="Kampaně"
        description="Kolik lidí přivedly a kolik z nich poslalo poptávku"
      />

      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="font-text text-xs leading-[1.4] font-semibold text-fg-3">
            <th className="pb-[18px] text-left font-semibold">
              <span className="sr-only">Kampaň</span>
            </th>
            <th className="w-20 pb-[18px] text-right font-semibold">
              Návštěvy
            </th>
            <th className="w-20 pb-[18px] text-right font-semibold">
              Poptávky
            </th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign.name} className="border-t border-line-soft">
              <th
                scope="row"
                className="truncate py-[13px] text-left font-text text-sm leading-[1.4] font-medium text-fg-2"
              >
                {campaign.name}
              </th>
              <td className="py-[13px] text-right font-title text-base leading-[1.4] font-medium text-fg-2">
                {formatNumber(campaign.visits)}
              </td>
              <td className="py-[13px] text-right font-title text-base leading-[1.4] font-medium text-fg">
                {formatNumber(campaign.inquiries)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
