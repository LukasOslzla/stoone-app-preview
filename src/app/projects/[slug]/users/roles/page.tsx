import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { RolesTab } from "@/components/team/RolesTab";
import { getProjects } from "@/lib/projects";
import { getRolePermissions, getTeamUsers } from "@/lib/team";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "Role" };

/** Roles and what each of them may do. */
export default function RolesPage({ params }: Props) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: Props) {
  const { slug } = await params;
  const [projects, users, permissions] = await Promise.all([
    getProjects(),
    getTeamUsers(),
    getRolePermissions(),
  ]);

  return (
    <RolesTab
      projectSlug={slug}
      projects={projects.map(({ slug, name }) => ({ slug, name }))}
      users={users}
      permissions={permissions}
    />
  );
}
