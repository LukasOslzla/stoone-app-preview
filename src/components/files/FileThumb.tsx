import { FileTextIcon, VideoCameraIcon } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/cn";
import type { LibraryFile } from "@/lib/files";

type FileThumbProps = {
  file: LibraryFile;
  /** Size of the fallback icon, e.g. "size-[30px]". */
  iconClassName?: string;
  className?: string;
};

/** Preview of a file: its image, or an icon for videos and documents. */
export function FileThumb({ file, iconClassName, className }: FileThumbProps) {
  const IconComponent =
    file.category === "video" ? VideoCameraIcon : FileTextIcon;

  return (
    <span
      className={cn(
        "flex items-center justify-center overflow-hidden bg-inset",
        className,
      )}
    >
      {file.thumbnailUrl ? (
        // Plain <img>: the source may be a local blob of a fresh upload.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={file.thumbnailUrl}
          alt=""
          loading="lazy"
          className="size-full object-cover"
        />
      ) : (
        <IconComponent
          weight="fill"
          className={cn("text-fg-3", iconClassName)}
        />
      )}
    </span>
  );
}
