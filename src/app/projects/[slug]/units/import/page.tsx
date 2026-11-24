import type { Metadata } from "next";
import { Suspense } from "react";
import { ImportUnitsWizard } from "@/components/units/ImportUnitsWizard";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "Nahrát byty z Excelu" };

/** Import of flats from a spreadsheet. */
export default function ImportUnitsPage({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: Props) {
  const { slug } = await params;
  return <ImportUnitsWizard projectSlug={slug} />;
}
