"use client";

import { useState } from "react";
import { ArrowsClockwiseIcon, SpinnerIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { syncRealpad, type RealpadStatus } from "@/lib/projects";

export type RealpadSyncState = "ok" | "syncing" | "error";

type RealpadSyncPillProps = {
  state: RealpadSyncState;
  /** Time of the last successful sync, e.g. "před 5 min". */
  lastSync: string;
  onSync?: () => void;
  className?: string;
};

/**
 * Realpad sync status with the manual refresh button:
 * `ok` = green dot and the time, `syncing` = spinner, `error` = yellow pill
 * with the time of the last successful sync.
 */
export function RealpadSyncPill({
  state,
  lastSync,
  onSync,
  className,
}: RealpadSyncPillProps) {
  const error = state === "error";
  const syncing = state === "syncing";

  return (
    <div
      role="status"
      title={
        error
          ? "Poslední synchronizace se nepovedla. Data na webu nemusí být aktuální."
          : undefined
      }
      className={cn(
        "flex items-center gap-2",
        error && "rounded-full bg-yellow/10 py-1 pr-1 pl-2.5",
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          error ? "bg-yellow" : syncing ? "bg-beige" : "bg-green",
        )}
      />
      <span
        className={cn(
          "font-text text-xs leading-none font-medium whitespace-nowrap",
          error ? "text-yellow" : "text-fg-3",
        )}
      >
        Realpad ·{" "}
        {syncing
          ? "synchronizuji…"
          : error
            ? `naposledy ${lastSync}`
            : lastSync}
      </span>
      <button
        type="button"
        onClick={onSync}
        disabled={syncing}
        aria-label={
          error ? "Zkusit synchronizaci znovu" : "Synchronizovat s Realpadem"
        }
        title={
          error ? "Zkusit synchronizaci znovu" : "Synchronizovat s Realpadem"
        }
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full border border-line-soft transition-colors enabled:hover:bg-tint/5 focus-visible:outline-[1.5px] focus-visible:outline-beige",
          error
            ? "text-yellow"
            : syncing
              ? "text-beige"
              : "text-fg-2 enabled:hover:text-fg",
        )}
      >
        {syncing ? (
          <SpinnerIcon weight="bold" className="size-[13px] animate-spin" />
        ) : (
          <ArrowsClockwiseIcon weight="fill" className="size-[13px]" />
        )}
      </button>
    </div>
  );
}

type RealpadSyncProps = { projectSlug: string; initial: RealpadStatus };

/** Sync status in the project header; the button starts a new sync. */
export function RealpadSync({ projectSlug, initial }: RealpadSyncProps) {
  const [status, setStatus] = useState(initial);
  const [syncing, setSyncing] = useState(false);

  async function sync() {
    setSyncing(true);
    try {
      setStatus(await syncRealpad(projectSlug));
    } catch {
      setStatus((current) => ({ ...current, failed: true }));
    } finally {
      setSyncing(false);
    }
  }

  return (
    <RealpadSyncPill
      state={syncing ? "syncing" : status.failed ? "error" : "ok"}
      lastSync={status.lastSync}
      onSync={sync}
      className="max-lg:hidden"
    />
  );
}
