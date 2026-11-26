/**
 * Content editor of a project's public web: site header, page sections and
 * content shared by several webs.
 *
 * MOCK DATA — replace the functions below with real API calls. The preview
 * images stand in for a live iframe of the web.
 */

import type { AiSuggestion } from "@/components/seo/AiSuggestionCard";
import { getSitePages } from "@/lib/pages";
import { getSiteSettings } from "@/lib/site-settings";

/* ── Section types (the building blocks of a page) ─────────────────────── */

export type SectionCategory = "text-media" | "gallery" | "units" | "contact";

export const sectionCategories: { id: SectionCategory; label: string }[] = [
  { id: "text-media", label: "Text a obrázky" },
  { id: "gallery", label: "Galerie" },
  { id: "units", label: "Byty a ceny" },
  { id: "contact", label: "Mapa a kontakt" },
];

/** Which inputs the editing form of a section shows. */
export type SectionField = "heading" | "text" | "link" | "images";

export type SectionType = {
  id: string;
  name: string;
  description: string;
  category: SectionCategory;
  /** How many times the section is already used on the web. */
  usage: number;
  /** Replaces "Použito N× na webu", e.g. "Použito na stránce Kontakt". */
  usageNote?: string;
  /** Screenshot of the section on the web; without it a wireframe is shown. */
  preview?: string;
  /** Offered in the quick "Přidat sekci" dialog. */
  quickPick?: boolean;
  fields: SectionField[];
};

const sectionTypes: SectionType[] = [
  {
    id: "text-images",
    name: "Text s obrázky",
    description: "Odstavec textu, odkaz a dvě fotografie vedle sebe",
    category: "text-media",
    usage: 3,
    preview: "/images/site/site-2.jpg",
    quickPick: true,
    fields: ["heading", "text", "link", "images"],
  },
  {
    id: "gallery",
    name: "Galerie",
    description: "Mřížka fotografií, která se po kliknutí zvětší",
    category: "gallery",
    usage: 2,
    quickPick: true,
    fields: ["heading", "images"],
  },
  {
    id: "heading-info",
    name: "Nadpis a informace",
    description: "Velký nadpis s krátkým doplňujícím textem",
    category: "text-media",
    usage: 2,
    quickPick: true,
    fields: ["heading", "text"],
  },
  {
    id: "pricing",
    name: "Vizuální ceník",
    description: "Budova s patry a byty, které se barví podle stavu",
    category: "units",
    usage: 1,
    quickPick: true,
    fields: ["heading", "text"],
  },
  {
    id: "wide-image",
    name: "Obrázek přes celou šířku",
    description: "Jedna fotografie od okraje k okraji",
    category: "text-media",
    usage: 1,
    quickPick: true,
    fields: ["images"],
  },
  {
    id: "contact-form",
    name: "Kontaktní formulář",
    description: "Formulář pro zájemce s kontakty na prodejce",
    category: "contact",
    usage: 1,
    usageNote: "Použito na stránce Kontakt",
    quickPick: true,
    fields: ["heading", "text"],
  },
  {
    id: "hero",
    name: "Úvodní obrazovka",
    description: "Velká fotka přes celou obrazovku s logem projektu",
    category: "text-media",
    usage: 1,
    preview: "/images/site/site-1.jpg",
    fields: ["heading", "images"],
  },
  {
    id: "benefits",
    name: "Přehled výhod",
    description: "Ikony s krátkými popisky, co všechno projekt nabízí",
    category: "text-media",
    usage: 2,
    preview: "/images/site/site-3.jpg",
    fields: ["heading", "text"],
  },
  {
    id: "map",
    name: "Mapa okolí",
    description: "Mapa s body zájmu a filtrem podle kategorie",
    category: "contact",
    usage: 1,
    preview: "/images/site/site-4.jpg",
    fields: ["heading", "text"],
  },
  {
    id: "photo-pair",
    name: "Dvojice fotografií",
    description: "Dvě velké fotky vedle sebe s jemným posunem",
    category: "gallery",
    usage: 1,
    preview: "/images/site/site-5.jpg",
    fields: ["images"],
  },
  {
    id: "gallery-scroll",
    name: "Galerie s posunem",
    description: "Pás fotografií, kterým se listuje do strany",
    category: "gallery",
    usage: 1,
    fields: ["heading", "images"],
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "Poslední příspěvky z instagramového účtu projektu",
    category: "gallery",
    usage: 1,
    fields: ["heading", "link"],
  },
];

/* ── Pages and their sections ──────────────────────────────────────────── */

export type SectionContent = {
  heading?: string;
  text?: string;
  linkLabel?: string;
  /** Id of the page the link leads to. */
  linkTarget?: string;
  images?: string[];
};

export type PageSection = {
  id: string;
  /** Id of a `SectionType`. */
  type: string;
  content: SectionContent;
};

export type EditorPage = {
  id: string;
  name: string;
  path: string;
  sections: PageSection[];
};

const libraryImages = [1, 2, 3, 4, 5, 6].map(
  (index) => `/images/library/lib${index}.jpg`,
);

const defaultContent: Record<string, SectionContent> = {
  "text-images": {
    heading: "Rezidence, kde čas má své místo",
    text: "Momentum nabízí moderní městské bydlení v jedné z nejžádanějších částí Prahy. 240 plně vybavených bytů navržených s důrazem na efektivní využití prostoru.",
    linkLabel: "nabídka bytů",
    linkTarget: "/cs/cenik",
    images: [libraryImages[3], libraryImages[4]],
  },
  hero: { heading: "Momentum Smíchov", images: [libraryImages[0]] },
  "heading-info": {
    heading: "Bydlení pro každý den",
    text: "Obchody, školy i park máte do pěti minut pěšky.",
  },
  "wide-image": { images: [libraryImages[1]] },
  "gallery-scroll": {
    heading: "Jak se tu bude žít",
    images: libraryImages.slice(0, 3),
  },
  pricing: {
    heading: "Vyberte si byt",
    text: "Volné byty jsou zelené, rezervované žluté.",
  },
  gallery: { heading: "Galerie", images: libraryImages.slice(2, 5) },
  instagram: {
    heading: "Sledujte stavbu",
    linkLabel: "@momentum.smichov",
    linkTarget: "/contact",
  },
  benefits: {
    heading: "Co všechno Momentum nabízí",
    text: "240 plně vybavených bytů, podzemní parkování, fitness a sauna.",
  },
  map: {
    heading: "Okolí projektu",
    text: "Metro Anděl 3 minuty pěšky, centrum 5 minut MHD.",
  },
  "photo-pair": { images: [libraryImages[4], libraryImages[5]] },
  "contact-form": {
    heading: "Napište nám",
    text: "Ozveme se vám do druhého pracovního dne.",
  },
};

/** Section types on each page, in order. Pages not listed get a short default. */
const pageLayouts: Record<string, string[]> = {
  "/cs": [
    "hero",
    "text-images",
    "heading-info",
    "wide-image",
    "text-images",
    "gallery-scroll",
    "pricing",
    "gallery",
    "instagram",
  ],
  "/about": ["heading-info", "text-images", "benefits", "photo-pair"],
  "/cs/lokalita": ["heading-info", "map", "benefits"],
  "/cs/cenik": ["heading-info", "pricing"],
  "/gallery": ["heading-info", "gallery", "photo-pair"],
  "/contact": ["heading-info", "contact-form", "map"],
};

/** New section of the given type with its starting content. */
export function createSection(type: string, id: string): PageSection {
  return { id, type, content: { ...defaultContent[type] } };
}

/* ── Site header ───────────────────────────────────────────────────────── */

export type MenuItem = {
  id: string;
  label: string;
  /** Left edge and width of the item in the 804px wide preview image. */
  previewBox?: [number, number];
};

export type HeaderLinks = {
  favourites: boolean;
  camera: boolean;
  portal: boolean;
};

export const headerLinkLabels: Record<keyof HeaderLinks, string> = {
  favourites: "Oblíbené byty",
  camera: "Online kamera",
  portal: "Klientský portál",
};

export type SiteHeader = { menu: MenuItem[]; links: HeaderLinks };

const header: SiteHeader = {
  menu: [
    { id: "about", label: "O projektu", previewBox: [179, 68] },
    { id: "location", label: "Lokalita", previewBox: [247, 50] },
    { id: "pricing", label: "Ceník", previewBox: [298, 37] },
    { id: "financing", label: "Financování", previewBox: [336, 75] },
    { id: "gallery", label: "Galerie", previewBox: [412, 47] },
    { id: "amenities", label: "Vybavení bytu", previewBox: [459, 91] },
    { id: "contact", label: "Kontakt", previewBox: [550, 50] },
  ],
  links: { favourites: true, camera: true, portal: true },
};

/* ── Shared content ────────────────────────────────────────────────────── */

export type OpeningDay = {
  day: string;
  open: boolean;
  /** "9:00" */
  from: string;
  to: string;
};

export type SharedContent = {
  id: string;
  name: string;
  /** Short name for the selector in the editor bar. */
  shortName: string;
  /** Projects whose webs show this content. */
  sites: string[];
  /** Page of the web the preview shows. */
  previewPath: string;
  days: OpeningDay[];
};

const openingHours: SharedContent = {
  id: "opening-hours",
  name: "Otevírací doba prodejního centra",
  shortName: "Otevírací doba",
  sites: ["Momentum", "Brique", "Žižkov 3.0"],
  previewPath: "/cs/kontakt",
  days: [
    { day: "Pondělí", open: true, from: "9:00", to: "13:00" },
    { day: "Úterý", open: true, from: "13:00", to: "18:00" },
    { day: "Středa", open: true, from: "9:00", to: "13:00" },
    { day: "Čtvrtek", open: true, from: "13:00", to: "18:00" },
    { day: "Pátek", open: true, from: "9:00", to: "13:00" },
    { day: "Sobota", open: false, from: "9:00", to: "13:00" },
    { day: "Neděle", open: false, from: "9:00", to: "13:00" },
  ],
};

/**
 * Opening hours as sentences for the web: days with the same hours share a
 * line, e.g. "pondělí, středa, pátek: od 9 do 13 hod".
 */
export function summarizeOpeningHours(days: OpeningDay[]): string[] {
  const short = (time: string) => time.replace(/:00$/, "");
  const groups = new Map<string, string[]>();
  for (const day of days) {
    if (!day.open) continue;
    const key = `od ${short(day.from)} do ${short(day.to)} hod`;
    groups.set(key, [...(groups.get(key) ?? []), day.day.toLowerCase()]);
  }
  return [...groups].map(([hours, names]) => {
    const list = names.length === 2 ? names.join(" a ") : names.join(", ");
    return `${list}: ${hours}`;
  });
}

/* ── Loading and saving ────────────────────────────────────────────────── */

export type EditorData = {
  /** Public domain of the web, e.g. "momentum-smichov.cz". */
  domain: string;
  projectName: string;
  header: SiteHeader;
  pages: EditorPage[];
  sectionTypes: SectionType[];
  shared: SharedContent;
  /** Images offered when adding a picture to a section. */
  imageLibrary: string[];
};

export async function getEditorData(
  projectSlug: string,
  projectName: string,
): Promise<EditorData> {
  const [sitePages, settings] = await Promise.all([
    getSitePages(projectSlug),
    getSiteSettings(projectSlug),
  ]);

  return {
    domain: settings.domain.replace(/^www\./, ""),
    projectName,
    header,
    pages: sitePages.map((page) => ({
      id: page.id,
      name: page.path === "/cs" ? "Hlavní stránka" : page.name,
      path: page.path,
      sections: (pageLayouts[page.id] ?? ["heading-info", "text-images"]).map(
        (type, index) => createSection(type, `${page.id}#${index + 1}`),
      ),
    })),
    sectionTypes,
    shared: openingHours,
    imageLibrary: libraryImages,
  };
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** What the editor keeps as a draft until "Zveřejnit změny". */
export type EditorDraft = {
  header: SiteHeader;
  /** Sections of every page, by page id. */
  sections: Record<string, PageSection[]>;
  hours: OpeningDay[];
  /** Slogan under the logo on the first screen (added by the AI). */
  slogan: string | null;
};

export async function publishEditorDraft(
  projectSlug: string,
  draft: EditorDraft,
): Promise<void> {
  void projectSlug;
  void draft;
  await wait(900);
}

/** A change proposed by the AI; it only shows in the preview until kept. */
export type AiChange = {
  question: string;
  title: string;
  /** Text the change adds to the web. */
  added: string;
  /** Where on the web the change is. */
  where: string;
  /** Changed area in the 804 × 540 preview: x, y, width, height. */
  previewBox: [number, number, number, number];
};

/** Mock: every prompt gets the same proposal. */
export async function askEditorAi(question: string): Promise<AiChange> {
  await wait(1200);
  return {
    question,
    title: "Přidal jsem slogan na úvodní obrazovku",
    added: "3 minuty pěšky od metra Anděl",
    where: "Úvodní obrazovka · pod logem Momentum · zvýrazněno v náhledu",
    previewBox: [64, 356, 209, 146],
  };
}

const textSuggestions: Record<"heading" | "text", AiSuggestion[]> = {
  heading: [
    {
      text: "Bydlení na Smíchově, které drží krok s vámi",
      reason: "Zmiňuje lokalitu, kterou lidé nejčastěji hledají.",
    },
    {
      text: "Domov tři minuty od metra Anděl",
      reason: "Konkrétní výhoda hned v nadpisu zvyšuje zájem o prohlídku.",
    },
  ],
  text: [
    {
      text: "Momentum přináší 240 plně vybavených bytů na pražském Smíchově. Promyšlené dispozice, společné prostory pro aktivní život i klidné zázemí kousek od parku a metra.",
      reason: "Kratší věty a konkrétní výhody se na webu čtou lépe.",
    },
    {
      text: "Bydlete tam, kde máte všechno po ruce. Momentum spojuje moderní byty, kvalitní design a skvělou dostupnost do centra Prahy.",
      reason: "Úvod oslovuje čtenáře přímo a končí hlavní výhodou.",
    },
  ],
};

/** Mock: alternates between two prepared texts per field. */
export async function suggestSectionText(
  field: "heading" | "text",
  attempt: number,
): Promise<AiSuggestion> {
  await wait(900);
  const options = textSuggestions[field];
  return options[attempt % options.length];
}
