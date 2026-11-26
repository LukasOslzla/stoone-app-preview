"use client";

import { useState } from "react";
import { useSaveForm } from "@/components/buildings/useSaveForm";
import { Card, CardHeader } from "@/components/ui/Card";
import { SelectInput, TextArea, TextInput } from "@/components/ui/form/Field";
import { saveSiteSettings, type SiteSettings } from "@/lib/site-settings";
import { SettingsScaffold } from "./SettingsScaffold";
import type { SettingsTabProps } from "./SiteSeoTab";

type Values = SiteSettings["notFound"];

/** "Nastavení webu" – tab Stránka nenalezena (404). */
export function NotFoundTab({
  projectSlug,
  projectName,
  settings,
}: SettingsTabProps) {
  const [values, setValues] = useState<Values>(settings.notFound);
  const { saving, saved, handleSubmit, markDirty } = useSaveForm(() =>
    saveSiteSettings(projectSlug, { notFound: values }),
  );

  function update<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    markDirty();
  }

  return (
    <form onSubmit={handleSubmit}>
      <SettingsScaffold
        projectSlug={projectSlug}
        projectName={projectName}
        saving={saving}
        saved={saved}
      >
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
          <Card className="flex min-w-0 flex-1 flex-col gap-[22px] p-6">
            <CardHeader
              title="Když návštěvník zabloudí"
              description="Tahle stránka se ukáže, když někdo otevře odkaz, který už neexistuje – třeba na prodaný byt."
            />
            <TextInput
              label="Nadpis"
              name="heading"
              required
              value={values.heading}
              disabled={saving}
              onChange={(event) => update("heading", event.target.value)}
            />
            <TextArea
              label="Text"
              name="text"
              value={values.text}
              disabled={saving}
              onChange={(event) => update("text", event.target.value)}
            />
            <div className="flex flex-col gap-4 sm:flex-row">
              <TextInput
                label="Text tlačítka"
                name="buttonLabel"
                value={values.buttonLabel}
                disabled={saving}
                onChange={(event) => update("buttonLabel", event.target.value)}
              />
              <SelectInput
                label="Kam tlačítko vede"
                name="buttonTarget"
                options={settings.pageOptions}
                value={values.buttonTarget}
                disabled={saving}
                onChange={(value) => update("buttonTarget", value)}
              />
            </div>
          </Card>

          <div className="flex w-full flex-col gap-3 xl:w-[480px] xl:shrink-0">
            <p className="font-text text-[11px] leading-[1.4] font-bold tracking-[0.8px] text-fg-3 uppercase">
              Náhled stránky
            </p>
            {/* Schematic preview in the colours of a light public web. */}
            <div className="flex h-[400px] flex-col overflow-hidden rounded-2xl bg-fg font-sans">
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <span className="text-[15px] leading-[1.4] font-extrabold text-ink">
                  {projectName.toLowerCase()}
                </span>
                <span className="flex gap-2.5 truncate text-[10px] leading-[1.4] text-[#5F6368]">
                  {settings.navigation.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </span>
              </div>
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2.5 px-10 pb-6 text-center">
                <span className="text-[13px] leading-[1.4] font-bold tracking-[2px] text-[#C56A45]">
                  404
                </span>
                <p className="text-3xl leading-[1.15] font-bold break-words text-ink">
                  {values.heading || "Nadpis"}
                </p>
                <p className="max-w-[300px] text-xs leading-normal text-[#4D5156]">
                  {values.text}
                </p>
                {values.buttonLabel && (
                  <span className="flex h-9 items-center rounded-full bg-ink px-[18px] text-xs leading-none font-semibold text-fg">
                    {values.buttonLabel}
                  </span>
                )}
              </div>
            </div>
            <p className="font-text text-xs leading-[1.4] text-fg-3">
              Náhled je orientační – stránka převezme vzhled vašeho webu.
            </p>
          </div>
        </div>
      </SettingsScaffold>
    </form>
  );
}
