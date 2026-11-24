"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { FlowHeader } from "@/components/app/FlowHeader";
import { PlanAreaEditor } from "@/components/plan/PlanAreaEditor";
import { PlanChecklist } from "@/components/plan/PlanChecklist";
import type { PlanArea } from "@/components/plan/types";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { CheckCard } from "@/components/ui/CheckCard";
import { Dropzone } from "@/components/ui/Dropzone";
import { FieldShell, TextInput } from "@/components/ui/form/Field";
import { Stepper } from "@/components/ui/Stepper";
import { formatFileSize, outOf } from "@/lib/format";
import {
  createSector,
  sectorMarking,
  type UnassignedHouse,
} from "@/lib/sectors";

const steps = ["Název a obrázek", "Domy v sektoru", "Označení na obrázku"];

const headings = [
  {
    title: "Jak se sektor jmenuje a jak vypadá?",
    description:
      "Stačí název a jeden obrázek skupiny domů. Vše můžete později změnit.",
  },
  {
    title: "Které domy do sektoru patří?",
    description:
      "Klikněte na domy, které jsou na obrázku. Nabízíme jen ty, které ještě nejsou v žádném sektoru.",
  },
  {
    title: "Kde jsou domy na obrázku?",
    description:
      "Vyberte dům vpravo a obkreslete ho na obrázku. Zájemce pak na web klikne přímo na dům.",
  },
];

/** PREVIEW ONLY — lets reviewers click through without a file at hand. */
const sampleImage = {
  name: "ukázkový obrázek",
  url: "/images/sectors/sector3.webp",
  width: 354,
  height: 211,
};

type SectorImage = {
  /** `null` for the sample image. */
  file: File | null;
  name: string;
  url: string;
  width: number;
  height: number;
};

function readImage(file: File): Promise<SectorImage> {
  const url = URL.createObjectURL(file);
  return new Promise((resolve, reject) => {
    const probe = new Image();
    probe.onload = () =>
      resolve({
        file,
        name: file.name,
        url,
        width: probe.naturalWidth,
        height: probe.naturalHeight,
      });
    probe.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Not an image"));
    };
    probe.src = url;
  });
}

type NewSectorWizardProps = {
  projectSlug: string;
  /** Pre-filled name, e.g. "Sektor 7". */
  suggestedName: string;
  /** Houses that are not in any sector yet. */
  availableHouses: UnassignedHouse[];
};

/** Three-step creation of a sector: name + image → houses → outlines. */
export function NewSectorWizard({
  projectSlug,
  suggestedName,
  availableHouses,
}: NewSectorWizardProps) {
  const router = useRouter();
  const list = `/projects/${projectSlug}/sectors`;

  const [step, setStep] = useState(0);
  const [name, setName] = useState(suggestedName);
  const [image, setImage] = useState<SectorImage | null>(null);
  const [imageError, setImageError] = useState("");
  const [pickedIds, setPickedIds] = useState<string[]>([]);
  const [areas, setAreas] = useState<Record<string, PlanArea>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Free the preview of a replaced or abandoned upload.
  useEffect(() => {
    if (!image?.file) return;
    return () => URL.revokeObjectURL(image.url);
  }, [image]);

  const houses = availableHouses
    .filter((house) => pickedIds.includes(house.id))
    .map((house) => ({
      id: house.id,
      name: house.name,
      area: areas[house.id] ?? null,
    }));
  const selected = houses.find((house) => house.id === selectedId);
  const marking = sectorMarking(houses);

  async function handleFile(file: File) {
    try {
      setImage(await readImage(file));
      setImageError("");
      // Outlines drawn on the previous image no longer fit.
      setAreas({});
    } catch {
      setImageError("Soubor se nepodařilo načíst jako obrázek.");
    }
  }

  function toggleHouse(id: string, picked: boolean) {
    setPickedIds((current) =>
      picked ? [...current, id] : current.filter((item) => item !== id),
    );
  }

  function goTo(next: number) {
    if (next === 2) {
      // Start with the first house that still needs an outline.
      setSelectedId((houses.find((house) => !house.area) ?? houses[0]).id);
    }
    setStep(next);
  }

  function setArea(id: string, area: PlanArea) {
    setAreas((current) => ({ ...current, [id]: area }));
    // Continue with the next house that is not outlined yet.
    const next = houses.find((house) => house.id !== id && !house.area);
    if (next) setSelectedId(next.id);
  }

  async function handleFinish() {
    setSaving(true);
    await createSector(projectSlug, {
      name: name.trim(),
      image: image?.file ?? null,
      houses,
    });
    router.push(list);
  }

  const canContinue =
    step === 0
      ? name.trim() !== "" && image !== null
      : step === 1
        ? pickedIds.length > 0
        : true;

  return (
    <div className="flex flex-col gap-6 px-8 pt-7 pb-8">
      <FlowHeader
        breadcrumb={[
          { label: "Sektory", href: list },
          { label: "Nový sektor" },
        ]}
        cancelHref={list}
        stepper={<Stepper steps={steps} current={step} />}
        heading={headings[step]}
      />

      {step === 0 && (
        <Card className="flex w-full max-w-[720px] flex-col gap-[22px] p-6">
          <TextInput
            label="Název sektoru"
            name="name"
            required
            value={name}
            hint={
              name === suggestedName
                ? "Navrhli jsme další číslo v řadě."
                : undefined
            }
            onChange={(event) => setName(event.target.value)}
          />

          <FieldShell
            label="Obrázek sektoru"
            htmlFor="sector-image"
            error={imageError}
            hint="Stejný pohled jako u ostatních sektorů – vizualizace skupiny domů shora."
          >
            {image ? (
              <div className="flex flex-col gap-3 rounded-[14px] border border-line-soft bg-inset p-3">
                {/* eslint-disable-next-line @next/next/no-img-element -- local preview of the picked file */}
                <img
                  src={image.url}
                  alt="Náhled obrázku sektoru"
                  className="h-[220px] w-full rounded-lg object-contain"
                />
                <div className="flex flex-wrap items-center justify-between gap-2 px-1 font-text text-[13px] leading-[1.4]">
                  <span className="min-w-0 truncate text-fg-2">
                    {image.name}
                    {image.file && ` · ${formatFileSize(image.file.size)}`}
                  </span>
                  <button
                    id="sector-image"
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setAreas({});
                    }}
                    className="rounded-md font-semibold text-beige transition-colors hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige"
                  >
                    Vybrat jiný obrázek
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Dropzone
                  title="Přetáhněte sem obrázek sektoru"
                  accept="image/*"
                  className="h-[220px]"
                  onFiles={([file]) => handleFile(file)}
                />
                <button
                  id="sector-image"
                  type="button"
                  onClick={() => setImage({ ...sampleImage, file: null })}
                  className="self-start rounded-md font-text text-[13px] leading-[1.4] font-semibold text-fg-2 transition-colors hover:text-beige focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige"
                >
                  Nemáte obrázek po ruce? Použít ukázkový (jen v preview)
                </button>
              </>
            )}
          </FieldShell>
        </Card>
      )}

      {step === 1 && (
        <Card className="flex w-full max-w-[720px] flex-col gap-4 p-6">
          <CardHeader
            title="Nezařazené domy"
            action={
              <p className="font-text text-[13px] leading-[1.4] font-semibold text-beige">
                Vybráno {pickedIds.length} {outOf(availableHouses.length)}
              </p>
            }
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {availableHouses.map((house) => (
              <CheckCard
                key={house.id}
                title={house.name}
                description={house.description}
                checked={pickedIds.includes(house.id)}
                onChange={(picked) => toggleHouse(house.id, picked)}
              />
            ))}
          </div>
        </Card>
      )}

      {step === 2 && image && (
        <div className="flex w-full max-w-[1128px] flex-col gap-5 xl:flex-row xl:items-start">
          <Card className="flex min-w-0 flex-1 flex-col gap-3 p-4">
            <PlanAreaEditor
              shape="polygon"
              zoomable={false}
              items={houses}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onAreaChange={setArea}
              aspectRatio={image.width / image.height}
              hint={
                selected &&
                `Klikáním obkreslete dům ${selected.name}. Dvojklikem tvar uzavřete.`
              }
              background={
                // eslint-disable-next-line @next/next/no-img-element -- local preview of the picked file
                <img
                  src={image.url}
                  alt={`Obrázek sektoru ${name}`}
                  className="size-full object-contain"
                />
              }
            />
          </Card>

          <Card className="flex w-full flex-col gap-3 p-6 xl:w-[340px] xl:shrink-0">
            <CardHeader title="Domy v sektoru" />
            <PlanChecklist
              items={houses}
              selectedId={selectedId}
              onSelect={setSelectedId}
              summary={marking.summary}
            />
            <p className="border-t border-line-soft pt-2.5 font-text text-xs leading-[1.45] text-fg-3">
              Označení můžete dokončit i později – sektor se uloží jako
              rozpracovaný.
            </p>
          </Card>
        </div>
      )}

      <div
        className={`flex w-full flex-wrap items-center justify-between gap-3 ${step === 2 ? "max-w-[1128px]" : "max-w-[720px]"}`}
      >
        {step > 0 ? (
          <Button
            variant="outline"
            size="action"
            disabled={saving}
            onClick={() => setStep(step - 1)}
          >
            <ArrowLeftIcon weight="fill" className="size-3.5 text-fg-2" />
            Zpět
          </Button>
        ) : (
          <span />
        )}
        {step < 2 ? (
          <Button
            size="action"
            disabled={!canContinue}
            onClick={() => goTo(step + 1)}
          >
            Pokračovat
            <ArrowRightIcon weight="fill" className="size-3.5" />
          </Button>
        ) : (
          <Button
            size="action"
            loading={saving}
            loadingLabel="Ukládám…"
            onClick={handleFinish}
          >
            Dokončit a zveřejnit
            <ArrowRightIcon weight="fill" className="size-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
