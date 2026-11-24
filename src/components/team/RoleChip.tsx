import { PencilSimpleIcon, ShieldIcon } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/cn";
import { roles, type RoleId } from "@/lib/team";

export const roleIcons = { admin: ShieldIcon, editor: PencilSimpleIcon };

/** Pill with the role of a user; the admin role is highlighted. */
export function RoleChip({ role }: { role: RoleId }) {
  const IconComponent = roleIcons[role];
  const admin = role === "admin";

  return (
    <span
      className={cn(
        "inline-flex h-[26px] items-center gap-1.5 rounded-full border px-2.5 font-text text-xs leading-none font-semibold",
        admin
          ? "border-[#CAC3B859] bg-[#CAC3B81F] text-beige"
          : "border-line-soft bg-control text-fg-2",
      )}
    >
      <IconComponent weight="fill" className="size-3" />
      {roles.find((item) => item.id === role)?.name}
    </span>
  );
}
