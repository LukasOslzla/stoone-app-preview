"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { SwitchRow } from "@/components/ui/SwitchRow";
import {
  notificationKinds,
  type NotificationSettings,
} from "@/lib/notifications";

type NotificationSettingsDialogProps = {
  open: boolean;
  onClose: () => void;
  settings: NotificationSettings;
  /** Every switch applies right away. */
  onChange: (settings: NotificationSettings) => void;
};

/** "Nastavení upozornění": which notifications to show and the e-mail summary. */
export function NotificationSettingsDialog({
  open,
  onClose,
  settings,
  onChange,
}: NotificationSettingsDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title="Nastavení upozornění"
      description="Změny platí hned a jen pro váš účet."
    >
      <div className="flex flex-col gap-3.5">
        <h3 className="font-text text-[11px] leading-[1.4] font-bold tracking-[0.8px] text-fg-3 uppercase">
          Co chcete vidět
        </h3>
        {notificationKinds.map((kind) => (
          <SwitchRow
            key={kind.id}
            label={kind.label}
            description={kind.description}
            checked={settings.kinds[kind.id]}
            onChange={(checked) =>
              onChange({
                ...settings,
                kinds: { ...settings.kinds, [kind.id]: checked },
              })
            }
          />
        ))}
      </div>

      <div className="flex flex-col gap-3.5 border-t border-line-soft pt-5">
        <SwitchRow
          label="Denní souhrn e-mailem"
          description="Každé ráno v 8:00, jen když je co hlásit"
          checked={settings.email}
          onChange={(email) => onChange({ ...settings, email })}
        />
      </div>

      <div className="flex justify-end">
        <Button size="md" onClick={onClose}>
          Hotovo
        </Button>
      </div>
    </Modal>
  );
}
