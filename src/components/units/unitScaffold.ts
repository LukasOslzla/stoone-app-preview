import type { UnitDetail } from "@/lib/units";

/** Breadcrumb, title, description and tabs shared by all unit tabs. */
export function unitScaffoldProps(
  projectSlug: string,
  unit: UnitDetail,
  realpad: boolean,
) {
  const list = `/projects/${projectSlug}/units`;
  const place = `${unit.floor}. patro · budova ${unit.building}`;

  return {
    breadcrumb: [{ label: "Byty", href: list }, { label: unit.name }],
    title: `Byt ${unit.name}`,
    description: realpad
      ? `${place} · ceny a stav se načítají automaticky z Realpadu`
      : place,
    tabs: [
      { label: "Přehled", href: `${list}/${unit.id}` },
      { label: "Půdorysy a dokumenty", href: `${list}/${unit.id}/files` },
      { label: "Vyhledávače (SEO)", href: `${list}/${unit.id}/seo` },
    ],
  };
}
