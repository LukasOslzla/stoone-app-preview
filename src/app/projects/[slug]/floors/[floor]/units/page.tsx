import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { notFound } from "next/navigation";
import { FloorUnitsTab } from "@/components/buildings/FloorUnitsTab";
import { getFloor } from "@/lib/buildings";

type Props = { params: Promise<{ slug: string; floor: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, floor } = await params;
  const name = (await getFloor(slug, floor))?.name;
  return { title: name && `${name} – byty na půdorysu` };
}

/** Floor detail – "Byty na půdorysu". */
export default function FloorUnitsPage({ params }: Props) {
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

  return <FloorUnitsTab projectSlug={slug} floor={floor} />;
}
