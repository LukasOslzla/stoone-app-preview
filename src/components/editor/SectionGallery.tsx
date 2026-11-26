"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CaretLeftIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchInput } from "@/components/ui/SearchInput";
import { outOf, plural } from "@/lib/format";
import {
  sectionCategories,
  type SectionCategory,
  type SectionType,
} from "@/lib/editor";
import { RequestSectionDialog } from "./RequestSectionDialog";
import { SectionIcon } from "./sectionIcons";

type SectionGalleryProps = {
  types: SectionType[];
  /** Name of the page the section goes to ("Hlavní stránka"). */
  pageName: string;
  /** Name of the section the new one is inserted under, if any. */
  afterName?: string;
  onInsert: (typeId: string) => void;
  onBack: () => void;
  projectSlug: string;
};

/** "Galerie sekcí": every building block of the web with its preview. */
export function SectionGallery({
  types,
  pageName,
  afterName,
  onInsert,
  onBack,
  projectSlug,
}: SectionGalleryProps) {
  const [requestOpen, setRequestOpen] = useState(false);
  const [requested, setRequested] = useState(false);
  const [category, setCategory] = useState<SectionCategory | "all">("all");
  const [query, setQuery] = useState("");

  const needle = query.trim().toLowerCase();
  // Sections with a screenshot come first.
  const sorted = [...types].sort(
    (a, b) => Number(Boolean(b.preview)) - Number(Boolean(a.preview)),
  );
  const visible = sorted.filter(
    (type) =>
      (category === "all" || type.category === category) &&
      (needle === "" ||
        type.name.toLowerCase().includes(needle) ||
        type.description.toLowerCase().includes(needle)),
  );

  return (
    <div className="flex flex-col">
      <div className="flex h-16 items-center justify-between gap-4 border-b border-line-soft px-5">
        <button
          type="button"
          onClick={onBack}
          className="flex h-9 items-center gap-1.5 rounded-full border border-line pr-3.5 pl-2.5 font-text text-[13px] leading-none font-semibold text-fg transition-colors hover:bg-tint/5 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-beige"
        >
          <CaretLeftIcon weight="fill" className="size-3 text-fg-2" />
          Zpět na {pageName}
        </button>
        <p className="font-text text-[13px] leading-[1.4] text-fg-3">
          {afterName
            ? `Sekce se vloží pod „${afterName}“`
            : "Sekce se vloží na začátek stránky"}
        </p>
      </div>

      <div className="flex flex-col gap-5 px-7 pt-6 pb-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1.5">
            <h1 className="font-title text-[28px] leading-[1.2] font-medium text-fg">
              Galerie sekcí
            </h1>
            <p className="font-text text-sm leading-[1.4] text-fg-2">
              Všechny stavební kameny vašeho webu. Vyberte sekci, vložte ji na
              stránku a přepište jen obsah.
            </p>
          </div>
          <SearchInput
            label="Hledat sekci"
            placeholder="Hledat sekci"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div
          role="group"
          aria-label="Druh sekce"
          className="flex flex-wrap gap-2"
        >
          <Chip
            label="Všechny"
            count={types.length}
            selected={category === "all"}
            onClick={() => setCategory("all")}
          />
          {sectionCategories.map((item) => (
            <Chip
              key={item.id}
              label={item.label}
              count={types.filter((type) => type.category === item.id).length}
              selected={category === item.id}
              onClick={() => setCategory(item.id)}
            />
          ))}
        </div>

        {visible.length === 0 && (
          <EmptyState
            size="sm"
            icon={MagnifyingGlassIcon}
            title="Takovou sekci tu nemáme"
            text="Zkuste jiný druh nebo hledaný text – nebo o sekci požádejte níže."
            action={
              <Button
                size="md"
                variant="outline"
                onClick={() => {
                  setCategory("all");
                  setQuery("");
                }}
              >
                Zrušit filtry
              </Button>
            }
          />
        )}

        <ul className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
          {visible.map((type) => {
            return (
              <li
                key={type.id}
                className="surface-card group relative flex flex-col overflow-hidden rounded-[18px] transition-colors focus-within:border-beige hover:border-beige"
              >
                <div className="relative h-[210px] bg-inset">
                  {type.preview ? (
                    <Image
                      src={type.preview}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 30vw, 50vw"
                      className="object-cover object-top"
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <SectionIcon
                        type={type.id}
                        className="size-9 text-fg-3"
                      />
                    </span>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0C80] opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => onInsert(type.id)}
                      aria-label={`Vložit na stránku: ${type.name}`}
                      className="flex h-10 items-center gap-2 rounded-full bg-beige px-[18px] font-text text-sm leading-none font-bold text-ink transition-colors after:absolute after:inset-0 hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
                    >
                      <PlusCircleIcon weight="fill" className="size-[15px]" />
                      Vložit na stránku
                    </button>
                  </div>
                </div>
                <div className="flex flex-1 items-start gap-3 px-[18px] pt-3.5 pb-4">
                  <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                    <h2 className="font-title text-base leading-[1.25] font-medium text-fg">
                      {type.name}
                    </h2>
                    <p className="font-text text-xs leading-[1.45] text-fg-3">
                      {type.description}
                    </p>
                  </div>
                  <span className="flex h-[22px] shrink-0 items-center rounded-full bg-control px-2 font-text text-[11px] leading-none font-semibold text-fg-2">
                    Použito {type.usage}×
                  </span>
                </div>
              </li>
            );
          })}

          <li className="flex min-h-[280px] flex-col items-center justify-center gap-2.5 rounded-[18px] border border-dashed border-line p-6 text-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-control">
              <SparkleIcon weight="fill" className="size-[18px] text-beige" />
            </span>
            <h2 className="font-title text-base leading-[1.4] font-medium text-fg">
              Chybí vám tu něco?
            </h2>
            <p className="max-w-[220px] font-text text-xs leading-[1.4] text-fg-3">
              {requested
                ? "Žádost jsme přijali. Ozveme se v notifikacích."
                : "Popište, jakou sekci potřebujete, a připravíme ji."}
            </p>
            <button
              type="button"
              onClick={() => setRequestOpen(true)}
              className="rounded-md font-text text-[13px] leading-[1.4] font-semibold text-beige transition-colors hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige"
            >
              {requested ? "Požádat o další sekci" : "Požádat o novou sekci"}
            </button>
          </li>
        </ul>

        <p className="font-text text-[13px] leading-[1.4] text-fg-3">
          Zobrazeno {visible.length} {outOf(types.length)}{" "}
          {plural(types.length, ["sekce", "sekcí", "sekcí"])}
        </p>
      </div>

      <RequestSectionDialog
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        projectSlug={projectSlug}
        onSent={() => setRequested(true)}
      />
    </div>
  );
}
