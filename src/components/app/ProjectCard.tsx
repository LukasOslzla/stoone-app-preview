import Link from "next/link";
import { LogoTile } from "@/components/ui/LogoTile";
import { cn } from "@/lib/cn";
import { formatBuildings, type Project } from "@/lib/projects";

function Stat({
  value,
  label,
  muted,
}: {
  value: number;
  label: string;
  muted: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <dd
        className={cn(
          "font-title text-[22px] leading-[1.1] font-medium",
          muted ? "text-fg-2" : "text-fg",
        )}
      >
        {value}
      </dd>
      <dt className="order-last truncate font-text text-[13px] leading-[1.4] font-medium text-fg-3">
        {label}
      </dt>
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const { units, active } = project;
  const taken = units.total - units.free;
  const takenPercent = units.total > 0 ? (taken / units.total) * 100 : 0;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "flex flex-col gap-9 rounded-3xl border border-line bg-card p-7 shadow-[inset_0_1px_0_#FFFFFF14] transition-colors hover:border-mist/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-beige",
        active
          ? "bg-[radial-gradient(ellipse_80%_65%_at_100%_100%,#6FD13C1A_0%,#6FD13C00_100%)]"
          : "bg-[radial-gradient(ellipse_80%_65%_at_100%_100%,#F0524B24_0%,#F0524B00_100%)]",
      )}
    >
      <div className="flex items-center gap-4">
        <LogoTile text={project.logoText} muted={!active} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h2
            className={cn(
              "truncate font-title text-xl leading-[1.2] font-medium",
              active ? "text-fg" : "text-fg-2",
            )}
          >
            {project.name}
          </h2>
          <p className="flex items-center gap-1.5 font-text text-[13px] leading-[1.4] font-medium text-fg-2">
            <span
              className={cn(
                "size-[7px] shrink-0 rounded-full",
                active ? "bg-green" : "bg-red",
              )}
            />
            {active ? "Aktivní" : "Neaktivní"} ·{" "}
            {formatBuildings(project.buildings)}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="font-text text-[13px] leading-[1.4] font-medium text-fg-2">
          Volné jednotky
        </p>
        <p className="flex items-end gap-2">
          <span
            className={cn(
              "font-title text-[44px] leading-none font-medium tracking-[-1px]",
              active ? "text-fg" : "text-fg-2",
            )}
          >
            {units.free}
          </span>
          <span className="pb-[5px] font-text text-base leading-none font-medium text-beige/60">
            z {units.total}
          </span>
        </p>

        {/* Filled part = units that are no longer free; the rest is drawn as ticks. */}
        <div
          role="meter"
          aria-label="Obsazené jednotky"
          aria-valuemin={0}
          aria-valuemax={units.total}
          aria-valuenow={taken}
          className="flex h-2.5 items-center gap-1 overflow-hidden"
        >
          <div
            style={{ width: `${takenPercent}%` }}
            className={cn(
              "h-full shrink-0 rounded-full",
              active
                ? "bg-[linear-gradient(90deg,#6FD13C_0%,#6FD13C_75%,#F2C94C_100%)]"
                : "bg-[linear-gradient(90deg,#F0524B_0%,#F0524B_75%,#F0524B66_100%)]",
            )}
          />
          <div
            className={cn(
              "h-full min-w-0 flex-1",
              active
                ? "bg-[repeating-linear-gradient(90deg,color-mix(in_srgb,var(--color-tint)_18%,transparent)_0_2px,transparent_2px_6px)]"
                : "bg-[repeating-linear-gradient(90deg,#F0524B4D_0_2px,transparent_2px_6px)]",
            )}
          />
        </div>
      </div>

      <dl className="flex gap-4 border-t border-line-soft pt-6">
        <Stat value={units.sold} label="Prodáno" muted={!active} />
        <Stat value={units.reserved} label="Rezervace" muted={!active} />
        <Stat value={units.preReserved} label="Předrezervace" muted={!active} />
      </dl>
    </Link>
  );
}
