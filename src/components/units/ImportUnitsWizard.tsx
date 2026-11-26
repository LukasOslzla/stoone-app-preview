"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  FileArrowUpIcon,
  FileTextIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { FlowHeader } from "@/components/app/FlowHeader";
import {
  Button,
  buttonBase,
  buttonSizes,
  buttonVariants,
} from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { Dropzone } from "@/components/ui/Dropzone";
import { Stepper } from "@/components/ui/Stepper";
import { cn } from "@/lib/cn";
import { plural } from "@/lib/format";
import {
  importUnits,
  readUnitsFile,
  templateColumns,
  templateCsv,
  type ImportPreview,
  type ImportRow,
} from "@/lib/units-import";

const steps = ["Soubor", "Kontrola", "Hotovo"];

const flats = (count: number) =>
  `${count} ${plural(count, ["byt", "byty", "bytů"])}`;

const missing = <span className="text-beige">—</span>;

const columns: DataTableColumn<ImportRow>[] = [
  {
    id: "name",
    header: "Byt",
    width: "w-[110px]",
    cell: (row) => (
      <span className="text-sm font-semibold text-fg">{row.name}</span>
    ),
  },
  {
    id: "floor",
    header: "Patro",
    width: "w-[146px]",
    className: "font-medium",
    cell: (row) => row.floorLabel,
  },
  {
    id: "layout",
    header: "Dispozice",
    width: "w-[136px]",
    className: "font-medium",
    cell: (row) => row.layout,
  },
  {
    id: "area",
    header: "Plocha",
    width: "w-[126px]",
    className: "font-medium",
    cell: (row) => row.area ?? missing,
  },
  {
    id: "price",
    header: "Cena",
    width: "w-[176px]",
    className: "font-medium",
    cell: (row) =>
      row.price ? <span className="text-fg">{row.price}</span> : missing,
  },
  {
    id: "status",
    header: "Stav",
    width: "w-[166px]",
    className: "font-medium",
    cell: (row) => row.status,
  },
  {
    id: "result",
    header: "",
    cell: (row) =>
      row.result.kind === "error" ? (
        <span className="flex items-center gap-1.5 font-semibold text-beige">
          <WarningCircleIcon weight="fill" className="size-[15px] shrink-0" />
          {row.result.note}
        </span>
      ) : (
        <span className="flex items-center gap-1.5 text-fg-3">
          <CheckCircleIcon weight="fill" className="size-[15px] shrink-0" />
          {row.result.note}
        </span>
      ),
  },
];

function downloadTemplate() {
  // The BOM makes Excel read the Czech characters correctly.
  const blob = new Blob(["﻿", templateCsv], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "vzor-byty.csv";
  link.click();
  URL.revokeObjectURL(url);
}

/** Three-step import of flats from a spreadsheet: file → review → done. */
export function ImportUnitsWizard({ projectSlug }: { projectSlug: string }) {
  const list = `/projects/${projectSlug}/units`;
  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File) {
    setBusy(true);
    const result = await readUnitsFile(file);
    setBusy(false);
    setPreview(result);
    setStep(1);
  }

  async function handleImport() {
    if (!preview) return;
    setBusy(true);
    await importUnits(projectSlug, preview);
    setBusy(false);
    setStep(2);
  }

  const importable = preview ? preview.total - preview.errorCount : 0;
  const errorRows = preview?.rows.filter((row) => row.result.kind === "error");

  const heading =
    step === 0
      ? {
          title: "Nahrajte tabulku s byty",
          description:
            "Jeden řádek = jeden byt. Nejjednodušší je vyplnit naši vzorovou tabulku.",
        }
      : step === 1 && preview
        ? {
            title: "Zkontrolujte, co se nahraje",
            description: `${preview.fileName} · našli jsme ${flats(preview.total)}. ${
              preview.errorCount === 0
                ? "Všechny řádky jsou v pořádku."
                : `${preview.errorCount} ${plural(preview.errorCount, ["řádek potřebuje", "řádky potřebují", "řádků potřebuje"])} opravu, ostatní jsou v pořádku.`
            }`,
          }
        : null;

  return (
    <div className="flex flex-col gap-6 px-8 pt-7 pb-8">
      <FlowHeader
        breadcrumb={[
          { label: "Byty", href: list },
          { label: "Nahrát z Excelu" },
        ]}
        cancelHref={list}
        stepper={<Stepper steps={steps} current={step} />}
        heading={heading}
      />

      {step === 0 && (
        <div className="flex w-full max-w-[720px] flex-col gap-4">
          <Card className="flex flex-wrap items-center gap-3.5 rounded-2xl px-5 py-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-control">
              <FileTextIcon weight="fill" className="size-[18px] text-beige" />
            </span>
            <span className="flex min-w-[200px] flex-1 flex-col gap-px">
              <span className="font-text text-sm leading-[1.4] font-semibold text-fg">
                Vzorová tabulka
              </span>
              <span className="font-text text-[13px] leading-[1.4] text-fg-3">
                {templateColumns
                  .join(", ")
                  .replace(/^./, (c) => c.toUpperCase())}
              </span>
            </span>
            <Button variant="outline" size="action" onClick={downloadTemplate}>
              <ArrowDownIcon weight="fill" className="size-[15px] text-fg-2" />
              Stáhnout vzor
            </Button>
          </Card>

          <Card className="flex flex-col gap-[22px] p-6">
            <Dropzone
              title={busy ? "Čtu soubor…" : "Přetáhněte sem soubor Excel"}
              accept=".xlsx,.csv"
              icon={FileArrowUpIcon}
              className={cn(
                "h-[220px]",
                busy && "pointer-events-none opacity-60",
              )}
              onFiles={([file]) => handleFile(file)}
            />
            <p className="font-text text-xs leading-[1.4] text-fg-3">
              Podporujeme .xlsx a .csv. Byty, které už v systému jsou, se podle
              čísla bytu aktualizují.
            </p>
          </Card>
        </div>
      )}

      {step === 1 && preview && (
        <>
          <div className="flex flex-wrap gap-3">
            {[
              {
                value: preview.newCount,
                label: plural(preview.newCount, [
                  "nový byt",
                  "nové byty",
                  "nových bytů",
                ]),
              },
              {
                value: preview.updateCount,
                label: plural(preview.updateCount, [
                  "se aktualizuje",
                  "se aktualizují",
                  "se aktualizují",
                ]),
              },
              {
                value: preview.errorCount,
                label: plural(preview.errorCount, [
                  "potřebuje opravu",
                  "potřebují opravu",
                  "potřebuje opravu",
                ]),
                warn: true,
              },
            ].map((item) => (
              <Card
                key={item.label}
                className="flex items-end gap-2.5 rounded-[14px] px-[18px] py-3"
              >
                <span
                  className={cn(
                    "font-title text-[22px] leading-none font-medium",
                    item.warn && item.value > 0 ? "text-beige" : "text-fg",
                  )}
                >
                  {item.value}
                </span>
                <span className="font-text text-[13px] leading-[1.4] text-fg-2">
                  {item.label}
                </span>
              </Card>
            ))}
          </div>

          <Card className="px-6 py-2">
            <DataTable
              columns={columns}
              rows={preview.rows}
              rowKey={(row) => row.name}
              sort={null}
              onSortChange={() => {}}
              minWidth={980}
            />
          </Card>

          <p className="font-text text-[13px] leading-[1.4] text-fg-3">
            Zobrazeno {preview.rows.length} z {preview.total} řádků. Řádky s
            chybou můžete opravit přímo tady, nebo je nahrát později.
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              variant="outline"
              size="action"
              disabled={busy}
              onClick={() => setStep(0)}
            >
              <ArrowLeftIcon weight="fill" className="size-[15px] text-fg-2" />
              Zpět
            </Button>
            <Button
              size="action"
              loading={busy}
              loadingLabel="Nahrávám…"
              disabled={importable === 0}
              onClick={handleImport}
            >
              Nahrát {flats(importable)}
            </Button>
          </div>
        </>
      )}

      {step === 2 && preview && (
        <Card className="flex w-full max-w-[640px] flex-col items-center gap-5 rounded-3xl p-8 text-center">
          <span className="flex size-16 items-center justify-center rounded-full border border-green/35 bg-green/10">
            <CheckCircleIcon weight="fill" className="size-7 text-green" />
          </span>
          <h1 className="font-title text-[26px] leading-[1.2] font-medium text-fg">
            Hotovo, nahráli jsme {flats(importable)}
          </h1>
          <p className="font-text text-sm leading-[1.4] text-fg-2">
            Byty jsou v seznamu a na webu se ukážou hned.
          </p>

          <div className="flex w-full flex-col gap-3 text-left sm:flex-row">
            {[
              {
                value: preview.newCount,
                label: plural(preview.newCount, [
                  "nový byt",
                  "nové byty",
                  "nových bytů",
                ]),
              },
              { value: preview.updateCount, label: "aktualizováno" },
              {
                value: preview.errorCount,
                label: "přeskočeno",
                warn: preview.errorCount > 0,
              },
            ].map((item) => (
              <div
                key={item.label}
                className={cn(
                  "flex flex-1 flex-col gap-1 rounded-[14px] border bg-inset px-4 py-3.5",
                  item.warn ? "border-beige/35" : "border-line-soft",
                )}
              >
                <span
                  className={cn(
                    "font-title text-2xl leading-[1.2] font-medium",
                    item.warn ? "text-beige" : "text-fg",
                  )}
                >
                  {item.value}
                </span>
                <span className="font-text text-[13px] leading-[1.4] text-fg-2">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {errorRows && errorRows.length > 0 && (
            <div className="flex w-full items-center gap-2.5 rounded-xl border border-line-soft bg-inset px-3.5 py-3 text-left">
              <WarningCircleIcon
                weight="fill"
                className="size-[15px] shrink-0 text-beige"
              />
              <p className="min-w-0 flex-1 font-text text-[13px] leading-[1.4] text-fg">
                {errorRows
                  .map(
                    (row) => `${row.name} (${row.result.note.toLowerCase()})`,
                  )
                  .join(" a ")}{" "}
                jsme nenahráli.
              </p>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-md font-text text-[13px] leading-[1.4] font-semibold text-beige transition-colors hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige"
              >
                Opravit
              </button>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-2.5 pt-1">
            <Button
              variant="outline"
              size="action"
              onClick={() => {
                setPreview(null);
                setStep(0);
              }}
            >
              Nahrát další soubor
            </Button>
            <Link
              href={list}
              className={cn(
                buttonBase,
                buttonSizes.action,
                buttonVariants.primary,
              )}
            >
              Zobrazit byty
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
