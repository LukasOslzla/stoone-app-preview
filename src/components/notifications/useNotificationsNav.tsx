"use client";

import { useCallback, useState } from "react";
import { BellIcon } from "@phosphor-icons/react";
import type { NavItem } from "@/components/app/sidebar/Sidebar";
import { getNotifications } from "@/lib/notifications";
import { NotificationsPanel } from "./NotificationsPanel";

/**
 * "Notifikace" for a sidebar: the menu item with the unread badge and the
 * panel it opens. Pass them to `<Sidebar bottom bottomPanel>`.
 */
export function useNotificationsNav() {
  const [notifications, setNotifications] = useState(getNotifications);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  const unread = notifications.filter((item) => item.unread).length;

  const item: NavItem = {
    label: "Notifikace",
    icon: BellIcon,
    badge: unread > 0 ? { value: unread, tone: "alert" } : undefined,
    onSelect: () => setOpen((current) => !current),
    expanded: open,
  };

  const panel = open && (
    <NotificationsPanel
      notifications={notifications}
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
  );

  return { item, panel };
}
