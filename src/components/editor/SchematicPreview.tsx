import type { PageSection, SectionType } from "@/lib/editor";
import { cn } from "@/lib/cn";
import { SectionIcon } from "./sectionIcons";

type SchematicPreviewProps = {
  siteName: string;
  menu: string[];
  sections: PageSection[];
  sectionTypes: SectionType[];
  /** Section that is being edited. */
  selectedId?: string | null;
  onSelect?: (id: string) => void;
};

/**
 * Simplified drawing of a page for sections without a screenshot: one block
 * per section with its texts, so edits are visible right away.
 */
export function SchematicPreview({
  siteName,
  menu,
  sections,
  sectionTypes,
  selectedId,
  onSelect,
}: SchematicPreviewProps) {
  return (
    <div className="min-h-full bg-[#F8F6EF] font-sans text-[#1C1A18]">
      <div className="flex items-center justify-between gap-4 px-7 py-[18px]">
        <p className="text-lg leading-[1.4] font-extrabold lowercase">
          {siteName}
        </p>
        <p className="flex flex-wrap justify-end gap-x-4 text-[11px] leading-[1.4] text-[#4D5156]">
          {menu.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </p>
      </div>

      <div className="flex flex-col gap-2.5 px-7 pb-7">
        {sections.map((section) => {
          const type = sectionTypes.find((item) => item.id === section.type);
          const selected = section.id === selectedId;
          const { heading, text, linkLabel, images } = section.content;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSelect?.(section.id)}
              className={cn(
                "flex flex-col gap-2 rounded-[10px] border bg-white p-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-[#B3A2FF]",
                selected
                  ? "border-[#1C1A18] shadow-[0_0_0_3px_#CAC3B8]"
                  : "border-[#1C1A1814] hover:border-[#1C1A1840]",
              )}
            >
              <span className="flex items-center gap-1.5 text-[10px] leading-none font-bold tracking-[1.2px] text-[#C56A45] uppercase">
                <SectionIcon type={section.type} className="size-3" />
                {type?.name}
              </span>
              {heading && (
                <span className="text-xl leading-[1.2] font-bold">
                  {heading}
                </span>
              )}
              {text && (
                <span className="max-w-[520px] text-[13px] leading-[1.6] text-[#4D5156]">
                  {text}
                </span>
              )}
              {linkLabel && (
                <span className="text-[13px] leading-[1.4] font-semibold underline underline-offset-2">
                  {linkLabel} →
                </span>
              )}
              {images && images.length > 0 && (
                <span className="flex gap-2 pt-1">
                  {images.map((image, index) => (
                    <span
                      key={`${image}-${index}`}
                      aria-hidden
                      style={{ backgroundImage: `url(${image})` }}
                      className="h-16 w-24 rounded-md bg-[#1C1A1814] bg-cover bg-center"
                    />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
