import { SparkleIcon, SpinnerIcon, UserIcon } from "@phosphor-icons/react";
import type { AiChange } from "@/lib/editor";
import { cn } from "@/lib/cn";

type AiAnswerCardProps = {
  /** Question that is being answered. */
  question: string;
  /** Proposed change; while missing the card shows "working". */
  change: AiChange | null;
  onKeep: () => void;
  onDiscard: () => void;
  className?: string;
};

/** Answer of the AI above the prompt: what it changed, with keep / discard. */
export function AiAnswerCard({
  question,
  change,
  onKeep,
  onDiscard,
  className,
}: AiAnswerCardProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col gap-3 rounded-[18px] border border-transparent p-4 shadow-float backdrop-blur-lg [background:linear-gradient(var(--color-popover),var(--color-popover))_padding-box,linear-gradient(90deg,#F08CB0B3,#5E7CF0B3_55%,#9532FFB3)_border-box]",
        className,
      )}
    >
      <p className="flex items-start gap-2 font-text text-xs leading-[1.4] text-fg-3">
        <UserIcon weight="fill" className="mt-0.5 size-[13px] shrink-0" />„
        {question}“
      </p>

      <div className="flex items-center gap-2.5">
        <span className="bg-ai-gradient flex size-[26px] shrink-0 items-center justify-center rounded-lg [--ai-gradient-angle:135deg]">
          {change ? (
            <SparkleIcon weight="fill" className="size-[13px] text-white" />
          ) : (
            <SpinnerIcon
              weight="bold"
              className="size-[13px] animate-spin text-white"
            />
          )}
        </span>
        <p className="font-text text-sm leading-[1.4] font-semibold text-fg">
          {change ? change.title : "Připravuji změnu…"}
        </p>
      </div>

      {change && (
        <>
          <div className="flex flex-col gap-1.5 rounded-xl bg-inset p-3">
            <p className="flex items-start gap-2 font-text text-[13px] leading-[1.4] text-fg">
              <span className="text-sm font-bold text-green">+</span>„
              {change.added}“
            </p>
            <p className="font-text text-[11px] leading-[1.4] text-fg-3">
              {change.where}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onKeep}
              className="bg-ai-gradient flex h-8 items-center rounded-full px-3.5 font-text text-[13px] leading-none font-bold text-white transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ai"
            >
              Ponechat změnu
            </button>
            <button
              type="button"
              onClick={onDiscard}
              className="flex h-8 items-center rounded-full border border-line px-3.5 font-text text-[13px] leading-none font-semibold text-fg transition-colors hover:bg-tint/5 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-ai"
            >
              Zahodit
            </button>
            <p className="font-text text-[11px] leading-[1.4] text-fg-3">
              Změna je zatím jen v náhledu
            </p>
          </div>
        </>
      )}
    </div>
  );
}
