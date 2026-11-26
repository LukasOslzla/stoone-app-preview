import type { ReactNode } from "react";
import { CheckCircleIcon, CircleIcon } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/cn";

type CheckCardProps = {
  title: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** `radio` cards with the same `name` exclude each other. */
  type?: "checkbox" | "radio";
  name?: string;
  /** Shown instead of the check mark (e.g. the icon of a role). */
  icon?: ReactNode;
  disabled?: boolean;
};

/**
 * Card that toggles like a checkbox or a radio; use in a grid to pick one or
 * several items.
 */
export function CheckCard({
  title,
  description,
  checked,
  onChange,
  type = "checkbox",
  name,
  icon,
  disabled,
}: CheckCardProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-[14px] border-[1.5px] p-3.5 transition-colors has-focus-visible:outline-[1.5px] has-focus-visible:outline-offset-2 has-focus-visible:outline-beige",
        checked
          ? "border-beige bg-beige/10"
          : "border-line-soft hover:border-line hover:bg-tint/2",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <input
        type={type}
        name={name}
        className="sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      {icon ? (
        <span className={cn("shrink-0", checked ? "text-beige" : "text-fg-2")}>
          {icon}
        </span>
      ) : checked ? (
        <CheckCircleIcon weight="fill" className="size-5 shrink-0 text-beige" />
      ) : (
        <CircleIcon weight="fill" className="size-5 shrink-0 text-tint/12" />
      )}
      <span className="flex min-w-0 flex-col gap-px">
        <span
          className={cn(
            "font-text text-sm leading-[1.4] text-fg",
            icon ? "font-semibold" : "font-bold",
          )}
        >
          {title}
        </span>
        {description && (
          <span
            className={cn(
              "font-text text-xs leading-[1.4] text-fg-3",
              !icon && "truncate",
            )}
          >
            {description}
          </span>
        )}
      </span>
    </label>
  );
}
