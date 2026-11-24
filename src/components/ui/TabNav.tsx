"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export type TabItem = {
  label: string;
  /** Tabs without `href` are not built yet and render as inert buttons. */
  href?: string;
  /** Number shown after the label. */
  count?: number;
};

const count = (tab: TabItem) =>
  tab.count !== undefined && (
    <span className="text-[13px] font-normal text-fg-3">{tab.count}</span>
  );

/** Underlined tabs where each tab is its own route. */
export function TabNav({ tabs, label }: { tabs: TabItem[]; label: string }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label={label}
      className="flex gap-7 overflow-x-auto border-b border-line-soft [scrollbar-width:none]"
    >
      {tabs.map((tab) => {
        const active = tab.href === pathname;
        const className = cn(
          "-mb-px flex shrink-0 items-center gap-2 border-b-2 pb-3.5 font-text text-[15px] leading-[1.4] font-semibold whitespace-nowrap transition-colors focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige",
          active
            ? "border-beige text-fg"
            : "border-transparent text-fg-2 hover:text-fg",
        );

        return tab.href ? (
          <Link
            key={tab.label}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={className}
          >
            {tab.label}
            {count(tab)}
          </Link>
        ) : (
          <button key={tab.label} type="button" className={className}>
            {tab.label}
            {count(tab)}
          </button>
        );
      })}
    </nav>
  );
}
