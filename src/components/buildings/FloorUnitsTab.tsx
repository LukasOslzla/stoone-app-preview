"use client";

import { useState } from "react";
import { DetailScaffold } from "@/components/detail/DetailScaffold";
import { SaveButton } from "@/components/detail/SaveButton";
import { PlanAreaEditor } from "@/components/plan/PlanAreaEditor";
import { PlanChecklist } from "@/components/plan/PlanChecklist";
import type { PlanItem } from "@/components/plan/types";
import { Card, CardHeader } from "@/components/ui/Card";
import { saleStatuses, saveFloorFiles, type Floor } from "@/lib/buildings";
import { floorScaffoldProps } from "./floorScaffold";
import { useSaveForm } from "./useSaveForm";

type FloorUnitsTabProps = { projectSlug: string; floor: Floor };

/** Floor detail, tab "Byty na půdorysu": mark each unit on the floor plan. */
export function FloorUnitsTab({ projectSlug, floor }: FloorUnitsTabProps) {
  const [units, setUnits] = useState<PlanItem[]>(floor.units);
  // Start with the first unit that still needs marking.
  const [selectedId, setSelectedId] = useState<string | null>(
    () => floor.units.find((unit) => !unit.area)?.id ?? null,
  );
  const { saving, saved, handleSubmit, markDirty } = useSaveForm(() =>
    saveFloorFiles(projectSlug, floor.slug),
  );

  const selected = units.find((unit) => unit.id === selectedId);

  function setArea(id: string, area: PlanItem["area"]) {
    setUnits((current) =>
      current.map((unit) => (unit.id === id ? { ...unit, area } : unit)),
    );
    markDirty();
  }

  return (
    <form onSubmit={handleSubmit}>
      <DetailScaffold
        {...floorScaffoldProps(projectSlug, floor)}
        status={saleStatuses[floor.saleStatus].pill}
        actions={<SaveButton saving={saving} saved={saved} />}
      >
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
          <Card className="flex min-w-0 flex-1 flex-col gap-3 p-6">
            <PlanAreaEditor
              items={units}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onAreaChange={setArea}
              background={<FloorPlanPlaceholder />}
              header={
                <CardHeader
                  title="Označte byty na půdorysu"
                  description="Vyberte byt v seznamu vpravo a obkreslete ho myší."
                />
              }
            />
            {/* Not in the design: a way to remove an area again. */}
            {selected?.area && (
              <button
                type="button"
                onClick={() => setArea(selected.id, null)}
                className="self-start rounded-md font-text text-[13px] leading-[1.4] font-semibold text-fg-2 transition-colors hover:text-red focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige"
              >
                Zrušit označení bytu {selected.name}
              </button>
            )}
          </Card>

          <Card className="flex w-full flex-col gap-3 p-6 xl:w-[340px] xl:shrink-0">
            <CardHeader title="Byty na patře" />
            <PlanChecklist
              items={units}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </Card>
        </div>
      </DetailScaffold>
    </form>
  );
}

/**
 * Stand-in drawing of a floor (outline + corridor) used until a real plan
 * image is uploaded on the "Půdorys a dokumenty" tab.
 */
function FloorPlanPlaceholder() {
  return (
    <>
      <div className="absolute top-[9.52%] left-[6.7%] h-[80.95%] w-[86.59%] rounded border-2 border-[#D2D5C54D]" />
      <div className="absolute top-[44.76%] left-[6.7%] flex h-[10.48%] w-[86.59%] items-center justify-center border border-[#D2D5C526] bg-[#FFFFFF08]">
        <span className="font-text text-[11px] leading-[1.4] text-fg-3">
          Chodba · výtah · schodiště
        </span>
      </div>
    </>
  );
}
