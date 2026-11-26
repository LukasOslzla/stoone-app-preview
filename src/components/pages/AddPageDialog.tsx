"use client";

import { useState } from "react";
import { FormDialog } from "@/components/ui/FormDialog";
import { SelectInput, TextInput } from "@/components/ui/form/Field";
import { createSitePage, slugifyPath, type SitePage } from "@/lib/pages";

type AddPageDialogProps = {
  open: boolean;
  onClose: () => void;
  projectSlug: string;
  /** Public domain, shown in front of the address. */
  domain: string;
  /** Existing pages: a new one may start as a copy, and paths must differ. */
  pages: SitePage[];
  onCreated: (page: SitePage) => void;
};

/** "Přidat stránku": name, address and what the page starts from. */
export function AddPageDialog({
  open,
  onClose,
  projectSlug,
  domain,
  pages,
  onCreated,
}: AddPageDialogProps) {
  const [name, setName] = useState("");
  // Until the user edits the address it follows the name.
  const [path, setPath] = useState<string | null>(null);
  const [template, setTemplate] = useState("empty");
  const [errors, setErrors] = useState<{ name?: string; path?: string }>({});

  const address = path ?? slugifyPath(name);

  function reset() {
    setName("");
    setPath(null);
    setTemplate("empty");
    setErrors({});
  }

  async function submit() {
    const fullPath = `/${address}`;
    const found: typeof errors = {};
    if (!name.trim()) found.name = "Zadejte název stránky.";
    if (!address) found.path = "Zadejte adresu stránky.";
    else if (pages.some((page) => page.path === fullPath)) {
      found.path = "Tuhle adresu už má jiná stránka.";
    }
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return false;
    }

    const page = await createSitePage(projectSlug, {
      name: name.trim(),
      path: fullPath,
      copyOf: template === "empty" ? null : template,
    });
    reset();
    onCreated(page);
  }

  return (
    <FormDialog
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title="Přidat stránku"
      description="Stránka vznikne jako koncept. Na webu se ukáže, až ji zveřejníte."
      onSubmit={submit}
      submitLabel="Vytvořit stránku"
      submittingLabel="Vytvářím…"
    >
      <TextInput
        label="Název stránky"
        placeholder="např. Standardy"
        value={name}
        error={errors.name}
        onChange={(event) => {
          setName(event.target.value);
          setErrors({});
        }}
      />
      <TextInput
        label="Adresa (URL)"
        hint={`${domain}/${address || "…"}`}
        value={address}
        error={errors.path}
        onChange={(event) => {
          setPath(slugifyPath(event.target.value, true));
          setErrors({});
        }}
      />
      <SelectInput
        label="Začít z"
        value={template}
        onChange={setTemplate}
        options={[
          {
            value: "empty",
            label: "Prázdná stránka",
            description: "Sekce přidáte v editoru",
          },
          ...pages
            .filter((page) => page.status === "published")
            .map((page) => ({
              value: page.id,
              label: `Kopie: ${page.name}`,
              description: page.path,
            })),
        ]}
      />
    </FormDialog>
  );
}
