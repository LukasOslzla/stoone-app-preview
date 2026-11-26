import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { NotFoundTab } from "@/components/settings/NotFoundTab";
import { getProject } from "@/lib/projects";
import { getSiteSettings } from "@/lib/site-settings";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "Stránka nenalezena (404)" };

export default function SettingsRoute({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: Props) {
  const { slug } = await params;
  const [project, settings] = await Promise.all([
    getProject(slug),
    getSiteSettings(slug),
  ]);
  if (!project) notFound();

  return (
    <NotFoundTab
      projectSlug={slug}
      projectName={project.name}
      settings={settings}
    />
  );
}
