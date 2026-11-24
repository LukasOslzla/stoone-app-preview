import type { Metadata } from "next";
import { Suspense } from "react";
import { SectorDetail } from "@/components/sectors/SectorDetail";
import { getSector } from "@/lib/sectors";
import { loadSectorContext } from "./context";

type Props = { params: Promise<{ slug: string; sector: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, sector } = await params;
  return { title: (await getSector(slug, sector))?.name };
}

/** Sector detail – "Základní údaje". */
export default function SectorPage({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: Props) {
  const { slug, sector } = await params;
  // `key` resets the form when stepping to another sector.
  return (
    <SectorDetail key={sector} {...await loadSectorContext(slug, sector)} />
  );
}
