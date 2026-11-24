import type { Metadata } from "next";
import { Suspense } from "react";
import { NewSectorWizard } from "@/components/sectors/NewSectorWizard";
import { getUnassignedHouses, suggestSectorName } from "@/lib/sectors";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "Nový sektor" };

/** New sector: name and image → houses → outlines on the image. */
export default function NewSectorPage({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: Props) {
  const { slug } = await params;
  const [houses, suggestedName] = await Promise.all([
    getUnassignedHouses(slug),
    suggestSectorName(slug),
  ]);

  return (
    <NewSectorWizard
      projectSlug={slug}
      suggestedName={suggestedName}
      availableHouses={houses}
    />
  );
}
