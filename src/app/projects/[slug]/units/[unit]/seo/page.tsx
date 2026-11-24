import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { UnitSeoTab } from "@/components/units/UnitSeoTab";
import { getProject } from "@/lib/projects";
import { getUnitDetail } from "@/lib/units";

type Props = { params: Promise<{ slug: string; unit: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, unit } = await params;
  const name = (await getUnitDetail(slug, unit))?.name;
  return { title: name && `Byt ${name} – vyhledávače` };
}

/** Unit detail – "Vyhledávače (SEO)". */
export default function UnitSeoPage({ params }: Props) {
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
    <UnitSeoTab
      key={unit.id}
      projectSlug={slug}
      unit={unit}
      realpad={Boolean(project.realpadSync)}
    />
  );
}
