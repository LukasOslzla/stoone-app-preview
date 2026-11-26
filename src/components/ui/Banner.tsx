import type { ReactNode } from "react";
import type { Icon } from "@phosphor-icons/react";
import {
  CheckCircleIcon,
  LockIcon,
  TimerIcon,
  XCircleIcon,
} from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/cn";

export type BannerTone = "error" | "locked" | "warning" | "success";

const tones: Record<
  BannerTone,
  { box: string; iconColor: string; icon: Icon; role: "alert" | "status" }
> = {
  error: {
    box: "border-red/35 bg-red/8",
    iconColor: "text-red",
    icon: XCircleIcon,
    role: "alert",
  },
  locked: {
    box: "border-red/35 bg-red/8",
    iconColor: "text-red",
    icon: LockIcon,
    role: "alert",
  },
  warning: {
    box: "border-yellow/35 bg-yellow/8",
    iconColor: "text-yellow",
    icon: TimerIcon,
    role: "status",
  },
  success: {
    box: "border-green/35 bg-green/8",
    iconColor: "text-green",
    icon: CheckCircleIcon,
    role: "status",
  },
};

type BannerProps = {
  tone: BannerTone;
  children: ReactNode;
  /** Replaces the default icon of the tone. */
  icon?: Icon;
  className?: string;
};

export function Banner({ tone, children, icon, className }: BannerProps) {
  const { box, iconColor, icon: defaultIcon, role } = tones[tone];
  const IconComponent = icon ?? defaultIcon;

  return (
    <div
      role={role}
      className={cn(
        "flex w-full gap-2.5 rounded-[14px] border px-3.5 py-3",
        box,
        className,
      )}
    >
      <IconComponent
        weight="fill"
        className={cn("size-[18px] shrink-0", iconColor)}
      />
      <p className="min-w-0 flex-1 font-text text-[13px] leading-[1.45] text-fg">
        {children}
      </p>
    </div>
  );
}
