"use client";

import { useState } from "react";
import { LockIcon } from "@phosphor-icons/react";
import { useSaveForm } from "@/components/buildings/useSaveForm";
import type { AiSuggestion } from "@/components/seo/AiSuggestionCard";
import { SearchPreview } from "@/components/seo/SearchPreview";
import { SeoTextField } from "@/components/seo/SeoTextField";
import { ShareImageField } from "@/components/seo/ShareImageField";
import { SharePreview } from "@/components/seo/SharePreview";
import { Card, CardHeader } from "@/components/ui/Card";
import { Disclosure } from "@/components/ui/Disclosure";
import { TagsInput } from "@/components/ui/form/TagsInput";
import { SwitchRow } from "@/components/ui/SwitchRow";
import {
  saveSiteSettings,
  suggestSiteSeo,
  type SiteSettings,
} from "@/lib/site-settings";
import { SettingsScaffold } from "./SettingsScaffold";

type SeoKey = "title" | "description";

export type SettingsTabProps = {
  projectSlug: string;
  projectName: string;
  settings: SiteSettings;
};

/** "Nastavení webu" – tab Vyhledávače a sdílení. */
export function SiteSeoTab({
  projectSlug,
  projectName,
  settings,
}: SettingsTabProps) {
  const { seo } = settings;
  const [values, setValues] = useState({
    title: seo.title,
    description: seo.description,
  });
  const [shareImage, setShareImage] = useState(seo.shareImage);
  const [advanced, setAdvanced] = useState({
    keywords: seo.keywords,
    structuredData: seo.structuredData,
  });
  const [suggestion, setSuggestion] = useState<
    Partial<Record<SeoKey, AiSuggestion | null>>
  >({});
  const [attempts, setAttempts] = useState({ title: 0, description: 0 });
  const [suggesting, setSuggesting] = useState<SeoKey | null>(null);
  const { saving, saved, handleSubmit, markDirty } = useSaveForm(() =>
    saveSiteSettings(projectSlug, {
      seo: { ...seo, ...values, ...advanced, shareImage },
    }),
  );

  function update(key: SeoKey, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    markDirty();
  }

  async function suggest(key: SeoKey) {
    setSuggesting(key);
    const next = await suggestSiteSeo(key, attempts[key]);
    setAttempts((current) => ({ ...current, [key]: current[key] + 1 }));
    setSuggestion((current) => ({ ...current, [key]: next }));
    setSuggesting(null);
  }

  const dismiss = (key: SeoKey) =>
    setSuggestion((current) => ({ ...current, [key]: null }));

  const field = (key: SeoKey) => ({
    value: values[key],
    disabled: saving,
    suggestLabel: "Navrhnout s AI",
    suggesting: suggesting === key,
    suggestion: suggestion[key],
    onSuggest: () => suggest(key),
    onChange: (value: string) => update(key, value),
    onUseSuggestion: () => {
      update(key, suggestion[key]!.text);
      dismiss(key);
    },
    onDismissSuggestion: () => dismiss(key),
  });

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
              title="Jak se web ukáže ve vyhledávači a na sítích"
              description="Použije se u všech stránek, které nemají vlastní text."
            />

            <SeoTextField
              label="Nadpis webu"
              maxLength={60}
              {...field("title")}
            />
            <SeoTextField
              label="Popis"
              multiline
              maxLength={160}
              {...field("description")}
            />

            <ShareImageField
              title={shareImage.fileName}
              note={shareImage.note}
              thumbnailUrl={shareImage.url}
              disabled={saving}
              onReplace={(file) => {
                // Mock upload: the picture stays in the browser.
                setShareImage({
                  url: URL.createObjectURL(file),
                  fileName: file.name,
                  note: "Nový obrázek · uloží se s ostatními změnami",
                });
                markDirty();
              }}
            />

            <Disclosure
              label="Pokročilé: klíčová slova, strukturovaná data"
              icon={<LockIcon weight="fill" className="text-fg-3" />}
            >
              <TagsInput
                label="Klíčová slova"
                hint="Slova a spojení, pod kterými má být web k nalezení. Stačí 3–6."
                addLabel="Přidat slovo"
                values={advanced.keywords}
                disabled={saving}
                onChange={(keywords) => {
                  setAdvanced((current) => ({ ...current, keywords }));
                  markDirty();
                }}
              />
              <SwitchRow
                label="Strukturovaná data"
                description="Vyhledávač díky nim může ukázat ceny a dostupnost bytů přímo ve výsledcích."
                checked={advanced.structuredData}
                disabled={saving}
                onChange={(structuredData) => {
                  setAdvanced((current) => ({ ...current, structuredData }));
                  markDirty();
                }}
              />
            </Disclosure>
          </Card>

          <div className="flex w-full flex-col gap-4 xl:w-[420px] xl:shrink-0">
            <SearchPreview
              label="Ve vyhledávači"
              siteName={settings.siteName}
              urlParts={[settings.domain]}
              title={values.title}
              description={values.description}
            />
            <SharePreview
              imageUrl={shareImage.url}
              domain={settings.domain.replace(/^www\./, "")}
              title={values.title}
            />
          </div>
        </div>
      </SettingsScaffold>
    </form>
  );
}
