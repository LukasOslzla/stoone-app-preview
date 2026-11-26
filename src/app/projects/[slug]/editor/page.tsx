import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ContentEditor } from "@/components/editor/ContentEditor";
import { getEditorData } from "@/lib/editor";
import { getProject } from "@/lib/projects";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "Editor obsahu" };

/** Content editor of the project's public web. */
export default function EditorRoute({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const data = await getEditorData(slug, project.name);
  return <ContentEditor projectSlug={slug} data={data} />;
}
