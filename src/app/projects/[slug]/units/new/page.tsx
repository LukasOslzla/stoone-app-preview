import type { Metadata } from "next";
import { Suspense } from "react";
import { NewUnitForm } from "@/components/units/NewUnitForm";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "Nový byt" };

/** Manual entry of a new flat. */
export default function NewUnitPage({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: Props) {
  const { slug } = await params;
  // MOCK: building names should come from the project's buildings.
  return <NewUnitForm projectSlug={slug} buildings={["A", "B"]} />;
}
