"use client";

import { useState } from "react";
import { useSaveForm } from "@/components/buildings/useSaveForm";
import { DetailScaffold } from "@/components/detail/DetailScaffold";
import { SaveButton } from "@/components/detail/SaveButton";
import { SearchPreview } from "@/components/seo/SearchPreview";
import { SeoTextField } from "@/components/seo/SeoTextField";
import { ShareImageField } from "@/components/seo/ShareImageField";
import { Card, CardHeader } from "@/components/ui/Card";
import { PrevNext } from "@/components/ui/PrevNext";
import { unitStatuses } from "@/lib/unit-status";
import { saveUnit, suggestSeoText, type UnitDetail } from "@/lib/units";
import { unitScaffoldProps } from "./unitScaffold";

type UnitSeoTabProps = {
  projectSlug: string;
  unit: UnitDetail;
  realpad: boolean;
};

type SeoKey = "title" | "description";

/** Unit detail, tab "Vyhledávače (SEO)". */
export function UnitSeoTab({ projectSlug, unit, realpad }: UnitSeoTabProps) {
  const { seo } = unit;
  const [values, setValues] = useState({
    title: seo.title,
    description: seo.description,
  });
  const [suggesting, setSuggesting] = useState<SeoKey | null>(null);
  const { saving, saved, handleSubmit, markDirty } = useSaveForm(() =>
    saveUnit(projectSlug, unit.id, { seo: { ...seo, ...values } }),
  );
  const base = `/projects/${projectSlug}/units`;

  function update(key: SeoKey, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    markDirty();
  }

  async function suggest(key: SeoKey) {
    setSuggesting(key);
    const text = await suggestSeoText(key, unit);
    setSuggesting(null);
    update(key, text);
  }

  return (
    <form onSubmit={handleSubmit}>
      <DetailScaffold
        {...unitScaffoldProps(projectSlug, unit, realpad)}
        status={unitStatuses[unit.status]}
        titleExtra={
          <PrevNext
            prevLabel="Předchozí byt"
            nextLabel="Další byt"
            prevHref={unit.prevId && `${base}/${unit.prevId}/seo`}
            nextHref={unit.nextId && `${base}/${unit.nextId}/seo`}
          />
        }
        actions={<SaveButton saving={saving} saved={saved} />}
      >
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
          <Card className="flex min-w-0 flex-1 flex-col gap-[22px] p-6">
            <CardHeader
              title="Jak se byt ukáže ve vyhledávači"
              description="Texty jsme vyplnili automaticky z údajů o bytě. Upravte je, jen pokud chcete."
            />

            <SeoTextField
              label="Nadpis"
              value={values.title}
              autoValue={seo.autoTitle}
              maxLength={60}
              disabled={saving}
              suggesting={suggesting === "title"}
              onSuggest={() => suggest("title")}
              onChange={(value) => update("title", value)}
            />

            <SeoTextField
              label="Popis"
              multiline
              value={values.description}
              autoValue={seo.autoDescription}
              maxLength={160}
              disabled={saving}
              suggesting={suggesting === "description"}
              onSuggest={() => suggest("description")}
              onChange={(value) => update("description", value)}
            />

            <ShareImageField
              title={seo.shareImage.title}
              note={seo.shareImage.note}
              actionLabel="Změnit"
            />
          </Card>

          <div className="w-full xl:w-[400px] xl:shrink-0">
            <SearchPreview
              siteName={seo.siteName}
              urlParts={seo.urlParts}
              title={values.title}
              description={values.description}
              caption="Takhle uvidí byt lidé, kteří ho najdou přes Google nebo Seznam."
            />
          </div>
        </div>
      </DetailScaffold>
    </form>
  );
}
