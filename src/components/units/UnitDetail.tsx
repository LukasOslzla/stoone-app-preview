"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircleIcon,
  LockIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { useSaveForm } from "@/components/buildings/useSaveForm";
import { DetailScaffold } from "@/components/detail/DetailScaffold";
import { SaveButton } from "@/components/detail/SaveButton";
import { Card, CardHeader } from "@/components/ui/Card";
import { DetailRows, type DetailRow } from "@/components/ui/DetailRows";
import { PrevNext } from "@/components/ui/PrevNext";
import { TextInput } from "@/components/ui/form/Field";
import { formatPrice, plural } from "@/lib/format";
import { unitStatuses } from "@/lib/unit-status";
import { formatArea, saveUnit, type UnitDetail as Unit } from "@/lib/units";
import { unitScaffoldProps } from "./unitScaffold";

type UnitDetailProps = {
  projectSlug: string;
  unit: Unit;
  /** Whether prices and statuses are synced from Realpad (read-only here). */
  realpad: boolean;
};

const files = (count: number) =>
  count === 0
    ? "Zatím žádné"
    : `${count} ${plural(count, ["soubor", "soubory", "souborů"])}`;

/** Unit detail, tab "Přehled". */
export function UnitDetail({ projectSlug, unit, realpad }: UnitDetailProps) {
  const [completion, setCompletion] = useState(unit.completion);
  const { saving, saved, handleSubmit, markDirty } = useSaveForm(() =>
    saveUnit(projectSlug, unit.id, { completion }),
  );
  const scaffold = unitScaffoldProps(projectSlug, unit, realpad);
  const base = `/projects/${projectSlug}/units`;

  const rows: DetailRow[] = [
    { label: "Dispozice", value: unit.layout },
    { label: "Plocha bytu", value: formatArea(unit.area, true) },
    ...(unit.terrace
      ? [{ label: "Terasa", value: formatArea(unit.terrace, true) }]
      : []),
    ...(unit.frontGarden
      ? [{ label: "Předzahrádka", value: formatArea(unit.frontGarden, true) }]
      : []),
    ...(unit.priceWithEquipment
      ? [
          {
            label: "Cena s vybavením",
            note: unit.equipmentNote,
            value: formatPrice(unit.priceWithEquipment),
          },
        ]
      : []),
  ];

  // What the admin fills in on the other tabs. `href` comes with those tabs.
  const todo: { title: string; detail: string; done: boolean; href?: string }[] =
    [
      {
        title: "Půdorysy",
        detail: files(unit.floorPlans.length),
        done: unit.floorPlans.length > 0,
        href: `${base}/${unit.id}/files`,
      },
      {
        title: "Dokumenty",
        detail: files(unit.documents.length),
        done: unit.documents.length > 0,
        href: `${base}/${unit.id}/files`,
      },
      {
        title: "Vyhledávače (SEO)",
        detail:
          unit.seo.title === unit.seo.autoTitle &&
          unit.seo.description === unit.seo.autoDescription
            ? "Vyplněno automaticky"
            : "Upraveno ručně",
        done: true,
        href: `${base}/${unit.id}/seo`,
      },
    ];

  return (
    <form onSubmit={handleSubmit}>
      <DetailScaffold
        {...scaffold}
        status={unitStatuses[unit.status]}
        titleExtra={
          <PrevNext
            prevLabel="Předchozí byt"
            nextLabel="Další byt"
            prevHref={unit.prevId && `${base}/${unit.prevId}`}
            nextHref={unit.nextId && `${base}/${unit.nextId}`}
          />
        }
        actions={<SaveButton saving={saving} saved={saved} />}
      >
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
          <Card className="flex min-w-0 flex-1 flex-col gap-1.5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5">
              <h2 className="font-title text-lg leading-[1.25] font-medium text-fg">
                Údaje o bytě
              </h2>
              {realpad && (
                <p className="flex items-center gap-1.5 font-text text-xs leading-[1.4] text-fg-3">
                  <LockIcon weight="fill" className="size-[13px]" />
                  Mění se v Realpadu
                </p>
              )}
            </div>

            <p className="flex flex-wrap items-end gap-2.5 pt-1 pb-3.5">
              <span className="font-title text-[34px] leading-none font-medium tracking-[-0.5px] text-fg">
                {formatPrice(unit.price)}
              </span>
              <span className="pb-1 font-text text-[13px] leading-[1.4] text-fg-3">
                včetně DPH
              </span>
            </p>

            <DetailRows rows={rows} />
          </Card>

          <Card className="flex w-full flex-col gap-4 p-6 xl:w-[380px] xl:shrink-0">
            <CardHeader
              title="Co doplňujete vy"
              description={
                realpad
                  ? "Půdorysy a dokumenty chodí z Realpadu. Zbytek můžete doladit."
                  : "Doplňte, co zájemci uvidí na webu."
              }
            />

            {todo.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3 rounded-xl border border-line-soft bg-inset px-3.5 py-3"
              >
                {item.done ? (
                  <CheckCircleIcon
                    weight="fill"
                    className="size-[17px] shrink-0 text-fg-3"
                  />
                ) : (
                  <WarningCircleIcon
                    weight="fill"
                    className="size-[17px] shrink-0 text-beige"
                  />
                )}
                <div className="flex min-w-0 flex-1 flex-col gap-px">
                  <span className="font-text text-sm leading-[1.4] font-semibold text-fg">
                    {item.title}
                  </span>
                  <span className="font-text text-xs leading-[1.4] text-fg-3">
                    {item.detail}
                  </span>
                </div>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="rounded-md font-text text-[13px] leading-[1.4] font-semibold text-fg-2 transition-colors hover:text-beige focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige"
                  >
                    Upravit
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="rounded-md font-text text-[13px] leading-[1.4] font-semibold text-fg-2 transition-colors hover:text-beige focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige"
                  >
                    Upravit
                  </button>
                )}
              </div>
            ))}

            <div className="pt-1.5">
              <TextInput
                label="Termín dokončení"
                name="completion"
                placeholder="např. 4. čtvrtletí 2027"
                value={completion}
                disabled={saving}
                onChange={(event) => {
                  setCompletion(event.target.value);
                  markDirty();
                }}
              />
            </div>
          </Card>
        </div>
      </DetailScaffold>
    </form>
  );
}
