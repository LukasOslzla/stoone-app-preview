"use client";

import { useRef } from "react";
import { ImageIcon } from "@phosphor-icons/react";

type ShareImageFieldProps = {
  /** File name or what the image is ("Půdorys bytu"). */
  title: string;
  /** Size or origin of the image. */
  note: string;
  /** Preview; an icon is shown without it. */
  thumbnailUrl?: string;
  /** Text of the button on the right. */
  actionLabel?: string;
  /** Called with the picked image; without it the button is hidden. */
  onReplace?: (file: File) => void;
  disabled?: boolean;
};

/** "Obrázek při sdílení": the picture social networks show with a link. */
export function ShareImageField({
  title,
  note,
  thumbnailUrl,
  actionLabel = "Vyměnit",
  onReplace,
  disabled = false,
}: ShareImageFieldProps) {
  const input = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-2">
      <p className="font-text text-sm leading-[1.4] font-medium text-fg">
        Obrázek při sdílení
      </p>
      <div className="flex items-center gap-3.5 rounded-xl border border-line-soft bg-inset py-2.5 pr-3.5 pl-2.5">
        {thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- small preview, may be a fresh upload
          <img
            src={thumbnailUrl}
            alt=""
            className="h-[50px] w-24 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <span className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-control">
            <ImageIcon weight="fill" className="size-4 text-fg-3" />
          </span>
        )}
        <span className="flex min-w-0 flex-1 flex-col gap-px">
          <span className="truncate font-text text-sm leading-[1.4] font-semibold text-fg">
            {title}
          </span>
          <span className="font-text text-xs leading-[1.4] text-fg-3">
            {note}
          </span>
        </span>
        {onReplace && (
          <>
            <input
              ref={input}
              type="file"
              accept="image/*"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onReplace(file);
                event.target.value = "";
              }}
            />
            <button
              type="button"
              disabled={disabled}
              onClick={() => input.current?.click()}
              className="rounded-md font-text text-[13px] leading-[1.4] font-semibold text-fg-2 transition-colors enabled:hover:text-beige disabled:opacity-50 focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige"
            >
              {actionLabel}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
