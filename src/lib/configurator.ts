/**
 * Configurator of standards for buyers: their units and the choices of
 * floors, tiles and equipment.
 *
 * MOCK DATA — replace the functions below with real API calls. Swatches are
 * colour gradients standing in for product photos.
 */

export type ConfigOption = {
  id: string;
  name: string;
  /** Product line and size, e.g. "Heritage Style X · 150 × 1900 mm". */
  detail?: string;
  /** Longer text shown under the room picture. */
  description: string;
  /** Surcharge incl. VAT; 0 = included in the price of the unit. */
  price: number;
  /** Two colours of the placeholder swatch. */
  swatch: [string, string];
};

export type ConfigSubstep = {
  id: string;
  /** "1.1" */
  number: string;
  /** Short name for the pill ("Podlaha"). */
  name: string;
  /** Name in the accusative for "Pokračovat na …" ("obvodové lišty"). */
  nextLabel: string;
  question: string;
  hint: string;
  options: ConfigOption[];
};

export type ConfigStep = {
  id: string;
  name: string;
  /** Room shown in the preview while this step is open. */
  room: string;
  substeps: ConfigSubstep[];
};

const included = "Součást standardu bytu.";

function options(
  items: [name: string, price: number, swatch: [string, string]][],
  detail?: string,
): ConfigOption[] {
  return items.map(([name, price, swatch]) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    detail,
    description:
      price === 0
        ? included
        : "Nadstandardní provedení; cena je spočítaná pro váš byt.",
    price,
    swatch,
  }));
}

const steps: ConfigStep[] = [
  {
    id: "floors",
    name: "Dřevěné podlahy",
    room: "Kuchyně a obývací pokoj",
    substeps: [
      {
        id: "floor",
        number: "1.1",
        name: "Podlaha",
        nextLabel: "podlahu",
        question: "Vyberte podlahu",
        hint: "Cena je spočítaná pro váš byt (42 m² podlahy).",
        options: [
          {
            id: "dub-natur",
            name: "Dub Natur",
            detail: "Heritage Style X · 150 × 1900 mm",
            description:
              "Jemně kartáčovaný povrch s matným lakem, čtyřstranná V-spára, suky a rustikální kresba.",
            price: 0,
            swatch: ["#C9A66B", "#8F6B3A"],
          },
          {
            id: "dub-invisible",
            name: "Dub Invisible",
            detail: "Heritage Style X · 150 × 1900 mm",
            description:
              "Světlý dub s neviditelným lakem, který zachovává vzhled surového dřeva.",
            price: 0,
            swatch: ["#DCCFB0", "#B9A77E"],
          },
          {
            id: "dub-castle-brown",
            name: "Dub Castle Brown",
            detail: "Heritage Style X · 150 × 1900 mm",
            description:
              "Tmavě mořený dub s výraznou kresbou a hluboce kartáčovaným povrchem.",
            price: 12600,
            swatch: ["#8A5A2B", "#3E2A18"],
          },
          {
            id: "dub-bastia",
            name: "Dub Bastia",
            detail: "Heritage Style X · 150 × 1900 mm",
            description:
              "Šedohnědý dub s patinou a přiznanými suky, olejovaný povrch.",
            price: 12600,
            swatch: ["#8C8378", "#4D463F"],
          },
        ],
      },
      {
        id: "skirting",
        number: "1.2",
        name: "Obvodové lišty",
        nextLabel: "obvodové lišty",
        question: "Vyberte obvodové lišty",
        hint: "Lišty se počítají podle obvodu místností (38 m).",
        options: options([
          ["Bílá lišta 60 mm", 0, ["#F4F2EC", "#D9D5CB"]],
          ["Lišta v dekoru podlahy", 0, ["#C9A66B", "#8F6B3A"]],
          ["Bílá lišta 100 mm", 4200, ["#FFFFFF", "#E6E2D8"]],
          ["Zapuštěná hliníková lišta", 9800, ["#B9BCC0", "#74787D"]],
        ]),
      },
    ],
  },
  {
    id: "doors",
    name: "Interiérové dveře",
    room: "Předsíň",
    substeps: [
      {
        id: "door",
        number: "2.1",
        name: "Dveře",
        nextLabel: "dveře",
        question: "Vyberte dveře",
        hint: "V bytě jsou 4 interiérové dveře.",
        options: options([
          ["Bílé hladké", 0, ["#F7F5F0", "#DEDAD0"]],
          ["Bílé s drážkou", 0, ["#EFECE5", "#CFCABD"]],
          ["Dub přírodní", 14800, ["#C9A66B", "#8F6B3A"]],
          ["Antracit mat", 16400, ["#4A4D52", "#24262A"]],
        ]),
      },
      {
        id: "handle",
        number: "2.2",
        name: "Kliky",
        nextLabel: "kliky",
        question: "Vyberte kliky",
        hint: "Stejné kliky budou na všech dveřích.",
        options: options([
          ["Nerez kartáčovaná", 0, ["#C9CCD0", "#8B8F94"]],
          ["Černá mat", 0, ["#3A3B3E", "#17181A"]],
          ["Mosaz kartáčovaná", 5600, ["#C8A562", "#8A6B2E"]],
          ["Bronz tmavý", 5600, ["#7A5A3C", "#3D2B1B"]],
        ]),
      },
    ],
  },
  {
    id: "tiles",
    name: "Obklady a dlažby",
    room: "Kuchyně a obývací pokoj",
    substeps: [
      {
        id: "hall-tiles",
        number: "3.1",
        name: "Dlažba v předsíni",
        nextLabel: "dlažbu v předsíni",
        question: "Vyberte dlažbu do předsíně",
        hint: "Formát 60 × 60 cm, 6 m².",
        options: options([
          ["Beton světlý", 0, ["#D8D6D0", "#A9A69E"]],
          ["Beton tmavý", 0, ["#8D8C88", "#55544F"]],
          ["Terrazzo", 7200, ["#E3DED3", "#B6AD9C"]],
          ["Mramor Calacatta", 11400, ["#F3F1EC", "#C9C3B8"]],
        ]),
      },
      {
        id: "kitchen-tiles",
        number: "3.2",
        name: "Obklad kuchyně",
        nextLabel: "obklad kuchyně",
        question: "Vyberte obklad za kuchyňskou linku",
        hint: "Pruh mezi linkou a horními skříňkami.",
        options: options([
          ["Bílý lesklý 10 × 30", 0, ["#FFFFFF", "#E4E2DC"]],
          ["Bílý matný 10 × 30", 0, ["#F3F1EC", "#D5D1C7"]],
          ["Zelený glazovaný", 6300, ["#6F8F7A", "#3F5A49"]],
          ["Sklo v barvě stěny", 13900, ["#DCE3E3", "#A8B4B4"]],
        ]),
      },
    ],
  },
  {
    id: "bathroom",
    name: "Koupelna a WC",
    room: "Koupelna",
    substeps: [
      {
        id: "bath-floor",
        number: "4.1",
        name: "Dlažba",
        nextLabel: "dlažbu",
        question: "Vyberte dlažbu do koupelny",
        hint: "Protiskluzová úprava R10, 5 m².",
        options: options([
          ["Šedá 60 × 60", 0, ["#C9C8C3", "#96948D"]],
          ["Béžová 60 × 60", 0, ["#DDD3C2", "#B3A68F"]],
          ["Terrazzo", 5400, ["#E3DED3", "#B6AD9C"]],
          ["Mramor Calacatta", 9700, ["#F3F1EC", "#C9C3B8"]],
        ]),
      },
      {
        id: "bath-wall",
        number: "4.2",
        name: "Obklad",
        nextLabel: "obklad",
        question: "Vyberte obklad do koupelny",
        hint: "Obklad do výšky 2,1 m, 22 m².",
        options: options([
          ["Bílý 30 × 60", 0, ["#FFFFFF", "#E4E2DC"]],
          ["Světle šedý 30 × 60", 0, ["#E3E2DE", "#BDBBB4"]],
          ["Velký formát 60 × 120", 18200, ["#EDEBE6", "#C4C0B6"]],
          ["Zelený glazovaný", 21500, ["#6F8F7A", "#3F5A49"]],
        ]),
      },
      {
        id: "basin",
        number: "4.3",
        name: "Umyvadlo",
        nextLabel: "umyvadlo",
        question: "Vyberte umyvadlo",
        hint: "Do koupelny se vejde umyvadlo do šířky 80 cm.",
        options: [
          {
            id: "laufen-60",
            name: "Laufen Pro S 60",
            description:
              "Bílá glazura, skrytý přepad, montáž na zeď nebo na skříňku. Součástí standardu bytu.",
            price: 0,
            swatch: ["#F4F3EF", "#CFCCC4"],
          },
          {
            id: "laufen-80",
            name: "Laufen Pro S 80",
            description:
              "Širší varianta se stejným tvarem a místem na odkládání po stranách.",
            price: 0,
            swatch: ["#EFEEE9", "#C4C1B8"],
          },
          {
            id: "kartell",
            name: "Kartell by Laufen",
            description:
              "Tenkostěnná keramika SaphirKeramik s ostrými hranami.",
            price: 6900,
            swatch: ["#E9E7E1", "#B5B1A7"],
          },
          {
            id: "villeroy-antao",
            name: "Villeroy Antao",
            description:
              "Kulaté umyvadlo na desku s organickým tvarem a matným povrchem.",
            price: 6900,
            swatch: ["#F6F2EA", "#CDBFA8"],
          },
        ],
      },
      {
        id: "tap",
        number: "4.4",
        name: "Baterie",
        nextLabel: "baterie",
        question: "Vyberte baterie",
        hint: "Umyvadlová a sprchová baterie ve stejném provedení.",
        options: options([
          ["Chrom", 0, ["#D9DCDF", "#9BA0A5"]],
          ["Chrom s úsporným perlátorem", 0, ["#CFD3D6", "#8D9297"]],
          ["Černá mat", 8400, ["#3A3B3E", "#17181A"]],
          ["Mosaz kartáčovaná", 12300, ["#C8A562", "#8A6B2E"]],
        ]),
      },
      {
        id: "shower",
        number: "4.5",
        name: "Sprchový kout",
        nextLabel: "sprchový kout",
        question: "Vyberte sprchový kout",
        hint: "Walk-in zástěna 120 cm s odtokovým žlabem.",
        options: options([
          ["Čiré sklo, chrom", 0, ["#E6ECEC", "#B7C2C2"]],
          ["Čiré sklo, černý profil", 0, ["#D5DADA", "#5A5E60"]],
          ["Kouřové sklo", 9200, ["#8E9392", "#4A4E4D"]],
          ["Rýhované sklo", 11800, ["#DDE5E4", "#A3B1B0"]],
        ]),
      },
    ],
  },
  {
    id: "electro",
    name: "Elektro",
    room: "Kuchyně a obývací pokoj",
    substeps: [
      {
        id: "switches",
        number: "5.1",
        name: "Vypínače",
        nextLabel: "vypínače",
        question: "Vyberte vypínače a zásuvky",
        hint: "Stejné provedení v celém bytě.",
        options: options([
          ["Bílé", 0, ["#FFFFFF", "#E4E2DC"]],
          ["Bílé s rámečkem", 0, ["#F3F1EC", "#D5D1C7"]],
          ["Antracit", 7900, ["#4A4D52", "#24262A"]],
          ["Mosaz", 18600, ["#C8A562", "#8A6B2E"]],
        ]),
      },
      {
        id: "sockets",
        number: "5.2",
        name: "Zásuvky navíc",
        nextLabel: "zásuvky navíc",
        question: "Chcete zásuvky navíc?",
        hint: "Standard je 28 zásuvek podle projektu.",
        options: options([
          ["Podle projektu", 0, ["#EDEBE6", "#C4C0B6"]],
          ["USB u postele", 0, ["#E3E2DE", "#BDBBB4"]],
          ["+ 4 zásuvky", 3600, ["#D0AE8F", "#6E6351"]],
          ["+ 8 zásuvek a příprava na wallbox", 14200, ["#32424B", "#1B252B"]],
        ]),
      },
    ],
  },
];

/** Pictures of each room (by `ConfigStep.room`); the preview cycles through them. */
const renders: Record<string, string[]> = {
  "Kuchyně a obývací pokoj": [
    "/images/configurator/render-1.jpg",
    "/images/library/lib4.jpg",
    "/images/library/lib5.jpg",
  ],
  Koupelna: ["/images/configurator/render-2.jpg", "/images/library/lib3.jpg"],
  Předsíň: ["/images/configurator/render-1.jpg", "/images/library/lib2.jpg"],
};

export type BuyerUnit = {
  id: string;
  name: string;
  project: string;
  /** "1. patro · 2+kk · 48 m²" */
  meta: string;
  thumbnailUrl: string;
  status: "in-progress" | "done";
  /** In progress: ISO date the configuration must be closed by. */
  deadline?: string;
  /** In progress: substeps already confirmed, e.g. ["floor", "skirting"]. */
  confirmed?: string[];
  /** In progress: chosen option of each substep that differs from the first. */
  choices?: Record<string, string>;
  /** Done: ISO date it was closed and the total surcharge. */
  closedAt?: string;
  surcharge?: number;
};

const units: BuyerUnit[] = [
  {
    id: "a-101",
    name: "A.101",
    project: "Momentum",
    meta: "1. patro · 2+kk · 48 m²",
    thumbnailUrl: "/images/library/lib4.jpg",
    status: "in-progress",
    deadline: "2026-12-15",
    confirmed: [
      "floor",
      "skirting",
      "door",
      "handle",
      "hall-tiles",
      "kitchen-tiles",
      "bath-floor",
      "bath-wall",
    ],
    choices: { floor: "dub-castle-brown" },
  },
  {
    id: "a-102",
    name: "A.102",
    project: "Momentum",
    meta: "1. patro · 1+kk · 27 m²",
    thumbnailUrl: "/images/library/lib5.jpg",
    status: "done",
    closedAt: "2026-11-24",
    surcharge: 84000,
  },
];

export type Buyer = {
  firstName: string;
  /** Vocative for the greeting ("Lukáši"). */
  greetingName: string;
  agent: { name: string; photoUrl: string; note: string };
};

export const buyer: Buyer = {
  firstName: "Lukáš",
  greetingName: "Lukáši",
  agent: {
    name: "Tereza Pilipová",
    photoUrl: "/images/library/lib6.jpg",
    note: "odpovídá obvykle do 1 pracovního dne",
  },
};

export async function getBuyerUnits(): Promise<BuyerUnit[]> {
  return units;
}

export async function getBuyerUnit(id: string): Promise<BuyerUnit | undefined> {
  return units.find((unit) => unit.id === id);
}

export async function getConfigSteps(): Promise<ConfigStep[]> {
  return steps;
}

export async function getRoomRenders(): Promise<Record<string, string[]>> {
  return renders;
}

/** Where a unit's configuration stands, for the card on "Vaše jednotky". */
export function configProgress(unit: BuyerUnit, allSteps: ConfigStep[]) {
  const confirmed = new Set(unit.confirmed ?? []);
  const substeps = allSteps.flatMap((step) => step.substeps);
  const done = substeps.filter((substep) => confirmed.has(substep.id)).length;
  const stepIndex = Math.max(
    0,
    allSteps.findIndex((step) =>
      step.substeps.some((substep) => !confirmed.has(substep.id)),
    ),
  );
  return {
    stepNumber: stepIndex + 1,
    stepCount: allSteps.length,
    stepName: allSteps[stepIndex].name,
    percent: Math.round((done / substeps.length) * 100),
  };
}

/** Whole days from `today` to the deadline (0 = today, negative = overdue). */
export function daysLeft(deadline: string, today = new Date()) {
  const [year, month, day] = deadline.split("-").map(Number);
  const end = Date.UTC(year, month - 1, day);
  const start = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  return Math.round((end - start) / 86_400_000);
}

/** Mock save of one choice: waits and resolves. */
export async function saveConfigChoice(
  unitId: string,
  substepId: string,
  optionId: string,
): Promise<void> {
  void unitId;
  void substepId;
  void optionId;
  await new Promise((resolve) => setTimeout(resolve, 500));
}

/** Mock: clears the configuration of a unit. */
export async function restartConfiguration(unitId: string): Promise<void> {
  void unitId;
  await new Promise((resolve) => setTimeout(resolve, 700));
}
