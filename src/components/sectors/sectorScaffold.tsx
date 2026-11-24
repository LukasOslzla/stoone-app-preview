import { PrevNext } from "@/components/ui/PrevNext";
import { outOf } from "@/lib/format";
import { sectorDescription, type Sector } from "@/lib/sectors";

export type SectorContext = {
  projectSlug: string;
  projectName: string;
  sector: Sector;
  /** Slugs of all sectors in order, for the previous / next switcher. */
  sectorSlugs: string[];
};

/** Breadcrumb, title, switcher, description and tabs shared by the sector tabs. */
export function sectorScaffoldProps(
  { projectSlug, projectName, sector, sectorSlugs }: SectorContext,
  /** Path of the current tab ("" or "/houses"), kept when switching sectors. */
  tabPath = "",
) {
  const list = `/projects/${projectSlug}/sectors`;
  const base = `${list}/${sector.slug}`;
  const index = sectorSlugs.indexOf(sector.slug);
  const sibling = (offset: number) => {
    const slug = sectorSlugs[index + offset];
    return slug ? `${list}/${slug}${tabPath}` : undefined;
  };

  return {
    breadcrumb: [{ label: "Sektory", href: list }, { label: sector.name }],
    title: sector.name,
    titleExtra: (
      <PrevNext
        prevHref={sibling(-1)}
        nextHref={sibling(1)}
        prevLabel="Předchozí sektor"
        nextLabel="Další sektor"
        position={`${index + 1} ${outOf(sectorSlugs.length)}`}
      />
    ),
    description: sectorDescription(sector, projectName),
    tabs: [
      { label: "Základní údaje", href: base },
      { label: "Domy na obrázku", href: `${base}/houses` },
    ],
  };
}
