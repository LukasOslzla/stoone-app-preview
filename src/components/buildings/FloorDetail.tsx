"use client";

import { useState } from "react";
import { BasicsCard } from "@/components/detail/BasicsCard";
import { DetailScaffold } from "@/components/detail/DetailScaffold";
import { SaveButton } from "@/components/detail/SaveButton";
import { SelectInput, TextInput } from "@/components/ui/form/Field";
import {
  saleStatusOptions,
  saleStatuses,
  saveFloor,
  type Floor,
  type FloorValues,
  type SaleStatus,
} from "@/lib/buildings";
import { floorScaffoldProps } from "./floorScaffold";
import { useSaveForm } from "./useSaveForm";

type FloorDetailProps = { projectSlug: string; floor: Floor };

/** Floor detail, tab "Základní údaje". */
export function FloorDetail({ projectSlug, floor }: FloorDetailProps) {
  const [values, setValues] = useState<FloorValues>({
    name: floor.name,
    saleStatus: floor.saleStatus,
  });
  const { saving, saved, handleSubmit, markDirty } = useSaveForm(() =>
    saveFloor(projectSlug, floor.slug, values),
  );

  function update<K extends keyof FloorValues>(key: K, value: FloorValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    markDirty();
  }

  return (
    <form onSubmit={handleSubmit}>
      <DetailScaffold
        {...floorScaffoldProps(projectSlug, floor)}
        status={saleStatuses[values.saleStatus].pill}
        actions={<SaveButton saving={saving} saved={saved} />}
      >
        <BasicsCard webUrl={floor.webUrl}>
          <TextInput
            label="Název patra"
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
        </BasicsCard>
      </DetailScaffold>
    </form>
  );
}
