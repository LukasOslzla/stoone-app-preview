"use client";

import { useState } from "react";
import { CaretDownIcon, LockIcon } from "@phosphor-icons/react";
import { useSaveForm } from "@/components/buildings/useSaveForm";
import type { AiSuggestion } from "@/components/seo/AiSuggestionCard";
import { SearchPreview } from "@/components/seo/SearchPreview";
import { SeoTextField } from "@/components/seo/SeoTextField";
import { ShareImageField } from "@/components/seo/ShareImageField";
import { SharePreview } from "@/components/seo/SharePreview";
import { Card, CardHeader } from "@/components/ui/Card";
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
  const [suggestion, setSuggestion] = useState<
    Partial<Record<SeoKey, AiSuggestion | null>>
  >({});
  const [attempts, setAttempts] = useState({ title: 0, description: 0 });
  const [suggesting, setSuggesting] = useState<SeoKey | null>(null);
  const { saving, saved, handleSubmit, markDirty } = useSaveForm(() =>
    saveSiteSettings(projectSlug, { seo: { ...seo, ...values } }),
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
              title={seo.shareImage.fileName}
              note={seo.shareImage.note}
              thumbnailUrl={seo.shareImage.url}
            />

            {/* Inert: the advanced section has no design yet. */}
            <button
              type="button"
              className="flex items-center gap-2.5 rounded-md border-t border-line-soft pt-4 text-left font-text text-[13px] leading-[1.4] font-medium text-fg-2 transition-colors hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige"
            >
              <LockIcon weight="fill" className="size-3.5 shrink-0 text-fg-3" />
              <span className="min-w-0 flex-1">
                Pokročilé: klíčová slova, strukturovaná data
              </span>
              <CaretDownIcon
                weight="fill"
                className="size-[13px] shrink-0 text-fg-3"
              />
            </button>
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
              imageUrl={seo.shareImage.url}
              domain={settings.domain.replace(/^www\./, "")}
              title={values.title}
            />
          </div>
        </div>
      </SettingsScaffold>
    </form>
  );
}
