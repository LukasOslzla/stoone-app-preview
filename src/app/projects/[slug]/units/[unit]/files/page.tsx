import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { UnitFilesTab } from "@/components/units/UnitFilesTab";
import { getProject } from "@/lib/projects";
import { getUnitDetail } from "@/lib/units";

type Props = { params: Promise<{ slug: string; unit: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, unit } = await params;
  const name = (await getUnitDetail(slug, unit))?.name;
  return { title: name && `Byt ${name} – půdorysy a dokumenty` };
}

/** Unit detail – "Půdorysy a dokumenty". */
export default function UnitFilesPage({ params }: Props) {
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
    <UnitFilesTab
      key={unit.id}
      projectSlug={slug}
      unit={unit}
      realpad={Boolean(project.realpadSync)}
    />
  );
}
