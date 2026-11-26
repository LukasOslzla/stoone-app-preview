"use client";

import { SquaresFourIcon } from "@phosphor-icons/react";
import { ChevronsUpDown } from "lucide-react";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { LogoTile } from "@/components/ui/LogoTile";
import { cn } from "@/lib/cn";
import { formatBuildings, formatUnits, type Project } from "@/lib/projects";

type ProjectSwitcherProps = {
  project: Project;
  /** Every project the user can switch to. */
  projects: Project[];
};

/** Current project in the header; opens the list of the other projects. */
export function ProjectSwitcher({ project, projects }: ProjectSwitcherProps) {
  return (
    <DropdownMenu
      label="Přepnout projekt"
      width="w-[300px]"
      className="min-w-0"
      groups={[
        {
          label: "Projekty",
          items: projects.map((item) => ({
            id: item.slug,
            label: item.name,
            description: `${formatBuildings(item.buildings)} · ${formatUnits(item.units.total)}`,
            icon: (
              <span
                className={cn(
                  "size-[7px] rounded-full",
                  item.active ? "bg-green" : "bg-red",
                )}
              />
            ),
            note: item.active ? undefined : "Neaktivní",
            selected: item.slug === project.slug,
            href: `/projects/${item.slug}`,
          })),
        },
        {
          items: [
            {
              id: "all",
              label: "Všechny projekty",
              icon: <SquaresFourIcon weight="fill" />,
              href: "/overview",
            },
          ],
        },
      ]}
      trigger={(props, open) => (
        <button
          type="button"
          title="Přepnout projekt"
          {...props}
          className={cn(
            "-m-1.5 flex max-w-full min-w-0 items-center gap-3.5 rounded-2xl p-1.5 text-left transition-colors hover:bg-white/5 focus-visible:outline-[1.5px] focus-visible:outline-beige",
            open && "bg-white/5",
          )}
        >
          <LogoTile text={project.logoText} size="md" muted={!project.active} />
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="flex items-center gap-2">
              <span className="truncate font-title text-xl leading-[1.2] font-medium text-fg">
                {project.name}
              </span>
              <ChevronsUpDown className="size-4 shrink-0 text-fg-3" />
            </span>
            <span className="flex items-center gap-1.5 font-text text-[13px] leading-[1.4] font-medium text-fg-2">
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
            </span>
          </span>
        </button>
      )}
    />
  );
}
