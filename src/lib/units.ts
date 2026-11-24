/**
 * Units (flats) of a project.
 *
 * MOCK DATA — replace `getUnits` with a real API call. The list page filters,
 * sorts and paginates in the browser; with a real API that should move to
 * the server.
 */

import type { ManagedFile } from "@/components/ui/FileRows";
import { formatPrice } from "@/lib/format";
import { getProject } from "@/lib/projects";
import type { UnitStatus } from "@/lib/unit-status";

export type Unit = {
  id: string;
  name: string;
  floor: number;
  building: string;
  layout: string;
  /** Floor area in m². */
  area: number;
  price: number;
  status: UnitStatus;
  hasFloorPlan: boolean;
};

export type UnitCounts = { units: number; parking: number; cellars: number };

/** First page exactly as in the design. */
const designed: Omit<Unit, "id" | "floor" | "building" | "hasFloorPlan">[] = [
  { name: "A.440", layout: "1+kk", area: 25.6, price: 7_694_000, status: "free" },
  { name: "A.439", layout: "1+kk", area: 23.1, price: 7_148_000, status: "free" },
  { name: "A.438", layout: "2+kk", area: 37.8, price: 10_701_000, status: "preReserved" },
  { name: "A.437", layout: "2+kk", area: 37.8, price: 10_701_000, status: "free" },
  { name: "A.436", layout: "1,5+kk", area: 28.2, price: 7_784_000, status: "free" },
  { name: "A.435", layout: "1,5+kk", area: 28.6, price: 7_895_000, status: "free" },
  { name: "A.434", layout: "1,5+kk", area: 29.5, price: 8_406_000, status: "free" },
  { name: "A.433", layout: "1,5+kk", area: 26.2, price: 7_967_000, status: "free" },
  { name: "A.432", layout: "1,5+kk", area: 31.1, price: 9_408_000, status: "free" },
  { name: "A.431", layout: "1,5+kk", area: 28.0, price: 8_527_000, status: "reserved" },
  { name: "A.430", layout: "1,5+kk", area: 32.1, price: 9_008_000, status: "reserved" },
  { name: "A.429", layout: "1,5+kk", area: 26.0, price: 7_491_000, status: "reserved" },
];

/** The flat shown on the detail screens in the design. */
const designedDetail: Unit = {
  id: "a-240",
  name: "A.240",
  floor: 2,
  building: "AB",
  layout: "1+kk",
  area: 26,
  price: 7_699_000,
  status: "free",
  hasFloorPlan: true,
};

const layouts = [
  { layout: "1+kk", area: 24 },
  { layout: "1,5+kk", area: 28 },
  { layout: "2+kk", area: 38 },
  { layout: "3+kk", area: 62 },
];

/** Deterministic pseudo-random number in 0–1 (same on server and client). */
function seeded(index: number, salt: number) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function statusFor(index: number): UnitStatus {
  const roll = seeded(index, 1);
  if (roll < 0.78) return "free";
  if (roll < 0.87) return "reserved";
  if (roll < 0.95) return "preReserved";
  return "sold";
}

function buildUnits(): Unit[] {
  const units: Unit[] = designed.map((unit) => ({
    ...unit,
    id: unit.name.toLowerCase().replace(".", "-"),
    floor: 4,
    building: "AB",
    hasFloorPlan: true,
  }));

  for (const letter of ["A", "B"]) {
    for (let floor = 8; floor >= 1; floor -= 1) {
      for (let number = 15; number >= 1; number -= 1) {
        if (units.length >= 239) return [...units, designedDetail];
        const index = units.length;
        const kind = layouts[Math.floor(seeded(index, 2) * layouts.length)];
        const area = Math.round((kind.area + seeded(index, 3) * 8) * 10) / 10;
        const name = `${letter}.${floor}${String(number).padStart(2, "0")}`;
        units.push({
          id: name.toLowerCase().replace(".", "-"),
          name,
          floor,
          building: "AB",
          layout: kind.layout,
          area,
          price: Math.round((area * 285_000) / 1000) * 1000,
          status: statusFor(index),
          // Half of the project still misses a floor plan.
          hasFloorPlan: index < 120,
        });
      }
    }
  }
  return units;
}

const units = buildUnits();

export async function getUnits(projectSlug: string): Promise<Unit[]> {
  void projectSlug;
  return units;
}

export async function getUnitCounts(projectSlug: string): Promise<UnitCounts> {
  void projectSlug;
  return { units: units.length, parking: 82, cellars: 117 };
}

export type UnitSeo = {
  title: string;
  description: string;
  /** Texts generated from the unit data, used until the user edits them. */
  autoTitle: string;
  autoDescription: string;
  /** Shown in the search preview. */
  siteName: string;
  urlParts: string[];
  shareImage: { title: string; note: string };
};

/** What the detail screen shows on top of the list data. */
export type UnitDetail = Unit & {
  terrace?: number;
  frontGarden?: number;
  priceWithEquipment?: number;
  equipmentNote?: string;
  floorPlans: ManagedFile[];
  documents: ManagedFile[];
  seo: UnitSeo;
  /** Free-text completion date, e.g. "4. čtvrtletí 2027". */
  completion: string;
  /** Neighbours in the list, for the previous / next arrows. */
  prevId?: string;
  nextId?: string;
};

/** A file synced from Realpad. */
const file = (name: string, sizeBytes: number): ManagedFile => ({
  id: name,
  name,
  sizeBytes,
  source: "realpad",
  visible: true,
});

export async function getUnitDetail(
  projectSlug: string,
  unitId: string,
): Promise<UnitDetail | undefined> {
  const index = units.findIndex((unit) => unit.id === unitId);
  if (index === -1) return undefined;
  const unit = units[index];
  const designedUnit = unit.id === designedDetail.id;
  const terrace = designedUnit ? 3.1 : seeded(index, 4) > 0.5 ? 4.2 : undefined;
  const frontGarden = designedUnit ? 1.2 : undefined;

  const projectName = (await getProject(projectSlug))?.name ?? projectSlug;
  const area = formatArea(unit.area, true);
  const extras = [terrace && "terasou", frontGarden && "předzahrádkou"]
    .filter(Boolean)
    .join(" a ");
  const autoTitle = `Byt ${unit.name} · ${unit.layout} · ${area} | ${projectName}`;
  const autoDescription = `Byt ${unit.layout} o ploše ${area}${extras ? ` s ${extras}` : ""} ${[2, 3, 4].includes(unit.floor) ? "ve" : "v"} ${unit.floor}. patře projektu ${projectName}. Cena ${formatPrice(unit.price)} včetně DPH.`;

  return {
    ...unit,
    terrace,
    frontGarden,
    priceWithEquipment: designedUnit ? 8_380_000 : unit.price + 680_000,
    equipmentNote: "Vestavěný nábytek, volně stojící nábytek",
    floorPlans: unit.hasFloorPlan
      ? [
          file(`Půdorys bytu ${unit.name}.png`, 1_468_006),
          file(`Půdorys bytu ${unit.name}.pdf`, 839_680),
        ]
      : [],
    documents: [
      file(`Karta bytu ${unit.name}.pdf`, 1_153_434),
      file("Standardy vybavení.pdf", 2_726_298),
    ],
    seo: {
      title: autoTitle,
      description: autoDescription,
      autoTitle,
      autoDescription,
      siteName: projectName,
      urlParts: [`${projectSlug}.cz`, "cs", "cenik", "byt", unit.name],
      shareImage: unit.hasFloorPlan
        ? {
            title: `Půdorys bytu ${unit.name}`,
            note: "Použije se půdorys z Realpadu",
          }
        : {
            title: "Výchozí obrázek projektu",
            note: "Byt zatím nemá půdorys",
          },
    },
    completion: "",
    prevId: units[index - 1]?.id,
    nextId: units[index + 1]?.id,
  };
}

/** Mock save: waits and resolves. */
export async function saveUnit(
  projectSlug: string,
  unitId: string,
  values: Partial<Pick<UnitDetail, "completion" | "seo">>,
): Promise<void> {
  void projectSlug;
  void unitId;
  void values;
  await new Promise((resolve) => setTimeout(resolve, 700));
}

/** Raw values of the "Nový byt" form; area and price stay as typed. */
export type NewUnitValues = {
  name: string;
  building: string;
  floor: number;
  layout: string;
  area: string;
  price: string;
  status: UnitStatus;
};

/** Mock create: waits and resolves, the list is not changed. */
export async function createUnit(
  projectSlug: string,
  values: NewUnitValues,
): Promise<void> {
  void projectSlug;
  void values;
  await new Promise((resolve) => setTimeout(resolve, 700));
}

/**
 * MOCK of the "Vylepšit s AI" button: waits and returns a canned rewrite.
 * Replace with a call to the real AI endpoint.
 */
export async function suggestSeoText(
  field: "title" | "description",
  unit: UnitDetail,
): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  const area = formatArea(unit.area, true);
  const { siteName } = unit.seo;

  if (field === "title") {
    return `Byt ${unit.layout} ${area} na prodej | ${siteName}`;
  }
  return `Nový byt ${unit.layout} (${area}) v ${unit.floor}. patře projektu ${siteName}${unit.terrace ? " s vlastní terasou" : ""}. Cena ${formatPrice(unit.price)} včetně DPH. Prohlédněte si půdorys a domluvte si prohlídku.`;
}

/**
 * 25.6 → "25,6 m²". With `trim`, whole numbers drop the decimal: 26 → "26 m²".
 */
export function formatArea(area: number, trim = false) {
  const text = trim && Number.isInteger(area) ? String(area) : area.toFixed(1);
  return `${text.replace(".", ",")} m²`;
}
