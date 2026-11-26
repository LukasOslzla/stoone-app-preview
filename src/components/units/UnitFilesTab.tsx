"use client";

import { useState } from "react";
import { useSaveForm } from "@/components/buildings/useSaveForm";
import { DetailScaffold } from "@/components/detail/DetailScaffold";
import { SaveButton } from "@/components/detail/SaveButton";
import { Card, CardHeader } from "@/components/ui/Card";
import { FileRows, type ManagedFile } from "@/components/ui/FileRows";
import { PrevNext } from "@/components/ui/PrevNext";
import { unitStatuses } from "@/lib/unit-status";
import { saveUnit, type UnitDetail } from "@/lib/units";
import { unitScaffoldProps } from "./unitScaffold";

type UnitFilesTabProps = {
  projectSlug: string;
  unit: UnitDetail;
  realpad: boolean;
};

/** State + handlers of one editable file list. */
function useFiles(initial: ManagedFile[], onChange: () => void) {
  const [files, setFiles] = useState(initial);

  return {
    files,
    onToggleVisible: (id: string) => {
      setFiles((current) =>
        current.map((file) =>
          file.id === id ? { ...file, visible: !file.visible } : file,
        ),
      );
      onChange();
    },
    onRemove: (id: string) => {
      setFiles((current) => current.filter((file) => file.id !== id));
      onChange();
    },
    onAdd: (added: File[]) => {
      setFiles((current) => [
        ...current,
        ...added.map((file) => ({
          id: crypto.randomUUID(),
          name: file.name,
          sizeBytes: file.size,
          source: "own" as const,
          visible: true,
        })),
      ]);
      onChange();
    },
  };
}

/** Unit detail, tab "Půdorysy a dokumenty". */
export function UnitFilesTab({
  projectSlug,
  unit,
  realpad,
}: UnitFilesTabProps) {
  const { saving, saved, handleSubmit, markDirty } = useSaveForm(() =>
    saveUnit(projectSlug, unit.id, {}),
  );
  const plans = useFiles(unit.floorPlans, markDirty);
  const documents = useFiles(unit.documents, markDirty);
  const base = `/projects/${projectSlug}/units`;

  return (
    <form onSubmit={handleSubmit}>
      <DetailScaffold
        {...unitScaffoldProps(projectSlug, unit, realpad)}
        status={unitStatuses[unit.status]}
        titleExtra={
          <PrevNext
            prevLabel="Předchozí byt"
            nextLabel="Další byt"
            prevHref={unit.prevId && `${base}/${unit.prevId}/files`}
            nextHref={unit.nextId && `${base}/${unit.nextId}/files`}
          />
        }
        actions={<SaveButton saving={saving} saved={saved} />}
      >
        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2">
          <Card className="flex min-w-0 flex-col gap-2 p-6">
            <CardHeader
              title="Půdorysy"
              description={
                realpad
                  ? "Načítají se z Realpadu a zobrazují se u bytu na webu"
                  : "Zobrazují se u bytu na webu"
              }
            />
            <FileRows
              {...plans}
              // With Realpad the floor plans are synced, not uploaded here.
              onAdd={realpad ? undefined : plans.onAdd}
              addLabel="Přidat půdorys"
              accept="image/*,application/pdf"
              empty="Byt zatím nemá žádný půdorys."
            />
          </Card>

          <Card className="flex min-w-0 flex-col gap-2 p-6">
            <CardHeader
              title="Dokumenty ke stažení"
              description="Karta bytu, standardy a další podklady"
            />
            <FileRows {...documents} empty="Byt zatím nemá žádné dokumenty." />
          </Card>
        </div>
      </DetailScaffold>
    </form>
  );
}
