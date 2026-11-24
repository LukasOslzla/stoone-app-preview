import type { Metadata } from "next";
import { Suspense } from "react";
import { AiInsight } from "@/components/dashboard/AiInsight";
import { AlertsCard } from "@/components/dashboard/AlertsCard";
import { CampaignsCard } from "@/components/dashboard/CampaignsCard";
import { FunnelCard } from "@/components/dashboard/FunnelCard";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { SalesStatusCard } from "@/components/dashboard/SalesStatusCard";
import { TopPagesCard } from "@/components/dashboard/TopPagesCard";
import { UnitsInterestCard } from "@/components/dashboard/UnitsInterestCard";
import { VisitsCard } from "@/components/dashboard/VisitsCard";
import { getProjectDashboard } from "@/lib/dashboard";
import { getProject } from "@/lib/projects";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  return { title: project?.name };
}

/** Project dashboard ("Přehled"). */
export default function ProjectDashboardPage({ params }: Props) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Dashboard params={params} />
    </Suspense>
  );
}

/** Two-column rows: wide card + 400px side card, stacked on smaller screens. */
const splitRow = "grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_400px]";

async function Dashboard({ params }: Props) {
  const { slug } = await params;
  const dashboard = await getProjectDashboard(slug);

  return (
    <div className="flex flex-col gap-4 px-8 pt-7 pb-8">
      <AiInsight {...dashboard.insight} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboard.kpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      <div className={splitRow}>
        <VisitsCard visits={dashboard.visits} />
        <SalesStatusCard status={dashboard.salesStatus} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <FunnelCard steps={dashboard.funnel} />
        <CampaignsCard campaigns={dashboard.campaigns} />
        <TopPagesCard pages={dashboard.topPages} />
      </div>

      <div className={splitRow}>
        <UnitsInterestCard
          units={dashboard.unitsByInterest}
          allUnitsHref={`/projects/${slug}/units`}
        />
        <AlertsCard alerts={dashboard.alerts} />
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div aria-hidden className="flex animate-pulse flex-col gap-4 px-8 pt-7">
      <div className="h-[72px] rounded-[20px] bg-white/5" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-[152px] rounded-[20px] bg-white/5" />
        ))}
      </div>
      <div className="h-[449px] rounded-[20px] bg-white/5" />
    </div>
  );
}
