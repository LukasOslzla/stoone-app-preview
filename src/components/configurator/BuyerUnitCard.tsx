"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowCounterClockwiseIcon,
  ArrowRightIcon,
  CalendarBlankIcon,
  FilePdfIcon,
} from "@phosphor-icons/react";
import { ActionMenu } from "@/components/ui/ActionMenu";
import {
  buttonBase,
  buttonSizes,
  buttonVariants,
} from "@/components/ui/Button";
import { DotPill } from "@/components/ui/DotPill";
import { ProgressTicks } from "@/components/ui/ProgressTicks";
import { cn } from "@/lib/cn";
import { daysLeft, type BuyerUnit } from "@/lib/configurator";
import { formatDate, formatPrice, outOf, plural } from "@/lib/format";

const noSubscription = () => () => {};

type BuyerUnitCardProps = {
  unit: BuyerUnit;
  /** Where the configuration stands (in-progress units only). */
  progress?: {
    stepNumber: number;
    stepCount: number;
    stepName: string;
    percent: number;
  };
  onRestart: () => void;
};

/**
 * A buyer's unit on "Vaše jednotky". The deadline belongs to the unit: an
 * unfinished one shows "Uzavřít do … · zbývá N dní", a closed one the date
 * it was closed and the total surcharge.
 */
export function BuyerUnitCard({
  unit,
  progress,
  onRestart,
}: BuyerUnitCardProps) {
  const inProgress = unit.status === "in-progress";
  const href = `/configurator/${unit.id}`;
  // The current date is only known in the browser (the page is prerendered).
  const today = useSyncExternalStore(
    noSubscription,
    () => new Date().toDateString(),
    () => null,
  );
  const left =
    unit.deadline && today ? daysLeft(unit.deadline, new Date(today)) : null;

  return (
    <article
      className={cn(
        "surface-card flex flex-wrap items-center gap-6 rounded-[20px] p-5",
        inProgress && "!border-beige/40",
      )}
    >
      <Image
        src={unit.thumbnailUrl}
        alt=""
        width={180}
        height={120}
        className="h-[120px] w-[180px] shrink-0 rounded-[14px] object-cover max-sm:w-full"
      />

      <div className="flex min-w-[260px] flex-1 flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-title text-2xl leading-[1.1] font-medium text-fg">
            {unit.name}
          </h2>
          {inProgress ? (
            <span className="flex h-6 items-center gap-1.5 rounded-full bg-beige/12 px-2.5 font-text text-xs leading-none font-bold text-beige">
              <span className="size-[7px] rounded-full bg-beige" />
              Rozpracováno
            </span>
          ) : (
            <DotPill
              label="Dokončeno"
              color="var(--color-green)"
              tone="tinted"
            />
          )}
        </div>

        <p className="font-text text-[13px] leading-[1.4] text-fg-2">
          {unit.project} · {unit.meta}
        </p>

        {inProgress && unit.deadline && (
          <p className="flex flex-wrap items-center gap-x-1.5 font-text text-[13px] leading-[1.4]">
            <CalendarBlankIcon
              weight="fill"
              className="size-3.5 shrink-0 text-beige"
            />
            <span className="text-fg-3">Uzavřít do:</span>
            <span className="font-semibold text-fg">
              {formatDate(unit.deadline)}
            </span>
            {left !== null && (
              <span
                className={cn(
                  "font-semibold",
                  left <= 3 ? "text-red" : "text-beige",
                )}
              >
                ·{" "}
                {left < 0
                  ? "termín vypršel"
                  : left === 0
                    ? "končí dnes"
                    : `${plural(left, ["zbývá", "zbývají", "zbývá"])} ${left} ${plural(left, ["den", "dny", "dní"])}`}
              </span>
            )}
          </p>
        )}

        {inProgress && progress && (
          <div className="flex max-w-[360px] flex-col gap-1.5 pt-0.5">
            <div className="flex items-center justify-between gap-3 font-text text-xs leading-[1.4]">
              <span className="font-semibold text-fg">
                Krok {progress.stepNumber} {outOf(progress.stepCount)} ·{" "}
                {progress.stepName}
              </span>
              <span className="text-fg-3">{progress.percent} %</span>
            </div>
            <ProgressTicks
              percent={progress.percent}
              label={`Průběh konfigurace ${unit.name}`}
            />
          </div>
        )}

        {!inProgress && (
          <p className="flex flex-wrap gap-x-[18px] gap-y-1 font-text text-[13px] leading-[1.4]">
            {unit.closedAt && (
              <span>
                <span className="text-fg-3">Uzavřeno: </span>
                <span className="font-semibold text-fg">
                  {formatDate(unit.closedAt)}
                </span>
              </span>
            )}
            {unit.surcharge !== undefined && (
              <span>
                <span className="text-fg-3">Nadstandardy: </span>
                <span className="font-semibold text-fg">
                  + {formatPrice(unit.surcharge)}
                </span>
              </span>
            )}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2.5">
        <ActionMenu
          label={`Akce: ${unit.name}`}
          className="!size-10 border border-line-soft"
          items={[
            {
              // Mock: the PDF is not generated yet.
              label: "Stáhnout souhrn (PDF)",
              icon: <FilePdfIcon weight="fill" className="size-[15px]" />,
              onSelect: () => {},
            },
            {
              label: "Začít konfiguraci znovu",
              tone: "danger",
              icon: (
                <ArrowCounterClockwiseIcon
                  weight="bold"
                  className="size-[15px]"
                />
              ),
              onSelect: onRestart,
            },
          ]}
        />
        <Link
          href={href}
          className={cn(
            buttonBase,
            buttonSizes.action,
            inProgress ? buttonVariants.primary : buttonVariants.outline,
          )}
        >
          {inProgress ? "Pokračovat v konfiguraci" : "Zobrazit souhrn"}
          <ArrowRightIcon weight="bold" className="size-3.5" />
        </Link>
      </div>
    </article>
  );
}
