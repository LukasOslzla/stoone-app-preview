"use client";

import { useRef } from "react";
import {
  EyeIcon,
  EyeSlashIcon,
  FileTextIcon,
  LockIcon,
  PlusCircleIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { formatFileSize } from "@/lib/format";

export type ManagedFile = {
  id: string;
  name: string;
  sizeBytes: number;
  /** `realpad` files are synced and cannot be removed here. */
  source: "realpad" | "own";
  /** Whether the file is shown on the public website. */
  visible: boolean;
};

type FileRowsProps = {
  files: ManagedFile[];
  /** Needed for the `detailed` variant only. */
  onToggleVisible?: (id: string) => void;
  /** Removes a file the user added themselves. */
  onRemove: (id: string) => void;
  /** Enables the "add" button below the list. */
  onAdd?: (files: File[]) => void;
  addLabel?: string;
  accept?: string;
  /** Shown when the list is empty. */
  empty?: string;
  /**
   * `detailed` = thumbnail, type, source badge and visibility toggle.
   * `simple` = one-line rows with size and a remove button only.
   */
  variant?: "detailed" | "simple";
};

const imageExtensions = ["png", "jpg", "jpeg", "webp", "gif", "svg"];

/** "plan.png" → "Obrázek", "karta.pdf" → "PDF" */
function fileKind(name: string) {
  const extension = name.split(".").pop()?.toLowerCase() ?? "";
  if (imageExtensions.includes(extension)) return "Obrázek";
  return extension ? extension.toUpperCase() : "Soubor";
}

const iconButton =
  "flex size-7 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/5 focus-visible:outline-[1.5px] focus-visible:outline-beige";

/**
 * File rows with a thumbnail, type and size, a "Z Realpadu" badge for synced
 * files and a toggle for showing the file on the website.
 */
export function FileRows({
  files,
  onToggleVisible,
  onRemove,
  onAdd,
  addLabel = "Přidat vlastní dokument",
  accept,
  empty = "Zatím žádné soubory.",
  variant = "detailed",
}: FileRowsProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col">
      {files.length === 0 && (
        <p className="py-3 font-text text-[13px] leading-[1.4] text-fg-3">
          {empty}
        </p>
      )}

      {variant === "simple" && (
        <ul className="flex flex-col">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-center gap-3 border-b border-line-soft py-3"
            >
              <FileTextIcon
                weight="fill"
                className="size-[18px] shrink-0 text-fg-3"
              />
              <span className="min-w-0 flex-1 truncate font-text text-sm leading-[1.4] font-medium text-fg">
                {file.name}
              </span>
              <span className="shrink-0 font-text text-[13px] leading-[1.4] text-fg-3">
                {formatFileSize(file.sizeBytes)}
              </span>
              <button
                type="button"
                onClick={() => onRemove(file.id)}
                aria-label={`Odebrat ${file.name}`}
                title="Odebrat"
                className="shrink-0 rounded-full text-fg-3 transition-colors hover:text-red focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-beige"
              >
                <XCircleIcon weight="fill" className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {variant === "detailed" && (
        <ul className="flex flex-col">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-center gap-3 border-line-soft py-3 not-last:border-b"
            >
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-line-soft bg-inset",
                  !file.visible && "opacity-50",
                )}
              >
                <FileTextIcon weight="fill" className="size-[17px] text-fg-3" />
              </span>

              <span
                className={cn(
                  "flex min-w-0 flex-1 flex-col gap-px",
                  !file.visible && "opacity-50",
                )}
              >
                <span className="truncate font-text text-sm leading-[1.4] font-semibold text-fg">
                  {file.name}
                </span>
                <span className="font-text text-xs leading-[1.4] text-fg-3">
                  {fileKind(file.name)} · {formatFileSize(file.sizeBytes)}
                  {!file.visible && " · skryto na webu"}
                </span>
              </span>

              {file.source === "realpad" ? (
                <span className="flex h-6 shrink-0 items-center gap-1.5 rounded-full bg-control px-[9px] font-text text-xs leading-none font-semibold text-fg-2">
                  <LockIcon weight="fill" className="size-[11px] text-fg-3" />Z
                  Realpadu
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onRemove(file.id)}
                  aria-label={`Odebrat ${file.name}`}
                  title="Odebrat"
                  className={cn(iconButton, "text-fg-3 hover:text-red")}
                >
                  <XCircleIcon weight="fill" className="size-4" />
                </button>
              )}

              <button
                type="button"
                onClick={() => onToggleVisible?.(file.id)}
                aria-pressed={file.visible}
                aria-label={`Zobrazovat ${file.name} na webu`}
                title={file.visible ? "Skrýt na webu" : "Zobrazit na webu"}
                className={cn(
                  iconButton,
                  file.visible ? "text-fg-2 hover:text-fg" : "text-fg-3",
                )}
              >
                {file.visible ? (
                  <EyeIcon weight="fill" className="size-4" />
                ) : (
                  <EyeSlashIcon weight="fill" className="size-4" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {onAdd && (
        <>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={accept}
            className="sr-only"
            tabIndex={-1}
            onChange={(event) => {
              const picked = Array.from(event.target.files ?? []);
              if (picked.length > 0) onAdd(picked);
              event.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-3 flex items-center gap-2 self-start rounded-md font-text text-sm leading-[1.4] font-semibold text-beige transition-colors hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige"
          >
            <PlusCircleIcon weight="fill" className="size-4" />
            {addLabel}
          </button>
        </>
      )}
    </div>
  );
}
