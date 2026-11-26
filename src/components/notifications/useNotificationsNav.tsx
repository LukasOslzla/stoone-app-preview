"use client";

import { useCallback, useState } from "react";
import { BellIcon } from "@phosphor-icons/react";
import type { NavItem } from "@/components/app/sidebar/Sidebar";
import {
  defaultNotificationSettings,
  getNotifications,
  saveNotificationSettings,
} from "@/lib/notifications";
import { NotificationSettingsDialog } from "./NotificationSettingsDialog";
import { NotificationsPanel } from "./NotificationsPanel";

/**
 * "Notifikace" for a sidebar: the menu item with the unread badge and the
 * panel it opens. Pass them to `<Sidebar bottom bottomPanel>`.
 */
export function useNotificationsNav() {
  const [notifications, setNotifications] = useState(getNotifications);
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(defaultNotificationSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  // Kinds switched off in the settings are not listed or counted.
  const shown = notifications.filter((item) => settings.kinds[item.kind]);
  const unread = shown.filter((item) => item.unread).length;

  const item: NavItem = {
    label: "Notifikace",
    icon: BellIcon,
    badge: unread > 0 ? { value: unread, tone: "alert" } : undefined,
    onSelect: () => setOpen((current) => !current),
    expanded: open,
  };

  const panel = (
    <>
      {open && (
        <NotificationsPanel
          notifications={shown}
          onOpenSettings={() => {
            setOpen(false);
            setSettingsOpen(true);
          }}
          onClose={close}
          onMarkAllRead={() =>
            setNotifications((current) =>
              current.map((entry) => ({ ...entry, unread: false })),
            )
          }
          // Mock: acting on a notification just marks it as read.
          onAction={(target) =>
            setNotifications((current) =>
              current.map((entry) =>
                entry.id === target.id
                  ? { ...entry, unread: false, actionLabel: undefined }
                  : entry,
              ),
            )
          }
          className="absolute bottom-0 left-full z-40 ml-[22px]"
        />
      )}
      <NotificationSettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onChange={(next) => {
          setSettings(next);
          void saveNotificationSettings(next);
        }}
      />
    </>
  );

  return { item, panel };
}
