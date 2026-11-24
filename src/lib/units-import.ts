/**
 * Import of units from an Excel / CSV file.
 *
 * MOCK — `readUnitsFile` ignores the file content and returns the rows from
 * the design; `importUnits` only waits. Replace both with real API calls.
 */

export type ImportRow = {
  name: string;
  floorLabel: string;
  layout: string;
  /** Pre-formatted values; `null` when the cell was empty. */
  area: string | null;
  price: string | null;
  status: string;
  result:
    { kind: "new" | "update"; note: string } | { kind: "error"; note: string };
};

export type ImportPreview = {
  fileName: string;
  total: number;
  newCount: number;
  updateCount: number;
  errorCount: number;
  /** Rows shown for review (the first few plus every row with a problem). */
  rows: ImportRow[];
};

export const templateColumns = [
  "Číslo bytu",
  "Budova",
  "Patro",
  "Dispozice",
  "Plocha",
  "Cena",
  "Stav",
];

/** Content of the downloadable template (CSV opens in Excel). */
export const templateCsv = [
  templateColumns.join(";"),
  "B.101;B;1;2+kk;48,2;9480000;Volné",
].join("\n");

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function readUnitsFile(file: File): Promise<ImportPreview> {
  await wait(900);

  return {
    fileName: file.name,
    total: 24,
    newCount: 18,
    updateCount: 4,
    errorCount: 2,
    rows: [
      {
        name: "B.101",
        floorLabel: "1. patro · B",
        layout: "2+kk",
        area: "48,2 m²",
        price: "9 480 000 Kč",
        status: "Volné",
        result: { kind: "new", note: "Nový" },
      },
      {
        name: "B.102",
        floorLabel: "1. patro · B",
        layout: "1+kk",
        area: "27,4 m²",
        price: null,
        status: "Volné",
        result: { kind: "error", note: "Chybí cena" },
      },
      {
        name: "B.103",
        floorLabel: "1. patro · B",
        layout: "3+kk",
        area: "72,0 m²",
        price: "13 950 000 Kč",
        status: "Volné",
        result: { kind: "new", note: "Nový" },
      },
      {
        name: "B.104",
        floorLabel: "1. patro · B",
        layout: "2 + kuch.",
        area: "51,6 m²",
        price: "9 990 000 Kč",
        status: "Volné",
        result: { kind: "error", note: "Neznámá dispozice" },
      },
      {
        name: "A.440",
        floorLabel: "4. patro · AB",
        layout: "1+kk",
        area: "25,6 m²",
        price: "7 694 000 Kč",
        status: "Rezervováno",
        result: { kind: "update", note: "Aktualizace stavu" },
      },
      {
        name: "A.439",
        floorLabel: "4. patro · AB",
        layout: "1+kk",
        area: "23,1 m²",
        price: "7 190 000 Kč",
        status: "Volné",
        result: { kind: "update", note: "Aktualizace ceny" },
      },
    ],
  };
}

export async function importUnits(
  projectSlug: string,
  preview: ImportPreview,
): Promise<void> {
  void projectSlug;
  void preview;
  await wait(1100);
}
