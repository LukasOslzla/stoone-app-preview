"use client";

import { PlusCircleIcon } from "@phosphor-icons/react";
import { SortableList } from "@/components/ui/SortableList";
import type { PageSection, SectionType } from "@/lib/editor";
import { EditorPanel, PanelAddButton, PanelHead } from "./EditorPanel";
import { SectionIcon } from "./sectionIcons";

type SectionsPanelProps = {
  sections: PageSection[];
  sectionTypes: SectionType[];
  onReorder: (sections: PageSection[]) => void;
  /** Opens the editing form of a section. */
  onEdit: (id: string) => void;
  /** Asks for a new section at the given index. */
  onInsert: (index: number) => void;
  /** Index the "Přidat sekci" dialog is open for. */
  insertingAt: number | null;
};

/** "Sekce stránky": order of the sections of one page. */
export function SectionsPanel({
  sections,
  sectionTypes,
  onReorder,
  onEdit,
  onInsert,
  insertingAt,
}: SectionsPanelProps) {
  const name = (section: PageSection) =>
    sectionTypes.find((type) => type.id === section.type)?.name ?? "Sekce";

  return (
    <EditorPanel>
      <PanelHead title="Sekce stránky" sub="Pořadí změníte přetažením." />

      <SortableList
        items={sections}
        label="Sekce stránky"
        itemLabel={name}
        onReorder={onReorder}
        insertLabel="Nová sekce sem"
        onInsert={onInsert}
        insertingAt={insertingAt}
        selectedId={
          insertingAt !== null ? sections[insertingAt - 1]?.id : undefined
        }
      >
        {(section, { selected }) => {
          return (
            <button
              type="button"
              onClick={() => onEdit(section.id)}
              className="flex h-full min-w-0 flex-1 items-center gap-2.5 rounded-md text-left focus-visible:outline-[1.5px] focus-visible:outline-beige"
            >
              <SectionIcon
                type={section.type}
                className={`size-[15px] shrink-0 ${selected ? "text-beige" : "text-fg-2"}`}
              />
              <span
                className={`min-w-0 flex-1 truncate font-text text-[13px] leading-[1.4] text-fg ${selected ? "font-semibold" : "font-medium"}`}
              >
                {name(section)}
              </span>
            </button>
          );
        }}
      </SortableList>

      {/* Not in the design: an always visible way to add a section. */}
      <PanelAddButton
        icon={<PlusCircleIcon weight="fill" className="size-[15px]" />}
        onClick={() => onInsert(sections.length)}
      >
        Přidat sekci na konec
      </PanelAddButton>
    </EditorPanel>
  );
}
