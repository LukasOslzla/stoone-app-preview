import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { FloorDetail } from "@/components/buildings/FloorDetail";
import { getFloor } from "@/lib/buildings";

type Props = { params: Promise<{ slug: string; floor: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, floor } = await params;
  return { title: (await getFloor(slug, floor))?.name };
}

/** Floor detail – "Základní údaje". */
export default function FloorPage({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: Props) {
  const { slug, floor: floorSlug } = await params;
  const floor = await getFloor(slug, floorSlug);
  if (!floor) notFound();

  return <FloorDetail projectSlug={slug} floor={floor} />;
}
