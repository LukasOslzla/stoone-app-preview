"use client";

import {
  ArrowCounterClockwiseIcon,
  CheckCircleIcon,
  DesktopIcon,
  DeviceMobileIcon,
  DeviceTabletIcon,
  SpinnerIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import type { PreviewDevice } from "./SitePreview";
import { TargetSelect, type EditorTarget } from "./TargetSelect";
import type { DraftStatus } from "./useEditorDraft";

type EditorBarProps = {
  targets: EditorTarget[];
  target: string;
  onTargetChange: (id: string) => void;
  projectName: string;
  device: PreviewDevice;
  onDeviceChange: (device: PreviewDevice) => void;
  status: DraftStatus;
  canUndo: boolean;
  onUndo: () => void;
  onPublish: () => void;
  /** "Zveřejnit změny" by default; shared content names the number of webs. */
  publishLabel?: string;
};

const statusLabels: Record<DraftStatus, string> = {
  saving: "Ukládám…",
  draft: "Rozpracováno · uloženo",
  publishing: "Zveřejňuji…",
  published: "Vše je zveřejněno",
};

/** Toolbar of the editor: what is edited, preview size, draft state, publish. */
export function EditorBar({
  targets,
  target,
  onTargetChange,
  projectName,
  device,
  onDeviceChange,
  status,
  canUndo,
  onUndo,
  onPublish,
  publishLabel = "Zveřejnit změny",
}: EditorBarProps) {
  const busy = status === "saving" || status === "publishing";

  return (
    <div className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-line-soft px-5">
      <div className="flex min-w-0 items-center gap-3">
        <TargetSelect
          targets={targets}
          value={target}
          onChange={onTargetChange}
          projectName={projectName}
        />
        <SegmentedControl
          label="Velikost náhledu"
          shape="pill"
          className="max-md:hidden"
          value={device}
          onChange={onDeviceChange}
          options={[
            {
              value: "desktop",
              label: "Počítač",
              icon: <DesktopIcon weight="fill" className="size-[15px]" />,
            },
            {
              value: "tablet",
              label: "Tablet",
              icon: <DeviceTabletIcon weight="fill" className="size-[15px]" />,
            },
            {
              value: "mobile",
              label: "Mobil",
              icon: <DeviceMobileIcon weight="fill" className="size-[15px]" />,
            },
          ]}
        />
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <p
          role="status"
          className="flex items-center gap-1.5 font-text text-xs leading-[1.4] text-fg-3 max-lg:hidden"
        >
          {busy ? (
            <SpinnerIcon weight="bold" className="size-3.5 animate-spin" />
          ) : (
            <CheckCircleIcon weight="fill" className="size-3.5 text-green" />
          )}
          {statusLabels[status]}
        </p>
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          aria-label="Vrátit poslední změnu"
          title="Vrátit poslední změnu"
          className="flex size-9 items-center justify-center rounded-full border border-line-soft text-fg-2 transition-colors enabled:hover:bg-tint/5 enabled:hover:text-fg disabled:opacity-40 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-beige"
        >
          <ArrowCounterClockwiseIcon weight="bold" className="size-3.5" />
        </button>
        <Button
          size="md"
          loading={status === "publishing"}
          loadingLabel="Zveřejňuji…"
          disabled={status === "published"}
          onClick={onPublish}
        >
          {publishLabel}
        </Button>
      </div>
    </div>
  );
}
