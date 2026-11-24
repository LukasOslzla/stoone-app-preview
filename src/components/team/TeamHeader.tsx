"use client";

import { useState } from "react";
import { UserPlusIcon } from "@phosphor-icons/react";
import { PageIntro } from "@/components/app/PageIntro";
import { Button } from "@/components/ui/Button";
import { TabNav } from "@/components/ui/TabNav";
import { roles, type TeamUser } from "@/lib/team";
import { InviteUserDialog } from "./InviteUserDialog";

export type TeamContext = {
  projectSlug: string;
  /** All projects, for the invite dialog and the role description. */
  projects: { slug: string; name: string }[];
};

type TeamHeaderProps = TeamContext & {
  userCount: number;
  onInvited?: (user: TeamUser) => void;
};

/** Title, "Pozvat uživatele" and the tabs shared by Uživatelé and Role. */
export function TeamHeader({
  projectSlug,
  projects,
  userCount,
  onInvited,
}: TeamHeaderProps) {
  const [inviting, setInviting] = useState(false);
  const base = `/projects/${projectSlug}/users`;

  return (
    <>
      <PageIntro
        title="Uživatelé a role"
        description="Kdo má přístup do administrace a co v ní smí dělat."
        action={
          <Button size="md" onClick={() => setInviting(true)}>
            <UserPlusIcon weight="fill" className="size-[15px]" />
            Pozvat uživatele
          </Button>
        }
      />

      <TabNav
        label="Uživatelé a role"
        tabs={[
          { label: "Uživatelé", href: base, count: userCount },
          {
            label: "Role",
            href: `${base}/roles`,
            count: roles.length,
            restriction: "jen správce",
          },
        ]}
      />

      <InviteUserDialog
        open={inviting}
        onClose={() => setInviting(false)}
        onInvited={(user) => onInvited?.(user)}
        projects={projects}
        currentProjectSlug={projectSlug}
      />
    </>
  );
}
