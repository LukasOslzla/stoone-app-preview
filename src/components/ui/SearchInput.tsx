import type { InputHTMLAttributes } from "react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/cn";

type SearchInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "className"
> & {
  /** Accessible name; the placeholder alone is not enough. */
  label: string;
  className?: string;
};

/** Pill-shaped search field for toolbars. */
export function SearchInput({ label, className, ...props }: SearchInputProps) {
  return (
    <label
      className={cn(
        "flex h-[38px] w-[260px] items-center gap-2.5 rounded-full border border-line-soft bg-field-inset px-3.5 transition-colors focus-within:border-beige hover:not-focus-within:border-line",
        className,
      )}
    >
      <MagnifyingGlassIcon
        weight="fill"
        className="size-[15px] shrink-0 text-fg-3"
      />
      <span className="sr-only">{label}</span>
      <input
        type="search"
        className="h-full min-w-0 flex-1 bg-transparent font-text text-[13px] leading-[1.4] text-fg outline-none placeholder:text-fg-3 [&::-webkit-search-cancel-button]:hidden"
        {...props}
      />
    </label>
  );
}
