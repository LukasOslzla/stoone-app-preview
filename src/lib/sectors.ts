/**
 * Sectors of a project: groups of houses a visitor picks on a picture.
 *
 * MOCK DATA — replace the functions below with real API calls.
 */

import type { PlanItem, PlanPoint } from "@/components/plan/types";
import { outOf, plural } from "@/lib/format";

export type Sector = {
  slug: string;
  name: string;
  /** Render of the sector the houses are outlined on. */
  image: { src: string; width: number; height: number };
  /** Public address of the sector page. */
  webUrl: string;
  /** Houses in the sector and their outlines on the image. */
  houses: PlanItem[];
};

const houseName = (number: number) => `RD${String(number).padStart(2, "0")}`;

/** Placeholder outline: the image split into equal vertical strips. */
function strip(index: number, count: number): PlanPoint[] {
  const width = 80 / count;
  const left = 10 + index * width;
  return [
    { x: left + 1, y: 22 },
    { x: left + width - 1, y: 22 },
    { x: left + width - 1, y: 80 },
    { x: left + 1, y: 80 },
  ];
}

/** Outlines of sector 6 traced over the render (percent of the image). */
const sector6Outlines: { points: PlanPoint[]; tag: PlanPoint }[] = [
  {
    points: [
      { x: 0.5, y: 27.7 },
      { x: 17.6, y: 19.5 },
      { x: 32.3, y: 30.5 },
      { x: 48.4, y: 77 },
      { x: 43.5, y: 100 },
      { x: 0.5, y: 76.6 },
    ],
    tag: { x: 10.8, y: 36.4 },
  },
  {
    points: [
      { x: 17.6, y: 19.5 },
      { x: 33, y: 11 },
      { x: 49, y: 22 },
      { x: 58, y: 62 },
      { x: 48.4, y: 77 },
      { x: 32.3, y: 30.5 },
    ],
    tag: { x: 49.6, y: 36.4 },
  },
  {
    points: [
      { x: 33, y: 11 },
      { x: 46, y: 5 },
      { x: 62, y: 14 },
      { x: 70, y: 52 },
      { x: 58, y: 62 },
      { x: 49, y: 22 },
    ],
    tag: { x: 62.2, y: 29.2 },
  },
  {
    points: [
      { x: 46, y: 5 },
      { x: 60, y: 1 },
      { x: 81, y: 15 },
      { x: 86, y: 44 },
      { x: 70, y: 52 },
      { x: 62, y: 14 },
    ],
    tag: { x: 76.1, y: 23.4 },
  },
];

type SectorSeed = {
  number: number;
  first: number;
  count: number;
  width: number;
  height: number;
  /** Indexes of houses that are not outlined yet. */
  unmarked?: number[];
};

const seeds: SectorSeed[] = [
  { number: 1, first: 1, count: 5, width: 498, height: 286 },
  { number: 2, first: 6, count: 6, width: 517, height: 267 },
  { number: 3, first: 12, count: 4, width: 354, height: 211 },
  { number: 4, first: 16, count: 2, width: 353, height: 278, unmarked: [1] },
  { number: 5, first: 18, count: 6, width: 582, height: 350 },
  { number: 6, first: 24, count: 4, width: 409, height: 256 },
];

const sectors: Sector[] = seeds.map((seed) => ({
  slug: `sektor-${seed.number}`,
  name: `Sektor ${seed.number}`,
  image: {
    src: `/images/sectors/sector${seed.number}.webp`,
    width: seed.width,
    height: seed.height,
  },
  webUrl: `brique.cz/sektory/sektor-${seed.number}`,
  houses: Array.from({ length: seed.count }, (_, index): PlanItem => {
    const name = houseName(seed.first + index);
    const base = { id: name.toLowerCase(), name, detail: "Rodinný dům" };

    if (seed.unmarked?.includes(index)) return { ...base, area: null };
    if (seed.number === 6) {
      const { points, tag } = sector6Outlines[index];
      return { ...base, area: { points }, tag };
    }
    return { ...base, area: { points: strip(index, seed.count) } };
  }),
}));

export async function getSectors(projectSlug: string): Promise<Sector[]> {
  void projectSlug;
  return sectors;
}

export async function getSector(
  projectSlug: string,
  sectorSlug: string,
): Promise<Sector | undefined> {
  void projectSlug;
  return sectors.find((sector) => sector.slug === sectorSlug);
}

export type SectorValues = {
  name: string;
  /** Names of the houses in the sector, e.g. "RD24". */
  houses: string[];
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Mock save: waits and resolves. Call from client components. */
export async function saveSector(
  projectSlug: string,
  sectorSlug: string,
  values: SectorValues,
): Promise<void> {
  void projectSlug;
  void sectorSlug;
  void values;
  await wait(700);
}

/** Mock save of the house outlines. */
export async function saveSectorHouses(
  projectSlug: string,
  sectorSlug: string,
  houses: PlanItem[],
): Promise<void> {
  void projectSlug;
  void sectorSlug;
  void houses;
  await wait(700);
}

const houseForms: [string, string, string] = ["dům", "domy", "domů"];

/** "4 domy · RD24–RD27" */
export function sectorHousesSummary(sector: Sector) {
  const { houses } = sector;
  const count = `${houses.length} ${plural(houses.length, houseForms)}`;
  if (houses.length === 0) return count;
  const first = houses[0].name;
  const last = houses[houses.length - 1].name;
  return houses.length === 1
    ? `${count} · ${first}`
    : `${count} · ${first}–${last}`;
}

/** How many houses are outlined on the image. */
export function sectorMarking(houses: PlanItem[]) {
  const marked = houses.filter((house) => house.area).length;
  const complete = marked === houses.length;
  return {
    marked,
    complete,
    /** Short label for the sector card. */
    label: complete
      ? "Vše označeno"
      : `Označeno ${marked} ${outOf(houses.length)}`,
    /** Line above the progress bar. */
    summary: `${marked} ${outOf(houses.length)} ${
      marked === 1
        ? "označen"
        : marked >= 2 && marked <= 4
          ? "označeny"
          : "označeno"
    }`,
  };
}

/** "Skupina 4 domů, kterou si zájemce vybírá na obrázku · projekt Brique" */
export function sectorDescription(sector: Sector, projectName: string) {
  const count = sector.houses.length;
  return `Skupina ${count} ${count === 1 ? "domu" : "domů"}, kterou si zájemce vybírá na obrázku · projekt ${projectName}`;
}

/** A house that is not in any sector yet. */
export type UnassignedHouse = { id: string; name: string; description: string };

const unassignedHouses: UnassignedHouse[] = [
  { name: "RD28", description: "5+kk · 142 m²" },
  { name: "RD29", description: "5+kk · 142 m²" },
  { name: "RD30", description: "4+kk · 128 m²" },
  { name: "RD31", description: "4+kk · 128 m²" },
  { name: "RD32", description: "5+kk · 151 m²" },
  { name: "RD33", description: "4+kk · 124 m²" },
].map((house) => ({ ...house, id: house.name.toLowerCase() }));

/** Houses offered in the "Nový sektor" wizard. */
export async function getUnassignedHouses(
  projectSlug: string,
): Promise<UnassignedHouse[]> {
  void projectSlug;
  return unassignedHouses;
}

/** Next free name in the row: "Sektor 7". */
export async function suggestSectorName(projectSlug: string) {
  void projectSlug;
  return `Sektor ${sectors.length + 1}`;
}

export type NewSector = {
  name: string;
  /** The picked image; upload it together with the rest. */
  image: File | null;
  houses: PlanItem[];
};

/** Mock create: waits and resolves (nothing is stored or uploaded). */
export async function createSector(
  projectSlug: string,
  sector: NewSector,
): Promise<void> {
  void projectSlug;
  void sector;
  await wait(900);
}
