import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import { ProjectSidebar } from "@/components/app/sidebar/ProjectSidebar";
import {
  ProjectHeader,
  ProjectHeaderSkeleton,
} from "@/components/project/ProjectHeader";
import { getProject, getProjects } from "@/lib/projects";
import { currentUser } from "@/lib/user";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

/**
 * Shell shared by all pages of one project: project menu + project header.
 * Everything that depends on the URL sits behind <Suspense> so navigation
 * between projects stays instant.
 */
export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  return (
    <AppShell
      sidebar={
        <Suspense
          fallback={
            <div className="h-full w-[248px] shrink-0 border-r border-line-soft" />
          }
        >
          <ProjectSidebar user={currentUser} />
        </Suspense>
      }
    >
      <Suspense fallback={<ProjectHeaderSkeleton />}>
        <CurrentProjectHeader params={params} />
      </Suspense>
      {children}
    </AppShell>
  );
}

async function CurrentProjectHeader({ params }: { params: Params }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return <ProjectHeader project={project} />;
}
