import type { ReactNode } from "react";

/** Left column of the editor with the controls of what is being edited. */
export function EditorPanel({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-[340px] shrink-0 flex-col gap-[18px] overflow-y-auto border-r border-line-soft p-5">
      {children}
    </div>
  );
}

export function PanelHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="font-title text-lg leading-[1.4] font-medium text-fg">
        {title}
      </h1>
      {sub && (
        <p className="font-text text-[13px] leading-[1.4] text-fg-3">{sub}</p>
      )}
    </div>
  );
}

export function PanelGroupLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-text text-[11px] leading-[1.4] font-bold tracking-[0.8px] text-fg-3 uppercase">
      {children}
    </h2>
  );
}

/** Beige "+ add" text button under a list. */
export function PanelAddButton({
  icon,
  children,
  onClick,
}: {
  icon: ReactNode;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 self-start rounded-md font-text text-[13px] leading-[1.4] font-semibold text-beige transition-colors hover:text-fg focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige"
    >
      {icon}
      {children}
    </button>
  );
}
