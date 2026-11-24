import type { ButtonHTMLAttributes } from "react";
import { SparkleIcon, SpinnerIcon } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/cn";

type AiSuggestButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
  loading?: boolean;
};

/** Small pill with the AI gradient outline, e.g. "Vylepšit s AI". */
export function AiSuggestButton({
  label = "Vylepšit s AI",
  loading = false,
  disabled,
  className,
  ...props
}: AiSuggestButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "bg-ai-gradient shrink-0 rounded-full p-px transition-[filter] enabled:hover:brightness-125 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ai",
        className,
      )}
      {...props}
    >
      <span className="flex h-[26px] items-center gap-1.5 rounded-full bg-[#201D2E] pr-2.5 pl-2 font-text text-xs leading-none font-semibold whitespace-nowrap text-fg">
        {loading ? (
          <SpinnerIcon
            weight="fill"
            className="size-[13px] animate-spin text-ai"
          />
        ) : (
          <SparkleIcon weight="fill" className="size-[13px] text-ai" />
        )}
        {label}
      </span>
    </button>
  );
}
