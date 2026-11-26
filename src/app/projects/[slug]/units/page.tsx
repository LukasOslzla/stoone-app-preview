import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { UnitsList } from "@/components/units/UnitsList";
import { getProject } from "@/lib/projects";
import { getUnitCounts, getUnits } from "@/lib/units";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "Byty" };

/** List of the project's flats. */
export default function UnitsPage({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: Props) {
  const { slug } = await params;
  const [project, units, counts] = await Promise.all([
    getProject(slug),
    getUnits(slug),
    getUnitCounts(slug),
  ]);
  if (!project) notFound();

  return (
    <UnitsList
      projectSlug={slug}
      units={units}
      counts={counts}
      realpad={Boolean(project.realpad)}
    />
  );
}
