"use client";

import { useState } from "react";
import { PlusCircleIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { cn } from "@/lib/cn";
import { plural } from "@/lib/format";
import {
  permissionActions,
  permissionAreas,
  roles as builtInRoles,
  saveRolePermissions,
  type PermissionAction,
  type PermissionArea,
  type Permissions,
  type RoleId,
  type TeamUser,
} from "@/lib/team";
import { CreateRoleDialog } from "./CreateRoleDialog";
import { RoleIcon } from "./RoleChip";
import { TeamHeader, type TeamContext } from "./TeamHeader";

type RolesTabProps = TeamContext & {
  users: TeamUser[];
  permissions: Record<RoleId, Permissions>;
};

const joinNames = (names: string[]) =>
  names.length <= 1
    ? names.join("")
    : `${names.slice(0, -1).join(", ")} a ${names.at(-1)}`;

/** "Uživatelé a role" – tab Role: roles on the left, what a role may do on the right. */
export function RolesTab({
  users,
  permissions: initialPermissions,
  ...context
}: RolesTabProps) {
  const [roles, setRoles] = useState(builtInRoles);
  const [selectedId, setSelectedId] = useState<RoleId>("editor");
  const [permissions, setPermissions] = useState(initialPermissions);
  const [creating, setCreating] = useState(false);

  const selected = roles.find((role) => role.id === selectedId)!;
  const granted = permissions[selectedId];
  // The admin role always has everything.
  const locked = selectedId === "admin";

  function toggle(area: PermissionArea, action: PermissionAction, on: boolean) {
    const next: Permissions = {
      ...granted,
      [area]: on
        ? [...granted[area], action]
        : granted[area].filter((item) => item !== action),
    };
    setPermissions((current) => ({ ...current, [selectedId]: next }));
    void saveRolePermissions(selectedId, next);
  }

  return (
    <div className="flex flex-col gap-5 px-8 pt-7 pb-8">
      <TeamHeader
        {...context}
        userCount={users.filter((user) => user.lastActiveAt).length}
      />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="flex w-full flex-col gap-2.5 lg:w-[300px] lg:shrink-0">
          {roles.map((role) => {
            const active = role.id === selectedId;
            const count = users.filter((user) => user.role === role.id).length;

            return (
              <button
                key={role.id}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedId(role.id)}
                className={cn(
                  "flex flex-col gap-2 rounded-2xl p-4 text-left transition-colors focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-beige",
                  active
                    ? "border-[1.5px] border-beige bg-beige/8"
                    : "surface-card hover:brightness-110",
                )}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-[10px]",
                      active ? "bg-beige text-ink" : "bg-control text-fg",
                    )}
                  >
                    <RoleIcon role={role.id} className="size-[15px]" />
                  </span>
                  <span className="min-w-0 flex-1 font-text text-base leading-[1.4] font-medium text-fg">
                    {role.name}
                  </span>
                  <span className="font-text text-xs leading-[1.4] text-fg-3">
                    {count}{" "}
                    {plural(count, ["uživatel", "uživatelé", "uživatelů"])}
                  </span>
                </span>
                <span className="font-text text-xs leading-[1.45] text-fg-3">
                  {role.description}
                </span>
              </button>
            );
          })}

          <Button
            variant="outline"
            size="md"
            className="w-full"
            onClick={() => setCreating(true)}
          >
            <PlusCircleIcon weight="fill" className="size-[15px] text-fg-2" />
            Vytvořit roli
          </Button>
        </div>

        <Card className="flex min-w-0 flex-1 flex-col px-6 py-5">
          <div className="pb-3.5">
            <CardHeader
              title={`Co smí ${selected.name}`}
              description={
                locked
                  ? "Správce smí vždy všechno, jeho oprávnění nejde omezit."
                  : `Platí pro projekty ${joinNames(context.projects.map((project) => project.name))}`
              }
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse">
              <thead>
                <tr className="border-b border-line-soft font-text text-xs leading-[1.4] font-semibold text-fg-3">
                  <th scope="col" className="py-2.5 text-left font-semibold">
                    Oblast
                  </th>
                  {permissionActions.map((action) => (
                    <th
                      key={action.id}
                      scope="col"
                      className="w-[84px] py-2.5 text-center font-semibold"
                    >
                      {action.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissionAreas.map((area) => (
                  <tr
                    key={area.id}
                    className="border-line-soft not-last:border-b"
                  >
                    <th
                      scope="row"
                      className="py-[11px] text-left font-text text-sm leading-[1.4] font-medium text-fg"
                    >
                      {area.label}
                    </th>
                    {permissionActions.map((action) => (
                      <td key={action.id} className="py-[11px]">
                        <span className="flex justify-center">
                          <Checkbox
                            hideLabel
                            label={`${area.label}: ${action.label.toLowerCase()}`}
                            checked={granted[area.id].includes(action.id)}
                            disabled={locked}
                            onChange={(event) =>
                              toggle(area.id, action.id, event.target.checked)
                            }
                          />
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <CreateRoleDialog
        open={creating}
        onClose={() => setCreating(false)}
        roles={roles}
        onCreated={(role, copyOf) => {
          setRoles((current) => [...current, role]);
          setPermissions((current) => ({
            ...current,
            [role.id]: structuredClone(current[copyOf]),
          }));
          setSelectedId(role.id);
        }}
      />
    </div>
  );
}
