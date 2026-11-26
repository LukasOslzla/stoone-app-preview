import type { ReactNode } from "react";
import {
  LinkSimpleIcon,
  ProhibitIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/ssr";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { LibraryFile } from "@/lib/files";
import { formatFileSize } from "@/lib/format";
import { FileThumb } from "./FileThumb";

/** Tile of a file in the grid view. `actions` sit over the thumbnail. */
export function FileCard({
  file,
  actions,
}: {
  file: LibraryFile;
  actions?: ReactNode;
}) {
  const used = file.usedOn.length > 0;
  const StateIcon = file.missingAlt
    ? WarningCircleIcon
    : used
      ? LinkSimpleIcon
      : ProhibitIcon;

  return (
    <Card className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl">
      <FileThumb
        file={file}
        className="h-[140px] w-full"
        iconClassName="size-[30px]"
      />
      {actions && (
        <div className="absolute top-2 right-2 rounded-full bg-surface/90 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 has-aria-expanded:opacity-100">
          {actions}
        </div>
      )}
      <div className="flex flex-col gap-1 px-3.5 pt-3 pb-3.5">
        <h3 className="truncate font-text text-[13px] leading-[1.3] font-semibold text-fg">
          {file.name}
        </h3>
        <p className="font-text text-xs leading-[1.4] text-fg-3">
          {file.typeLabel} · {formatFileSize(file.sizeBytes)}
        </p>
        <p
          className={cn(
            "flex items-center gap-1.5 pt-1 font-text text-[11px] leading-[1.4]",
            file.missingAlt ? "text-beige" : "text-fg-3",
          )}
        >
          <StateIcon weight="fill" className="size-3 shrink-0" />
          <span className="truncate">
            {file.missingAlt
              ? "Chybí popis obrázku"
              : used
                ? `Použito: ${file.usedOn.join(", ")}`
                : "Nepoužívá se"}
          </span>
        </p>
      </div>
    </Card>
  );
}
