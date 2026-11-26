"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
  MagnifyingGlassPlusIcon,
} from "@phosphor-icons/react";
import {
  Button,
  buttonBase,
  buttonSizes,
  buttonVariants,
} from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { PillSteps } from "@/components/ui/PillSteps";
import { Stepper } from "@/components/ui/Stepper";
import { cn } from "@/lib/cn";
import {
  saveConfigChoice,
  type Buyer,
  type BuyerUnit,
  type ConfigStep,
} from "@/lib/configurator";
import { formatNumber, formatPrice, outOf } from "@/lib/format";
import { ConfigOptionCard } from "./ConfigOptionCard";
import { ConfiguratorHeader } from "./ConfiguratorHeader";

type ConfigWizardProps = {
  buyer: Buyer;
  unit: BuyerUnit;
  steps: ConfigStep[];
  /** Pictures of the rooms shown on the left, by room name. */
  renders: Record<string, string[]>;
};

const VAT = 0.15;

/**
 * Configuration of one unit: steps on top, the room on the left, variants of
 * the current sub-step on the right and the running total at the bottom.
 * Every choice is saved right away.
 */
export function ConfigWizard({
  buyer,
  unit,
  steps,
  renders,
}: ConfigWizardProps) {
  const flat = steps.flatMap((step, stepIndex) =>
    step.substeps.map((substep) => ({ step, stepIndex, substep })),
  );

  const [confirmed, setConfirmed] = useState(
    () => new Set(unit.confirmed ?? []),
  );
  // Start where the buyer left off.
  const [position, setPosition] = useState(() => {
    const first = flat.findIndex(({ substep }) => !confirmed.has(substep.id));
    return first === -1 ? 0 : first;
  });
  const [choices, setChoices] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      flat.map(({ substep }) => [
        substep.id,
        unit.choices?.[substep.id] ?? substep.options[0].id,
      ]),
    ),
  );
  // Position in the pictures of each room.
  const [views, setViews] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const saveRun = useRef(0);

  const { step, stepIndex, substep } = flat[position];
  const selected =
    substep.options.find((option) => option.id === choices[substep.id]) ??
    substep.options[0];
  const next = flat[position + 1];
  const closed = unit.status === "done";

  const total = flat.reduce((sum, item) => {
    const option = item.substep.options.find(
      (candidate) => candidate.id === choices[item.substep.id],
    );
    return sum + (option?.price ?? 0);
  }, 0);

  async function choose(optionId: string) {
    setChoices((current) => ({ ...current, [substep.id]: optionId }));
    const run = (saveRun.current += 1);
    setSaving(true);
    await saveConfigChoice(unit.id, substep.id, optionId);
    if (run === saveRun.current) setSaving(false);
  }

  function goTo(index: number) {
    setPosition(Math.min(flat.length - 1, Math.max(0, index)));
  }

  function proceed() {
    setConfirmed((current) => new Set(current).add(substep.id));
    if (next) goTo(position + 1);
  }

  const pictures = renders[step.room] ?? Object.values(renders)[0];
  const stepRenders = pictures.length;
  const render = (views[step.room] ?? 0) % stepRenders;
  const shift = (direction: 1 | -1) =>
    setViews((current) => ({
      ...current,
      [step.room]: (render + direction + stepRenders) % stepRenders,
    }));

  return (
    <div className="flex h-dvh min-h-[640px] flex-col bg-bg">
      <ConfiguratorHeader
        subtitle={`Byt ${unit.name} · ${unit.project}`}
        subtitleTone="strong"
        saveState={saving ? "saving" : "saved"}
        userName={buyer.firstName}
      />

      <div className="flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line-soft px-10 py-3 max-md:px-5">
        <Stepper
          variant="pills"
          steps={steps.map((item) => item.name)}
          current={stepIndex}
          onSelect={(index) =>
            goTo(flat.findIndex((item) => item.stepIndex === index))
          }
        />
        <p className="font-text text-xs leading-[1.4] text-fg-3">
          Krok {stepIndex + 1} {outOf(steps.length)}
        </p>
      </div>

      <div className="flex min-h-0 flex-1 max-lg:flex-col max-lg:overflow-y-auto">
        <section className="flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto pt-7 pr-8 pb-6 pl-10 max-lg:overflow-visible max-md:px-5">
          <div className="relative aspect-[888/440] w-full shrink-0 overflow-hidden rounded-[20px] bg-card">
            <Image
              src={pictures[render]}
              alt={`${step.room}, vizualizace`}
              fill
              priority
              sizes="(min-width: 1024px) 65vw, 100vw"
              className="object-cover"
            />
            <p className="absolute top-4 left-4 flex h-[30px] items-center rounded-full bg-popover/85 px-3 font-text text-xs leading-none font-semibold text-fg">
              {step.room} · {render + 1} / {stepRenders}
            </p>
            {([-1, 1] as const).map((direction) => (
              <button
                key={direction}
                type="button"
                aria-label={
                  direction === 1 ? "Další pohled" : "Předchozí pohled"
                }
                onClick={() => shift(direction)}
                className={cn(
                  "absolute top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-popover/85 text-fg transition-colors hover:bg-popover focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-beige",
                  direction === 1 ? "right-4" : "left-4",
                )}
              >
                {direction === 1 ? (
                  <CaretRightIcon weight="fill" className="size-3.5" />
                ) : (
                  <CaretLeftIcon weight="fill" className="size-3.5" />
                )}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex min-w-[240px] flex-1 flex-col gap-1">
              <p className="font-title text-lg leading-[1.4] font-medium text-fg">
                {selected.name}
                {selected.detail && ` · ${selected.detail.split(" · ")[0]}`}
              </p>
              <p className="font-text text-[13px] leading-[1.5] text-fg-2">
                {selected.description}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDetailOpen(true)}
              className={cn(
                buttonBase,
                buttonVariants.outline,
                "h-9 gap-1.5 px-3.5 text-[13px] font-semibold",
              )}
            >
              <MagnifyingGlassPlusIcon
                weight="fill"
                className="size-3.5 text-fg-2"
              />
              Detail vzorku
            </button>
          </div>
        </section>

        <section className="flex w-[480px] shrink-0 flex-col gap-[18px] overflow-y-auto border-l border-line-soft bg-panel px-7 py-6 max-lg:w-full max-lg:overflow-visible max-lg:border-t max-lg:border-l-0 max-md:px-5">
          <PillSteps
            label={`Podkroky: ${step.name}`}
            value={substep.id}
            onChange={(id) =>
              goTo(flat.findIndex((item) => item.substep.id === id))
            }
            steps={step.substeps.map((item) => ({
              id: item.id,
              label: `${item.number} ${item.name}`,
              done: confirmed.has(item.id),
            }))}
          />

          <div className="flex flex-col gap-1">
            <h1 className="font-title text-[22px] leading-[1.2] font-medium text-fg">
              {substep.question}
            </h1>
            <p className="font-text text-[13px] leading-[1.4] text-fg-3">
              {substep.hint}
            </p>
          </div>

          <fieldset disabled={closed} className="grid grid-cols-2 gap-3">
            <legend className="sr-only">{substep.question}</legend>
            {substep.options.map((option) => (
              <ConfigOptionCard
                key={option.id}
                name={substep.id}
                option={option}
                selected={option.id === selected.id}
                onSelect={() => choose(option.id)}
              />
            ))}
          </fieldset>
        </section>
      </div>

      <footer className="flex min-h-20 shrink-0 flex-wrap items-center gap-x-5 gap-y-3 border-t border-line-soft bg-panel px-10 py-3 max-md:px-5">
        <div className="flex min-w-[200px] flex-1 flex-col gap-0.5">
          <p className="font-text text-xs leading-[1.4] text-fg-3">
            Příplatky za nadstandardy celkem
          </p>
          <p className="flex flex-wrap items-baseline gap-x-2.5">
            <span className="font-title text-[22px] leading-[1.1] font-medium text-fg">
              + {formatPrice(total)}
            </span>
            <span className="font-text text-xs leading-[1.4] text-fg-3">
              vč. DPH · bez DPH {formatNumber(Math.round(total / (1 + VAT)))} Kč
            </span>
          </p>
        </div>
        <Button
          variant="outline"
          size="action"
          disabled={position === 0}
          onClick={() => goTo(position - 1)}
        >
          <ArrowLeftIcon weight="bold" className="size-3.5 text-fg-2" />
          Zpět
        </Button>
        {next ? (
          <Button size="action" onClick={proceed}>
            Pokračovat na {next.substep.nextLabel}
            <ArrowRightIcon weight="bold" className="size-3.5" />
          </Button>
        ) : (
          <Link
            href="/configurator"
            onClick={proceed}
            className={cn(
              buttonBase,
              buttonSizes.action,
              buttonVariants.primary,
            )}
          >
            {closed ? "Zpět na jednotky" : "Dokončit konfiguraci"}
            <ArrowRightIcon weight="bold" className="size-3.5" />
          </Link>
        )}
      </footer>

      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title={selected.name}
        description={selected.detail}
      >
        <div
          aria-hidden
          className="h-56 rounded-2xl"
          style={{
            backgroundImage: `linear-gradient(135deg, ${selected.swatch[0]}, ${selected.swatch[1]})`,
          }}
        />
        <p className="font-text text-sm leading-[1.5] text-fg-2">
          {selected.description}
        </p>
        <p className="font-text text-sm leading-[1.4] font-semibold text-fg">
          {selected.price > 0
            ? `Příplatek + ${formatPrice(selected.price)}`
            : "V ceně bytu"}
        </p>
      </Modal>
    </div>
  );
}
