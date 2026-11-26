import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { SectorHousesTab } from "@/components/sectors/SectorHousesTab";
import { getSector } from "@/lib/sectors";
import { loadSectorContext } from "../context";

type Props = { params: Promise<{ slug: string; sector: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, sector } = await params;
  const name = (await getSector(slug, sector))?.name;
  return { title: name && `${name} – domy na obrázku` };
}

/** Sector detail – "Domy na obrázku". */
export default function SectorHousesPage({ params }: Props) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: Props) {
  const { slug, sector } = await params;
  return (
    <SectorHousesTab key={sector} {...await loadSectorContext(slug, sector)} />
  );
}
