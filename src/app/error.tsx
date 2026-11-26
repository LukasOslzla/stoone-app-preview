"use client";

import { WarningCircleIcon } from "@phosphor-icons/react";
import Link from "next/link";
import {
  Button,
  buttonBase,
  buttonSizes,
  buttonVariants,
} from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { EmptyState } from "@/components/ui/EmptyState";

/** Shown when a page fails to render or load its data. */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[70dvh] items-center justify-center bg-bg">
      <EmptyState
        tone="error"
        icon={WarningCircleIcon}
        title="Stránku se nepodařilo načíst"
        text={
          <>
            Zkuste to prosím znovu. Když chyba potrvá, napište nám na podporu
            {error.digest ? ` a uveďte kód ${error.digest}` : ""}.
          </>
        }
        action={
          <>
            <Button size="md" onClick={reset}>
              Zkusit znovu
            </Button>
            <Link
              href="/overview"
              className={cn(buttonBase, buttonSizes.md, buttonVariants.outline)}
            >
              Zpět na projekty
            </Link>
          </>
        }
      />
    </div>
  );
}
