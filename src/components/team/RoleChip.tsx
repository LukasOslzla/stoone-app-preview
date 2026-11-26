import { createElement } from "react";
import type { Icon, IconProps } from "@phosphor-icons/react";
import {
  PencilSimpleIcon,
  ShieldIcon,
  UserGearIcon,
} from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/cn";
import { roles, type RoleId } from "@/lib/team";

export const roleIcons: Record<string, Icon> = {
  admin: ShieldIcon,
  editor: PencilSimpleIcon,
};

/** Icon of a role; roles created by the user share one icon. */
export function RoleIcon({ role, ...props }: IconProps & { role: RoleId }) {
  return createElement(roleIcons[role] ?? UserGearIcon, {
    weight: "fill",
    ...props,
  });
}

/** Pill with the role of a user; the admin role is highlighted. */
export function RoleChip({
  role,
  name,
}: {
  role: RoleId;
  /** Name of a role that is not built in. */
  name?: string;
}) {
  const admin = role === "admin";

  return (
    <span
      className={cn(
        "inline-flex h-[26px] items-center gap-1.5 rounded-full border px-2.5 font-text text-xs leading-none font-semibold",
        admin
          ? "border-beige/35 bg-beige/12 text-beige"
          : "border-line-soft bg-control text-fg-2",
      )}
    >
      <RoleIcon role={role} className="size-3" />
      {name ?? roles.find((item) => item.id === role)?.name}
    </span>
  );
}
