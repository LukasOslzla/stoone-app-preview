"use client";

import { SwitchRow } from "@/components/ui/SwitchRow";
import {
  headerLinkLabels,
  type HeaderLinks,
  type SiteHeader,
} from "@/lib/editor";
import { EditorPanel, PanelGroupLabel, PanelHead } from "./EditorPanel";
import { MenuItemsEditor } from "./MenuItemsEditor";

type HeaderPanelProps = {
  header: SiteHeader;
  /** `key` groups quick changes into one undo step. */
  onChange: (key: string, header: SiteHeader) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

/** "Hlavička webu": menu items (order, names) and the links on the right. */
export function HeaderPanel({
  header,
  onChange,
  selectedId,
  onSelect,
}: HeaderPanelProps) {
  return (
    <EditorPanel>
      <PanelHead
        title="Hlavička webu"
        sub="Změny se hned ukážou v náhledu vpravo."
      />

      <PanelGroupLabel>Položky menu</PanelGroupLabel>
      <MenuItemsEditor
        items={header.menu}
        label="Položky menu"
        addLabel="Přidat položku menu"
        selectedId={selectedId}
        onSelect={onSelect}
        onChange={(key, menu) => onChange(`menu-${key}`, { ...header, menu })}
      />

      <PanelGroupLabel>Odkazy vpravo</PanelGroupLabel>
      <div className="flex flex-col gap-[18px]">
        {(Object.keys(headerLinkLabels) as (keyof HeaderLinks)[]).map((key) => (
          <SwitchRow
            key={key}
            label={headerLinkLabels[key]}
            checked={header.links[key]}
            onChange={(checked) =>
              onChange(`link-${key}`, {
                ...header,
                links: { ...header.links, [key]: checked },
              })
            }
          />
        ))}
      </div>
    </EditorPanel>
  );
}
