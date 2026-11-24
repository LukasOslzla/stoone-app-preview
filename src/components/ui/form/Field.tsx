"use client";

import { useId } from "react";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { CaretDownIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { controlBox, controlText } from "./control";

type FieldShellProps = {
  label: string;
  htmlFor: string;
  error?: string;
  /** Helper text under the control, shown when there is no error. */
  hint?: string;
  children: ReactNode;
};

/** Label + control + message. Used by the admin form fields below. */
export function FieldShell({
  label,
  htmlFor,
  error,
  hint,
  children,
}: FieldShellProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="font-text text-sm leading-[1.4] font-medium text-fg"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p
          id={`${htmlFor}-message`}
          className="flex items-center gap-1.5 font-text text-[13px] leading-[1.4] text-red"
        >
          <WarningCircleIcon weight="fill" className="size-3.5 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p
          id={`${htmlFor}-message`}
          className="font-text text-[13px] leading-[1.4] text-fg-3"
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type Common = { label: string; error?: string; hint?: string };

type TextInputProps = Common &
  Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
    /** Unit shown at the end of the input, e.g. "m²" or "Kč". */
    suffix?: string;
  };

export function TextInput({
  label,
  error,
  hint,
  id,
  disabled,
  suffix,
  ...props
}: TextInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <FieldShell label={label} htmlFor={inputId} error={error} hint={hint}>
      <div className={controlBox({ invalid: Boolean(error), disabled })}>
        <input
          id={inputId}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? `${inputId}-message` : undefined}
          className={`${controlText()} h-full`}
          {...props}
        />
        {suffix && (
          <span className="shrink-0 font-text text-[13px] leading-[1.4] text-fg-3">
            {suffix}
          </span>
        )}
      </div>
    </FieldShell>
  );
}

type SelectInputProps = Common &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, "className"> & {
    options: { value: string; label: string }[];
  };

/** Native select styled like the other controls. */
export function SelectInput({
  label,
  error,
  hint,
  id,
  disabled,
  options,
  ...props
}: SelectInputProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <FieldShell label={label} htmlFor={selectId} error={error} hint={hint}>
      <div
        className={`${controlBox({ invalid: Boolean(error), disabled })} relative`}
      >
        <select
          id={selectId}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? `${selectId}-message` : undefined}
          className={`${controlText()} -mx-4 h-full cursor-pointer appearance-none truncate rounded-xl pr-11 pl-4`}
          {...props}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-control text-fg"
            >
              {option.label}
            </option>
          ))}
        </select>
        <CaretDownIcon
          weight="fill"
          className="pointer-events-none absolute right-4 size-3.5 text-fg-2"
        />
      </div>
    </FieldShell>
  );
}

type TextAreaProps = Common &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className">;

export function TextArea({
  label,
  error,
  hint,
  id,
  disabled,
  rows = 3,
  ...props
}: TextAreaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  return (
    <FieldShell label={label} htmlFor={textareaId} error={error} hint={hint}>
      <div
        className={controlBox({
          invalid: Boolean(error),
          disabled,
          multiline: true,
        })}
      >
        <textarea
          id={textareaId}
          rows={rows}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error || hint ? `${textareaId}-message` : undefined
          }
          className={`${controlText()} min-h-[101px] resize-y py-3.5`}
          {...props}
        />
      </div>
    </FieldShell>
  );
}
