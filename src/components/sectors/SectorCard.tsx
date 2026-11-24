import Image from "next/image";
import Link from "next/link";
import { CheckCircleIcon, WarningCircleIcon } from "@phosphor-icons/react/ssr";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { sectorHousesSummary, sectorMarking, type Sector } from "@/lib/sectors";

/** Card of a sector in the list: render, name, houses and marking state. */
export function SectorCard({ sector, href }: { sector: Sector; href: string }) {
  const marking = sectorMarking(sector.houses);
  const StateIcon = marking.complete ? CheckCircleIcon : WarningCircleIcon;

  return (
    <Card className="group relative flex flex-col overflow-hidden transition-[filter] hover:brightness-110">
      <div className="relative h-[220px] bg-inset">
        <Image
          src={sector.image.src}
          alt=""
          fill
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
          className="object-contain p-4"
        />
      </div>

      <div className="flex items-center justify-between gap-3 px-5 pt-4 pb-[18px]">
        <div className="flex min-w-0 flex-col gap-[3px]">
          <h2 className="font-title text-lg leading-[1.25] font-medium text-fg">
            {/* The link covers the whole card. */}
            <Link
              href={href}
              className="outline-none after:absolute after:inset-0 after:rounded-[20px] focus-visible:after:outline-[1.5px] focus-visible:after:-outline-offset-2 focus-visible:after:outline-beige"
            >
              {sector.name}
            </Link>
          </h2>
          <p className="truncate font-text text-[13px] leading-[1.4] text-fg-3">
            {sectorHousesSummary(sector)}
          </p>
        </div>
        <p
          className={cn(
            "flex shrink-0 items-center gap-1.5 font-text text-xs leading-[1.4] font-semibold",
            marking.complete ? "text-fg-3" : "text-beige",
          )}
        >
          <StateIcon weight="fill" className="size-[15px]" />
          {marking.label}
        </p>
      </div>
    </Card>
  );
}
