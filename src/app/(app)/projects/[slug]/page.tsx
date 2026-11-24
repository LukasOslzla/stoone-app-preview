import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/app/PageHeader";
import { getProject, getProjects } from "@/lib/projects";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  return { title: project?.name };
}

/** Placeholder — the project dashboard is not implemented yet. */
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return (
    <>
      <PageHeader title={project.name} />
      <div className="flex flex-col items-start gap-4 px-8 pt-7">
        <p className="font-text text-[15px] leading-normal text-fg-2">
          Dashboard projektu zatím není nakódovaný.
        </p>
        <Link
          href="/overview"
          className="rounded-md font-text text-[13px] leading-[1.4] font-semibold text-beige transition-colors hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige"
        >
          ← Zpět na výběr projektů
        </Link>
      </div>
    </>
  );
}
