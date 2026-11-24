"use client";

import { useState } from "react";
import type { DragEvent } from "react";
import type { Icon } from "@phosphor-icons/react";
import { ImageIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

type DropzoneProps = {
  /** Main line, e.g. "Přetáhněte sem obrázek půdorysu". */
  title: string;
  /** Called with the dropped or picked files. */
  onFiles: (files: File[]) => void;
  /** Value of the file input's `accept`, e.g. "image/*". */
  accept?: string;
  multiple?: boolean;
  icon?: Icon;
  /** `inline` = low single-line variant for use inside forms. */
  layout?: "stacked" | "inline";
  /** Link-like text that opens the picker. */
  actionLabel?: string;
  className?: string;
};

/** Dashed drop area that also opens the file picker on click. */
export function Dropzone({
  title,
  onFiles,
  accept,
  multiple = false,
  icon: IconComponent = ImageIcon,
  layout = "stacked",
  actionLabel,
  className,
}: DropzoneProps) {
  const inline = layout === "inline";
  const [dragging, setDragging] = useState(false);

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) onFiles(multiple ? files : files.slice(0, 1));
  }

  return (
    <label
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "flex w-full cursor-pointer items-center justify-center gap-2.5 border-[1.5px] border-dashed px-4 text-center transition-colors has-focus-visible:border-beige",
        inline
          ? "min-h-[84px] flex-wrap rounded-xl py-3"
          : "min-h-[200px] flex-col rounded-[14px]",
        dragging
          ? "border-beige bg-[#CAC3B814]"
          : "border-line hover:border-[#D2D5C566] hover:bg-white/[0.02]",
        className,
      )}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          if (files.length > 0) onFiles(files);
          event.target.value = "";
        }}
      />
      <IconComponent
        weight="fill"
        className={cn("shrink-0 text-fg-3", inline ? "size-[18px]" : "size-7")}
      />
      <span
        className={cn(
          "font-text leading-[1.4]",
          inline ? "text-[13px] text-fg-2" : "text-sm font-semibold text-fg",
        )}
      >
        {title}
      </span>
      <span className="flex flex-wrap justify-center gap-1 font-text text-[13px] leading-[1.4]">
        {!inline && <span className="text-fg-3">nebo</span>}
        <span className="font-semibold text-beige">
          {actionLabel ??
            (inline ? "vyberte soubor" : "vyberte soubor z počítače")}
        </span>
      </span>
    </label>
  );
}
