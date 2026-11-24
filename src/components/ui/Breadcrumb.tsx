import Link from "next/link";
import { CaretRightIcon } from "@phosphor-icons/react/ssr";

export type BreadcrumbItem = { label: string; href?: string };

/** Path to the current page; the last item is the page itself. */
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Drobečková navigace">
      <ol className="flex flex-wrap items-center gap-2 font-text text-[13px] leading-[1.4]">
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {index > 0 && (
                <CaretRightIcon weight="fill" className="size-3 text-fg-3" />
              )}
              {current ? (
                <span aria-current="page" className="font-semibold text-fg-2">
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="rounded-sm font-medium text-fg-3 transition-colors hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-beige"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-fg-3">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
