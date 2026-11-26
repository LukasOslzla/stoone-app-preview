import { PageHeader } from "@/components/app/PageHeader";
import { DashboardOnly } from "@/components/project/DashboardOnly";
import { RealpadSync } from "@/components/project/RealpadSync";
import { ProjectSwitcher } from "@/components/project/ProjectSwitcher";
import { RangeSelect } from "@/components/project/RangeSelect";
import type { Project } from "@/lib/projects";

/** Header of every project page: project switcher + sync, range, language, theme. */
export function ProjectHeader({
  project,
  projects,
}: {
  project: Project;
  /** Projects offered by the switcher. */
  projects: Project[];
}) {
  return (
    <PageHeader
      size="compact"
      leading={<ProjectSwitcher project={project} projects={projects} />}
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
            <RangeSelect />
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
          <div className="size-11 rounded-xl bg-tint/5" />
          <div className="flex flex-col gap-2">
            <div className="h-5 w-32 rounded bg-tint/5" />
            <div className="h-3.5 w-48 rounded bg-tint/5" />
          </div>
        </div>
      }
    />
  );
}
