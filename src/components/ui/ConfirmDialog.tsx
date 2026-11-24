"use client";

import type { ReactNode } from "react";
import { TrashIcon, WarningIcon } from "@phosphor-icons/react";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  /** Consequence worth a second look, shown in a yellow box. */
  warning?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  /** Disables the buttons while the action runs. */
  loading?: boolean;
};

/** Confirmation of a destructive action (delete…). */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  warning,
  confirmLabel,
  cancelLabel = "Ponechat",
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      icon={
        <span className="flex size-12 items-center justify-center rounded-full bg-[#F0524B1F]">
          <TrashIcon weight="fill" className="size-[22px] text-red" />
        </span>
      }
    >
      {warning && (
        <Banner tone="warning" icon={WarningIcon} className="items-center">
          {warning}
        </Banner>
      )}
      <div className="flex flex-wrap justify-end gap-2.5">
        <Button
          variant="outline"
          size="md"
          disabled={loading}
          onClick={onClose}
        >
          {cancelLabel}
        </Button>
        <Button
          variant="danger"
          size="md"
          loading={loading}
          loadingLabel="Mažu…"
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
