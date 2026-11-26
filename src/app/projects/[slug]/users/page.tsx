import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { UsersTab } from "@/components/team/UsersTab";
import { getProjects } from "@/lib/projects";
import { getTeamUsers } from "@/lib/team";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "Uživatelé a role" };

/** Users with access to the administration. */
export default function UsersPage({ params }: Props) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: Props) {
  const { slug } = await params;
  const [projects, users] = await Promise.all([getProjects(), getTeamUsers()]);

  return (
    <UsersTab
      projectSlug={slug}
      projects={projects.map(({ slug, name }) => ({ slug, name }))}
      users={users}
    />
  );
}
