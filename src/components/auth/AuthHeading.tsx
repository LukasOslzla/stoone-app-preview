import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type AuthHeadingProps = {
  title: string;
  subtitle?: ReactNode;
  /** Optional element above the title (e.g. a success icon). */
  icon?: ReactNode;
};

export function AuthHeading({ title, subtitle, icon }: AuthHeadingProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center pt-3",
        icon ? "gap-4" : "gap-2.5",
      )}
    >
      {icon}
      <h1 className="text-center font-title text-[26px] leading-[1.15] font-medium tracking-[-0.5px] text-fg">
        {title}
      </h1>
      {subtitle && (
        <p className="text-center font-text text-[15px] leading-normal text-fg-2">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/** Shared style of the small text links on auth screens. */
export const authLinkClass =
  "rounded-md font-text text-[13px] leading-[1.4] text-fg-2 transition-colors hover:text-beige focus-visible:text-beige focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-beige";
