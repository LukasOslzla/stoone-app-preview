"use client";

import { useState } from "react";
import { EnvelopeSimpleIcon, UserMinusIcon } from "@phosphor-icons/react";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { InfoStrip } from "@/components/ui/InfoStrip";
import { formatDate, plural } from "@/lib/format";
import { removeUser, type TeamUser } from "@/lib/team";
import { RoleChip } from "./RoleChip";
import { TeamHeader, type TeamContext } from "./TeamHeader";

type UsersTabProps = TeamContext & { users: TeamUser[] };

/** "Uživatelé a role" – tab Uživatelé. */
export function UsersTab({ users: initialUsers, ...context }: UsersTabProps) {
  const [users, setUsers] = useState(initialUsers);
  const [toRemove, setToRemove] = useState<TeamUser | null>(null);
  const [removing, setRemoving] = useState(false);

  const active = users.filter((user) => user.lastActiveAt);
  const pending = users.filter((user) => !user.lastActiveAt);
  const projectCount = context.projects.length;

  const projectsLabel = (user: TeamUser) => {
    if (user.projects === "all" || user.projects.length === projectCount) {
      return `Všechny ${projectCount} projekty`;
    }
    return context.projects
      .filter((project) => user.projects.includes(project.slug))
      .map((project) => project.name)
      .join(", ");
  };

  const columns: DataTableColumn<TeamUser>[] = [
    {
      id: "user",
      header: "Uživatel",
      cell: (user) => (
        <span className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line-soft bg-control text-sm leading-none font-semibold text-fg">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <span className="flex min-w-0 flex-col gap-px">
            <span className="truncate text-sm font-semibold text-fg">
              {user.name}
            </span>
            <span className="truncate text-xs text-fg-3">{user.email}</span>
          </span>
        </span>
      ),
    },
    {
      id: "role",
      header: "Role",
      width: "w-[186px]",
      cell: (user) => <RoleChip role={user.role} />,
    },
    {
      id: "projects",
      header: "Projekty",
      width: "w-[236px]",
      cell: projectsLabel,
    },
    {
      id: "activity",
      header: "Poslední aktivita",
      width: "w-[166px]",
      className: "text-fg-3",
      cell: (user) =>
        user.lastActiveAt ? formatDate(user.lastActiveAt) : "Pozvánka odeslána",
    },
    {
      id: "actions",
      header: "",
      width: "w-[56px]",
      align: "right",
      cell: (user) => (
        <ActionMenu
          label={`Akce: ${user.name}`}
          items={[
            {
              label: user.lastActiveAt ? "Odebrat přístup" : "Zrušit pozvánku",
              tone: "danger",
              icon: <UserMinusIcon weight="fill" className="size-3.5" />,
              onSelect: () => setToRemove(user),
            },
          ]}
        />
      ),
    },
  ];

  async function handleRemove() {
    if (!toRemove) return;
    setRemoving(true);
    await removeUser(toRemove.id);
    setUsers((current) => current.filter((user) => user.id !== toRemove.id));
    setRemoving(false);
    setToRemove(null);
  }

  const table = (rows: TeamUser[]) => (
    <Card className="px-6 py-1.5">
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(user) => user.id}
        sort={null}
        onSortChange={() => {}}
        minWidth={860}
      />
    </Card>
  );

  return (
    <div className="flex flex-col gap-5 px-8 pt-7 pb-8">
      <TeamHeader
        {...context}
        userCount={active.length}
        onInvited={(user) => setUsers((current) => [...current, user])}
      />

      {table(active)}

      {pending.length === 0 ? (
        <InfoStrip icon={EnvelopeSimpleIcon}>
          <span className="text-fg-3">
            Pozvaní uživatelé, kteří se ještě nepřihlásili, se zobrazí tady.
          </span>
        </InfoStrip>
      ) : (
        <>
          {/* Not in the design: the list of pending invitations. */}
          <h2 className="pt-1 font-text text-[13px] leading-[1.4] font-semibold text-fg-2">
            {pending.length}{" "}
            {plural(pending.length, [
              "pozvaný uživatel se ještě nepřihlásil",
              "pozvaní uživatelé se ještě nepřihlásili",
              "pozvaných uživatelů se ještě nepřihlásilo",
            ])}
          </h2>
          {table(pending)}
        </>
      )}

      <ConfirmDialog
        open={toRemove !== null}
        onClose={() => setToRemove(null)}
        onConfirm={handleRemove}
        loading={removing}
        title={
          toRemove
            ? toRemove.lastActiveAt
              ? `Odebrat přístup: ${toRemove.name}?`
              : `Zrušit pozvánku: ${toRemove.name}?`
            : ""
        }
        description={
          toRemove?.lastActiveAt
            ? "Uživatel se už do administrace nepřihlásí. Obsah, který vytvořil, zůstane."
            : "Odkaz z pozvánky přestane fungovat."
        }
        confirmLabel={
          toRemove?.lastActiveAt ? "Odebrat přístup" : "Zrušit pozvánku"
        }
      />
    </div>
  );
}
