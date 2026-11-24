import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { FilesLibrary } from "@/components/files/FilesLibrary";
import { getLibraryCounts, getLibraryFiles } from "@/lib/files";
import { getProject } from "@/lib/projects";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "Soubory" };

/** File library of the project. */
export default function FilesPage({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: Props) {
  const { slug } = await params;
  const [project, files, counts] = await Promise.all([
    getProject(slug),
    getLibraryFiles(slug),
    getLibraryCounts(slug),
  ]);
  if (!project) notFound();

  return (
    <FilesLibrary
      projectSlug={slug}
      projectName={project.name}
      realpad={Boolean(project.realpadSync)}
      files={files}
      counts={counts}
    />
  );
}
