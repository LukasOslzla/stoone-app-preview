"use client";

import { Fragment, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Icon } from "@phosphor-icons/react";
import {
  ArrowSquareOutIcon,
  CaretRightIcon,
  LockIcon,
  SidebarSimpleIcon,
} from "@phosphor-icons/react";
import { ChevronsUpDown } from "lucide-react";
import { StooneLogo } from "@/components/StooneLogo";
import { cn } from "@/lib/cn";
import type { CurrentUser } from "@/lib/user";

export type NavItem = {
  label: string;
  icon: Icon;
  /** Items without `href` are not built yet and render as inert buttons. */
  href?: string;
  /** Match the path exactly instead of by prefix (for section roots). */
  exact?: boolean;
  /** Other path prefixes that should highlight this item. */
  alsoActiveFor?: string[];
  badge?: { value: number; tone: "neutral" | "alert" };
  /** Small indicator after the label: opens elsewhere / needs permission. */
  trailing?: "external" | "locked";
  /** Slightly smaller label for long names. */
  smallLabel?: boolean;
  /** Makes the item a button that opens something (e.g. a panel). */
  onSelect?: () => void;
  /** State of what `onSelect` opens. */
  expanded?: boolean;
};

export type NavSection = {
  /** Optional group heading, e.g. "Nemovitosti". */
  title?: string;
  items: NavItem[];
};

type Density = "comfortable" | "compact";

type SidebarProps = {
  user: CurrentUser;
  sections: NavSection[];
  /** Items pinned above the user card (always in the comfortable size). */
  bottom?: NavItem[];
  /** Floating panel anchored next to the bottom items (notifications). */
  bottomPanel?: ReactNode;
  /** `comfortable` = 48px rows (global menu), `compact` = 40px rows (project menu). */
  density?: Density;
  /** Where the user card leads ("Můj účet"); without it the card is inert. */
  accountHref?: string;
};

function NavLink({
  item,
  active,
  collapsed,
  density,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  density: Density;
}) {
  const IconComponent = item.icon;
  const compact = density === "compact" && !collapsed;

  const className = cn(
    "relative flex shrink-0 items-center transition-colors focus-visible:outline-[1.5px] focus-visible:outline-beige",
    collapsed
      ? "size-12 justify-center rounded-[14px]"
      : compact
        ? "h-10 w-full gap-3 rounded-[10px] px-3 text-left"
        : "h-12 w-full gap-3.5 rounded-[14px] px-3.5 text-left",
    active
      ? "bg-[#CAC3B826] ring-1 ring-[#CAC3B82E] ring-inset"
      : item.expanded
        ? "bg-white/5"
        : "hover:bg-white/5",
  );

  const content = (
    <>
      <IconComponent
        weight="fill"
        className={cn(
          "shrink-0",
          collapsed ? "size-[22px]" : compact ? "size-[18px]" : "size-5",
          active ? "text-beige" : "text-fg-3",
        )}
      />
      {!collapsed && (
        <span
          className={cn(
            "min-w-0 flex-1 truncate font-text leading-[1.4]",
            compact
              ? item.smallLabel
                ? "text-[13px]"
                : "text-sm"
              : "text-[15px]",
            compact && !active ? "font-medium" : "font-semibold",
            active ? "text-fg" : "text-fg-2",
          )}
        >
          {item.label}
        </span>
      )}
      {!collapsed && item.trailing === "external" && (
        <ArrowSquareOutIcon
          weight="fill"
          className="size-[13px] shrink-0 text-fg-3"
        />
      )}
      {!collapsed && item.trailing === "locked" && (
        <LockIcon weight="fill" className="size-3 shrink-0 text-fg-3" />
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

  const shared = {
    "aria-label": collapsed ? item.label : undefined,
    title: collapsed ? item.label : undefined,
    className,
  };

  if (item.href) {
    return (
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        {...shared}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-expanded={item.onSelect ? Boolean(item.expanded) : undefined}
      // The open panel closes on outside presses; keep this one for the toggle.
      onPointerDown={
        item.onSelect ? (event) => event.stopPropagation() : undefined
      }
      onClick={item.onSelect}
      {...shared}
    >
      {content}
    </button>
  );
}

const userCardClass =
  "flex w-full items-center gap-3 rounded-xl border border-line bg-card p-2.5 text-left shadow-[inset_0_1px_0_#FFFFFF14] transition-colors hover:border-[#D2D5C566] focus-visible:outline-[1.5px] focus-visible:outline-beige";

function Avatar({ user }: { user: CurrentUser }) {
  if (!user.avatarUrl) {
    return <AvatarInitial user={user} />;
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

function AvatarInitial({ user }: { user: CurrentUser }) {
  return (
    <span className="flex size-11 items-center justify-center rounded-full border border-line bg-control font-text text-base leading-none font-semibold text-fg">
      {user.name.charAt(0)}
    </span>
  );
}

/**
 * App sidebar shell: brand, collapsible navigation, pinned items and the
 * user card. The menu content comes from `sections` / `bottom`, see
 * `GlobalSidebar` and `ProjectSidebar`.
 */
export function Sidebar({
  user,
  sections,
  bottom = [],
  bottomPanel,
  density = "comfortable",
  accountHref,
}: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (item: NavItem) => {
    if (!item.href) return false;
    if (item.exact) return pathname === item.href;
    return [item.href, ...(item.alsoActiveFor ?? [])].some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
  };

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
          className="flex min-h-0 flex-1 flex-col items-center gap-1.5 overflow-y-auto px-1 [scrollbar-width:none]"
        >
          {sections.map((section, index) => (
            <Fragment key={section.title ?? index}>
              {index > 0 && (
                <span className="my-1.5 h-px w-6 shrink-0 bg-line-soft" />
              )}
              {section.items.map((item) => (
                <NavLink
                  key={item.label}
                  item={item}
                  active={isActive(item)}
                  collapsed
                  density={density}
                />
              ))}
            </Fragment>
          ))}
        </nav>

        <div className="relative flex flex-col items-center gap-1.5">
          {bottomPanel}
          {bottom.map((item) => (
            <NavLink
              key={item.label}
              item={item}
              active={isActive(item)}
              collapsed
              density="comfortable"
            />
          ))}
          <div className="pt-2.5" title={user.name}>
            {accountHref ? (
              <Link
                href={accountHref}
                aria-label="Můj účet"
                className="block rounded-full focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-beige"
              >
                <AvatarInitial user={user} />
              </Link>
            ) : (
              <AvatarInitial user={user} />
            )}
          </div>
        </div>
      </aside>
    );
  }

  const userCard = (
    <>
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
    </>
  );

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
        className={cn(
          "-mx-1 flex min-h-0 flex-1 flex-col overflow-y-auto px-1 [scrollbar-width:none]",
          density === "compact" ? "gap-0.5" : "gap-1.5",
        )}
      >
        {sections.map((section, index) => (
          <Fragment key={section.title ?? index}>
            {section.title && (
              <p className="px-3 pt-[18px] pb-1.5 font-text text-[11px] leading-[1.4] font-semibold tracking-[0.8px] text-fg-3 uppercase">
                {section.title}
              </p>
            )}
            {section.items.map((item) => (
              <NavLink
                key={item.label}
                item={item}
                active={isActive(item)}
                collapsed={false}
                density={density}
              />
            ))}
          </Fragment>
        ))}
      </nav>

      {bottom.length > 0 && (
        <div className="relative flex flex-col gap-1.5">
          {bottomPanel}
          {bottom.map((item) => (
            <NavLink
              key={item.label}
              item={item}
              active={isActive(item)}
              collapsed={false}
              density="comfortable"
            />
          ))}
        </div>
      )}

      {accountHref ? (
        <Link
          href={accountHref}
          aria-current={pathname === accountHref ? "page" : undefined}
          className={cn(
            userCardClass,
            pathname === accountHref && "border-beige",
          )}
        >
          {userCard}
        </Link>
      ) : (
        <button type="button" className={userCardClass}>
          {userCard}
        </button>
      )}
    </aside>
  );
}
