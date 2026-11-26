"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  CaretDownIcon,
  FolderIcon,
  PaperclipIcon,
  SparkleIcon,
  UploadSimpleIcon,
} from "@phosphor-icons/react";
import { ArrowUp, Plus, X } from "lucide-react";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { aiModels } from "@/lib/ai";
import { cn } from "@/lib/cn";
import { plural } from "@/lib/format";

type AiPromptProps = {
  /** Called with the prompt text; the AI backend is not wired up yet. */
  onSubmit?: (
    prompt: string,
    options: { model: string; files: File[] },
  ) => void;
  /** Id of the model selected at the start (see `lib/ai`). */
  defaultModel?: string;
  className?: string;
};

/** Floating AI prompt: attachments, the request and the model picker. */
export function AiPrompt({
  onSubmit,
  defaultModel = aiModels[0].id,
  className,
}: AiPromptProps) {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState(defaultModel);
  const [files, setFiles] = useState<File[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  const canSend = prompt.trim().length > 0;
  const currentModel =
    aiModels.find((item) => item.id === model) ?? aiModels[0];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSend) return;
    onSubmit?.(prompt.trim(), { model, files });
    setPrompt("");
    setFiles([]);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex h-[52px] items-center gap-3.5 rounded-full border border-line-soft bg-[#2A2A2FF2] pr-2.5 pl-[18px] shadow-[0_10px_32px_#00000080] backdrop-blur-[10px]",
        className,
      )}
    >
      <input
        ref={fileInput}
        type="file"
        multiple
        hidden
        onChange={(event) => {
          setFiles((current) => [
            ...current,
            ...Array.from(event.target.files ?? []),
          ]);
          event.target.value = "";
        }}
      />
      <DropdownMenu
        label="Přidat přílohu"
        side="top"
        width="w-[230px]"
        className="flex shrink-0"
        groups={[
          {
            items: [
              {
                id: "upload",
                label: "Nahrát z počítače",
                icon: <UploadSimpleIcon weight="fill" />,
                onSelect: () => fileInput.current?.click(),
              },
              // The picker of project files is not designed yet.
              {
                id: "library",
                label: "Vybrat ze Souborů",
                icon: <FolderIcon weight="fill" />,
                note: "připravujeme",
                disabled: true,
              },
            ],
          },
        ]}
        trigger={(props, open) => (
          <button
            type="button"
            aria-label="Přidat přílohu"
            title="Přidat přílohu"
            {...props}
            className={cn(
              "rounded-md transition-[color,rotate] hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige",
              open ? "rotate-45 text-fg" : "text-fg-2",
            )}
          >
            <Plus className="size-[18px]" />
          </button>
        )}
      />

      {files.length > 0 && (
        <span
          title={files.map((file) => file.name).join(", ")}
          className="-ml-1 flex h-7 max-w-[150px] shrink-0 items-center gap-1.5 rounded-full bg-[#FFFFFF0F] pr-1 pl-2.5"
        >
          <PaperclipIcon weight="bold" className="size-3 shrink-0 text-fg-2" />
          <span className="truncate font-text text-xs leading-none font-medium text-fg">
            {files.length === 1
              ? files[0].name
              : `${files.length} ${plural(files.length, ["příloha", "přílohy", "příloh"])}`}
          </span>
          <button
            type="button"
            aria-label="Odebrat přílohy"
            onClick={() => setFiles([])}
            className="flex size-5 shrink-0 items-center justify-center rounded-full text-fg-3 transition-colors hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-beige"
          >
            <X className="size-3" />
          </button>
        </span>
      )}

      <input
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        aria-label="Zadání pro AI"
        placeholder="Popište, co chcete na webu změnit…"
        className="h-full min-w-0 flex-1 bg-transparent font-text text-sm leading-[1.4] text-fg outline-none placeholder:text-fg-3"
      />

      <DropdownMenu
        label="Model AI"
        side="top"
        align="end"
        width="w-[270px]"
        className="flex shrink-0"
        groups={[
          {
            label: "Model",
            items: aiModels.map((item) => ({
              id: item.id,
              label: item.name,
              description: item.description,
              selected: item.id === model,
              onSelect: () => setModel(item.id),
            })),
          },
        ]}
        trigger={(props, open) => (
          <button
            type="button"
            title="Model AI"
            {...props}
            className={cn(
              "flex h-8 items-center gap-1.5 rounded-full px-2.5 transition-colors hover:bg-[#FFFFFF1A] focus-visible:outline-[1.5px] focus-visible:outline-beige",
              open ? "bg-[#FFFFFF1A]" : "bg-[#FFFFFF0F]",
            )}
          >
            <SparkleIcon weight="fill" className="size-3.5 text-fg-2" />
            <span className="font-text text-[13px] leading-none font-medium whitespace-nowrap text-fg">
              {currentModel.name}
            </span>
            <CaretDownIcon
              weight="fill"
              className={cn(
                "size-[11px] text-fg-3 transition-transform",
                open && "rotate-180",
              )}
            />
          </button>
        )}
      />

      <button
        type="submit"
        aria-label="Odeslat"
        disabled={!canSend}
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#FFFFFF1F] text-fg-2 transition-colors enabled:hover:bg-beige enabled:hover:text-ink focus-visible:outline-[1.5px] focus-visible:outline-beige"
      >
        <ArrowUp className="size-4" />
      </button>
    </form>
  );
}
