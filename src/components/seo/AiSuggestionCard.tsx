import { ArrowsClockwiseIcon, SparkleIcon } from "@phosphor-icons/react/ssr";
import { X } from "lucide-react";

export type AiSuggestion = {
  text: string;
  /** Why the AI proposes this text. */
  reason: string;
};

type AiSuggestionCardProps = {
  suggestion: AiSuggestion;
  onUse: () => void;
  onAnother: () => void;
  onDismiss: () => void;
  /** While another suggestion is being generated. */
  loading?: boolean;
};

/** Proposal from the AI with "use it / another one / dismiss". */
export function AiSuggestionCard({
  suggestion,
  onUse,
  onAnother,
  onDismiss,
  loading = false,
}: AiSuggestionCardProps) {
  return (
    <div
      aria-live="polite"
      className="surface-ai mt-1 flex flex-col gap-3 rounded-[14px] p-3.5"
    >
      <div className="flex items-center gap-2.5">
        <span className="bg-ai-gradient flex size-[26px] shrink-0 items-center justify-center rounded-lg">
          <SparkleIcon weight="fill" className="size-3.5 text-white" />
        </span>
        <p className="min-w-0 flex-1 font-text text-[11px] leading-none font-bold tracking-[0.8px] text-ai uppercase">
          Návrh AI
        </p>
        <button
          type="button"
          aria-label="Zavřít návrh"
          onClick={onDismiss}
          className="rounded-md text-fg-3 transition-colors hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-ai"
        >
          <X className="size-3.5" />
        </button>
      </div>

      <p className="font-text text-[15px] leading-[1.4] font-semibold text-fg">
        {suggestion.text}
      </p>
      <p className="font-text text-xs leading-[1.45] text-fg-2">
        {suggestion.reason}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={onUse}
          className="bg-ai-gradient flex h-8 items-center rounded-full px-3.5 font-text text-[13px] leading-none font-bold text-white transition-[filter] enabled:hover:brightness-110 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ai"
        >
          Použít návrh
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={onAnother}
          className="flex h-8 items-center gap-1.5 rounded-full border border-line px-3.5 font-text text-[13px] leading-none font-semibold text-fg transition-colors enabled:hover:bg-tint/5 disabled:opacity-60 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-ai"
        >
          <ArrowsClockwiseIcon
            weight="fill"
            className={`size-3 text-fg-2 ${loading ? "animate-spin" : ""}`}
          />
          {loading ? "Hledám jiný…" : "Jiný návrh"}
        </button>
      </div>
    </div>
  );
}
