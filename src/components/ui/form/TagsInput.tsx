"use client";

import { useId, useState } from "react";
import { PlusCircleIcon, XCircleIcon } from "@phosphor-icons/react";
import { controlBox } from "./control";
import { FieldShell } from "./Field";

type TagsInputProps = {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  /** Text of the button that adds a value, e.g. "Přidat dům". */
  addLabel: string;
  /** Adjusts what the user typed before it is added (trim, upper-case…). */
  normalize?: (value: string) => string;
  error?: string;
  hint?: string;
  disabled?: boolean;
};

/** List of removable tags inside a form control, with an inline "add". */
export function TagsInput({
  label,
  values,
  onChange,
  addLabel,
  normalize = (value) => value.trim(),
  error,
  hint,
  disabled,
}: TagsInputProps) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);

  function commit() {
    const value = normalize(draft ?? "");
    if (value && !values.includes(value)) onChange([...values, value]);
    setDraft(null);
  }

  return (
    <FieldShell label={label} htmlFor={id} error={error} hint={hint}>
      <div
        className={controlBox({
          invalid: Boolean(error),
          disabled,
          wrap: true,
        })}
      >
        {values.map((value) => (
          <span
            key={value}
            className="flex h-8 items-center gap-1.5 rounded-full border border-line-soft bg-control pr-2 pl-3 font-text text-[13px] leading-none font-semibold text-fg"
          >
            {value}
            <button
              type="button"
              aria-label={`Odebrat ${value}`}
              title={`Odebrat ${value}`}
              onClick={() => onChange(values.filter((item) => item !== value))}
              className="rounded-full text-fg-3 transition-colors hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-beige"
            >
              <XCircleIcon weight="fill" className="size-3.5" />
            </button>
          </span>
        ))}

        {draft === null ? (
          <button
            id={id}
            type="button"
            onClick={() => setDraft("")}
            className="flex h-8 items-center gap-1.5 rounded-full px-2.5 font-text text-[13px] leading-none font-semibold text-beige transition-colors hover:bg-beige/8 focus-visible:outline-[1.5px] focus-visible:outline-beige"
          >
            <PlusCircleIcon weight="fill" className="size-3.5" />
            {addLabel}
          </button>
        ) : (
          <input
            id={id}
            autoFocus
            value={draft}
            aria-label={addLabel}
            placeholder={addLabel}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commit}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                commit();
              }
              if (event.key === "Escape") setDraft(null);
            }}
            className="h-8 w-28 min-w-0 bg-transparent px-2 font-text text-[13px] leading-none font-semibold text-fg outline-none placeholder:font-normal placeholder:text-fg-3"
          />
        )}
      </div>
    </FieldShell>
  );
}
