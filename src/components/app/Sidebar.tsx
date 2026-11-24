"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Icon } from "@phosphor-icons/react";
import {
  BellIcon,
  BuildingsIcon,
  CaretRightIcon,
  GearIcon,
  HouseIcon,
  SidebarSimpleIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import { ChevronsUpDown } from "lucide-react";
import { StooneLogo } from "@/components/StooneLogo";
import { cn } from "@/lib/cn";
import type { CurrentUser } from "@/lib/user";

type NavItem = {
  label: string;
  icon: Icon;
  /** Items without `href` are not built yet and render as inert buttons. */
  href?: string;
  badge?: { value: number; tone: "neutral" | "alert" };
};

const mainNav: NavItem[] = [
  { label: "Přehled", icon: HouseIcon, href: "/overview" },
  { label: "Projekty", icon: BuildingsIcon },
  { label: "Leady", icon: UsersIcon, badge: { value: 24, tone: "neutral" } },
];

const bottomNav: NavItem[] = [
  { label: "Notifikace", icon: BellIcon, badge: { value: 3, tone: "alert" } },
  { label: "Nastavení", icon: GearIcon },
];

function NavLink({
  item,
  active,
  collapsed,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
}) {
  const IconComponent = item.icon;

  const className = cn(
    "relative flex h-12 shrink-0 items-center rounded-[14px] transition-colors focus-visible:outline-[1.5px] focus-visible:outline-beige",
    collapsed ? "w-12 justify-center" : "w-full gap-3.5 px-3.5 text-left",
    active
      ? "bg-[#CAC3B826] ring-1 ring-[#CAC3B82E] ring-inset"
      : "hover:bg-white/5",
  );

  const content = (
    <>
      <IconComponent
        weight="fill"
        className={cn(
          "shrink-0",
          collapsed ? "size-[22px]" : "size-5",
          active ? "text-beige" : "text-fg-3",
        )}
      />
      {!collapsed && (
        <span
          className={cn(
            "min-w-0 flex-1 truncate font-text text-[15px] leading-[1.4] font-semibold",
            active ? "text-fg" : "text-fg-2",
          )}
        >
          {item.label}
        </span>
      )}
      {item.badge && (
        <span
          className={cn(
            "flex items-center justify-center rounded-full font-text leading-none font-bold",
            item.badge.tone === "alert"
              ? "bg-red text-white"
              : "bg-beige text-ink",
            collapsed
              ? "absolute top-1 left-[25px] h-[18px] min-w-[18px] px-1 text-[10px] ring-2 ring-bg"
              : "h-[22px] min-w-[22px] px-1.5 text-[11px]",
          )}
        >
          {item.badge.value}
        </span>
      )}
    </>
  );

  if (item.href) {
    return (
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        aria-label={collapsed ? item.label : undefined}
        title={collapsed ? item.label : undefined}
        className={className}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-label={collapsed ? item.label : undefined}
      title={collapsed ? item.label : undefined}
      className={className}
    >
      {content}
    </button>
  );
}

function Avatar({ user }: { user: CurrentUser }) {
  if (!user.avatarUrl) {
    return (
      <span className="flex size-11 items-center justify-center rounded-full border border-line bg-control font-text text-base leading-none font-semibold text-fg">
        {user.name.charAt(0)}
      </span>
    );
  }

  return (
    <Image
      src={user.avatarUrl}
      alt=""
      width={44}
      height={44}
      className="size-11 rounded-full border border-line object-cover"
    />
  );
}

export function Sidebar({ user }: { user: CurrentUser }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (item: NavItem) =>
    Boolean(item.href && pathname.startsWith(item.href));

  if (collapsed) {
    return (
      <aside className="flex h-full w-[88px] shrink-0 flex-col items-center gap-7 border-r border-line-soft py-6">
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          aria-label="Rozbalit menu"
          title="Rozbalit menu"
          className="group flex h-12 w-16 shrink-0 items-center justify-center gap-1.5 rounded-[14px] pl-2 transition-colors hover:bg-white/5 focus-visible:outline-[1.5px] focus-visible:outline-beige"
        >
          {/* Only the "S" of the wordmark is visible. */}
          <span className="relative block h-6 w-[20.8px] shrink-0 overflow-hidden">
            <StooneLogo className="absolute top-0 left-0 h-6 w-[143.64px] max-w-none text-beige" />
          </span>
          <CaretRightIcon
            weight="bold"
            className="size-3 shrink-0 text-fg-2 transition-[color,translate] group-hover:translate-x-0.5 group-hover:text-fg"
          />
        </button>

        <nav
          aria-label="Hlavní navigace"
          className="flex min-h-0 flex-1 flex-col items-center gap-1.5"
        >
          {mainNav.map((item) => (
            <NavLink
              key={item.label}
              item={item}
              active={isActive(item)}
              collapsed
            />
          ))}
        </nav>

        <div className="flex flex-col items-center gap-1.5">
          {bottomNav.map((item) => (
            <NavLink
              key={item.label}
              item={item}
              active={isActive(item)}
              collapsed
            />
          ))}
          <div className="pt-2.5" title={user.name}>
            <span className="flex size-11 items-center justify-center rounded-full border border-line bg-control font-text text-base leading-none font-semibold text-fg">
              {user.name.charAt(0)}
            </span>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex h-full w-[248px] shrink-0 flex-col gap-6 border-r border-line-soft px-3.5 pt-5 pb-3.5">
      <div className="flex h-12 shrink-0 items-center justify-between pr-1 pl-2.5">
        <StooneLogo className="h-[18px] w-[107.7px] text-beige" />
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          aria-label="Sbalit menu"
          title="Sbalit menu"
          className="flex size-8 items-center justify-center rounded-[10px] text-fg-2 transition-colors hover:bg-white/5 hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-beige"
        >
          <SidebarSimpleIcon weight="fill" className="size-5" />
        </button>
      </div>

      <nav
        aria-label="Hlavní navigace"
        className="flex min-h-0 flex-1 flex-col gap-1.5"
      >
        {mainNav.map((item) => (
          <NavLink
            key={item.label}
            item={item}
            active={isActive(item)}
            collapsed={false}
          />
        ))}
      </nav>

      <div className="flex flex-col gap-1.5">
        {bottomNav.map((item) => (
          <NavLink
            key={item.label}
            item={item}
            active={isActive(item)}
            collapsed={false}
          />
        ))}
      </div>

      <button
        type="button"
        className="flex w-full items-center gap-3 rounded-xl border border-line bg-card p-2.5 text-left shadow-[inset_0_1px_0_#FFFFFF14] transition-colors hover:border-[#D2D5C566] focus-visible:outline-[1.5px] focus-visible:outline-beige"
      >
        <span className="relative size-11 shrink-0">
          <Avatar user={user} />
          {user.online && (
            <span className="absolute top-[31px] left-[31px] size-[13px] rounded-full border-[2.5px] border-card bg-green" />
          )}
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate font-text text-sm leading-[1.3] font-semibold text-fg">
            {user.name}
          </span>
          <span className="truncate font-text text-xs leading-[1.3] font-medium text-fg-3">
            {user.organization} · {user.role}
          </span>
        </span>
        <ChevronsUpDown className="size-4 shrink-0 text-fg-3" />
      </button>
    </aside>
  );
}
