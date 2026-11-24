"use client";

import {
  BellIcon,
  BuildingsIcon,
  GearIcon,
  HouseIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import type { CurrentUser } from "@/lib/user";
import { Sidebar, type NavItem, type NavSection } from "./Sidebar";

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

const bottom: NavItem[] = [
  { label: "Notifikace", icon: BellIcon, badge: { value: 3, tone: "alert" } },
  { label: "Nastavení", icon: GearIcon },
];

/** Menu shown outside of a project (project selection, leads…). */
export function GlobalSidebar({ user }: { user: CurrentUser }) {
  return <Sidebar user={user} sections={sections} bottom={bottom} />;
}
