/**
 * Settings that apply to the whole public web of a project.
 *
 * MOCK DATA — replace the functions below with real API calls.
 */

import type { AiSuggestion } from "@/components/seo/AiSuggestionCard";

export type SiteSettings = {
  /** Name shown in search results, e.g. "Momentum Smíchov". */
  siteName: string;
  /** Public domain with "www". */
  domain: string;
  seo: {
    title: string;
    description: string;
    shareImage: { url: string; fileName: string; note: string };
  };
  notFound: {
    heading: string;
    text: string;
    buttonLabel: string;
    /** Slug of the page the button leads to. */
    buttonTarget: string;
  };
  /** Pages the 404 button can lead to. */
  pageOptions: { value: string; label: string }[];
  /** Menu of the public web, for the 404 preview. */
  navigation: string[];
};

const settings: SiteSettings = {
  siteName: "Momentum Smíchov",
  domain: "www.momentum-smichov.cz",
  seo: {
    title:
      "Momentum Smíchov | Vybavené byty s fitness, saunou a střešní terasou",
    description:
      "Momentum nabízí 240 plně vybavených bytů v atraktivní části Prahy. Moderní bydlení s kvalitním designem, společnými prostory a skvělou dostupností.",
    shareImage: {
      url: "/images/momentum-og.webp",
      fileName: "og.webp",
      note: "1200 × 630 px · správná velikost",
    },
  },
  notFound: {
    heading: "Tady nic není",
    text: "Stránka, kterou hledáte, už neexistuje nebo se přestěhovala. Podívejte se na aktuální nabídku bytů.",
    buttonLabel: "Zobrazit nabídku bytů",
    buttonTarget: "cenik",
  },
  pageOptions: [
    { value: "home", label: "Úvodní stránka" },
    { value: "cenik", label: "Ceník" },
    { value: "lokalita", label: "Lokalita" },
    { value: "contact", label: "Kontakt" },
  ],
  navigation: ["O projektu", "Lokalita", "Ceník", "Kontakt"],
};

export async function getSiteSettings(
  projectSlug: string,
): Promise<SiteSettings> {
  void projectSlug;
  return settings;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Mock save: waits and resolves. */
export async function saveSiteSettings(
  projectSlug: string,
  values: Partial<Pick<SiteSettings, "seo" | "notFound">>,
): Promise<void> {
  void projectSlug;
  void values;
  await wait(700);
}

const suggestions: Record<"title" | "description", AiSuggestion[]> = {
  title: [
    {
      text: "Momentum Smíchov | Vybavené byty u metra Anděl",
      reason:
        "46 znaků, zobrazí se celý. Přidali jsme „metro Anděl“ – podle toho lidé bydlení na Smíchově často hledají.",
    },
    {
      text: "Vybavené byty na Smíchově | Momentum",
      reason:
        "36 znaků. Začíná tím, co lidé hledají, a název projektu nechává na konec.",
    },
  ],
  description: [
    {
      text: "240 vybavených bytů na Smíchově, 5 minut od metra Anděl. Fitness, sauna a střešní terasa v domě. Prohlédněte si ceník a volné byty.",
      reason:
        "132 znaků, zobrazí se celý. Končí výzvou, na kterou se dá kliknout.",
    },
    {
      text: "Nové vybavené byty v Praze na Smíchově. Fitness, sauna, střešní terasa a metro Anděl za rohem. Vyberte si byt z aktuální nabídky.",
      reason: "129 znaků. Zmiňuje lokalitu hned na začátku.",
    },
  ],
};

/**
 * MOCK of "Navrhnout s AI": waits and returns one of the canned proposals.
 * `attempt` picks the next one for "Jiný návrh".
 */
export async function suggestSiteSeo(
  field: "title" | "description",
  attempt: number,
): Promise<AiSuggestion> {
  await wait(1100);
  const list = suggestions[field];
  return list[attempt % list.length];
}
