import { cn } from "@/lib/cn";

type LogoTileProps = {
  /** Short text shown until real project logos are available. */
  text: string;
  size?: "md" | "lg";
  muted?: boolean;
  className?: string;
};

/** Square tile with a project logo (text placeholder for now). */
export function LogoTile({
  text,
  size = "lg",
  muted = false,
  className,
}: LogoTileProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden border border-line bg-inset",
        size === "lg" ? "size-[52px] rounded-[14px]" : "size-11 rounded-xl",
        muted && "opacity-50",
        className,
      )}
    >
      <span
        className={cn(
          "font-text leading-none font-extrabold text-fg",
          size === "lg" ? "text-[7px]" : "text-[6px]",
        )}
      >
        {text}
      </span>
    </div>
  );
}
