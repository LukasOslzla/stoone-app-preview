import { CheckIcon, SealCheckIcon, StarIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import type { ConfigOption } from "@/lib/configurator";
import { formatPrice } from "@/lib/format";

type ConfigOptionCardProps = {
  option: ConfigOption;
  selected: boolean;
  onSelect: () => void;
  /** Name of the radio group (the sub-step). */
  name: string;
};

/**
 * One variant in the configurator: swatch, "Standard" / "Nadstandard" tag,
 * name and price. The check of the selected card stays neutral (not green).
 */
export function ConfigOptionCard({
  option,
  selected,
  onSelect,
  name,
}: ConfigOptionCardProps) {
  const upgrade = option.price > 0;

  return (
    <label
      className={cn(
        "flex cursor-pointer flex-col gap-2.5 rounded-2xl border p-2 transition-colors has-focus-visible:outline-[1.5px] has-focus-visible:outline-offset-2 has-focus-visible:outline-beige",
        selected
          ? "border-beige bg-beige/8 shadow-[0_0_0_1px_var(--color-beige)]"
          : upgrade
            ? "border-beige/35 hover:border-beige/60"
            : "border-line-soft hover:border-line",
      )}
    >
      <input
        type="radio"
        name={name}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />
      <span
        aria-hidden
        className="relative block h-[120px] rounded-[10px]"
        style={{
          backgroundImage: `linear-gradient(135deg, ${option.swatch[0]}, ${option.swatch[1]})`,
        }}
      >
        {selected && (
          <span className="absolute top-2 left-2 flex size-6 items-center justify-center rounded-full bg-beige text-ink">
            <CheckIcon weight="bold" className="size-3" />
          </span>
        )}
        <span
          className={cn(
            "absolute top-2 right-2 flex h-6 items-center gap-[5px] rounded-full px-[9px] font-text text-[11px] leading-none font-bold",
            upgrade
              ? "bg-beige text-ink"
              : "border border-tint/12 bg-popover/85 text-fg-2",
          )}
        >
          {upgrade ? (
            <StarIcon weight="fill" className="size-[11px]" />
          ) : (
            <SealCheckIcon weight="fill" className="size-[11px]" />
          )}
          {upgrade ? "Nadstandard" : "Standard"}
        </span>
      </span>
      <span className="flex flex-col gap-0.5 px-1.5 pb-1.5">
        <span className="font-text text-sm leading-[1.4] font-semibold text-fg">
          {option.name}
        </span>
        {option.detail && (
          <span className="font-text text-[11px] leading-[1.4] text-fg-3">
            {option.detail}
          </span>
        )}
        <span
          className={cn(
            "font-text text-[13px] leading-[1.4]",
            upgrade ? "font-bold text-beige" : "font-medium text-fg-3",
          )}
        >
          {upgrade ? `příplatek + ${formatPrice(option.price)}` : "V ceně bytu"}
        </span>
      </span>
    </label>
  );
}
