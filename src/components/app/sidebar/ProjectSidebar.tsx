"use client";

import {
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
import { useNotificationsNav } from "@/components/notifications/useNotificationsNav";
import { Sidebar, type NavSection } from "./Sidebar";

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
        {
          label: "Editor obsahu",
          icon: PencilSimpleIcon,
          href: `${base}/pages`,
          alsoActiveFor: [`${base}/editor`],
        },
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
          // The buyers' app; opened from here for the preview.
          href: "/configurator",
        },
      ],
    },
    {
      title: "Správa",
      items: [
        { label: "Soubory", icon: FolderIcon, href: `${base}/files` },
        { label: "Uživatelé a role", icon: UsersIcon, href: `${base}/users` },
        {
          label: "Migrace dat",
          icon: DatabaseIcon,
          trailing: "locked",
          href: `${base}/migration`,
        },
        { label: "Nastavení", icon: GearIcon, href: `${base}/settings` },
      ],
    },
  ];
}

/** Reads the project from the URL (`/projects/[slug]/…`). */
export function ProjectSidebar({ user }: { user: CurrentUser }) {
  const { slug } = useParams<{ slug: string }>();
  const notifications = useNotificationsNav();

  return (
    <Sidebar
      user={user}
      sections={projectSections(slug)}
      bottom={[notifications.item]}
      bottomPanel={notifications.panel}
      density="compact"
      accountHref={`/projects/${slug}/account`}
    />
  );
}
