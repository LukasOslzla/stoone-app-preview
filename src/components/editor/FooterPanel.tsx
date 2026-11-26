"use client";

import { TextInput } from "@/components/ui/form/Field";
import { SwitchRow } from "@/components/ui/SwitchRow";
import { footerSocialLabels, type SiteFooter } from "@/lib/editor";
import { EditorPanel, PanelGroupLabel, PanelHead } from "./EditorPanel";
import { MenuItemsEditor } from "./MenuItemsEditor";

type FooterPanelProps = {
  footer: SiteFooter;
  /** `key` groups quick changes into one undo step. */
  onChange: (key: string, footer: SiteFooter) => void;
};

/** "Patička webu": contact, links, social networks and the bottom line. */
export function FooterPanel({ footer, onChange }: FooterPanelProps) {
  const text = (field: "phone" | "email" | "note") => ({
    value: footer[field],
    onChange: (event: { target: { value: string } }) =>
      onChange(`footer-${field}`, { ...footer, [field]: event.target.value }),
  });

  return (
    <EditorPanel>
      <PanelHead
        title="Patička webu"
        sub="Zobrazuje se dole na každé stránce."
      />

      <PanelGroupLabel>Kontakt</PanelGroupLabel>
      <div className="grid grid-cols-2 gap-2.5">
        <TextInput size="sm" label="Telefon" type="tel" {...text("phone")} />
        <TextInput size="sm" label="E-mail" type="email" {...text("email")} />
      </div>

      <PanelGroupLabel>Odkazy</PanelGroupLabel>
      <MenuItemsEditor
        items={footer.links}
        label="Odkazy v patičce"
        addLabel="Přidat odkaz"
        onChange={(key, links) =>
          onChange(`footer-${key}`, { ...footer, links })
        }
      />

      <PanelGroupLabel>Sociální sítě</PanelGroupLabel>
      <div className="flex flex-col gap-[18px]">
        {(
          Object.keys(footerSocialLabels) as (keyof SiteFooter["social"])[]
        ).map((key) => (
          <SwitchRow
            key={key}
            label={footerSocialLabels[key]}
            checked={footer.social[key]}
            onChange={(checked) =>
              onChange(`footer-social-${key}`, {
                ...footer,
                social: { ...footer.social, [key]: checked },
              })
            }
          />
        ))}
      </div>

      <TextInput size="sm" label="Text úplně dole" {...text("note")} />
    </EditorPanel>
  );
}
