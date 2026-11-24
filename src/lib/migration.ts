/**
 * Moving content between projects.
 *
 * MOCK DATA — replace the functions below with real API calls.
 */

export type MigrationPart = "pages" | "layout" | "settings" | "files";

export const migrationParts: {
  id: MigrationPart;
  label: string;
  /** Short name used in the history ("Stránky, hlavička"). */
  shortLabel: string;
  /** How much there is to move, shown on the right. */
  amount?: string;
}[] = [
  {
    id: "pages",
    label: "Stránky webu",
    shortLabel: "stránky",
    amount: "12 stránek",
  },
  { id: "layout", label: "Hlavička a patička", shortLabel: "hlavička" },
  {
    id: "settings",
    label: "Nastavení webu (SEO, 404)",
    shortLabel: "nastavení",
  },
  {
    id: "files",
    label: "Soubory",
    shortLabel: "soubory",
    amount: "301 souborů",
  },
];

export type MigrationRecord = {
  id: string;
  fromName: string;
  toName: string;
  parts: MigrationPart[];
  /** ISO date. */
  date: string;
  author: string;
};

const history: MigrationRecord[] = [
  {
    id: "m-2",
    fromName: "Brique",
    toName: "Momentum",
    parts: ["pages", "layout"],
    date: "2026-10-12",
    author: "Dominik",
  },
  {
    id: "m-1",
    fromName: "Žižkov 3.0",
    toName: "Brique",
    parts: ["files"],
    date: "2026-06-29",
    author: "Dominik",
  },
];

export async function getMigrationHistory(): Promise<MigrationRecord[]> {
  return history;
}

/** "Stránky, hlavička" */
export function partsSummary(parts: MigrationPart[]) {
  const text = migrationParts
    .filter((part) => parts.includes(part.id))
    .map((part) => part.shortLabel)
    .join(", ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Mock run: waits and returns the history record (nothing is moved). */
export async function runMigration(
  request: Omit<MigrationRecord, "id" | "date">,
): Promise<MigrationRecord> {
  await wait(1200);
  return {
    ...request,
    id: `m-${Date.now()}`,
    date: new Date().toISOString().slice(0, 10),
  };
}

/** Mock undo of a finished migration. */
export async function undoMigration(recordId: string): Promise<void> {
  void recordId;
  await wait(600);
}
