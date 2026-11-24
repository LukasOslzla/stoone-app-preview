import { floorSummary, type Floor } from "@/lib/buildings";

/** Breadcrumb, title, description and tabs shared by all floor tabs. */
export function floorScaffoldProps(projectSlug: string, floor: Floor) {
  const base = `/projects/${projectSlug}/floors/${floor.slug}`;

  return {
    breadcrumb: [
      { label: "Patra", href: `/projects/${projectSlug}/buildings` },
      { label: floor.name },
    ],
    title: floor.name,
    description: floorSummary(floor),
    tabs: [
      { label: "Základní údaje", href: base },
      { label: "Půdorys a dokumenty", href: `${base}/plan` },
      { label: "Byty na půdorysu", href: `${base}/units` },
    ],
  };
}
