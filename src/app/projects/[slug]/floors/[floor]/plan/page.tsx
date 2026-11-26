import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { notFound } from "next/navigation";
import { FloorPlanTab } from "@/components/buildings/FloorPlanTab";
import { getFloor } from "@/lib/buildings";

type Props = { params: Promise<{ slug: string; floor: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, floor } = await params;
  const name = (await getFloor(slug, floor))?.name;
  return { title: name && `${name} – půdorys a dokumenty` };
}

/** Floor detail – "Půdorys a dokumenty". */
export default function FloorPlanPage({ params }: Props) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: Props) {
  const { slug, floor: floorSlug } = await params;
  const floor = await getFloor(slug, floorSlug);
  if (!floor) notFound();

  return <FloorPlanTab projectSlug={slug} floor={floor} />;
}
