"use client";

import { useId } from "react";
import { Switch } from "@/components/ui/Switch";

type SwitchRowProps = {
  label: string;
  /** Second line explaining what the switch does. */
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

/** A setting on one row: label (and description) left, switch right. */
export function SwitchRow({
  label,
  description,
  checked,
  onChange,
  disabled,
}: SwitchRowProps) {
  const id = useId();

  return (
    <div className="flex items-center justify-between gap-4">
      <span id={id} className="flex min-w-0 flex-col gap-0.5">
        <span className="font-text text-sm leading-[1.4] font-medium text-fg-2">
          {label}
        </span>
        {description && (
          <span className="font-text text-xs leading-[1.4] text-fg-3">
            {description}
          </span>
        )}
      </span>
      <Switch
        labelledBy={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}
