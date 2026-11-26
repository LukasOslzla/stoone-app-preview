import type { ReactNode } from "react";
import { PageIntro } from "@/components/app/PageIntro";
import { SaveButton } from "@/components/detail/SaveButton";
import { TabNav } from "@/components/ui/TabNav";

type SettingsScaffoldProps = {
  projectSlug: string;
  projectName: string;
  saving: boolean;
  saved: boolean;
  /** Content of the active tab. */
  children: ReactNode;
};

/** Title, "Uložit změny" and the tabs shared by the web settings pages. */
export function SettingsScaffold({
  projectSlug,
  projectName,
  saving,
  saved,
  children,
}: SettingsScaffoldProps) {
  const base = `/projects/${projectSlug}/settings`;

  return (
    <div className="flex flex-col gap-5 px-8 pt-7 pb-8">
      <PageIntro
        title="Nastavení webu"
        description={`Věci, které platí pro celý web projektu ${projectName}.`}
        action={
          <div className="flex items-center gap-2.5">
            <SaveButton saving={saving} saved={saved} />
          </div>
        }
      />
      <TabNav
        label="Nastavení webu"
        tabs={[
          { label: "Vyhledávače a sdílení", href: base },
          { label: "Stránka nenalezena (404)", href: `${base}/not-found` },
        ]}
      />
      {children}
    </div>
  );
}
