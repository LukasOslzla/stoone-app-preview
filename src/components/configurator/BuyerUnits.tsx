"use client";

import { useState } from "react";
import Image from "next/image";
import { EnvelopeSimpleIcon } from "@phosphor-icons/react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  buttonBase,
  buttonSizes,
  buttonVariants,
} from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import {
  configProgress,
  restartConfiguration,
  type Buyer,
  type BuyerUnit,
  type ConfigStep,
} from "@/lib/configurator";
import { BuyerUnitCard } from "./BuyerUnitCard";
import { ConfiguratorHeader } from "./ConfiguratorHeader";

type BuyerUnitsProps = {
  buyer: Buyer;
  units: BuyerUnit[];
  steps: ConfigStep[];
};

/** "Vaše jednotky": the buyer's units and where their configuration stands. */
export function BuyerUnits({ buyer, units: initial, steps }: BuyerUnitsProps) {
  const [units, setUnits] = useState(initial);
  const [toRestart, setToRestart] = useState<BuyerUnit | null>(null);
  const [restarting, setRestarting] = useState(false);

  async function restart() {
    if (!toRestart) return;
    setRestarting(true);
    await restartConfiguration(toRestart.id);
    setUnits((current) =>
      current.map((unit) =>
        unit.id === toRestart.id
          ? {
              ...unit,
              status: "in-progress",
              confirmed: [],
              choices: {},
              // Mock: a restarted unit gets the usual three weeks.
              deadline: unit.deadline ?? "2026-12-17",
              closedAt: undefined,
              surcharge: undefined,
            }
          : unit,
      ),
    );
    setRestarting(false);
    setToRestart(null);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <ConfiguratorHeader
        subtitle="Konfigurátor standardů"
        userName={buyer.firstName}
      />

      <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-7 px-5 py-12">
        <div className="flex flex-col gap-2">
          <p className="font-text text-sm leading-[1.4] text-fg-3">
            Dobrý den, {buyer.greetingName}
          </p>
          <h1 className="font-title text-[34px] leading-[1.15] font-medium text-fg">
            Vaše jednotky
          </h1>
          <p className="font-text text-sm leading-[1.4] text-fg-2">
            Vyberte si podlahy, obklady a vybavení. Konfiguraci můžete kdykoli
            přerušit a vrátit se k ní.
          </p>
        </div>

        {units.map((unit) => (
          <BuyerUnitCard
            key={unit.id}
            unit={unit}
            progress={
              unit.status === "in-progress"
                ? configProgress(unit, steps)
                : undefined
            }
            onRestart={() => setToRestart(unit)}
          />
        ))}

        <div className="flex flex-wrap items-center gap-3.5 rounded-2xl border border-line-soft bg-inset px-5 py-4">
          <Image
            src={buyer.agent.photoUrl}
            alt=""
            width={44}
            height={44}
            className="size-11 shrink-0 rounded-full object-cover"
          />
          <div className="flex min-w-[220px] flex-1 flex-col gap-px">
            <p className="font-text text-sm leading-[1.4] font-semibold text-fg">
              Nevíte si rady? Ozvěte se své prodejkyni
            </p>
            <p className="font-text text-xs leading-[1.4] text-fg-3">
              {buyer.agent.name} · {buyer.agent.note}
            </p>
          </div>
          <a
            href="mailto:prodej@momentum-smichov.cz"
            className={cn(
              buttonBase,
              buttonSizes.md,
              buttonVariants.outline,
              "h-[38px] px-4 text-[13px] font-semibold",
            )}
          >
            <EnvelopeSimpleIcon weight="fill" className="size-3.5 text-fg-2" />
            Napsat zprávu
          </a>
        </div>
      </main>

      <ConfirmDialog
        open={toRestart !== null}
        onClose={() => setToRestart(null)}
        onConfirm={restart}
        loading={restarting}
        title={toRestart ? `Začít konfiguraci ${toRestart.name} znovu?` : ""}
        description="Všechny dosavadní volby se smažou a začnete od prvního kroku."
        warning={
          toRestart?.status === "done"
            ? "Jednotka je už uzavřená. Znovuotevření musí potvrdit vaše prodejkyně."
            : undefined
        }
        confirmLabel="Začít znovu"
      />
    </div>
  );
}
