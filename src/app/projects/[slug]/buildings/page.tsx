import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { CaretRightIcon } from "@phosphor-icons/react/ssr";
import { Card, CardHeader } from "@/components/ui/Card";
import { DotPill } from "@/components/ui/DotPill";
import {
  buildingSummary,
  floorSummary,
  getBuildings,
  getFloors,
  saleStatuses,
  type SaleStatus,
} from "@/lib/buildings";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "Budovy a patra" };

/**
 * PROVISIONAL — there is no design for the list of buildings and floors yet.
 * This page only links to the detail screens so they are reachable.
 */
export default function BuildingsPage({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: Props) {
  const { slug } = await params;
  const [buildings, floors] = await Promise.all([
    getBuildings(slug),
    getFloors(slug),
  ]);
  const base = `/projects/${slug}`;

  return (
    <div className="flex flex-col gap-5 px-8 pt-7 pb-8">
      <h1 className="font-title text-3xl leading-[1.2] font-medium text-fg">
        Budovy a patra
      </h1>

      <div className="grid max-w-[1128px] grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="flex flex-col gap-4 p-6">
          <CardHeader title="Budovy" />
          <ul className="flex flex-col gap-2.5">
            {buildings.map((building) => (
              <Row
                key={building.slug}
                href={`${base}/buildings/${building.slug}`}
                title={building.name}
                description={buildingSummary(building)}
                status={building.saleStatus}
              />
            ))}
          </ul>
        </Card>

        <Card className="flex flex-col gap-4 p-6">
          <CardHeader title="Patra" />
          <ul className="flex flex-col gap-2.5">
            {floors.map((floor) => (
              <Row
                key={floor.slug}
                href={`${base}/floors/${floor.slug}`}
                title={floor.name}
                description={floorSummary(floor)}
                status={floor.saleStatus}
              />
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Row({
  href,
  title,
  description,
  status,
}: {
  href: string;
  title: string;
  description: string;
  status: SaleStatus;
}) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-3 rounded-[14px] border border-line-soft bg-inset p-3.5 transition-colors hover:border-line focus-visible:outline-[1.5px] focus-visible:outline-beige"
      >
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="font-text text-sm leading-[1.4] font-bold text-fg">
            {title}
          </span>
          <span className="truncate font-text text-[13px] leading-[1.4] text-fg-2">
            {description}
          </span>
        </span>
        <DotPill {...saleStatuses[status].pill} />
        <CaretRightIcon weight="fill" className="size-4 shrink-0 text-fg-3" />
      </Link>
    </li>
  );
}
