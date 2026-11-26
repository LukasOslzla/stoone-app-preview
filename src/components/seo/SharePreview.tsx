type SharePreviewProps = {
  imageUrl: string;
  /** Shown in capitals above the title, e.g. "momentum-smichov.cz". */
  domain: string;
  title: string;
  label?: string;
};

/** Light card imitating a link shared on a social network. */
export function SharePreview({
  imageUrl,
  domain,
  title,
  label = "Při sdílení na sítích",
}: SharePreviewProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-text text-[11px] leading-[1.4] font-bold tracking-[0.8px] text-fg-3 uppercase">
        {label}
      </p>
      <div className="flex flex-col overflow-hidden rounded-2xl border border-line-soft bg-paper font-sans">
        {/* eslint-disable-next-line @next/next/no-img-element -- preview of the share image */}
        <img src={imageUrl} alt="" className="h-[220px] w-full object-cover" />
        <div className="flex flex-col gap-[3px] px-4 pt-3 pb-3.5">
          <p className="text-[11px] leading-[1.4] text-[#5F6368] uppercase">
            {domain}
          </p>
          <p className="text-sm leading-[1.3] font-semibold break-words text-[#1C1A18]">
            {title || "Nadpis webu"}
          </p>
        </div>
      </div>
    </div>
  );
}
