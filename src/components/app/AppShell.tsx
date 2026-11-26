import type { ReactNode } from "react";
import { Suspense } from "react";
import { ShellAiPrompt } from "@/components/app/ShellAiPrompt";

/**
 * Frame of every signed-in screen: sidebar on the left, scrollable page on
 * the right and the floating AI prompt pinned to the bottom.
 */
export function AppShell({
  sidebar,
  children,
}: {
  sidebar: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex h-dvh bg-bg">
      {sidebar}

      <div className="relative flex min-w-0 flex-1 flex-col bg-panel">
        <main className="min-h-0 flex-1 overflow-y-auto pb-28">{children}</main>
        <Suspense fallback={null}>
          <ShellAiPrompt className="absolute bottom-7 left-1/2 w-[560px] max-w-[calc(100%-2rem)] -translate-x-1/2" />
        </Suspense>
      </div>
    </div>
  );
}
