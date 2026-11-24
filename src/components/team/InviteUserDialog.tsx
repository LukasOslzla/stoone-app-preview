"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { CheckCard } from "@/components/ui/CheckCard";
import { Checkbox } from "@/components/ui/Checkbox";
import { TextInput } from "@/components/ui/form/Field";
import { Modal } from "@/components/ui/Modal";
import { inviteUser, roles, type RoleId, type TeamUser } from "@/lib/team";
import { roleIcons } from "./RoleChip";

type InviteUserDialogProps = {
  open: boolean;
  onClose: () => void;
  /** Called with the pending user once the invitation is sent. */
  onInvited: (user: TeamUser) => void;
  projects: { slug: string; name: string }[];
  /** Project pre-checked in "Přístup k projektům". */
  currentProjectSlug: string;
};

/** "Pozvat uživatele": e-mail, role and the projects the user may open. */
export function InviteUserDialog({
  open,
  onClose,
  onInvited,
  projects,
  currentProjectSlug,
}: InviteUserDialogProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<RoleId>("editor");
  const [picked, setPicked] = useState<string[]>([currentProjectSlug]);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Zadejte e-mail ve tvaru jmeno@firma.cz.");
      return;
    }
    setSending(true);
    const user = await inviteUser({ email, name, role, projects: picked });
    setSending(false);
    setEmail("");
    setName("");
    onInvited(user);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Pozvat uživatele"
      description="Pošleme e-mail s odkazem, přes který si nastaví heslo."
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <div className="flex flex-col gap-3.5 sm:flex-row">
          <TextInput
            label="E-mail"
            name="email"
            type="email"
            autoComplete="off"
            placeholder="jmeno@firma.cz"
            value={email}
            error={error}
            disabled={sending}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
            }}
          />
          <TextInput
            label="Jméno"
            name="name"
            autoComplete="off"
            placeholder="nepovinné"
            value={name}
            disabled={sending}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="pb-2 font-text text-sm leading-[1.4] font-medium text-fg">
            Role
          </legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[...roles].reverse().map((item) => {
              const IconComponent = roleIcons[item.id];
              return (
                <CheckCard
                  key={item.id}
                  type="radio"
                  name="role"
                  title={item.name}
                  description={item.inviteDescription}
                  icon={<IconComponent weight="fill" className="size-4" />}
                  checked={role === item.id}
                  disabled={sending}
                  onChange={() => setRole(item.id)}
                />
              );
            })}
          </div>
        </fieldset>

        <fieldset className="flex flex-col">
          <legend className="pb-2.5 font-text text-sm leading-[1.4] font-medium text-fg">
            Přístup k projektům
          </legend>
          <div className="flex flex-wrap gap-x-[18px] gap-y-2">
            {projects.map((project) => (
              <Checkbox
                key={project.slug}
                label={project.name}
                checked={picked.includes(project.slug)}
                disabled={sending}
                onChange={(event) =>
                  setPicked((current) =>
                    event.target.checked
                      ? [...current, project.slug]
                      : current.filter((slug) => slug !== project.slug),
                  )
                }
              />
            ))}
          </div>
        </fieldset>

        <div className="flex flex-wrap justify-end gap-2.5 pt-1">
          <Button
            variant="outline"
            size="md"
            disabled={sending}
            onClick={onClose}
          >
            Zrušit
          </Button>
          <Button
            type="submit"
            size="md"
            loading={sending}
            loadingLabel="Odesílám…"
            disabled={picked.length === 0}
          >
            Odeslat pozvánku
          </Button>
        </div>
      </form>
    </Modal>
  );
}
