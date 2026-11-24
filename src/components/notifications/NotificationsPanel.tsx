"use client";

import { useEffect, useRef } from "react";
import type { Icon } from "@phosphor-icons/react";
import {
  ChatCenteredTextIcon,
  CheckCircleIcon,
  TimerIcon,
  UserPlusIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import type { AppNotification, NotificationKind } from "@/lib/notifications";

const kinds: Record<NotificationKind, { icon: Icon; tile: string }> = {
  warning: { icon: WarningCircleIcon, tile: "bg-[#F2C94C1F] text-yellow" },
  inquiry: { icon: ChatCenteredTextIcon, tile: "bg-[#6FD13C1F] text-green" },
  deadline: { icon: TimerIcon, tile: "bg-[#F0524B1F] text-red" },
  done: { icon: CheckCircleIcon, tile: "bg-[#CAC3B81F] text-beige" },
  user: { icon: UserPlusIcon, tile: "bg-[#CAC3B81F] text-beige" },
};

type NotificationsPanelProps = {
  notifications: AppNotification[];
  onClose: () => void;
  onMarkAllRead: () => void;
  /** Called when the inline action of a notification is clicked. */
  onAction?: (notification: AppNotification) => void;
  className?: string;
};

/** Floating list of notifications; closes on Escape or a press outside. */
export function NotificationsPanel({
  notifications,
  onClose,
  onMarkAllRead,
  onAction,
  className,
}: NotificationsPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const hasUnread = notifications.some((item) => item.unread);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) onClose();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Notifikace"
      className={cn(
        "flex w-[400px] max-w-[calc(100vw-2rem)] flex-col gap-1 rounded-[20px] border border-line bg-card pt-[18px] pb-2 shadow-[0_24px_64px_#000000A6]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 px-5 pb-2">
        <h2 className="font-title text-lg leading-[1.4] font-medium text-fg">
          Notifikace
        </h2>
        <button
          type="button"
          disabled={!hasUnread}
          onClick={onMarkAllRead}
          className="rounded-md font-text text-xs leading-[1.4] font-semibold text-fg-2 transition-colors enabled:hover:text-fg disabled:opacity-40 focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige"
        >
          Označit vše jako přečtené
        </button>
      </div>

      <ul className="flex max-h-[min(520px,60vh)] flex-col gap-1 overflow-y-auto">
        {notifications.map((item) => {
          const { icon: IconComponent, tile } = kinds[item.kind];
          return (
            <li
              key={item.id}
              className={cn(
                "flex gap-3 px-5 py-3",
                item.unread && "bg-[#FFFFFF05]",
              )}
            >
              <span
                className={cn(
                  "flex size-[34px] shrink-0 items-center justify-center rounded-[10px]",
                  tile,
                )}
              >
                <IconComponent weight="fill" className="size-4" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                <p className="font-text text-[13px] leading-[1.35] font-semibold text-fg">
                  {item.title}
                </p>
                <p className="font-text text-xs leading-[1.4] text-fg-3">
                  {item.description}
                </p>
                <div className="flex items-center gap-2.5 pt-0.5">
                  <span className="font-text text-[11px] leading-[1.4] text-fg-3">
                    {item.time}
                  </span>
                  {item.actionLabel && (
                    <button
                      type="button"
                      onClick={() => onAction?.(item)}
                      className="rounded-md font-text text-xs leading-[1.4] font-semibold text-beige transition-colors hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-beige"
                    >
                      {item.actionLabel}
                    </button>
                  )}
                </div>
              </div>
              {item.unread && (
                <span
                  aria-label="Nepřečtené"
                  className="mt-1.5 size-[7px] shrink-0 rounded-full bg-beige"
                />
              )}
            </li>
          );
        })}
      </ul>

      <div className="flex justify-center border-t border-line-soft px-5 pt-2.5 pb-1.5">
        {/* Inert: notification settings have no design yet. */}
        <button
          type="button"
          className="rounded-md font-text text-xs leading-[1.4] font-semibold text-fg-2 transition-colors hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige"
        >
          Nastavení upozornění
        </button>
      </div>
    </div>
  );
}
