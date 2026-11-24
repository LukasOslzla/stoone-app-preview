"use client";

import {
  BuildingsIcon,
  GearIcon,
  HouseIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import type { CurrentUser } from "@/lib/user";
import { useNotificationsNav } from "@/components/notifications/useNotificationsNav";
import { Sidebar, type NavSection } from "./Sidebar";

const sections: NavSection[] = [
  {
    items: [
      { label: "Přehled", icon: HouseIcon, href: "/overview" },
      { label: "Projekty", icon: BuildingsIcon },
      {
        label: "Leady",
        icon: UsersIcon,
        badge: { value: 24, tone: "neutral" },
      },
    ],
  },
];

/** Menu shown outside of a project (project selection, leads…). */
export function GlobalSidebar({ user }: { user: CurrentUser }) {
  const notifications = useNotificationsNav();

  return (
    <Sidebar
      user={user}
      sections={sections}
      bottom={[notifications.item, { label: "Nastavení", icon: GearIcon }]}
      bottomPanel={notifications.panel}
    />
  );
}
