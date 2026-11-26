/**
 * People with access to the administration and what their roles may do.
 *
 * MOCK DATA — replace the functions below with real API calls.
 */

/** "admin" and "editor" are built in; created roles get their own id. */
export type RoleId = string;

export type Role = {
  id: RoleId;
  name: string;
  description: string;
  /** Shorter description used in the invite dialog. */
  inviteDescription: string;
  /** Created by the user (built-in roles cannot be removed). */
  custom?: boolean;
};

export const roles: Role[] = [
  {
    id: "admin",
    name: "Správce",
    description: "Může všechno, včetně projektů a uživatelů",
    inviteDescription: "Může všechno, včetně uživatelů",
  },
  {
    id: "editor",
    name: "Editor",
    description: "Upravuje obsah webu, byty a soubory",
    inviteDescription: "Upravuje obsah webu, byty a soubory",
  },
];

export type TeamUser = {
  id: string;
  name: string;
  /** Masked in the list ("lu…@artstay.co"), the way the design shows it. */
  email: string;
  role: RoleId;
  /** Slugs of the projects the user can open; "all" = every project. */
  projects: "all" | string[];
  /** ISO date; `null` = invited, has not signed in yet. */
  lastActiveAt: string | null;
};

const users: TeamUser[] = [
  { name: "Lukáš", email: "lu…@artstay.co", role: "admin", at: "2026-11-02" },
  { name: "Bára", email: "tr…@stoone.cz", role: "editor", at: "2026-10-27" },
  { name: "Patrik", email: "pa…@artstay.co", role: "admin", at: "2026-10-22" },
  {
    name: "Marketing",
    email: "ma…@pentarealestate.com",
    role: "editor",
    at: "2026-10-12",
  },
  {
    name: "Eliška",
    email: "ji…@pentarealestate.com",
    role: "editor",
    at: "2026-10-07",
  },
  {
    name: "Nicole",
    email: "vo…@pentarealestate.com",
    role: "editor",
    at: "2026-10-07",
  },
  { name: "Dominik", email: "do…@artstay.co", role: "admin", at: "2026-06-29" },
].map(({ at, ...user }, index) => ({
  ...user,
  id: `user-${index + 1}`,
  role: user.role as RoleId,
  projects: "all" as const,
  lastActiveAt: at,
}));

export async function getTeamUsers(): Promise<TeamUser[]> {
  return users;
}

export const permissionActions = [
  { id: "view", label: "Zobrazit" },
  { id: "edit", label: "Upravit" },
  { id: "add", label: "Přidat" },
  { id: "delete", label: "Smazat" },
] as const;

export type PermissionAction = (typeof permissionActions)[number]["id"];

export const permissionAreas = [
  { id: "pages", label: "Stránky webu" },
  { id: "layout", label: "Hlavička a patička" },
  { id: "settings", label: "Nastavení webu" },
  { id: "units", label: "Byty" },
  { id: "structure", label: "Budovy, patra a sektory" },
  { id: "files", label: "Soubory" },
  { id: "shared", label: "Sdílený obsah" },
  { id: "projects", label: "Projekty" },
] as const;

export type PermissionArea = (typeof permissionAreas)[number]["id"];

export type Permissions = Record<PermissionArea, PermissionAction[]>;

const everything: PermissionAction[] = ["view", "edit", "add", "delete"];

const permissions: Record<RoleId, Permissions> = {
  admin: {
    pages: everything,
    layout: everything,
    settings: everything,
    units: everything,
    structure: everything,
    files: everything,
    shared: everything,
    projects: everything,
  },
  editor: {
    pages: everything,
    layout: ["view", "edit"],
    settings: ["view", "edit"],
    units: ["view", "edit"],
    structure: ["view", "edit"],
    files: everything,
    shared: everything,
    projects: ["view"],
  },
};

export async function getRolePermissions(): Promise<
  Record<RoleId, Permissions>
> {
  return permissions;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type Invitation = {
  email: string;
  name: string;
  role: RoleId;
  projects: string[];
};

/** Mock invite: no e-mail is sent. Returns the pending user. */
export async function inviteUser(invitation: Invitation): Promise<TeamUser> {
  await wait(700);
  return {
    id: `invite-${Date.now()}`,
    name: invitation.name.trim() || invitation.email.split("@")[0],
    email: invitation.email.trim(),
    role: invitation.role,
    projects: invitation.projects,
    lastActiveAt: null,
  };
}

/** Mock removal of a user's access. */
export async function removeUser(userId: string): Promise<void> {
  void userId;
  await wait(600);
}

/** Mock save of one permission switch. */
export async function saveRolePermissions(
  roleId: RoleId,
  value: Permissions,
): Promise<void> {
  void roleId;
  void value;
  await wait(300);
}

/** Mock: waits and returns the new role. */
export async function createRole(input: {
  name: string;
  description: string;
}): Promise<Role> {
  await wait(700);
  return {
    id: `role-${Date.now()}`,
    name: input.name,
    description: input.description || "Vlastní role",
    inviteDescription: input.description || "Vlastní role",
    custom: true,
  };
}
