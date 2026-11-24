import type { InputHTMLAttributes } from "react";
import { CheckIcon } from "@phosphor-icons/react/ssr";

type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "className"
> & { label: string };

/** Checkbox with its label on the right. */
export function Checkbox({ label, ...props }: CheckboxProps) {
  return (
    <label className="group flex cursor-pointer items-center gap-2.5 font-text text-sm leading-[1.4] text-fg-2">
      <span className="relative flex size-5 shrink-0">
        <input type="checkbox" className="peer sr-only" {...props} />
        <span className="size-full rounded-md border-[1.5px] border-line transition-colors group-hover:border-[#D2D5C566] peer-checked:border-beige peer-checked:bg-beige peer-focus-visible:outline-[1.5px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-beige" />
        <CheckIcon
          weight="bold"
          className="absolute inset-0 m-auto hidden size-3 text-ink peer-checked:block"
        />
      </span>
      {label}
    </label>
  );
}
