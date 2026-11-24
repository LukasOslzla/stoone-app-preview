"use client";

import { useState } from "react";
import Image from "next/image";
import { useSaveForm } from "@/components/buildings/useSaveForm";
import { DetailScaffold } from "@/components/detail/DetailScaffold";
import { SaveButton } from "@/components/detail/SaveButton";
import { PlanAreaEditor } from "@/components/plan/PlanAreaEditor";
import { PlanChecklist } from "@/components/plan/PlanChecklist";
import type { PlanItem } from "@/components/plan/types";
import { Card, CardHeader } from "@/components/ui/Card";
import { saveSectorHouses, sectorMarking } from "@/lib/sectors";
import { sectorScaffoldProps, type SectorContext } from "./sectorScaffold";

/** Sector detail, tab "Domy na obrázku": outline each house on the render. */
export function SectorHousesTab(context: SectorContext) {
  const { projectSlug, sector } = context;
  const [houses, setHouses] = useState<PlanItem[]>(sector.houses);
  // Start with the first house that still needs an outline.
  const [selectedId, setSelectedId] = useState<string | null>(
    () =>
      (sector.houses.find((house) => !house.area) ?? sector.houses[0])?.id ??
      null,
  );
  const { saving, saved, handleSubmit, markDirty } = useSaveForm(() =>
    saveSectorHouses(projectSlug, sector.slug, houses),
  );

  const selected = houses.find((house) => house.id === selectedId);

  function setArea(id: string, area: PlanItem["area"]) {
    setHouses((current) =>
      current.map((house) =>
        // A new outline gets its tag back in the middle.
        house.id === id ? { ...house, area, tag: undefined } : house,
      ),
    );
    markDirty();
  }

  return (
    <form onSubmit={handleSubmit}>
      <DetailScaffold
        {...sectorScaffoldProps(context, "/houses")}
        actions={<SaveButton saving={saving} saved={saved} />}
      >
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
          <Card className="flex min-w-0 flex-1 flex-col gap-3 p-6">
            <PlanAreaEditor
              shape="polygon"
              items={houses}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onAreaChange={setArea}
              aspectRatio={sector.image.width / sector.image.height}
              background={
                <Image
                  src={sector.image.src}
                  alt={`Vizualizace: ${sector.name}`}
                  fill
                  sizes="(min-width: 1280px) 60vw, 100vw"
                  className="object-contain"
                />
              }
              header={
                <CardHeader
                  title="Označte domy na obrázku"
                  description="Vyberte dům v seznamu vpravo a obkreslete ho myší."
                />
              }
            />
            {/* Not in the design: a way to remove an outline again. */}
            {selected?.area && (
              <button
                type="button"
                onClick={() => setArea(selected.id, null)}
                className="self-start rounded-md font-text text-[13px] leading-[1.4] font-semibold text-fg-2 transition-colors hover:text-red focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige"
              >
                Zrušit označení domu {selected.name}
              </button>
            )}
          </Card>

          <Card className="flex w-full flex-col gap-3 p-6 xl:w-[340px] xl:shrink-0">
            <CardHeader title="Domy v sektoru" />
            <PlanChecklist
              items={houses}
              selectedId={selectedId}
              onSelect={setSelectedId}
              summary={sectorMarking(houses).summary}
            />
          </Card>
        </div>
      </DetailScaffold>
    </form>
  );
}
