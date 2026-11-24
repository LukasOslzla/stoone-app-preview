"use client";

import { useEffect, useState } from "react";
import { DetailScaffold } from "@/components/detail/DetailScaffold";
import { SaveButton } from "@/components/detail/SaveButton";
import { Card, CardHeader } from "@/components/ui/Card";
import { Dropzone } from "@/components/ui/Dropzone";
import { FileRows, type ManagedFile } from "@/components/ui/FileRows";
import { saleStatuses, saveFloorFiles, type Floor } from "@/lib/buildings";
import { formatFileSize } from "@/lib/format";
import { floorScaffoldProps } from "./floorScaffold";
import { useSaveForm } from "./useSaveForm";

type FloorPlanTabProps = { projectSlug: string; floor: Floor };

/** Floor detail, tab "Půdorys a dokumenty". */
export function FloorPlanTab({ projectSlug, floor }: FloorPlanTabProps) {
  const [plan, setPlan] = useState<{ file: File; url: string } | null>(null);
  const [documents, setDocuments] = useState<ManagedFile[]>(floor.documents);
  const { saving, saved, handleSubmit, markDirty } = useSaveForm(() =>
    saveFloorFiles(projectSlug, floor.slug),
  );

  // Release the local preview URL when the image changes or the tab unmounts.
  useEffect(() => {
    if (!plan) return;
    return () => URL.revokeObjectURL(plan.url);
  }, [plan]);

  function addDocuments(files: File[]) {
    setDocuments((current) => [
      ...current,
      ...files.map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        sizeBytes: file.size,
        source: "own" as const,
        visible: true,
      })),
    ]);
    markDirty();
  }

  return (
    <form onSubmit={handleSubmit}>
      <DetailScaffold
        {...floorScaffoldProps(projectSlug, floor)}
        status={saleStatuses[floor.saleStatus].pill}
        actions={<SaveButton saving={saving} saved={saved} />}
      >
        <Card className="flex w-full max-w-[720px] flex-col gap-5 p-6">
          <CardHeader
            title="Půdorys patra"
            description="Obrázek, na kterém zájemci na webu vybírají byt"
          />

          {plan ? (
            // Not in the design: preview of the picked image with its actions.
            <div className="flex flex-col gap-3">
              <div className="flex h-[200px] items-center justify-center overflow-hidden rounded-[14px] border border-line-soft bg-inset">
                {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
                <img
                  src={plan.url}
                  alt="Náhled půdorysu"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-text text-[13px] leading-[1.4]">
                <span className="min-w-0 flex-1 truncate text-fg-2">
                  {plan.file.name} · {formatFileSize(plan.file.size)}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setPlan(null);
                    markDirty();
                  }}
                  className="rounded-md font-semibold text-fg-2 transition-colors hover:text-red focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige"
                >
                  Odebrat obrázek
                </button>
              </div>
            </div>
          ) : (
            <Dropzone
              title="Přetáhněte sem obrázek půdorysu"
              accept="image/*"
              onFiles={([file]) => {
                setPlan({ file, url: URL.createObjectURL(file) });
                markDirty();
              }}
            />
          )}
        </Card>

        <Card className="flex w-full max-w-[720px] flex-col gap-3 p-6">
          <CardHeader
            title="Dokumenty ke stažení"
            description="Soubory, které si zájemce může stáhnout u tohoto patra"
          />
          <FileRows
            variant="simple"
            addLabel="Přidat dokument"
            files={documents}
            onAdd={addDocuments}
            onRemove={(id) => {
              setDocuments((current) =>
                current.filter((file) => file.id !== id),
              );
              markDirty();
            }}
          />
        </Card>
      </DetailScaffold>
    </form>
  );
}
