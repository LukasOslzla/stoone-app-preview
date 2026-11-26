import { LinkSimpleIcon } from "@phosphor-icons/react";
import { plural } from "@/lib/format";
import { summarizeOpeningHours, type OpeningDay } from "@/lib/editor";

type OpeningHoursPreviewProps = {
  siteName: string;
  menu: string[];
  days: OpeningDay[];
  /** Number of webs that share the content. */
  sites: number;
};

/** Contact page of the web with the shared opening hours highlighted. */
export function OpeningHoursPreview({
  siteName,
  menu,
  days,
  sites,
}: OpeningHoursPreviewProps) {
  const lines = summarizeOpeningHours(days);

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

      <div className="flex flex-wrap items-start gap-x-14 gap-y-6 px-14 py-12">
        <div className="flex min-w-[240px] flex-1 flex-col gap-3.5">
          <p className="text-[11px] leading-[1.4] font-bold tracking-[2px] text-[#C56A45] uppercase">
            Kontakt
          </p>
          <p className="text-[34px] leading-[1.15] font-bold">
            Prodejní centrum
          </p>
          <p className="text-[13px] leading-[1.6] text-[#4D5156]">
            Zastavte se za námi osobně. Rádi vám ukážeme vzorový byt a projdeme
            s vámi nabídku i financování.
          </p>
        </div>

        <div className="flex w-[300px] max-w-full flex-col items-start gap-2 rounded-[10px] border border-[#B3A2FF] bg-[#A78BFA14] p-5">
          <p className="text-[15px] leading-[1.4] font-bold">Otevírací doba</p>
          <p className="text-[13px] leading-[1.7] whitespace-pre-line text-[#4D5156]">
            {lines.length > 0 ? lines.join("\n") : "Zavřeno"}
          </p>
          <span className="flex h-6 items-center gap-1.5 rounded-full bg-[#B3A2FF] px-[9px] text-[11px] leading-none font-bold">
            <LinkSimpleIcon weight="bold" className="size-[11px]" />
            Sdílený obsah · {sites} {plural(sites, ["web", "weby", "webů"])}
          </span>
        </div>
      </div>
    </div>
  );
}
