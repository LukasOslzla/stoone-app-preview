"use client";

import { useId } from "react";
import { SparkleIcon } from "@phosphor-icons/react";
import { AiSuggestButton } from "@/components/ui/AiSuggestButton";
import { controlBox, controlText } from "@/components/ui/form/control";
import { cn } from "@/lib/cn";
import { outOf } from "@/lib/format";
import { AiSuggestionCard, type AiSuggestion } from "./AiSuggestionCard";

type SeoTextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /**
   * Text generated from the record's data; shows "Vyplněno automaticky" while
   * unchanged. Omit for fields without an automatic text.
   */
  autoValue?: string;
  /** Recommended maximum length (60 for titles, 160 for descriptions). */
  maxLength: number;
  multiline?: boolean;
  /** Asks AI for a better text. */
  onSuggest?: () => Promise<void>;
  suggesting?: boolean;
  /** Label of the AI button, "Vylepšit s AI" by default. */
  suggestLabel?: string;
  /**
   * A proposal waiting for the user's decision, shown under the field. Without
   * it `onSuggest` is expected to change the value directly.
   */
  suggestion?: AiSuggestion | null;
  onUseSuggestion?: () => void;
  onDismissSuggestion?: () => void;
  disabled?: boolean;
};

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
  suggestLabel,
  suggestion,
  onUseSuggestion,
  onDismissSuggestion,
  disabled = false,
}: SeoTextFieldProps) {
  const id = useId();
  const length = value.trim().length;
  const isAuto = value === autoValue;
  const over = length > maxLength;
  // A few characters over the limit only get clipped; much more is an error.
  const tooLong = length > maxLength * 1.25;
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
          {autoValue !== undefined &&
            (isAuto ? (
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
            ))}
          {onSuggest && (
            <AiSuggestButton
              label={suggestLabel}
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
        {over ? length : `${length} ${outOf(maxLength)}`} znaků ·{" "}
        {tooLong
          ? "příliš dlouhé, vyhledávač text ořízne"
          : over
            ? `o něco delší než doporučených ${maxLength}, konec se může oříznout`
            : tooShort
              ? "zkuste být konkrétnější"
              : "ideální délka"}
      </p>

      {suggestion && (
        <AiSuggestionCard
          suggestion={suggestion}
          loading={suggesting}
          onUse={() => onUseSuggestion?.()}
          onAnother={() => onSuggest?.()}
          onDismiss={() => onDismissSuggestion?.()}
        />
      )}
    </div>
  );
}
