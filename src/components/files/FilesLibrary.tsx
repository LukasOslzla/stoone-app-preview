"use client";

import { useRef, useState } from "react";
import {
  GridFourIcon,
  LockIcon,
  PlusCircleIcon,
  RowsIcon,
  TrashIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { PageIntro } from "@/components/app/PageIntro";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { AiSuggestButton } from "@/components/ui/AiSuggestButton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { InfoStrip } from "@/components/ui/InfoStrip";
import {
  DataTable,
  sortRows,
  type DataTableColumn,
  type SortState,
} from "@/components/ui/DataTable";
import { SearchInput } from "@/components/ui/SearchInput";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import {
  deleteLibraryFile,
  fileCategories,
  fillMissingAltTexts,
  uploadLibraryFiles,
  usageSentence,
  type FileCategory,
  type LibraryCounts,
  type LibraryFile,
  getRealpadFiles,
} from "@/lib/files";
import {
  formatDate,
  formatFileSize,
  formatNumber,
  outOf,
  plural,
} from "@/lib/format";
import { FileCard } from "./FileCard";
import { FileThumb } from "./FileThumb";

type View = "grid" | "table";

type FilesLibraryProps = {
  projectSlug: string;
  projectName: string;
  /** Whether the project syncs floor plans and unit cards from Realpad. */
  realpad: boolean;
  files: LibraryFile[];
  counts: LibraryCounts;
};

/** "Soubory": the project's media library as a grid or a table. */
export function FilesLibrary({
  projectSlug,
  projectName,
  realpad,
  files: initialFiles,
  counts: initialCounts,
}: FilesLibraryProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState(initialFiles);
  const [counts, setCounts] = useState(initialCounts);
  const [category, setCategory] = useState<FileCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<View>("grid");
  const [sort, setSort] = useState<SortState | null>(null);
  const [toDelete, setToDelete] = useState<LibraryFile | null>(null);
  const [busy, setBusy] = useState<
    "upload" | "delete" | "ai" | "realpad" | null
  >(null);
  // `null` = hidden (the default).
  const [realpadFiles, setRealpadFiles] = useState<LibraryFile[] | null>(null);

  async function toggleRealpad() {
    if (realpadFiles) {
      setRealpadFiles(null);
      return;
    }
    setBusy("realpad");
    setRealpadFiles(await getRealpadFiles(projectSlug));
    setBusy(null);
  }

  const needle = query.trim().toLowerCase();
  const visible = [...files, ...(realpadFiles ?? [])].filter(
    (file) =>
      (category === "all" || file.category === category) &&
      (needle === "" || file.name.toLowerCase().includes(needle)),
  );
  const missingAltCount = files.filter((file) => file.missingAlt).length;

  // Files from Realpad are managed at their unit.
  const menu = (file: LibraryFile) =>
    file.fromRealpad ? null : (
      <ActionMenu
        label={`Akce: ${file.name}`}
        items={[
          {
            label: "Smazat",
            tone: "danger",
            icon: <TrashIcon weight="fill" className="size-3.5" />,
            onSelect: () => setToDelete(file),
          },
        ]}
      />
    );

  const columns: DataTableColumn<LibraryFile>[] = [
    {
      id: "name",
      header: "Soubor",
      sortValue: (file) => file.name,
      cell: (file) => (
        <span className="flex items-center gap-3">
          <FileThumb
            file={file}
            className="h-[38px] w-[52px] shrink-0 rounded-lg border border-line-soft"
            iconClassName="size-4"
          />
          <span className="flex min-w-0 flex-col gap-px">
            <span className="truncate text-sm font-semibold text-fg">
              {file.name}
            </span>
            {file.missingAlt && (
              <span className="flex items-center gap-[5px] text-[11px] text-beige">
                <WarningCircleIcon
                  weight="fill"
                  className="size-[11px] shrink-0"
                />
                Chybí popis obrázku
              </span>
            )}
          </span>
        </span>
      ),
    },
    {
      id: "type",
      header: "Typ",
      width: "w-[126px]",
      sortValue: (file) => file.typeLabel,
      cell: (file) => file.typeLabel,
    },
    {
      id: "size",
      header: "Velikost",
      width: "w-[116px]",
      align: "right",
      sortValue: (file) => file.sizeBytes,
      cell: (file) => formatFileSize(file.sizeBytes),
    },
    {
      id: "usedOn",
      header: "Použito na",
      width: "w-[236px]",
      cell: (file) =>
        file.usedOn.length > 0 ? file.usedOn.join(", ") : "Nepoužívá se",
    },
    {
      id: "uploadedAt",
      header: "Nahráno",
      width: "w-[146px]",
      className: "text-fg-3",
      sortValue: (file) => file.uploadedAt,
      cell: (file) => formatDate(file.uploadedAt),
    },
    {
      id: "actions",
      header: "",
      width: "w-[76px]",
      align: "right",
      cell: menu,
    },
  ];

  async function handleUpload(picked: File[]) {
    setBusy("upload");
    const uploaded = await uploadLibraryFiles(projectSlug, picked);
    setFiles((current) => [...uploaded, ...current]);
    setCounts((current) => {
      const next = { ...current, all: current.all + uploaded.length };
      for (const file of uploaded) next[file.category] += 1;
      return next;
    });
    setBusy(null);
  }

  async function handleDelete() {
    if (!toDelete) return;
    setBusy("delete");
    await deleteLibraryFile(projectSlug, toDelete.id);
    setFiles((current) => current.filter((file) => file.id !== toDelete.id));
    setCounts((current) => ({
      ...current,
      all: current.all - 1,
      [toDelete.category]: current[toDelete.category] - 1,
    }));
    setBusy(null);
    setToDelete(null);
  }

  async function handleFillAlt() {
    setBusy("ai");
    await fillMissingAltTexts(projectSlug);
    setFiles((current) =>
      current.map((file) => ({ ...file, missingAlt: false })),
    );
    setBusy(null);
  }

  const total = category === "all" ? counts.all : counts[category];

  return (
    <div className="flex flex-col gap-[18px] px-8 pt-7 pb-8">
      <PageIntro
        title="Soubory"
        description={`Obrázky, videa a dokumenty, které používáte na webu projektu ${projectName}.`}
        action={
          <>
            <input
              ref={inputRef}
              type="file"
              multiple
              className="sr-only"
              tabIndex={-1}
              aria-hidden
              onChange={(event) => {
                const picked = Array.from(event.target.files ?? []);
                event.target.value = "";
                if (picked.length > 0) handleUpload(picked);
              }}
            />
            <Button
              size="md"
              loading={busy === "upload"}
              loadingLabel="Nahrávám…"
              onClick={() => inputRef.current?.click()}
            >
              <PlusCircleIcon weight="fill" className="size-[15px]" />
              Nahrát soubory
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Chip
            label="Vše"
            count={counts.all}
            selected={category === "all"}
            onClick={() => setCategory("all")}
          />
          {fileCategories.map((item) => (
            <Chip
              key={item.value}
              label={item.label}
              count={counts[item.value]}
              selected={category === item.value}
              onClick={() => setCategory(item.value)}
            />
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <SearchInput
            label="Hledat soubor"
            placeholder="Hledat podle názvu nebo popisu"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <SegmentedControl
            label="Zobrazení"
            shape="pill"
            value={view}
            onChange={setView}
            options={[
              {
                value: "grid",
                label: "Mřížka",
                icon: <GridFourIcon weight="fill" className="size-[15px]" />,
              },
              {
                value: "table",
                label: "Tabulka",
                icon: <RowsIcon weight="fill" className="size-[15px]" />,
              },
            ]}
          />
        </div>
      </div>

      {realpad && (
        <InfoStrip
          icon={LockIcon}
          action={{
            label:
              busy === "realpad"
                ? "Načítám…"
                : realpadFiles
                  ? "Skrýt"
                  : "Zobrazit i tak",
            onClick: busy === "realpad" ? undefined : toggleRealpad,
          }}
        >
          {realpadFiles ? (
            <>
              Ukazujeme i prvních {realpadFiles.length} z{" "}
              {formatNumber(counts.realpadHidden)} souborů z Realpadu. Mazat ani
              měnit je tu nejde – spravují se u jednotlivých bytů.
            </>
          ) : (
            <>
              {formatNumber(counts.realpadHidden)} půdorysů a karet bytů z
              Realpadu tu neukazujeme – najdete je přímo u jednotlivých bytů.
            </>
          )}
        </InfoStrip>
      )}

      {view === "grid" ? (
        visible.length > 0 ? (
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visible.map((file) => (
              <li key={file.id} className="min-w-0">
                <FileCard file={file} actions={menu(file)} />
              </li>
            ))}
          </ul>
        ) : (
          <Card className="py-10 text-center font-text text-sm leading-[1.4] text-fg-3">
            Žádný soubor neodpovídá filtru.
          </Card>
        )
      ) : (
        <Card className="px-6 py-1.5">
          <DataTable
            columns={columns}
            rows={sortRows(visible, columns, sort)}
            rowKey={(file) => file.id}
            sort={sort}
            onSortChange={setSort}
            minWidth={940}
            empty="Žádný soubor neodpovídá filtru."
          />
        </Card>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-text text-[13px] leading-[1.4] text-fg-3">
          Zobrazeno {visible.length} {outOf(total)}{" "}
          {plural(total, ["souboru", "souborů", "souborů"])}
        </p>
        {missingAltCount > 0 && (
          <AiSuggestButton
            label="Doplnit chybějící popisy obrázků s AI"
            loading={busy === "ai"}
            onClick={handleFillAlt}
          />
        )}
      </div>

      <ConfirmDialog
        open={toDelete !== null}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={busy === "delete"}
        title={toDelete ? `Smazat „${toDelete.name}“?` : ""}
        description="Soubor se odstraní z knihovny i z webu. Tuto akci nejde vrátit."
        warning={toDelete && usageSentence(toDelete)}
        confirmLabel="Smazat soubor"
      />
    </div>
  );
}
