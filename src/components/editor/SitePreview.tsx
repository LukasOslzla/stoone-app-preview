import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

/** Size of the preview in the design; highlight boxes use these pixels. */
const BASE_WIDTH = 804;
const BASE_HEIGHT = 540;

export type PreviewDevice = "desktop" | "tablet" | "mobile";

export type PreviewHighlight = {
  id: string;
  /** x, y, width, height in the 804 × 540 preview. */
  box: [number, number, number, number];
  /** `outline` = edited area, `fill` = selected item, `ai` = change by the AI. */
  tone: "outline" | "fill" | "ai";
  /** Small label attached to the box. */
  tag?: string;
  /** `below` hangs the tag under the right corner, `inside` puts it top left. */
  tagPlacement?: "below" | "inside";
  /** Makes the box a button (e.g. to select a menu item). */
  onSelect?: () => void;
  /** Accessible name of the button. */
  label?: string;
  /** Keeps a button invisible until hovered or focused. */
  hidden?: boolean;
};

type SitePreviewProps = {
  /** Address shown next to "Živý náhled". */
  url: string;
  hint?: string;
  device?: PreviewDevice;
  /** Screenshot of the web; stands in for a live iframe. */
  image?: string;
  highlights?: PreviewHighlight[];
  /** HTML preview rendered instead of (or over) the image. */
  children?: ReactNode;
  /** Dialog shown over the dimmed site (e.g. "Přidat sekci"). */
  overlay?: ReactNode;
  /** Floating content of the preview area (AI prompt and its answer). */
  footer?: ReactNode;
};

const deviceWidths: Record<PreviewDevice, string> = {
  desktop: "w-full",
  tablet: "w-[560px] max-w-full",
  mobile: "w-[320px] max-w-full",
};

const percent = (value: number, base: number) => `${(value / base) * 100}%`;

/** Right side of the editor: the web as visitors see it, with highlights. */
export function SitePreview({
  url,
  hint,
  device = "desktop",
  image,
  highlights = [],
  children,
  overlay,
  footer,
}: SitePreviewProps) {
  return (
    <div className="relative flex min-w-[440px] flex-1 flex-col bg-inset">
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-6 pt-5 pb-28">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <p className="flex items-center gap-2 font-text text-xs leading-[1.4]">
            <span className="size-[7px] rounded-full bg-green" />
            <span className="font-semibold text-fg-2">Živý náhled</span>
            <span className="text-fg-3">{url}</span>
          </p>
          {hint && (
            <p className="font-text text-xs leading-[1.4] text-fg-3">{hint}</p>
          )}
        </div>

        <div
          className={cn(
            "relative mx-auto aspect-[804/540] shrink-0 overflow-hidden rounded-t-xl border border-line bg-white",
            deviceWidths[device],
            device !== "desktop" && "rounded-b-xl",
          )}
        >
          {image && (
            <Image
              src={image}
              alt="Náhled webu"
              fill
              sizes="(min-width: 1280px) 60vw, 100vw"
              className="object-cover object-top"
              priority
            />
          )}
          {children && (
            <div className="absolute inset-0 overflow-y-auto">{children}</div>
          )}

          {highlights.map((highlight) => {
            const [x, y, width, height] = highlight.box;
            const style = {
              left: percent(x, BASE_WIDTH),
              top: percent(y, BASE_HEIGHT),
              width: percent(width, BASE_WIDTH),
              height: percent(height, BASE_HEIGHT),
            };
            const className = cn(
              "absolute",
              highlight.tone === "outline" &&
                "pointer-events-none rounded-[10px] border border-beige",
              highlight.tone === "fill" &&
                "rounded-md border border-beige bg-[#CAC3B840]",
              highlight.tone === "ai" &&
                "pointer-events-none rounded-lg bg-[#7C5CFF1A]",
            );
            const tag = highlight.tag && (
              <span
                className={cn(
                  "absolute flex items-center bg-beige font-text text-[11px] leading-none font-bold whitespace-nowrap text-ink",
                  highlight.tagPlacement === "inside"
                    ? "top-3 left-3 h-6 rounded-full px-2.5"
                    : "top-full right-[3%] h-[22px] rounded-b-md px-2",
                )}
              >
                {highlight.tag}
              </span>
            );

            return highlight.onSelect ? (
              <button
                key={highlight.id}
                type="button"
                aria-label={highlight.label}
                title={highlight.label}
                onClick={highlight.onSelect}
                style={style}
                className={cn(
                  className,
                  "transition-opacity focus-visible:outline-2 focus-visible:outline-beige",
                  highlight.hidden &&
                    "opacity-0 hover:opacity-60 focus-visible:opacity-100",
                )}
              />
            ) : (
              <div key={highlight.id} style={style} className={className}>
                {highlight.tone === "ai" && (
                  // Gradient border: the fill is masked out of the padding box.
                  <span
                    className="bg-ai-gradient absolute inset-0 rounded-lg p-px"
                    style={{
                      mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
                    }}
                  />
                )}
                {tag}
              </div>
            );
          })}

          {overlay && (
            <div className="absolute inset-0 flex items-start justify-center overflow-y-auto bg-[#0A0A0C99] p-4 pt-[7%]">
              {overlay}
            </div>
          )}
        </div>
      </div>

      {footer}
    </div>
  );
}
