import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ConfigWizard } from "@/components/configurator/ConfigWizard";
import {
  buyer,
  getBuyerUnit,
  getBuyerUnits,
  getConfigSteps,
  getRoomRenders,
} from "@/lib/configurator";

type Props = { params: Promise<{ unit: string }> };

export const metadata: Metadata = { title: "Konfigurace bytu" };

export async function generateStaticParams() {
  const units = await getBuyerUnits();
  return units.map((unit) => ({ unit: unit.id }));
}

/** Configuration of one unit, step by step. */
export default function ConfigWizardRoute({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: Props) {
  const { unit: unitId } = await params;
  const [unit, steps, renders] = await Promise.all([
    getBuyerUnit(unitId),
    getConfigSteps(),
    getRoomRenders(),
  ]);
  if (!unit) notFound();

  return (
    <ConfigWizard buyer={buyer} unit={unit} steps={steps} renders={renders} />
  );
}
