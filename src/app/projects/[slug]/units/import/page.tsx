import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { ImportUnitsWizard } from "@/components/units/ImportUnitsWizard";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "Nahrát byty z Excelu" };

/** Import of flats from a spreadsheet. */
export default function ImportUnitsPage({ params }: Props) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: Props) {
  const { slug } = await params;
  return <ImportUnitsWizard projectSlug={slug} />;
}
