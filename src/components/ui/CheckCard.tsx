import { CheckCircleIcon, CircleIcon } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/cn";

type CheckCardProps = {
  title: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

/** Card that toggles like a checkbox; use in a grid to pick several items. */
export function CheckCard({
  title,
  description,
  checked,
  onChange,
  disabled,
}: CheckCardProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-[14px] border-[1.5px] p-3.5 transition-colors has-focus-visible:outline-[1.5px] has-focus-visible:outline-offset-2 has-focus-visible:outline-beige",
        checked
          ? "border-beige bg-[#CAC3B81A]"
          : "border-line-soft hover:border-line hover:bg-white/[0.02]",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      {checked ? (
        <CheckCircleIcon weight="fill" className="size-5 shrink-0 text-beige" />
      ) : (
        <CircleIcon
          weight="fill"
          className="size-5 shrink-0 text-[#FFFFFF1F]"
        />
      )}
      <span className="flex min-w-0 flex-col gap-px">
        <span className="font-text text-sm leading-[1.4] font-bold text-fg">
          {title}
        </span>
        {description && (
          <span className="truncate font-text text-xs leading-[1.4] text-fg-3">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}
