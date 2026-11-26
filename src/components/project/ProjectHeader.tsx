import Link from "next/link";
import { CalendarBlankIcon, CaretDownIcon } from "@phosphor-icons/react/ssr";
import { ChevronsUpDown } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { DashboardOnly } from "@/components/project/DashboardOnly";
import { RealpadSync } from "@/components/project/RealpadSync";
import { LogoTile } from "@/components/ui/LogoTile";
import { cn } from "@/lib/cn";
import { formatBuildings, formatUnits, type Project } from "@/lib/projects";

/** Header of every project page: project switcher + sync, range, language, theme. */
export function ProjectHeader({ project }: { project: Project }) {
  return (
    <PageHeader
      size="compact"
      leading={<ProjectSwitcher project={project} />}
      actions={
        <>
          {project.realpad && (
            <RealpadSync
              // A fresh state for every project.
              key={project.slug}
              projectSlug={project.slug}
              initial={project.realpad}
            />
          )}
          {/* The date range only applies to the dashboard. */}
          <DashboardOnly>
            <RangeSelect label="Posledních 30 dní" />
          </DashboardOnly>
        </>
      }
    />
  );
}

/** Placeholder with the same height while the project loads. */
export function ProjectHeaderSkeleton() {
  return (
    <PageHeader
      size="compact"
      leading={
        <div aria-hidden className="flex animate-pulse items-center gap-3.5">
          <div className="size-11 rounded-xl bg-white/5" />
          <div className="flex flex-col gap-2">
            <div className="h-5 w-32 rounded bg-white/5" />
            <div className="h-3.5 w-48 rounded bg-white/5" />
          </div>
        </div>
      }
    />
  );
}

/** Current project; for now it links back to the project selection. */
export function ProjectSwitcher({ project }: { project: Project }) {
  return (
    <Link
      href="/overview"
      title="Změnit projekt"
      className="-m-1.5 flex min-w-0 items-center gap-3.5 rounded-2xl p-1.5 transition-colors hover:bg-white/5 focus-visible:outline-[1.5px] focus-visible:outline-beige"
    >
      <LogoTile text={project.logoText} size="md" muted={!project.active} />
      <div className="flex min-w-0 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <h1 className="truncate font-title text-xl leading-[1.2] font-medium text-fg">
            {project.name}
          </h1>
          <ChevronsUpDown className="size-4 shrink-0 text-fg-3" />
        </div>
        <p className="flex items-center gap-1.5 font-text text-[13px] leading-[1.4] font-medium text-fg-2">
          <span
            className={cn(
              "size-[7px] shrink-0 rounded-full",
              project.active ? "bg-green" : "bg-red",
            )}
          />
          <span className="truncate">
            {project.active ? "Aktivní" : "Neaktivní"} ·{" "}
            {formatBuildings(project.buildings)} ·{" "}
            {formatUnits(project.units.total)}
          </span>
        </p>
      </div>
    </Link>
  );
}

/** Date-range picker trigger; the dropdown itself is not designed yet. */
export function RangeSelect({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex h-9 items-center gap-2 rounded-full border border-line px-3.5 transition-colors hover:bg-white/5 focus-visible:outline-[1.5px] focus-visible:outline-beige"
    >
      <CalendarBlankIcon weight="fill" className="size-[15px] text-fg-2" />
      <span className="font-text text-[13px] leading-[1.4] font-semibold whitespace-nowrap text-fg">
        {label}
      </span>
      <CaretDownIcon weight="fill" className="size-3.5 text-fg-3" />
    </button>
  );
}
