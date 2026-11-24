import { notFound } from "next/navigation";
import type { SectorContext } from "@/components/sectors/sectorScaffold";
import { getProject } from "@/lib/projects";
import { getSectors } from "@/lib/sectors";

/** Loads what every sector tab needs; 404 when the sector does not exist. */
export async function loadSectorContext(
  projectSlug: string,
  sectorSlug: string,
): Promise<SectorContext> {
  const [project, sectors] = await Promise.all([
    getProject(projectSlug),
    getSectors(projectSlug),
  ]);
  const sector = sectors.find((item) => item.slug === sectorSlug);
  if (!project || !sector) notFound();

  return {
    projectSlug,
    projectName: project.name,
    sector,
    sectorSlugs: sectors.map((item) => item.slug),
  };
}
