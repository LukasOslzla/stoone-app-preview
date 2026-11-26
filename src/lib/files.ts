/**
 * File library of a project: images, videos and documents used on the web.
 *
 * MOCK DATA — replace the functions below with real API calls.
 */

export type FileCategory = "image" | "video" | "document" | "logo";

export const fileCategories: { value: FileCategory; label: string }[] = [
  { value: "image", label: "Obrázky" },
  { value: "video", label: "Videa" },
  { value: "document", label: "Dokumenty" },
  { value: "logo", label: "Loga a ikony" },
];

export type LibraryFile = {
  id: string;
  name: string;
  category: FileCategory;
  /** Shown in lists: "Obrázek", "Video", "PDF"… */
  typeLabel: string;
  sizeBytes: number;
  /** Preview image; files without it show an icon. */
  thumbnailUrl?: string;
  /** Pages of the web the file is used on; empty = not used anywhere. */
  usedOn: string[];
  /** ISO date of the upload. */
  uploadedAt: string;
  /** Image without an alt text (bad for SEO and accessibility). */
  missingAlt?: boolean;
  /** Synced from Realpad: managed at the unit, cannot be deleted here. */
  fromRealpad?: boolean;
};

const MB = 1024 * 1024;
const kB = 1024;

const files: LibraryFile[] = [
  {
    id: "vizualizace-projektu",
    name: "Vizualizace projektu Momentum",
    category: "image",
    typeLabel: "Obrázek",
    sizeBytes: 4.7 * MB,
    thumbnailUrl: "/images/library/lib1.jpg",
    usedOn: ["Kontakt"],
    uploadedAt: "2026-11-10",
  },
  {
    id: "standards-change",
    name: "standards-change",
    category: "image",
    typeLabel: "Obrázek",
    sizeBytes: 2.8 * MB,
    thumbnailUrl: "/images/library/lib2.jpg",
    usedOn: ["Vybavení bytu"],
    uploadedAt: "2026-11-10",
    missingAlt: true,
  },
  {
    id: "vizualizace-praha",
    name: "Vizualizace Praha",
    category: "image",
    typeLabel: "Obrázek",
    sizeBytes: 667 * kB,
    thumbnailUrl: "/images/library/lib3.jpg",
    usedOn: ["Lokalita"],
    uploadedAt: "2026-10-02",
  },
  {
    id: "smichov-exterier",
    name: "Momentum Smíchov – exteriér",
    category: "image",
    typeLabel: "Obrázek",
    sizeBytes: 3.7 * MB,
    thumbnailUrl: "/images/library/lib4.jpg",
    usedOn: ["Hlavní stránka", "Galerie"],
    uploadedAt: "2026-06-29",
  },
  {
    id: "smichov-ulice",
    name: "Momentum Smíchov – ulice",
    category: "image",
    typeLabel: "Obrázek",
    sizeBytes: 3.2 * MB,
    thumbnailUrl: "/images/library/lib5.jpg",
    usedOn: ["Galerie"],
    uploadedAt: "2026-06-29",
  },
  {
    id: "tereza-pilipova",
    name: "Tereza Pilipová",
    category: "image",
    typeLabel: "Obrázek",
    sizeBytes: 147 * kB,
    thumbnailUrl: "/images/library/lib6.jpg",
    usedOn: ["Kontakt"],
    uploadedAt: "2026-10-14",
  },
  {
    id: "smichov-dvur",
    name: "Momentum Smíchov – dvůr",
    category: "image",
    typeLabel: "Obrázek",
    sizeBytes: 2.2 * MB,
    thumbnailUrl: "/images/library/lib7.webp",
    usedOn: ["Galerie"],
    uploadedAt: "2026-06-29",
  },
  {
    id: "momentum-vid",
    name: "momentum-vid",
    category: "video",
    typeLabel: "Video",
    sizeBytes: 10.5 * MB,
    usedOn: ["Hlavní stránka"],
    uploadedAt: "2026-06-29",
  },
  {
    id: "vzor-smlouvy",
    name: "Vzor smlouvy – Momentum Smíchov",
    category: "document",
    typeLabel: "PDF",
    sizeBytes: 428 * kB,
    usedOn: ["Dokumenty"],
    uploadedAt: "2026-11-10",
  },
  {
    id: "platebni-kalendar",
    name: "Platební kalendář 10 %",
    category: "document",
    typeLabel: "PDF",
    sizeBytes: 165 * kB,
    usedOn: [],
    uploadedAt: "2026-10-22",
  },
];

/** The first page of the library (the design shows 10 of 199 files). */
export async function getLibraryFiles(
  projectSlug: string,
): Promise<LibraryFile[]> {
  void projectSlug;
  return files;
}

/**
 * Floor plans and unit cards synced from Realpad (hidden by default).
 * Mock: the first few of them.
 */
export async function getRealpadFiles(
  projectSlug: string,
): Promise<LibraryFile[]> {
  void projectSlug;
  await new Promise((resolve) => setTimeout(resolve, 700));
  return ["A.101", "A.102", "A.103", "A.104"].flatMap((unit, index) => [
    {
      id: `realpad-plan-${unit}`,
      name: `Půdorys bytu ${unit}`,
      category: "document" as const,
      typeLabel: "PDF",
      sizeBytes: (380 + index * 35) * 1024,
      usedOn: [`Byt ${unit}`],
      uploadedAt: "2026-11-02",
      fromRealpad: true,
    },
    {
      id: `realpad-card-${unit}`,
      name: `Karta bytu ${unit}`,
      category: "document" as const,
      typeLabel: "PDF",
      sizeBytes: (1200 + index * 90) * 1024,
      usedOn: [`Byt ${unit}`],
      uploadedAt: "2026-11-02",
      fromRealpad: true,
    },
  ]);
}

export type LibraryCounts = Record<FileCategory | "all", number> & {
  /** Floor plans and unit cards synced from Realpad, hidden by default. */
  realpadHidden: number;
};

/** Totals for the filter chips. */
export async function getLibraryCounts(
  projectSlug: string,
): Promise<LibraryCounts> {
  void projectSlug;
  return {
    all: 199,
    image: 165,
    video: 1,
    document: 22,
    logo: 11,
    realpadHidden: 418,
  };
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Mock delete: waits and resolves. */
export async function deleteLibraryFile(
  projectSlug: string,
  fileId: string,
): Promise<void> {
  void projectSlug;
  void fileId;
  await wait(600);
}

/** Mock upload: nothing leaves the browser, the files are only described. */
export async function uploadLibraryFiles(
  projectSlug: string,
  uploads: File[],
): Promise<LibraryFile[]> {
  void projectSlug;
  await wait(600);
  const today = new Date().toISOString().slice(0, 10);

  return uploads.map((file, index) => {
    const image = file.type.startsWith("image/");
    const video = file.type.startsWith("video/");
    const extension = file.name.split(".").pop()?.toUpperCase() ?? "Soubor";
    return {
      id: `upload-${Date.now()}-${index}`,
      name: file.name.replace(/\.[^.]+$/, ""),
      category: image ? "image" : video ? "video" : "document",
      typeLabel: image ? "Obrázek" : video ? "Video" : extension,
      sizeBytes: file.size,
      thumbnailUrl: image ? URL.createObjectURL(file) : undefined,
      usedOn: [],
      uploadedAt: today,
      missingAlt: image,
    };
  });
}

/** Mock AI: pretends to write the missing alt texts. */
export async function fillMissingAltTexts(projectSlug: string): Promise<void> {
  void projectSlug;
  await wait(1200);
}

/** "Obrázek se používá na stránce Kontakt." / "…na stránkách A a B." */
export function usageSentence(file: LibraryFile) {
  if (file.usedOn.length === 0) return null;
  const subject =
    file.category === "image" || file.category === "logo"
      ? "Obrázek"
      : file.category === "video"
        ? "Video"
        : "Soubor";
  const pages =
    file.usedOn.length === 1
      ? `na stránce ${file.usedOn[0]}`
      : `na stránkách ${file.usedOn.slice(0, -1).join(", ")} a ${file.usedOn.at(-1)}`;
  return `${subject} se používá ${pages}. Po smazání tam bude prázdné místo.`;
}
