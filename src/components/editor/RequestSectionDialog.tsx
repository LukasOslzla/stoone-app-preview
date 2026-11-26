"use client";

import { useState } from "react";
import { FormDialog } from "@/components/ui/FormDialog";
import { TextArea, TextInput } from "@/components/ui/form/Field";
import { requestSection } from "@/lib/editor";

type RequestSectionDialogProps = {
  open: boolean;
  onClose: () => void;
  projectSlug: string;
  onSent: () => void;
};

/** "Požádat o novou sekci": what the section should show and an example. */
export function RequestSectionDialog({
  open,
  onClose,
  projectSlug,
  onSent,
}: RequestSectionDialogProps) {
  const [text, setText] = useState("");
  const [example, setExample] = useState("");
  const [error, setError] = useState("");

  async function submit() {
    if (text.trim().length < 10) {
      setError("Popište sekci aspoň jednou větou.");
      return false;
    }
    await requestSection(projectSlug, { text, example });
    setText("");
    setExample("");
    onSent();
  }

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title="Požádat o novou sekci"
      description="Napište, co má sekce ukazovat. Připravíme ji a dáme vám vědět v notifikacích."
      onSubmit={submit}
      submitLabel="Odeslat žádost"
      submittingLabel="Odesílám…"
    >
      <TextArea
        label="Co má sekce ukazovat"
        placeholder="např. Časová osa stavby s fotkami z jednotlivých měsíců"
        rows={4}
        value={text}
        error={error}
        onChange={(event) => {
          setText(event.target.value);
          setError("");
        }}
      />
      <TextInput
        label="Odkaz na příklad"
        placeholder="nepovinné, např. https://…"
        value={example}
        onChange={(event) => setExample(event.target.value)}
      />
    </FormDialog>
  );
}
