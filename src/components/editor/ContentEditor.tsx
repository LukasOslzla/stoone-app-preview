"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AiPrompt } from "@/components/app/AiPrompt";
import { plural } from "@/lib/format";
import {
  askEditorAi,
  createSection,
  type AiChange,
  type EditorData,
  type PageSection,
} from "@/lib/editor";
import { AddSectionDialog } from "./AddSectionDialog";
import { AiAnswerCard } from "./AiAnswerCard";
import { EditorBar } from "./EditorBar";
import { FooterPanel } from "./FooterPanel";
import { FooterPreview } from "./FooterPreview";
import { HeaderPanel } from "./HeaderPanel";
import { OpeningHoursPanel } from "./OpeningHoursPanel";
import { OpeningHoursPreview } from "./OpeningHoursPreview";
import { SchematicPreview } from "./SchematicPreview";
import { SectionEditPanel } from "./SectionEditPanel";
import { SectionGallery } from "./SectionGallery";
import { SectionsPanel } from "./SectionsPanel";
import {
  SitePreview,
  type PreviewDevice,
  type PreviewHighlight,
} from "./SitePreview";
import type { EditorTarget } from "./TargetSelect";
import { useEditorDraft } from "./useEditorDraft";

type ContentEditorProps = { projectSlug: string; data: EditorData };

const HERO_IMAGE = "/images/site/site-1.jpg";

/**
 * "Editor obsahu": pick what to edit (site header, a page, shared content),
 * change it in the left panel and watch the preview on the right. Changes
 * stay a draft until "Zveřejnit změny".
 *
 * `?page=<page id>` opens a page directly (used by "Stránky webu").
 */
export function ContentEditor({ projectSlug, data }: ContentEditorProps) {
  const { domain, pages, sectionTypes, shared } = data;
  const requestedPage = useSearchParams().get("page");

  const [target, setTarget] = useState(() =>
    pages.some((page) => page.id === requestedPage)
      ? `page:${requestedPage}`
      : "header",
  );
  const [device, setDevice] = useState<PreviewDevice>("desktop");
  const [menuItem, setMenuItem] = useState<string | null>("pricing");
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [insertAt, setInsertAt] = useState<number | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [ai, setAi] = useState<{
    question: string;
    change: AiChange | null;
  } | null>(null);

  const { draft, update, undo, canUndo, status, publish } = useEditorDraft(
    projectSlug,
    {
      header: data.header,
      footer: data.footer,
      sections: Object.fromEntries(
        pages.map((page) => [page.id, page.sections]),
      ),
      hours: shared.days,
      slogan: null,
    },
  );

  const targets: EditorTarget[] = [
    {
      id: "header",
      label: "Hlavička",
      sub: "Zobrazuje se na celém webu",
      kind: "site",
    },
    {
      id: "footer",
      label: "Patička",
      sub: "Zobrazuje se na celém webu",
      kind: "site",
    },
    ...pages.map((page): EditorTarget => ({
      id: `page:${page.id}`,
      label: page.name,
      sub: `${domain}${page.path}`,
      kind: "page",
    })),
    {
      id: shared.id,
      label: shared.name,
      shortLabel: shared.shortName,
      sub: "Společné pro všechny projekty",
      kind: "shared",
      note: `${shared.sites.length} ${plural(shared.sites.length, ["web", "weby", "webů"])}`,
    },
  ];

  const page = pages.find((item) => `page:${item.id}` === target);
  const sections = page ? (draft.sections[page.id] ?? []) : [];
  const section = sections.find((item) => item.id === editingSection);
  const typeOf = (item: PageSection) =>
    sectionTypes.find((type) => type.id === item.type);
  const menuLabels = draft.header.menu.map((item) => item.label);

  function changeTarget(id: string) {
    setTarget(id);
    setEditingSection(null);
    setInsertAt(null);
    setGalleryOpen(false);
  }

  function setSections(key: string, next: PageSection[]) {
    if (!page) return;
    update(key, (current) => ({
      ...current,
      sections: { ...current.sections, [page.id]: next },
    }));
  }

  function addSection(typeId: string) {
    if (!page || insertAt === null) return;
    const added = createSection(typeId, `${page.id}#new-${Date.now()}`);
    setSections("section-add", [
      ...sections.slice(0, insertAt),
      added,
      ...sections.slice(insertAt),
    ]);
    setInsertAt(null);
    setGalleryOpen(false);
    setEditingSection(added.id);
  }

  async function askAi(question: string) {
    setAi({ question, change: null });
    const change = await askEditorAi(question);
    // Ignore the answer if the question was discarded or replaced meanwhile.
    setAi((current) =>
      current?.question === question && current.change === null
        ? { question, change }
        : current,
    );
  }

  if (galleryOpen && page) {
    const previous = insertAt ? sections[insertAt - 1] : undefined;
    return (
      <SectionGallery
        types={sectionTypes}
        pageName={page.name === "Hlavní stránka" ? "Hlavní stránku" : page.name}
        afterName={previous && typeOf(previous)?.name}
        onInsert={addSection}
        onBack={() => setGalleryOpen(false)}
        projectSlug={projectSlug}
      />
    );
  }

  /* ── Left panel and preview of the current target ── */

  let panel;
  let preview: {
    url: string;
    hint: string;
    image?: string;
    highlights?: PreviewHighlight[];
    content?: React.ReactNode;
  };

  if (target === shared.id) {
    panel = (
      <OpeningHoursPanel
        shared={shared}
        days={draft.hours}
        onChange={(key, hours) =>
          update(key, (current) => ({ ...current, hours }))
        }
      />
    );
    preview = {
      url: `${domain}${shared.previewPath}`,
      hint: "Takhle se otevírací doba ukazuje na stránce Kontakt",
      content: (
        <OpeningHoursPreview
          siteName={data.projectName}
          menu={menuLabels}
          days={draft.hours}
          sites={shared.sites.length}
        />
      ),
    };
  } else if (target === "footer") {
    panel = (
      <FooterPanel
        footer={draft.footer}
        onChange={(key, footer) =>
          update(key, (current) => ({ ...current, footer }))
        }
      />
    );
    preview = {
      url: domain,
      hint: "Změny vidíte hned – na web jdou po „Zveřejnit změny“",
      content: (
        <FooterPreview siteName={data.projectName} footer={draft.footer} />
      ),
    };
  } else if (page && section) {
    const type = typeOf(section)!;
    panel = (
      <SectionEditPanel
        key={section.id}
        section={section}
        type={type}
        position={sections.indexOf(section) + 1}
        pageOptions={pages.map((item) => ({
          value: item.id,
          label: item.name,
        }))}
        imageLibrary={data.imageLibrary}
        onBack={() => setEditingSection(null)}
        onRemove={() => {
          setEditingSection(null);
          setSections(
            "section-remove",
            sections.filter((item) => item.id !== section.id),
          );
        }}
        onChange={(key, content) =>
          setSections(
            key,
            sections.map((item) =>
              item.id === section.id ? { ...item, content } : item,
            ),
          )
        }
      />
    );
    preview = {
      url: `${domain}${page.path === "/cs" ? "" : page.path}`,
      hint: "Změny vidíte hned – na web jdou po „Zveřejnit změny“",
      ...(type.preview
        ? {
            image: type.preview,
            highlights: [
              {
                id: "section",
                box: [2, 2, 800, 536],
                tone: "outline",
                tag: `${type.name} · upravujete`,
                tagPlacement: "inside",
              },
            ],
          }
        : {}),
    };
  } else if (page) {
    panel = (
      <SectionsPanel
        sections={sections}
        sectionTypes={sectionTypes}
        onReorder={(next) => setSections("section-order", next)}
        onEdit={setEditingSection}
        onInsert={setInsertAt}
        insertingAt={insertAt}
      />
    );
    const first = sections[0] && typeOf(sections[0]);
    preview = {
      url: `${domain}${page.path === "/cs" ? "" : page.path}`,
      hint: "Klikněte na cokoli na webu a upravte to",
      image: first?.preview,
    };
  } else {
    const selected = draft.header.menu.find((item) => item.id === menuItem);
    panel = (
      <HeaderPanel
        header={draft.header}
        onChange={(key, header) =>
          update(key, (current) => ({ ...current, header }))
        }
        selectedId={menuItem}
        onSelect={setMenuItem}
      />
    );
    preview = {
      url: domain,
      hint: "Klikněte na cokoli na webu a upravte to",
      image: HERO_IMAGE,
      highlights: [
        {
          id: "header",
          box: [1, 1, 802, 48],
          tone: "outline",
          tag: "Hlavička",
        },
        // Menu items of the screenshot are clickable.
        ...draft.header.menu.flatMap((item): PreviewHighlight[] =>
          item.previewBox && item.id !== selected?.id
            ? [
                {
                  id: item.id,
                  box: [item.previewBox[0], 11, item.previewBox[1], 27],
                  tone: "fill",
                  label: `Vybrat položku ${item.label}`,
                  onSelect: () => setMenuItem(item.id),
                },
              ]
            : [],
        ),
        ...(selected?.previewBox
          ? [
              {
                id: "selected",
                box: [selected.previewBox[0], 11, selected.previewBox[1], 27],
                tone: "fill",
              } satisfies PreviewHighlight,
            ]
          : []),
      ],
    };
  }

  // Without a screenshot the page is drawn from its sections.
  const schematic = page && !preview.image && !preview.content && (
    <SchematicPreview
      siteName={data.projectName}
      menu={menuLabels}
      sections={sections}
      sectionTypes={sectionTypes}
      selectedId={editingSection}
      onSelect={setEditingSection}
    />
  );

  const highlights = [
    ...(preview.highlights ?? []).map((highlight) =>
      // Unselected menu items are invisible click targets.
      highlight.onSelect
        ? { ...highlight, tone: "fill" as const, hidden: true }
        : highlight,
    ),
    ...(ai?.change && preview.image === HERO_IMAGE
      ? [
          {
            id: "ai",
            box: ai.change.previewBox,
            tone: "ai",
          } satisfies PreviewHighlight,
        ]
      : []),
  ];

  return (
    <div className="-mb-28 flex h-[calc(100dvh-85px)] flex-col">
      <EditorBar
        targets={targets}
        target={target}
        onTargetChange={changeTarget}
        projectName={data.projectName}
        device={device}
        onDeviceChange={setDevice}
        status={status}
        canUndo={canUndo}
        onUndo={undo}
        onPublish={publish}
        publishLabel={
          target === shared.id
            ? `Zveřejnit na ${shared.sites.length} ${plural(shared.sites.length, ["webu", "webech", "webech"])}`
            : undefined
        }
      />

      {/* Narrow windows scroll sideways instead of squeezing the preview. */}
      <div className="flex min-h-0 flex-1 overflow-x-auto">
        {panel}
        <SitePreview
          url={preview.url}
          hint={preview.hint}
          device={device}
          image={preview.image}
          highlights={highlights}
          overlay={
            page &&
            insertAt !== null && (
              <AddSectionDialog
                types={sectionTypes.filter((type) => type.quickPick)}
                onAdd={addSection}
                onClose={() => setInsertAt(null)}
                onShowAll={() => setGalleryOpen(true)}
              />
            )
          }
          footer={
            <div className="pointer-events-none absolute inset-x-0 bottom-7 flex justify-center px-4">
              <div className="pointer-events-auto relative w-[560px] max-w-full">
                {ai && (
                  <AiAnswerCard
                    question={ai.question}
                    change={ai.change}
                    onKeep={() => {
                      const added = ai.change?.added ?? null;
                      update("ai-change", (current) => ({
                        ...current,
                        slogan: added,
                      }));
                      setAi(null);
                    }}
                    onDiscard={() => setAi(null)}
                    className="absolute inset-x-0 bottom-10 z-10"
                  />
                )}
                <AiPrompt onSubmit={askAi} />
              </div>
            </div>
          }
        >
          {preview.content ?? schematic}
        </SitePreview>
      </div>
    </div>
  );
}
