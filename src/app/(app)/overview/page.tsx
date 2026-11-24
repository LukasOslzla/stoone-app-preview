import type { Metadata } from "next";
import { PageHeader } from "@/components/app/PageHeader";
import { ProjectCard } from "@/components/app/ProjectCard";
import { getProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Výběr projektů",
};

export default async function OverviewPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHeader title="Výběr projektů" />

      <div className="grid grid-cols-1 gap-5 px-8 pt-7 pb-8 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </>
  );
}
