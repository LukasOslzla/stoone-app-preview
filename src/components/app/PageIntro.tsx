import type { ReactNode } from "react";

type PageIntroProps = {
  title: string;
  description?: string;
  /** Main action of the page, e.g. the "Přidat byty" button. */
  action?: ReactNode;
};

/** Title, one-paragraph description and the main action of a list page. */
export function PageIntro({ title, description, action }: PageIntroProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-1.5">
        <h1 className="font-title text-3xl leading-[1.2] font-medium text-fg">
          {title}
        </h1>
        {description && (
          <p className="max-w-[760px] font-text text-sm leading-[1.4] text-fg-2">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
