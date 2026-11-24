/**
 * Project data.
 *
 * MOCK DATA — replace `getProjects` with a real API call.
 */

export type Project = {
  slug: string;
  name: string;
  /** Short text rendered in the logo tile until real logos are available. */
  logoText: string;
  active: boolean;
  buildings: number;
  /** Human-readable time of the last Realpad sync; undefined = not connected. */
  realpadSync?: string;
  units: {
    total: number;
    free: number;
    sold: number;
    reserved: number;
    preReserved: number;
  };
};

const projects: Project[] = [
  {
    slug: "momentum",
    name: "Momentum",
    logoText: "momentum",
    active: true,
    buildings: 2,
    realpadSync: "před 5 min",
    units: { total: 240, free: 196, sold: 1, reserved: 21, preReserved: 18 },
  },
  {
    slug: "brique",
    name: "Brique",
    logoText: "BRIQUE",
    active: true,
    buildings: 11,
    units: { total: 60, free: 8, sold: 0, reserved: 6, preReserved: 32 },
  },
  {
    slug: "zizkov-3-0",
    name: "Žižkov 3.0",
    logoText: "Žižkov 3.0",
    active: false,
    buildings: 9,
    units: { total: 280, free: 151, sold: 96, reserved: 13, preReserved: 11 },
  },
];

export async function getProjects(): Promise<Project[]> {
  return projects;
}

export async function getProject(slug: string): Promise<Project | undefined> {
  return projects.find((project) => project.slug === slug);
}

/** "1 budova", "2 budovy", "5 budov" */
export function formatBuildings(count: number) {
  if (count === 1) return `${count} budova`;
  if (count >= 2 && count <= 4) return `${count} budovy`;
  return `${count} budov`;
}

/** "1 jednotka", "3 jednotky", "240 jednotek" */
export function formatUnits(count: number) {
  if (count === 1) return `${count} jednotka`;
  if (count >= 2 && count <= 4) return `${count} jednotky`;
  return `${count} jednotek`;
}
