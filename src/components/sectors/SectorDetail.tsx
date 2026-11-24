"use client";

import { useState } from "react";
import { useSaveForm } from "@/components/buildings/useSaveForm";
import { BasicsCard } from "@/components/detail/BasicsCard";
import { DetailScaffold } from "@/components/detail/DetailScaffold";
import { SaveButton } from "@/components/detail/SaveButton";
import { TextInput } from "@/components/ui/form/Field";
import { TagsInput } from "@/components/ui/form/TagsInput";
import { saveSector, type SectorValues } from "@/lib/sectors";
import { sectorScaffoldProps, type SectorContext } from "./sectorScaffold";

/** Sector detail, tab "Základní údaje". */
export function SectorDetail(context: SectorContext) {
  const { projectSlug, sector } = context;
  const [values, setValues] = useState<SectorValues>({
    name: sector.name,
    houses: sector.houses.map((house) => house.name),
  });
  const { saving, saved, handleSubmit, markDirty } = useSaveForm(() =>
    saveSector(projectSlug, sector.slug, values),
  );

  function update<K extends keyof SectorValues>(
    key: K,
    value: SectorValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    markDirty();
  }

  return (
    <form onSubmit={handleSubmit}>
      <DetailScaffold
        {...sectorScaffoldProps(context)}
        actions={<SaveButton saving={saving} saved={saved} />}
      >
        <BasicsCard webUrl={sector.webUrl}>
          <TextInput
            label="Název sektoru"
            name="name"
            required
            value={values.name}
            disabled={saving}
            onChange={(event) => update("name", event.target.value)}
          />
          <TagsInput
            label="Domy v sektoru"
            addLabel="Přidat dům"
            values={values.houses}
            disabled={saving}
            normalize={(value) => value.trim().toUpperCase()}
            onChange={(houses) => update("houses", houses)}
          />
        </BasicsCard>
      </DetailScaffold>
    </form>
  );
}
