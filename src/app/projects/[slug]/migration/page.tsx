import type { Metadata } from "next";
import { Suspense } from "react";
import { MigrationPage } from "@/components/migration/MigrationPage";
import { getMigrationHistory } from "@/lib/migration";
import { getProjects } from "@/lib/projects";
import { getAccount } from "@/lib/user";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "Migrace dat" };

/** Moving content between projects (admins only). */
export default function MigrationRoute({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: Props) {
  const { slug } = await params;
  const [projects, history, account] = await Promise.all([
    getProjects(),
    getMigrationHistory(),
    getAccount(),
  ]);

  return (
    <MigrationPage
      projectSlug={slug}
      projects={projects.map(({ slug, name }) => ({ slug, name }))}
      history={history}
      authorName={account.firstName}
    />
  );
}
