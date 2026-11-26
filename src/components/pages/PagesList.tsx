"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowSquareOutIcon,
  PencilSimpleIcon,
  PlusCircleIcon,
} from "@phosphor-icons/react";
import { PageIntro } from "@/components/app/PageIntro";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  DataTable,
  sortRows,
  type DataTableColumn,
  type SortState,
} from "@/components/ui/DataTable";
import { DotPill } from "@/components/ui/DotPill";
import { Modal } from "@/components/ui/Modal";
import { NumberedSteps } from "@/components/ui/NumberedSteps";
import { SearchInput } from "@/components/ui/SearchInput";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { formatNumber, plural } from "@/lib/format";
import type { SitePage, SiteStatus } from "@/lib/pages";
import { AddPageDialog } from "./AddPageDialog";
import { SiteStatusBar } from "./SiteStatusBar";

type Filter = "all" | SitePage["status"];

const statuses = {
  published: { label: "Na webu", color: "#6FD13C" },
  draft: { label: "Koncept", color: "#F2C94C" },
};

type PagesListProps = {
  pages: SitePage[];
  site: SiteStatus;
  /** Address of the content editor of this project. */
  editorHref: string;
  projectSlug: string;
};

/** "Stránky webu": state of the public web and the list of its pages. */
export function PagesList({
  pages: initialPages,
  site,
  editorHref,
  projectSlug,
}: PagesListProps) {
  const [pages, setPages] = useState(initialPages);
  const [dialog, setDialog] = useState<"add" | "help" | null>(null);
  const [created, setCreated] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortState | null>(null);

  const siteUrl = `https://${site.domain}`;
  const drafts = pages.filter((page) => page.status === "draft").length;

  const columns: DataTableColumn<SitePage>[] = [
    {
      id: "name",
      header: "Stránka",
      sortValue: (page) => page.name,
      cell: (page) => (
        <span className="text-sm font-semibold text-fg">{page.name}</span>
      ),
    },
    {
      id: "path",
      header: "Adresa (URL)",
      width: "w-[216px]",
      sortValue: (page) => page.path,
      cell: (page) => (
        <span className="font-mono text-xs break-all">{page.path}</span>
      ),
    },
    {
      id: "status",
      header: "Stav",
      width: "w-[126px]",
      cell: (page) => <DotPill tone="tinted" {...statuses[page.status]} />,
    },
    {
      id: "edited",
      header: "Naposledy upraveno",
      width: "w-[216px]",
      sortValue: (page) => page.editedDaysAgo,
      cell: (page) => (
        <>
          {page.editedLabel}{" "}
          <span className="text-fg-3">· {page.editedBy}</span>
        </>
      ),
    },
    {
      id: "visits",
      header: "Návštěvy (30 dní)",
      width: "w-[146px]",
      align: "right",
      sortValue: (page) => page.visits ?? -1,
      cell: (page) => (
        <span className="text-sm font-semibold text-fg">
          {page.visits === null ? "—" : formatNumber(page.visits)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      width: "w-[156px]",
      align: "right",
      cell: (page) => (
        <span className="flex items-center justify-end gap-1.5">
          <Link
            href={`${editorHref}?page=${encodeURIComponent(page.id)}`}
            aria-label={`Upravit stránku ${page.name}`}
            className="flex h-[30px] items-center gap-1.5 rounded-full border border-line px-3 text-[13px] leading-none font-semibold text-fg transition-colors hover:bg-white/5 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-beige"
          >
            <PencilSimpleIcon weight="fill" className="size-[13px] text-fg-2" />
            Upravit
          </Link>
          <a
            href={`${siteUrl}${page.path}`}
            target="_blank"
            rel="noreferrer"
            aria-label={`Otevřít stránku ${page.name} na webu`}
            title="Otevřít na webu"
            className="flex size-[30px] items-center justify-center rounded-full text-fg-3 transition-colors hover:bg-white/5 hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-beige"
          >
            <ArrowSquareOutIcon weight="fill" className="size-[15px]" />
          </a>
        </span>
      ),
    },
  ];

  const needle = query.trim().toLowerCase();
  const visible = pages.filter(
    (page) =>
      (filter === "all" || page.status === filter) &&
      (needle === "" ||
        page.name.toLowerCase().includes(needle) ||
        page.path.toLowerCase().includes(needle)),
  );

  return (
    <div className="flex flex-col gap-6 px-8 pt-7 pb-8">
      <PageIntro
        title="Stránky webu"
        description={`Upravte texty, fotky a nabídku na webu projektu – vše se hned propíše na ${site.domain}.`}
        action={
          <div className="flex items-center gap-2.5">
            <a
              href={siteUrl}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 items-center gap-2 rounded-full border border-line px-4 font-text text-sm leading-none font-semibold text-fg transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
            >
              <ArrowSquareOutIcon
                weight="fill"
                className="size-[15px] text-fg-2"
              />
              Zobrazit web
            </a>
            <Button size="md" onClick={() => setDialog("add")}>
              <PlusCircleIcon weight="fill" className="size-4" />
              Přidat stránku
            </Button>
          </div>
        }
      />

      {created && (
        <Banner tone="success">
          Stránka „{created}“ je založená jako koncept. Obsah do ní přidáte v
          editoru.
        </Banner>
      )}

      <SiteStatusBar
        online={site.online}
        domain={site.domain}
        helpLabel="Jak upravit stránku?"
        onHelp={() => setDialog("help")}
        facts={[
          {
            label: "Stránek",
            value:
              drafts > 0
                ? `${pages.length} · ${drafts} ${plural(drafts, ["koncept", "koncepty", "konceptů"])}`
                : String(pages.length),
          },
          { label: "Poslední úprava", value: site.lastEdit },
          {
            label: "Návštěvy za 30 dní",
            value: formatNumber(site.visits30Days),
          },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SegmentedControl
          label="Stav stránek"
          shape="pill"
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "Všechny", count: pages.length },
            {
              value: "published",
              label: "Zveřejněné",
              count: pages.length - drafts,
            },
            { value: "draft", label: "Koncepty", count: drafts },
          ]}
        />
        <SearchInput
          label="Hledat stránku"
          placeholder="Hledat stránku"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <Card className="px-6 py-2">
        <DataTable
          columns={columns}
          rows={sortRows(visible, columns, sort)}
          rowKey={(page) => page.id}
          sort={sort}
          onSortChange={setSort}
          minWidth={980}
          empty="Žádná stránka neodpovídá filtru."
        />
      </Card>

      <AddPageDialog
        open={dialog === "add"}
        onClose={() => setDialog(null)}
        projectSlug={projectSlug}
        domain={site.domain}
        pages={pages}
        onCreated={(page) => {
          setPages((current) => [...current, page]);
          setCreated(page.name);
        }}
      />

      <Modal
        open={dialog === "help"}
        onClose={() => setDialog(null)}
        title="Jak upravit stránku"
        description="Změny se ukládají průběžně jako koncept a na web jdou až po zveřejnění."
      >
        <NumberedSteps
          steps={[
            {
              title: "U stránky klikněte na Upravit",
              text: "Otevře se editor s náhledem webu vpravo.",
            },
            {
              title: "Vyberte sekci a přepište její obsah",
              text: "Texty, odkazy a obrázky měníte vlevo; vzhled sekce zůstává stejný.",
            },
            {
              title: "Přidejte nebo přeřaďte sekce",
              text: "Sekce přetáhnete za úchyt, novou vložíte mezi dvě stávající.",
            },
            {
              title: "Klikněte na Zveřejnit změny",
              text: "Do té doby vidíte úpravy jen vy v náhledu.",
            },
          ]}
        />
        <div className="flex justify-end">
          <Button size="md" onClick={() => setDialog(null)}>
            Rozumím
          </Button>
        </div>
      </Modal>
    </div>
  );
}
