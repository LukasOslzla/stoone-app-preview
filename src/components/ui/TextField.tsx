"use client";

import { useId, useState } from "react";
import type { InputHTMLAttributes, KeyboardEvent, ReactNode } from "react";
import {
  ArrowFatUpIcon,
  EyeIcon,
  EyeSlashIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { controlBox, controlText } from "@/components/ui/form/control";
import { cn } from "@/lib/cn";

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
  label: string;
  /** Validation message; also switches the input to the error style. */
  error?: string;
  /** Error style without a message (e.g. wrong credentials). */
  invalid?: boolean;
  /** Extra message under the input, shown when there is no error. */
  hint?: ReactNode;
  trailing?: ReactNode;
};

export function TextField({
  label,
  error,
  invalid,
  hint,
  trailing,
  disabled,
  id,
  ...inputProps
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const hasError = Boolean(error) || invalid;

  return (
    <div className="flex w-full flex-col gap-2.5">
      <label
        htmlFor={inputId}
        className="font-text text-[15px] leading-[1.3] font-medium text-fg"
      >
        {label}
      </label>

      <div
        className={controlBox({ size: "lg", invalid: hasError, disabled })}
      >
        <input
          id={inputId}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={error || hint ? messageId : undefined}
          className={cn(controlText("lg"), "h-full")}
          {...inputProps}
        />
        {trailing}
      </div>

      {error ? (
        <p
          id={messageId}
          className="flex items-center gap-1.5 font-text text-[13px] leading-[1.4] text-red"
        >
          <WarningCircleIcon weight="fill" className="size-3.5 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <div id={messageId}>{hint}</div>
      ) : null}
    </div>
  );
}

type PasswordFieldProps = Omit<TextFieldProps, "type" | "trailing" | "hint">;

/** Password input with show/hide toggle and a Caps Lock warning. */
export function PasswordField({
  onKeyDown,
  onKeyUp,
  onBlur,
  disabled,
  ...props
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  const syncCapsLock = (event: KeyboardEvent<HTMLInputElement>) => {
    setCapsLock(event.getModifierState("CapsLock"));
  };

  return (
    <TextField
      {...props}
      disabled={disabled}
      type={visible ? "text" : "password"}
      onKeyDown={(event) => {
        syncCapsLock(event);
        onKeyDown?.(event);
      }}
      onKeyUp={(event) => {
        syncCapsLock(event);
        onKeyUp?.(event);
      }}
      onBlur={(event) => {
        setCapsLock(false);
        onBlur?.(event);
      }}
      hint={
        capsLock && (
          <p className="flex items-center gap-1.5 font-text text-[13px] leading-[1.4] text-yellow">
            <ArrowFatUpIcon weight="fill" className="size-3.5 shrink-0" />
            Máte zapnutý Caps Lock.
          </p>
        )
      }
      trailing={
        <button
          type="button"
          disabled={disabled}
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? "Skrýt heslo" : "Zobrazit heslo"}
          aria-pressed={visible}
          className={cn(
            "-mr-1.5 flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors hover:text-beige focus-visible:outline-[1.5px] focus-visible:outline-beige",
            visible ? "text-beige" : "text-fg-2",
          )}
        >
          {visible ? (
            <EyeIcon weight="fill" className="size-5" />
          ) : (
            <EyeSlashIcon weight="fill" className="size-5" />
          )}
        </button>
      }
    />
  );
}
