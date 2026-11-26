"use client";

import { useEffect, useId, useRef, useState } from "react";
import type {
  InputHTMLAttributes,
  KeyboardEvent,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
import {
  CaretDownIcon,
  CheckCircleIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
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

export type SelectOption = {
  value: string;
  label: string;
  /** Second line in the open list. */
  description?: string;
  disabled?: boolean;
};

type SelectInputProps = Common & {
  options: SelectOption[];
  /** Controlled value; omit it and use `defaultValue` for an uncontrolled field. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Shown while nothing is selected. */
  placeholder?: string;
  /** Adds a hidden input so the value is part of a submitted <form>. */
  name?: string;
  id?: string;
  disabled?: boolean;
};

/**
 * Select with its own list (instead of the system one): opens under the
 * field, or above it when there is no room. Keyboard: arrows, Home / End,
 * Enter or Space to choose, Escape to close, letters jump to an option.
 */
export function SelectInput({
  label,
  error,
  hint,
  id,
  disabled,
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = "Vyberte…",
  name,
  size,
  action,
}: SelectInputProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const listId = `${selectId}-list`;

  const [innerValue, setInnerValue] = useState(defaultValue ?? "");
  const value = controlledValue ?? innerValue;
  const selected = options.find((option) => option.value === value);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [above, setAbove] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: "", at: 0 });

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  function openList() {
    const rect = rootRef.current?.getBoundingClientRect();
    if (rect) {
      const listHeight = Math.min(options.length * 40 + 12, 280);
      setAbove(
        window.innerHeight - rect.bottom < listHeight + 16 &&
          rect.top > listHeight + 16,
      );
    }
    setActive(Math.max(0, options.indexOf(selected ?? options[0])));
    setOpen(true);
  }

  function choose(option: SelectOption) {
    if (option.disabled) return;
    setInnerValue(option.value);
    onChange?.(option.value);
    setOpen(false);
  }

  function move(step: number) {
    let next = active;
    for (let count = 0; count < options.length; count += 1) {
      next = (next + step + options.length) % options.length;
      if (!options[next].disabled) break;
    }
    setActive(next);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const { key } = event;
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(key)) {
        event.preventDefault();
        openList();
      }
      return;
    }
    if (key === "Escape" || key === "Tab") {
      if (key === "Escape") event.preventDefault();
      setOpen(false);
    } else if (key === "ArrowDown" || key === "ArrowUp") {
      event.preventDefault();
      move(key === "ArrowDown" ? 1 : -1);
    } else if (key === "Home" || key === "End") {
      event.preventDefault();
      setActive(key === "Home" ? 0 : options.length - 1);
    } else if (key === "Enter" || key === " ") {
      event.preventDefault();
      choose(options[active]);
    } else if (key.length === 1) {
      // Typing letters jumps to the first option that starts with them.
      const now = Date.now();
      const text =
        (now - typed.current.at < 600 ? typed.current.text : "") +
        key.toLowerCase();
      typed.current = { text, at: now };
      const match = options.findIndex(
        (option) =>
          !option.disabled && option.label.toLowerCase().startsWith(text),
      );
      if (match !== -1) setActive(match);
    }
  }

  const sm = size === "sm";

  return (
    <FieldShell
      label={label}
      htmlFor={selectId}
      error={error}
      hint={hint}
      size={size}
      action={action}
    >
      <div ref={rootRef} className="relative">
        {name && <input type="hidden" name={name} value={value} />}
        <button
          id={selectId}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={
            open ? `${selectId}-option-${active}` : undefined
          }
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? `${selectId}-message` : undefined}
          disabled={disabled}
          onClick={() => (open ? setOpen(false) : openList())}
          onKeyDown={onKeyDown}
          className={cn(
            controlBox({ invalid: Boolean(error), disabled, size }),
            "text-left outline-none focus-visible:border-beige focus-visible:shadow-[0_0_12px_#CAC3B84D]",
            open && !error && "border-beige shadow-[0_0_12px_#CAC3B84D]",
          )}
        >
          <span
            className={cn(
              "min-w-0 flex-1 truncate font-text leading-[1.4]",
              sm ? "text-[13px]" : "text-[15px]",
              selected ? "text-fg" : "text-fg-3",
            )}
          >
            {selected?.label ?? placeholder}
          </span>
          <CaretDownIcon
            weight="fill"
            className={cn(
              "shrink-0 text-fg-2 transition-transform",
              sm ? "size-3" : "size-3.5",
              open && "rotate-180",
            )}
          />
        </button>

        {open && (
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label={label}
            className={cn(
              "absolute inset-x-0 z-40 flex max-h-[280px] flex-col gap-0.5 overflow-y-auto rounded-xl border border-line bg-card p-1.5 shadow-[0_16px_40px_#000000B3]",
              above ? "bottom-full mb-1.5" : "top-full mt-1.5",
            )}
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              return (
                <li
                  key={option.value}
                  id={`${selectId}-option-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled || undefined}
                  // Keep the focus on the button.
                  onPointerDown={(event) => event.preventDefault()}
                  onPointerMove={() => !option.disabled && setActive(index)}
                  onClick={() => choose(option)}
                  className={cn(
                    "flex shrink-0 cursor-pointer items-center gap-2.5 rounded-lg px-2.5",
                    sm ? "min-h-[34px] py-1.5" : "min-h-[38px] py-2",
                    isSelected
                      ? "bg-[#CAC3B81F]"
                      : index === active && "bg-white/5",
                    index === active && "ring-1 ring-line ring-inset",
                    option.disabled && "cursor-default opacity-45",
                  )}
                >
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span
                      className={cn(
                        "truncate font-text leading-[1.4] text-fg",
                        sm ? "text-[13px]" : "text-sm",
                        isSelected ? "font-semibold" : "font-medium",
                      )}
                    >
                      {option.label}
                    </span>
                    {option.description && (
                      <span className="truncate font-text text-xs leading-[1.4] text-fg-3">
                        {option.description}
                      </span>
                    )}
                  </span>
                  {isSelected && (
                    <CheckCircleIcon
                      weight="fill"
                      className="size-3.5 shrink-0 text-beige"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        )}
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
