"use client";

import { useState } from "react";
import { BasicsCard } from "@/components/detail/BasicsCard";
import { DetailScaffold } from "@/components/detail/DetailScaffold";
import { SaveButton } from "@/components/detail/SaveButton";
import { SelectInput, TextArea, TextInput } from "@/components/ui/form/Field";
import {
  buildingSummary,
  saleStatusOptions,
  saleStatuses,
  saveBuilding,
  type Building,
  type BuildingValues,
  type SaleStatus,
} from "@/lib/buildings";
import { useSaveForm } from "./useSaveForm";

type BuildingDetailProps = { projectSlug: string; building: Building };

/** Building detail, tab "Základní údaje". */
export function BuildingDetail({ projectSlug, building }: BuildingDetailProps) {
  const base = `/projects/${projectSlug}/buildings`;
  const [values, setValues] = useState<BuildingValues>({
    name: building.name,
    saleStatus: building.saleStatus,
    description: building.description,
  });
  const { saving, saved, handleSubmit, markDirty } = useSaveForm(() =>
    saveBuilding(projectSlug, building.slug, values),
  );

  function update<K extends keyof BuildingValues>(
    key: K,
    value: BuildingValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    markDirty();
  }

  return (
    <form onSubmit={handleSubmit}>
      <DetailScaffold
        breadcrumb={[{ label: "Budovy", href: base }, { label: building.name }]}
        title={building.name}
        status={saleStatuses[values.saleStatus].pill}
        description={buildingSummary(building)}
        actions={<SaveButton saving={saving} saved={saved} />}
        tabs={[
          { label: "Základní údaje", href: `${base}/${building.slug}` },
          { label: "Dokumenty a plány" },
          { label: "Interaktivní ceník" },
        ]}
      >
        <BasicsCard webUrl={building.webUrl}>
          <TextInput
            label="Název budovy"
            name="name"
            required
            value={values.name}
            disabled={saving}
            onChange={(event) => update("name", event.target.value)}
          />
          <SelectInput
            label="Stav prodeje"
            name="saleStatus"
            options={saleStatusOptions}
            value={values.saleStatus}
            disabled={saving}
            onChange={(value) => update("saleStatus", value as SaleStatus)}
          />
          <TextArea
            label="Krátký popis"
            name="description"
            placeholder="Pár vět o budově, které uvidí zájemci na webu."
            value={values.description}
            disabled={saving}
            onChange={(event) => update("description", event.target.value)}
          />
        </BasicsCard>
      </DetailScaffold>
    </form>
  );
}
