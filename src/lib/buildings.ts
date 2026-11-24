/**
 * Buildings and floors of a project.
 *
 * MOCK DATA — replace the functions below with real API calls.
 */

import type { ManagedFile } from "@/components/ui/FileRows";
import type { PlanItem } from "@/components/plan/types";
import { formatUnits } from "@/lib/projects";

export type SaleStatus =
  "forSale" | "forSaleNew" | "preparing" | "soldOut" | "hidden";

/**
 * Options of the "Stav prodeje" select and the pill shown next to the title.
 * Only "Na prodej – novinka" and "Připravujeme" appear in the design; the
 * rest is a guess to be confirmed.
 */
export const saleStatuses: Record<
  SaleStatus,
  { label: string; pill: { label: string; color: string } }
> = {
  forSale: {
    label: "Na prodej",
    pill: { label: "Na prodej", color: "#6FD13C" },
  },
  forSaleNew: {
    label: "Na prodej – novinka",
    pill: { label: "Na prodej", color: "#6FD13C" },
  },
  preparing: {
    label: "Připravujeme",
    pill: { label: "Připravujeme", color: "#F2C94C" },
  },
  soldOut: {
    label: "Vyprodáno",
    pill: { label: "Vyprodáno", color: "#F0524B" },
  },
  hidden: {
    label: "Skryto na webu",
    pill: { label: "Skryto", color: "#5A5A62" },
  },
};

export const saleStatusOptions = (
  Object.keys(saleStatuses) as SaleStatus[]
).map((value) => ({ value, label: saleStatuses[value].label }));

export type Building = {
  slug: string;
  name: string;
  saleStatus: SaleStatus;
  unitCount: number;
  description: string;
  /** Public address of the building page. */
  webUrl: string;
  realpad: boolean;
};

export type Floor = {
  slug: string;
  name: string;
  buildingName: string;
  floorNumber: number;
  saleStatus: SaleStatus;
  webUrl: string;
  realpad: boolean;
  /** Files visitors can download on the floor page. */
  documents: ManagedFile[];
  /** Units on the floor and where they sit on the floor plan. */
  units: PlanItem[];
};

/** Three units above the corridor, three below (percent of the plan). */
const slot = (column: number, row: number) => ({
  x: 7.263 + column * 28.864,
  y: row === 0 ? 10.476 : 56.19,
  width: 27.747,
  height: 33.333,
});

const buildings: Building[] = [
  {
    slug: "vybaveni",
    name: "Vybavení",
    saleStatus: "forSaleNew",
    unitCount: 118,
    description: "",
    webUrl: "momentum.cz/budovy/vybaveni",
    realpad: true,
  },
];

const floors: Floor[] = [
  {
    slug: "ab-8",
    name: "AB | 8",
    buildingName: "AB",
    floorNumber: 8,
    saleStatus: "preparing",
    webUrl: "momentum.cz/patra/ab-8",
    realpad: true,
    documents: [
      {
        id: "doc-1",
        name: "Půdorys 8. patro.pdf",
        sizeBytes: 1_258_291,
        source: "own",
        visible: true,
      },
      {
        id: "doc-2",
        name: "Technický popis.pdf",
        sizeBytes: 860_160,
        source: "own",
        visible: true,
      },
    ],
    units: [
      { id: "a-801", name: "A.801", detail: "1+kk", area: slot(0, 0) },
      { id: "a-802", name: "A.802", detail: "2+kk", area: slot(1, 0) },
      { id: "a-803", name: "A.803", detail: "3+kk", area: slot(2, 0) },
      { id: "a-804", name: "A.804", detail: "2+kk", area: slot(0, 1) },
      { id: "a-805", name: "A.805", detail: "1+kk", area: slot(1, 1) },
      {
        id: "a-806",
        name: "A.806",
        detail: "3+kk",
        area: null,
        placeholder: slot(2, 1),
      },
    ],
  },
];

export async function getBuildings(projectSlug: string): Promise<Building[]> {
  void projectSlug;
  return buildings;
}

export async function getBuilding(
  projectSlug: string,
  buildingSlug: string,
): Promise<Building | undefined> {
  void projectSlug;
  return buildings.find((building) => building.slug === buildingSlug);
}

export async function getFloors(projectSlug: string): Promise<Floor[]> {
  void projectSlug;
  return floors;
}

export async function getFloor(
  projectSlug: string,
  floorSlug: string,
): Promise<Floor | undefined> {
  void projectSlug;
  return floors.find((floor) => floor.slug === floorSlug);
}

export type BuildingValues = Pick<
  Building,
  "name" | "saleStatus" | "description"
>;
export type FloorValues = Pick<Floor, "name" | "saleStatus">;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Mock save: waits and resolves. Call from client components. */
export async function saveBuilding(
  projectSlug: string,
  buildingSlug: string,
  values: BuildingValues,
): Promise<void> {
  void projectSlug;
  void buildingSlug;
  void values;
  await wait(700);
}

export async function saveFloor(
  projectSlug: string,
  floorSlug: string,
  values: FloorValues,
): Promise<void> {
  void projectSlug;
  void floorSlug;
  void values;
  await wait(700);
}

/** Mock save of the floor plan image and documents (nothing is uploaded). */
export async function saveFloorFiles(
  projectSlug: string,
  floorSlug: string,
): Promise<void> {
  void projectSlug;
  void floorSlug;
  await wait(700);
}

const realpadNote = "se načítají automaticky z Realpadu";

export function buildingSummary(building: Building) {
  const units = formatUnits(building.unitCount);
  return building.realpad ? `${units} · ceny a stavy ${realpadNote}` : units;
}

export function floorSummary(floor: Floor) {
  const place = `Budova ${floor.buildingName} · ${floor.floorNumber}. patro`;
  return floor.realpad ? `${place} · údaje ${realpadNote}` : place;
}
