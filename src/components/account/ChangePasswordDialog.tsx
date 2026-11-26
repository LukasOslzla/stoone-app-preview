"use client";

import { useState } from "react";
import { FormDialog } from "@/components/ui/FormDialog";
import { TextInput } from "@/components/ui/form/Field";
import { changePassword } from "@/lib/user";

type ChangePasswordDialogProps = {
  open: boolean;
  onClose: () => void;
  onChanged: () => void;
};

type Errors = { current?: string; next?: string; repeat?: string };

/** "Změnit heslo": current password, the new one and its confirmation. */
export function ChangePasswordDialog({
  open,
  onClose,
  onChanged,
}: ChangePasswordDialogProps) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [repeat, setRepeat] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  function reset() {
    setCurrent("");
    setNext("");
    setRepeat("");
    setErrors({});
  }

  async function submit() {
    const found: Errors = {};
    if (!current) found.current = "Zadejte současné heslo.";
    if (next.length < 8) found.next = "Heslo musí mít aspoň 8 znaků.";
    else if (next === current) found.next = "Nové heslo musí být jiné.";
    if (repeat !== next) found.repeat = "Hesla se neshodují.";
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return false;
    }

    const ok = await changePassword(current, next);
    if (!ok) {
      setErrors({ current: "Současné heslo nesouhlasí." });
      return false;
    }
    reset();
    onChanged();
  }

  return (
    <FormDialog
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      size="sm"
      title="Změnit heslo"
      description="Na ostatních zařízeních zůstanete přihlášeni."
      onSubmit={submit}
      submitLabel="Změnit heslo"
      submittingLabel="Měním…"
    >
      <TextInput
        label="Současné heslo"
        type="password"
        autoComplete="current-password"
        value={current}
        error={errors.current}
        onChange={(event) => {
          setCurrent(event.target.value);
          setErrors((found) => ({ ...found, current: undefined }));
        }}
      />
      <TextInput
        label="Nové heslo"
        type="password"
        autoComplete="new-password"
        hint="Aspoň 8 znaků."
        value={next}
        error={errors.next}
        onChange={(event) => {
          setNext(event.target.value);
          setErrors((found) => ({ ...found, next: undefined }));
        }}
      />
      <TextInput
        label="Nové heslo znovu"
        type="password"
        autoComplete="new-password"
        value={repeat}
        error={errors.repeat}
        onChange={(event) => {
          setRepeat(event.target.value);
          setErrors((found) => ({ ...found, repeat: undefined }));
        }}
      />
    </FormDialog>
  );
}
