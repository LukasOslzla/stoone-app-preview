/**
 * Pages of a project's public web.
 *
 * MOCK DATA — replace the functions below with real API calls.
 */

export type SitePage = {
  id: string;
  name: string;
  /** Path on the public web, e.g. "/cs/cenik". */
  path: string;
  status: "published" | "draft";
  /** Already formatted relative time ("Dnes", "Před 3 dny"). */
  editedLabel: string;
  /** Days since the last edit; only used for sorting. */
  editedDaysAgo: number;
  editedBy: string;
  /** Visits in the last 30 days; `null` for pages that are not public yet. */
  visits: number | null;
};

const pages: SitePage[] = [
  ["Úvodní stránka", "/cs", "Dnes", 0, "Jana N.", 3853],
  ["O projektu", "/about", "Před 3 dny", 3, "Dominik Ř.", 312],
  ["Lokalita", "/cs/lokalita", "Před týdnem", 7, "Jana N.", 1272],
  ["Galerie", "/gallery", "Včera", 1, "Petr K.", 388],
  ["Ceník", "/cs/cenik", "Dnes", 0, "automaticky", 3380],
  ["Vybavení bytů", "/apartment-amenities", "Před 2 týdny", 14, "Jana N.", 264],
  ["Financování", "/cs/financovani", "Před měsícem", 30, "Dominik Ř.", 407],
  ["Oblíbené byty", "/favourites", "Před měsícem", 30, "Petr K.", 96],
  ["Kontakt", "/contact", "Před 5 dny", 5, "Jana N.", 205],
  ["Dokumenty", "/documents", "Před 3 týdny", 21, "Dominik Ř.", 121],
  ["Živá kamera", "/camera", "Dnes", 0, "Petr K.", null],
].map(([name, path, editedLabel, editedDaysAgo, editedBy, visits]) => ({
  id: String(path),
  name: name as string,
  path: path as string,
  status: visits === null ? "draft" : "published",
  editedLabel: editedLabel as string,
  editedDaysAgo: editedDaysAgo as number,
  editedBy: editedBy as string,
  visits: visits as number | null,
}));

export async function getSitePages(projectSlug: string): Promise<SitePage[]> {
  void projectSlug;
  return pages;
}

export type SiteStatus = {
  online: boolean;
  /** Public domain, e.g. "momentum.cz". */
  domain: string;
  lastEdit: string;
  visits30Days: number;
};

export async function getSiteStatus(projectSlug: string): Promise<SiteStatus> {
  return {
    online: true,
    domain: `${projectSlug}.cz`,
    lastEdit: "Dnes 14:20 · Jana Nováková",
    visits30Days: 4486,
  };
}
