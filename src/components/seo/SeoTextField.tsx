"use client";

import { useId } from "react";
import { SparkleIcon } from "@phosphor-icons/react";
import { AiSuggestButton } from "@/components/ui/AiSuggestButton";
import { controlBox, controlText } from "@/components/ui/form/control";
import { cn } from "@/lib/cn";

type SeoTextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Text generated from the record's data; shows "Vyplněno automaticky" while unchanged. */
  autoValue: string;
  /** Recommended maximum length (60 for titles, 160 for descriptions). */
  maxLength: number;
  multiline?: boolean;
  /** Asks AI for a better text; resolves with the suggestion. */
  onSuggest?: () => Promise<void>;
  suggesting?: boolean;
  disabled?: boolean;
};

/** "z 60" but "ze 160" – Czech preposition before a number. */
const outOf = (count: number) =>
  `${(count >= 100 && count < 200) || [7, 17].includes(count) || (count >= 70 && count < 80) ? "ze" : "z"} ${count}`;

/** Title / description field with a length counter, auto-fill note and AI button. */
export function SeoTextField({
  label,
  value,
  onChange,
  autoValue,
  maxLength,
  multiline = false,
  onSuggest,
  suggesting = false,
  disabled = false,
}: SeoTextFieldProps) {
  const id = useId();
  const length = value.trim().length;
  const isAuto = value === autoValue;
  const tooLong = length > maxLength;
  const tooShort = length < maxLength * 0.4;
  const busy = disabled || suggesting;

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex min-h-7 flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <label
          htmlFor={id}
          className="font-text text-sm leading-[1.4] font-medium text-fg"
        >
          {label}
        </label>
        <div className="flex items-center gap-3">
          {isAuto ? (
            <span className="flex items-center gap-1.5 font-text text-xs leading-[1.4] text-fg-3">
              <SparkleIcon weight="fill" className="size-3" />
              Vyplněno automaticky
            </span>
          ) : (
            // Not in the design: lets the user go back to the generated text.
            <button
              type="button"
              disabled={busy}
              onClick={() => onChange(autoValue)}
              className="rounded-md font-text text-xs leading-[1.4] text-fg-3 underline-offset-2 transition-colors hover:text-fg hover:underline focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-beige"
            >
              Vrátit automatický text
            </button>
          )}
          {onSuggest && (
            <AiSuggestButton
              loading={suggesting}
              disabled={disabled}
              onClick={onSuggest}
            />
          )}
        </div>
      </div>

      <div
        className={controlBox({ disabled: busy, multiline, invalid: tooLong })}
      >
        {multiline ? (
          <textarea
            id={id}
            rows={3}
            value={value}
            disabled={busy}
            aria-describedby={`${id}-count`}
            onChange={(event) => onChange(event.target.value)}
            className={cn(
              controlText(),
              "min-h-[101px] resize-y py-3.5 leading-[1.45]",
            )}
          />
        ) : (
          <input
            id={id}
            value={value}
            disabled={busy}
            aria-describedby={`${id}-count`}
            onChange={(event) => onChange(event.target.value)}
            className={cn(controlText(), "h-full")}
          />
        )}
      </div>

      <p
        id={`${id}-count`}
        className={cn(
          "font-text text-xs leading-[1.4]",
          tooLong ? "text-red" : tooShort ? "text-yellow" : "text-fg-3",
        )}
      >
        {length} {outOf(maxLength)} znaků ·{" "}
        {tooLong
          ? "příliš dlouhé, vyhledávač text ořízne"
          : tooShort
            ? "zkuste být konkrétnější"
            : "ideální délka"}
      </p>
    </div>
  );
}
