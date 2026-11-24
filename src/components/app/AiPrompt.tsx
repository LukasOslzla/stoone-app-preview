"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { CaretDownIcon, SparkleIcon } from "@phosphor-icons/react";
import { ArrowUp, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

type AiPromptProps = {
  /** Called with the prompt text; the AI backend is not wired up yet. */
  onSubmit?: (prompt: string) => void;
  model?: string;
  className?: string;
};

export function AiPrompt({
  onSubmit,
  model = "Claude Fable 5.2",
  className,
}: AiPromptProps) {
  const [prompt, setPrompt] = useState("");
  const canSend = prompt.trim().length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSend) return;
    onSubmit?.(prompt.trim());
    setPrompt("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex h-[52px] items-center gap-3.5 rounded-full border border-line-soft bg-[#2A2A2FF2] pr-2.5 pl-[18px] shadow-[0_10px_32px_#00000080] backdrop-blur-[10px]",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Přidat přílohu"
        className="shrink-0 rounded-md text-fg-2 transition-colors hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige"
      >
        <Plus className="size-[18px]" />
      </button>

      <input
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        aria-label="Zadání pro AI"
        placeholder="Popište, co chcete na webu změnit…"
        className="h-full min-w-0 flex-1 bg-transparent font-text text-sm leading-[1.4] text-fg outline-none placeholder:text-fg-3"
      />

      <button
        type="button"
        className="flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-[#FFFFFF0F] px-2.5 transition-colors hover:bg-[#FFFFFF1A] focus-visible:outline-[1.5px] focus-visible:outline-beige"
      >
        <SparkleIcon weight="fill" className="size-3.5 text-fg-2" />
        <span className="font-text text-[13px] leading-none font-medium text-fg">
          {model}
        </span>
        <CaretDownIcon weight="fill" className="size-[11px] text-fg-3" />
      </button>

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
