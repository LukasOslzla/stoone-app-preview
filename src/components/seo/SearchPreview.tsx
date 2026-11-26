type SearchPreviewProps = {
  siteName: string;
  /** Path shown under the site name, e.g. ["momentum.cz", "cs", "cenik"]. */
  urlParts: string[];
  title: string;
  description: string;
  /** Sentence under the preview. */
  caption?: string;
  /** Small heading above the card. */
  label?: string;
};

const clip = (text: string, max: number) =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;

/** Light card imitating a search-engine result. */
export function SearchPreview({
  siteName,
  urlParts,
  title,
  description,
  caption,
  label = "Náhled ve vyhledávači",
}: SearchPreviewProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-text text-[11px] leading-[1.4] font-bold tracking-[0.8px] text-fg-3 uppercase">
        {label}
      </p>

      <div className="flex flex-col gap-1.5 rounded-2xl border border-line-soft bg-paper p-5 font-sans">
        <div className="flex items-center gap-2">
          <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-[#1C1A18] text-[11px] leading-none font-bold text-[#F8F6EF]">
            {siteName.charAt(0).toLowerCase()}
          </span>
          <div className="flex min-w-0 flex-col">
            <span className="text-xs leading-[1.3] text-[#1C1A18]">
              {siteName}
            </span>
            <span className="truncate text-[11px] leading-[1.3] text-[#5F6368]">
              {urlParts.join(" › ")}
            </span>
          </div>
        </div>
        <p className="text-[17px] leading-[1.3] break-words text-[#1A0DAB]">
          {clip(title, 60) || "Nadpis stránky"}
        </p>
        <p className="text-[13px] leading-[1.45] break-words text-[#4D5156]">
          {clip(description, 160) || "Popis stránky"}
        </p>
      </div>

      {caption && (
        <p className="font-text text-xs leading-[1.4] text-fg-3">{caption}</p>
      )}
    </div>
  );
}
