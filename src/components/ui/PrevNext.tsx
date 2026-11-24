import Link from "next/link";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/ssr";

type PrevNextProps = {
  prevHref?: string;
  nextHref?: string;
  prevLabel: string;
  nextLabel: string;
};

const itemClass =
  "flex size-7 items-center justify-center rounded-full text-fg-2 transition-colors focus-visible:outline-[1.5px] focus-visible:outline-beige";

/** Small pill with previous / next arrows for stepping through records. */
export function PrevNext({
  prevHref,
  nextHref,
  prevLabel,
  nextLabel,
}: PrevNextProps) {
  const items = [
    { href: prevHref, label: prevLabel, icon: CaretLeftIcon },
    { href: nextHref, label: nextLabel, icon: CaretRightIcon },
  ];

  return (
    <div className="flex shrink-0 items-center gap-1 rounded-full border border-line-soft bg-inset p-[3px]">
      {items.map(({ href, label, icon: IconComponent }) =>
        href ? (
          <Link
            key={label}
            href={href}
            aria-label={label}
            title={label}
            className={`${itemClass} hover:bg-white/5 hover:text-fg`}
          >
            <IconComponent weight="fill" className="size-3" />
          </Link>
        ) : (
          <span key={label} aria-hidden className={`${itemClass} opacity-40`}>
            <IconComponent weight="fill" className="size-3" />
          </span>
        ),
      )}
    </div>
  );
}
