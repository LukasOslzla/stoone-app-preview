import { cn } from "@/lib/cn";

type ControlBoxOptions = {
  /** `lg` = 56px (sign-in screens), `md` = 48px (admin forms), `sm` = 42px (side panels). */
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
  disabled?: boolean;
  /** Auto height with top-aligned content, for textareas. */
  multiline?: boolean;
  /** Auto height with wrapping content, for lists of tags. */
  wrap?: boolean;
};

/**
 * Classes of the box around every form control (input, select, textarea):
 * border, fill and the hover / focus / error / disabled states.
 */
export function controlBox({
  size = "md",
  invalid = false,
  disabled = false,
  multiline = false,
  wrap = false,
}: ControlBoxOptions = {}) {
  return cn(
    "flex w-full border-[1.5px] transition-[border-color,background-color,box-shadow]",
    multiline ? "items-start" : "items-center",
    wrap
      ? "min-h-12 flex-wrap gap-2 rounded-xl px-2.5 py-[6.5px]"
      : size === "lg"
        ? "gap-3 rounded-2xl px-[18px] shadow-[inset_0_1px_0_#FFFFFF0F]"
        : size === "sm"
          ? "gap-2 rounded-[10px] px-3.5"
          : "gap-2.5 rounded-xl px-4",
    !multiline &&
      !wrap &&
      (size === "lg" ? "h-14" : size === "sm" ? "h-[42px]" : "h-12"),
    invalid
      ? "border-red bg-[#F0524B0D]"
      : "border-[#D2D5C54D] bg-[#F8F6EF08] focus-within:border-beige focus-within:shadow-[0_0_12px_#CAC3B84D] hover:not-focus-within:border-[#D2D5C599] hover:not-focus-within:bg-[#F8F6EF0D]",
    disabled && "pointer-events-none opacity-50",
  );
}

/** Classes of the native element inside the box. */
export function controlText(size: "sm" | "md" | "lg" = "md") {
  return cn(
    "min-w-0 flex-1 bg-transparent font-text leading-[1.4] text-fg outline-none placeholder:text-fg-3",
    size === "lg" ? "text-base" : size === "sm" ? "text-[13px]" : "text-[15px]",
  );
}
