"use client";

import { useId } from "react";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { CaretDownIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { controlBox, controlText } from "./control";

type FieldShellProps = {
  label: string;
  htmlFor: string;
  error?: string;
  /** Helper text under the control, shown when there is no error. */
  hint?: string;
  /** `sm` = compact label for narrow side panels. */
  size?: "md" | "sm";
  /** Small control at the end of the label row, e.g. an AI button. */
  action?: ReactNode;
  children: ReactNode;
};

/** Label + control + message. Used by the admin form fields below. */
export function FieldShell({
  label,
  htmlFor,
  error,
  hint,
  size = "md",
  action,
  children,
}: FieldShellProps) {
  const labelElement = (
    <label
      htmlFor={htmlFor}
      className={cn(
        "font-text leading-[1.4] font-medium text-fg",
        size === "sm" ? "text-[13px]" : "text-sm",
      )}
    >
      {label}
    </label>
  );

  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col",
        size === "sm" ? "gap-[7px]" : "gap-2",
      )}
    >
      {action ? (
        <div className="flex min-h-7 items-center justify-between gap-3">
          {labelElement}
          {action}
        </div>
      ) : (
        labelElement
      )}
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

type Common = {
  label: string;
  error?: string;
  hint?: string;
  /** `sm` = 42px control with 13px text, for narrow side panels. */
  size?: "md" | "sm";
  /** Small control at the end of the label row, e.g. an AI button. */
  action?: ReactNode;
};

type TextInputProps = Common &
  Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "size"> & {
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
  size,
  action,
  ...props
}: TextInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <FieldShell
      label={label}
      htmlFor={inputId}
      error={error}
      hint={hint}
      size={size}
      action={action}
    >
      <div className={controlBox({ invalid: Boolean(error), disabled, size })}>
        <input
          id={inputId}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? `${inputId}-message` : undefined}
          className={`${controlText(size)} h-full`}
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
  Omit<SelectHTMLAttributes<HTMLSelectElement>, "className" | "size"> & {
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
  size,
  action,
  ...props
}: SelectInputProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <FieldShell
      label={label}
      htmlFor={selectId}
      error={error}
      hint={hint}
      size={size}
      action={action}
    >
      <div
        className={`${controlBox({ invalid: Boolean(error), disabled, size })} relative`}
      >
        <select
          id={selectId}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? `${selectId}-message` : undefined}
          className={cn(
            controlText(size),
            "h-full cursor-pointer appearance-none truncate",
            size === "sm"
              ? "-mx-3.5 rounded-[10px] pr-9 pl-3.5"
              : "-mx-4 rounded-xl pr-11 pl-4",
          )}
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
          className={cn(
            "pointer-events-none absolute text-fg-2",
            size === "sm" ? "right-3.5 size-3" : "right-4 size-3.5",
          )}
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
  size,
  action,
  ...props
}: TextAreaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  return (
    <FieldShell
      label={label}
      htmlFor={textareaId}
      error={error}
      hint={hint}
      size={size}
      action={action}
    >
      <div
        className={controlBox({
          invalid: Boolean(error),
          disabled,
          multiline: true,
          size,
        })}
      >
        <textarea
          id={textareaId}
          rows={rows}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? `${textareaId}-message` : undefined}
          className={cn(
            controlText(size),
            "resize-y",
            size === "sm"
              ? "min-h-[110px] py-3 leading-[1.5]"
              : "min-h-[101px] py-3.5",
          )}
          {...props}
        />
      </div>
    </FieldShell>
  );
}
