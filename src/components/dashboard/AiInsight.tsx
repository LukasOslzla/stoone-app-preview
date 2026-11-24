import { ArrowRightIcon, SparkleIcon } from "@phosphor-icons/react/ssr";

type AiInsightProps = {
  /** Small uppercase line, e.g. "AI insight · posledních 30 dní". */
  eyebrow: string;
  text: string;
  /** Label of the call-to-action; the button is hidden without it. */
  actionLabel?: string;
};

/** Highlighted AI summary strip at the top of a dashboard. */
export function AiInsight({ eyebrow, text, actionLabel }: AiInsightProps) {
  return (
    <section className="surface-ai flex flex-wrap items-center gap-4 rounded-[20px] px-5 py-4">
      <div className="bg-ai-gradient flex size-10 shrink-0 items-center justify-center rounded-xl shadow-[0_4px_16px_#8B5CF666] [--ai-gradient-angle:135deg]">
        <SparkleIcon weight="fill" className="size-5 text-white" />
      </div>

      <div className="flex min-w-[240px] flex-1 flex-col gap-[3px]">
        <p className="font-text text-[11px] leading-[1.2] font-bold tracking-[0.8px] text-ai uppercase">
          {eyebrow}
        </p>
        <p className="font-text text-sm leading-[1.45] text-fg">{text}</p>
      </div>

      {actionLabel && (
        <button
          type="button"
          className="bg-ai-gradient flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 font-text text-[13px] leading-none font-bold text-white transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ai"
        >
          {actionLabel}
          <ArrowRightIcon weight="fill" className="size-3.5" />
        </button>
      )}
    </section>
  );
}
