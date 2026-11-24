import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

type BasicsCardProps = {
  title?: string;
  /** Public address shown under the card. */
  webUrl?: string;
  /** Form fields. */
  children: ReactNode;
};

/** 720px form card with the web address and advanced-settings link below. */
export function BasicsCard({
  title = "Základní údaje",
  webUrl,
  children,
}: BasicsCardProps) {
  return (
    <>
      <Card className="flex w-full max-w-[720px] flex-col gap-6 p-6">
        <h2 className="font-title text-lg leading-[1.25] font-medium text-fg">
          {title}
        </h2>
        {children}
      </Card>

      <div className="flex w-full max-w-[720px] flex-wrap items-center justify-between gap-2 px-1 font-text text-[13px] leading-[1.4]">
        <p className="text-fg-3">{webUrl && `Adresa na webu: ${webUrl}`}</p>
        <button
          type="button"
          className="rounded-md font-semibold text-fg-2 transition-colors hover:text-beige focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige"
        >
          Pokročilé nastavení
        </button>
      </div>
    </>
  );
}
