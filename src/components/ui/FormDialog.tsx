"use client";

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

type FormDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  /** `md` = 640px, `sm` = 480px. */
  size?: "md" | "sm";
  /**
   * Runs on submit; the buttons are locked while it is pending. Return `false`
   * (e.g. after a validation error) to keep the dialog open.
   */
  onSubmit: () => Promise<boolean | void> | boolean | void;
  submitLabel: string;
  /** Text next to the spinner, e.g. "Ukládám…". */
  submittingLabel?: string;
  cancelLabel?: string;
  submitDisabled?: boolean;
  /** Fields of the form. */
  children: ReactNode;
};

/**
 * Modal with a form and the usual "Zrušit / confirm" footer. Handles the
 * submitting state, so a dialog only describes its fields.
 */
export function FormDialog({
  open,
  onClose,
  title,
  description,
  size,
  onSubmit,
  submitLabel,
  submittingLabel,
  cancelLabel = "Zrušit",
  submitDisabled = false,
  children,
}: FormDialogProps) {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const result = await onSubmit();
    setSubmitting(false);
    if (result !== false) onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size={size}
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <fieldset
          disabled={submitting}
          className="flex min-w-0 flex-col gap-4 disabled:opacity-70"
        >
          {children}
        </fieldset>
        <div className="flex flex-wrap justify-end gap-2.5 pt-1">
          <Button
            variant="outline"
            size="md"
            disabled={submitting}
            onClick={onClose}
          >
            {cancelLabel}
          </Button>
          <Button
            type="submit"
            size="md"
            loading={submitting}
            loadingLabel={submittingLabel}
            disabled={submitDisabled}
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
