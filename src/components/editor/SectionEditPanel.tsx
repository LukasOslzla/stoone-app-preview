"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CaretLeftIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { X } from "lucide-react";
import {
  AiSuggestionCard,
  type AiSuggestion,
} from "@/components/seo/AiSuggestionCard";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { AiSuggestButton } from "@/components/ui/AiSuggestButton";
import { SelectInput, TextArea, TextInput } from "@/components/ui/form/Field";
import {
  suggestSectionText,
  type PageSection,
  type SectionContent,
  type SectionType,
} from "@/lib/editor";
import { EditorPanel } from "./EditorPanel";
import { SectionIcon } from "./sectionIcons";

type SectionEditPanelProps = {
  section: PageSection;
  type: SectionType;
  /** 1-based position of the section on the page. */
  position: number;
  /** Pages a link can lead to. */
  pageOptions: { value: string; label: string }[];
  /** Images offered by "add image". */
  imageLibrary: string[];
  onChange: (key: string, content: SectionContent) => void;
  onBack: () => void;
  onRemove: () => void;
};

type TextField = "heading" | "text";

/** Form with the content of one section; the look of the section is fixed. */
export function SectionEditPanel({
  section,
  type,
  position,
  pageOptions,
  imageLibrary,
  onChange,
  onBack,
  onRemove,
}: SectionEditPanelProps) {
  const { content } = section;

  const [suggestions, setSuggestions] = useState<
    Partial<Record<TextField, AiSuggestion>>
  >({});
  const [suggesting, setSuggesting] = useState<TextField | null>(null);
  const [attempts, setAttempts] = useState({ heading: 0, text: 0 });

  const set = (field: keyof SectionContent, value: string | string[]) =>
    onChange(`${section.id}-${field}`, { ...content, [field]: value });

  async function suggest(field: TextField) {
    setSuggesting(field);
    const suggestion = await suggestSectionText(field, attempts[field]);
    setAttempts((current) => ({ ...current, [field]: current[field] + 1 }));
    setSuggestions((current) => ({ ...current, [field]: suggestion }));
    setSuggesting(null);
  }

  const dismiss = (field: TextField) =>
    setSuggestions((current) => ({ ...current, [field]: undefined }));

  const aiButton = (field: TextField) => (
    <AiSuggestButton
      label="Navrhnout"
      loading={suggesting === field}
      onClick={() => suggest(field)}
    />
  );

  const suggestionCard = (field: TextField) => {
    const suggestion = suggestions[field];
    return (
      suggestion && (
        <AiSuggestionCard
          suggestion={suggestion}
          loading={suggesting === field}
          onUse={() => {
            set(field, suggestion.text);
            dismiss(field);
          }}
          onAnother={() => suggest(field)}
          onDismiss={() => dismiss(field)}
        />
      )
    );
  };

  const images = content.images ?? [];
  const nextImage =
    imageLibrary.find((image) => !images.includes(image)) ?? imageLibrary[0];

  return (
    <EditorPanel>
      <button
        type="button"
        onClick={onBack}
        className="-mb-0.5 flex items-center gap-1.5 self-start rounded-md font-text text-[13px] leading-[1.4] font-semibold text-fg-2 transition-colors hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige"
      >
        <CaretLeftIcon weight="fill" className="size-3" />
        Sekce stránky
      </button>

      <div className="flex items-center gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-[#CAC3B81F]">
          <SectionIcon type={type.id} className="size-[15px] text-beige" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-px">
          <h1 className="truncate font-title text-base leading-[1.4] font-medium text-fg">
            {type.name}
          </h1>
          <p className="font-text text-xs leading-[1.4] text-fg-3">
            {position}. sekce na stránce
          </p>
        </div>
        <ActionMenu
          label={`Akce: ${type.name}`}
          items={[
            {
              label: "Odstranit sekci",
              tone: "danger",
              icon: <TrashIcon weight="fill" className="size-3.5" />,
              onSelect: onRemove,
            },
          ]}
        />
      </div>

      {type.fields.includes("heading") && (
        <div className="flex flex-col">
          <TextInput
            size="sm"
            label="Nadpis"
            value={content.heading ?? ""}
            onChange={(event) => set("heading", event.target.value)}
            action={aiButton("heading")}
          />
          {suggestionCard("heading")}
        </div>
      )}

      {type.fields.includes("text") && (
        <div className="flex flex-col">
          <TextArea
            size="sm"
            label="Text"
            rows={4}
            value={content.text ?? ""}
            onChange={(event) => set("text", event.target.value)}
            action={aiButton("text")}
          />
          {suggestionCard("text")}
        </div>
      )}

      {type.fields.includes("link") && (
        <div className="grid grid-cols-2 gap-2.5">
          <TextInput
            size="sm"
            label="Text odkazu"
            value={content.linkLabel ?? ""}
            onChange={(event) => set("linkLabel", event.target.value)}
          />
          <SelectInput
            size="sm"
            label="Vede na"
            options={pageOptions}
            value={content.linkTarget ?? ""}
            onChange={(value) => set("linkTarget", value)}
          />
        </div>
      )}

      {type.fields.includes("images") && (
        <div className="flex flex-col gap-[7px]">
          <h2 className="font-text text-[13px] leading-[1.4] font-medium text-fg">
            Obrázky
          </h2>
          <ul className="flex flex-wrap gap-2">
            {images.map((image, index) => (
              <li
                key={`${image}-${index}`}
                className="group relative h-[72px] w-[108px] overflow-hidden rounded-[10px]"
              >
                <Image
                  src={image}
                  alt={`Obrázek ${index + 1}`}
                  fill
                  sizes="108px"
                  className="object-cover"
                />
                <button
                  type="button"
                  aria-label={`Odebrat obrázek ${index + 1}`}
                  title="Odebrat"
                  onClick={() =>
                    set(
                      "images",
                      images.filter((_, other) => other !== index),
                    )
                  }
                  className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-[#0A0A0CCC] text-fg opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-[1.5px] focus-visible:outline-beige"
                >
                  <X className="size-3" />
                </button>
              </li>
            ))}
            <li>
              {/* Mock: adds the next picture from the file library. */}
              <button
                type="button"
                aria-label="Přidat obrázek"
                title="Přidat obrázek"
                onClick={() => set("images", [...images, nextImage])}
                className="flex h-[72px] w-14 items-center justify-center rounded-[10px] border border-dashed border-line text-beige transition-colors hover:border-beige hover:bg-white/5 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-beige"
              >
                <PlusCircleIcon weight="fill" className="size-4" />
              </button>
            </li>
          </ul>
        </div>
      )}
    </EditorPanel>
  );
}
