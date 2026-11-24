"use client";

import { useState } from "react";
import {
  FileArrowUpIcon,
  PencilSimpleIcon,
  PlusCircleIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { ChoiceCard } from "@/components/ui/ChoiceCard";
import { Modal } from "@/components/ui/Modal";

/** "Přidat byty" button with the dialog asking how to add them. */
export function AddUnitsButton({ projectSlug }: { projectSlug: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="action" onClick={() => setOpen(true)}>
        <PlusCircleIcon weight="fill" className="size-3.5" />
        Přidat byty
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Jak chcete byty přidat?"
        description="Vyberte způsob, který vám vyhovuje. Později můžete použít i ten druhý."
      >
        <div className="flex flex-col gap-4 sm:flex-row">
          <ChoiceCard
            recommended
            icon={<FileArrowUpIcon weight="fill" className="size-5" />}
            title="Nahrát z Excelu"
            description="Více bytů najednou z tabulky. Připravili jsme pro vás vzor."
            note="Doporučeno pro 5 a více bytů"
            href={`/projects/${projectSlug}/units/import`}
            onSelect={() => setOpen(false)}
          />
          <ChoiceCard
            icon={<PencilSimpleIcon weight="fill" className="size-5" />}
            title="Přidat ručně"
            description="Jeden byt po druhém přes krátký formulář."
            note="Vhodné pro pár bytů"
            href={`/projects/${projectSlug}/units/new`}
            onSelect={() => setOpen(false)}
          />
        </div>
      </Modal>
    </>
  );
}
