"use client";

import { useState } from "react";
import { FormDialog } from "@/components/ui/FormDialog";
import { SelectInput, TextInput } from "@/components/ui/form/Field";
import { createRole, type Role, type RoleId } from "@/lib/team";

type CreateRoleDialogProps = {
  open: boolean;
  onClose: () => void;
  /** Existing roles: names must differ and permissions can be copied. */
  roles: Role[];
  /** Called with the new role and the role its permissions start from. */
  onCreated: (role: Role, copyOf: RoleId) => void;
};

/** "Vytvořit roli": name, description and which role to start from. */
export function CreateRoleDialog({
  open,
  onClose,
  roles,
  onCreated,
}: CreateRoleDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [copyOf, setCopyOf] = useState<RoleId>("editor");
  const [error, setError] = useState("");

  function reset() {
    setName("");
    setDescription("");
    setCopyOf("editor");
    setError("");
  }

  async function submit() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Zadejte název role.");
      return false;
    }
    if (
      roles.some((role) => role.name.toLowerCase() === trimmed.toLowerCase())
    ) {
      setError("Role s tímhle názvem už existuje.");
      return false;
    }
    const role = await createRole({ name: trimmed, description });
    reset();
    onCreated(role, copyOf);
  }

  return (
    <FormDialog
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title="Vytvořit roli"
      description="Oprávnění role pak upravíte v tabulce vpravo."
      onSubmit={submit}
      submitLabel="Vytvořit roli"
      submittingLabel="Vytvářím…"
    >
      <TextInput
        label="Název role"
        placeholder="např. Makléř"
        value={name}
        error={error}
        onChange={(event) => {
          setName(event.target.value);
          setError("");
        }}
      />
      <TextInput
        label="Popis"
        placeholder="nepovinné, např. Vidí byty a poptávky"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <SelectInput
        label="Začít s oprávněními role"
        value={copyOf}
        onChange={setCopyOf}
        options={roles
          // The admin role cannot be limited, so it is not a useful start.
          .filter((role) => role.id !== "admin")
          .map((role) => ({
            value: role.id,
            label: role.name,
            description: role.description,
          }))}
      />
    </FormDialog>
  );
}
