"use client";

import {
  BellIcon,
  BuildingsIcon,
  DatabaseIcon,
  DoorIcon,
  FolderIcon,
  GearIcon,
  GridFourIcon,
  HouseIcon,
  PencilSimpleIcon,
  SlidersHorizontalIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import { useParams } from "next/navigation";
import type { CurrentUser } from "@/lib/user";
import { Sidebar, type NavItem, type NavSection } from "./Sidebar";

/**
 * Menu of a single project. Only "Přehled" has a page so far — give the
 * other items an `href` as their screens get built.
 */
function projectSections(slug: string): NavSection[] {
  const base = `/projects/${slug}`;

  return [
    {
      items: [
        { label: "Přehled", icon: HouseIcon, href: base, exact: true },
        { label: "Editor obsahu", icon: PencilSimpleIcon },
      ],
    },
    {
      title: "Nemovitosti",
      items: [
        { label: "Byty", icon: DoorIcon, href: `${base}/units` },
        {
          label: "Budovy a patra",
          icon: BuildingsIcon,
          href: `${base}/buildings`,
          alsoActiveFor: [`${base}/floors`],
        },
        { label: "Sektory", icon: GridFourIcon, href: `${base}/sectors` },
        {
          label: "Konfigurátor standardů",
          icon: SlidersHorizontalIcon,
          trailing: "external",
          smallLabel: true,
        },
      ],
    },
    {
      title: "Správa",
      items: [
        { label: "Soubory", icon: FolderIcon },
        { label: "Uživatelé a role", icon: UsersIcon },
        { label: "Migrace dat", icon: DatabaseIcon, trailing: "locked" },
        { label: "Nastavení", icon: GearIcon },
      ],
    },
  ];
}

const bottom: NavItem[] = [
  { label: "Notifikace", icon: BellIcon, badge: { value: 3, tone: "alert" } },
];

/** Reads the project from the URL (`/projects/[slug]/…`). */
export function ProjectSidebar({ user }: { user: CurrentUser }) {
  const { slug } = useParams<{ slug: string }>();

  return (
    <Sidebar
      user={user}
      sections={projectSections(slug)}
      bottom={bottom}
      density="compact"
    />
  );
}
