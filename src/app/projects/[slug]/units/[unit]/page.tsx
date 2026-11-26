import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { UnitDetail } from "@/components/units/UnitDetail";
import { getProject } from "@/lib/projects";
import { getUnitDetail } from "@/lib/units";

type Props = { params: Promise<{ slug: string; unit: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, unit } = await params;
  const name = (await getUnitDetail(slug, unit))?.name;
  return { title: name && `Byt ${name}` };
}

/** Unit detail – "Přehled". */
export default function UnitPage({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: Props) {
  const { slug, unit: unitId } = await params;
  const [project, unit] = await Promise.all([
    getProject(slug),
    getUnitDetail(slug, unitId),
  ]);
  if (!project || !unit) notFound();

  return (
    <UnitDetail
      // Reset the form when stepping to another unit with the arrows.
      key={unit.id}
      projectSlug={slug}
      unit={unit}
      realpad={Boolean(project.realpad)}
    />
  );
}
