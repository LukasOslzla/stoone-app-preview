"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FlowHeader } from "@/components/app/FlowHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Dropzone } from "@/components/ui/Dropzone";
import { SelectInput, TextInput } from "@/components/ui/form/Field";
import { formatFileSize } from "@/lib/format";
import { unitStatuses, type UnitStatus } from "@/lib/unit-status";
import { createUnit, type NewUnitValues } from "@/lib/units";

const empty: NewUnitValues = {
  name: "",
  building: "A",
  floor: 1,
  layout: "2+kk",
  area: "",
  price: "",
  status: "free",
};

const toOptions = (values: string[]) =>
  values.map((value) => ({ value, label: value }));

const floorOptions = Array.from({ length: 8 }, (_, index) => ({
  value: String(index + 1),
  label: `${index + 1}. patro`,
}));

const statusOptions = (Object.keys(unitStatuses) as UnitStatus[]).map(
  (value) => ({ value, label: unitStatuses[value].label }),
);

/** Accepts "48,2" as well as "48.2" and "9 480 000". */
const toNumber = (text: string) =>
  Number(text.replace(/\s/g, "").replace(",", "."));

type Errors = Partial<Record<"name" | "area" | "price", string>>;

type NewUnitFormProps = {
  projectSlug: string;
  /** Building names offered in the "Budova" select. */
  buildings: string[];
};

/** "Nový byt": manual entry of one flat (projects without Realpad). */
export function NewUnitForm({ projectSlug, buildings }: NewUnitFormProps) {
  const router = useRouter();
  const list = `/projects/${projectSlug}/units`;
  const [values, setValues] = useState<NewUnitValues>({
    ...empty,
    building: buildings[0] ?? empty.building,
  });
  const [plan, setPlan] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [addAnother, setAddAnother] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedName, setSavedName] = useState<string | null>(null);

  function update<K extends keyof NewUnitValues>(
    key: K,
    value: NewUnitValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSavedName(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const next: Errors = {};
    if (!values.name.trim()) next.name = "Zadejte číslo bytu.";
    if (!(toNumber(values.area) > 0)) next.area = "Zadejte plochu v m².";
    if (!(toNumber(values.price) > 0)) next.price = "Zadejte cenu v Kč.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    await createUnit(projectSlug, values);
    setSaving(false);

    if (!addAnother) {
      router.push(list);
      return;
    }
    // Keep building, floor and layout – the next flat is usually similar.
    setSavedName(values.name.trim());
    setValues((current) => ({ ...current, name: "", area: "", price: "" }));
    setPlan(null);
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 px-8 pt-7 pb-8"
    >
      <FlowHeader
        breadcrumb={[{ label: "Byty", href: list }, { label: "Nový byt" }]}
        cancelHref={list}
        heading={{
          title: "Nový byt",
          description:
            "Vyplňte základní údaje. Půdorys a fotky můžete doplnit hned, nebo později.",
        }}
      />

      <Card className="flex w-full max-w-[720px] flex-col gap-[22px] p-6">
        <div className="grid grid-cols-1 gap-x-4 gap-y-[22px] sm:grid-cols-3">
          <TextInput
            label="Číslo bytu"
            name="name"
            autoFocus
            placeholder="např. B.105"
            value={values.name}
            error={errors.name}
            disabled={saving}
            onChange={(event) => update("name", event.target.value)}
          />
          <SelectInput
            label="Budova"
            name="building"
            options={toOptions(buildings)}
            value={values.building}
            disabled={saving}
            onChange={(event) => update("building", event.target.value)}
          />
          <SelectInput
            label="Patro"
            name="floor"
            options={floorOptions}
            value={String(values.floor)}
            disabled={saving}
            onChange={(event) => update("floor", Number(event.target.value))}
          />
          <SelectInput
            label="Dispozice"
            name="layout"
            options={toOptions(["1+kk", "1,5+kk", "2+kk", "3+kk", "4+kk"])}
            value={values.layout}
            disabled={saving}
            onChange={(event) => update("layout", event.target.value)}
          />
          <TextInput
            label="Plocha"
            name="area"
            inputMode="decimal"
            placeholder="např. 48,2"
            suffix="m²"
            value={values.area}
            error={errors.area}
            disabled={saving}
            onChange={(event) => update("area", event.target.value)}
          />
          <TextInput
            label="Cena včetně DPH"
            name="price"
            inputMode="numeric"
            placeholder="např. 9 480 000"
            suffix="Kč"
            value={values.price}
            error={errors.price}
            disabled={saving}
            onChange={(event) => update("price", event.target.value)}
          />
          <SelectInput
            label="Stav"
            name="status"
            options={statusOptions}
            value={values.status}
            disabled={saving}
            onChange={(event) =>
              update("status", event.target.value as UnitStatus)
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-text text-sm leading-[1.4] font-medium text-fg">
            Půdorys (nepovinné)
          </p>
          {plan ? (
            <div className="flex min-h-[84px] items-center gap-3 rounded-xl border border-line-soft bg-inset px-4 py-3 font-text text-[13px] leading-[1.4]">
              <span className="min-w-0 flex-1 truncate text-fg">
                {plan.name}
                <span className="text-fg-3">
                  {" "}
                  · {formatFileSize(plan.size)}
                </span>
              </span>
              <button
                type="button"
                onClick={() => setPlan(null)}
                className="rounded-md font-semibold text-fg-2 transition-colors hover:text-red focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige"
              >
                Odebrat
              </button>
            </div>
          ) : (
            <Dropzone
              layout="inline"
              title="Přetáhněte obrázek nebo PDF"
              accept="image/*,application/pdf"
              onFiles={([file]) => setPlan(file)}
            />
          )}
        </div>
      </Card>

      <div className="flex w-full max-w-[720px] flex-wrap items-center justify-between gap-4">
        <Checkbox
          label="Po uložení přidat další byt"
          checked={addAnother}
          onChange={(event) => setAddAnother(event.target.checked)}
        />
        <div className="flex items-center gap-2.5">
          <span
            role="status"
            className="font-text text-[13px] leading-[1.4] text-fg-3"
          >
            {savedName && `Byt ${savedName} uložen`}
          </span>
          <Button
            type="submit"
            size="action"
            loading={saving}
            loadingLabel="Ukládám…"
          >
            Uložit byt
          </Button>
        </div>
      </div>
    </form>
  );
}
