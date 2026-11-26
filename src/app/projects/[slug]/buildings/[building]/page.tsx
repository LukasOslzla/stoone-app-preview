import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { notFound } from "next/navigation";
import { BuildingDetail } from "@/components/buildings/BuildingDetail";
import { getBuilding } from "@/lib/buildings";

type Props = { params: Promise<{ slug: string; building: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, building } = await params;
  return { title: (await getBuilding(slug, building))?.name };
}

/** Building detail – "Základní údaje". */
export default function BuildingPage({ params }: Props) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: Props) {
  const { slug, building: buildingSlug } = await params;
  const building = await getBuilding(slug, buildingSlug);
  if (!building) notFound();

  return <BuildingDetail projectSlug={slug} building={building} />;
}
