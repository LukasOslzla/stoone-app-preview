"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { AiPrompt } from "@/components/app/AiPrompt";

/** Segments that bring their own AI prompt (the content editor). */
const OWN_PROMPT = ["editor"];

/** The floating AI prompt of the shell; hidden where a page has its own. */
export function ShellAiPrompt({ className }: { className?: string }) {
  const segment = useSelectedLayoutSegment();
  if (segment && OWN_PROMPT.includes(segment)) return null;
  return <AiPrompt className={className} />;
}
