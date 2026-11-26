import type { Metadata } from "next";
import { BuyerUnits } from "@/components/configurator/BuyerUnits";
import { buyer, getBuyerUnits, getConfigSteps } from "@/lib/configurator";

export const metadata: Metadata = { title: "Vaše jednotky" };

/** Configurator of standards for buyers: list of their units. */
export default async function ConfiguratorRoute() {
  const [units, steps] = await Promise.all([getBuyerUnits(), getConfigSteps()]);
  return <BuyerUnits buyer={buyer} units={units} steps={steps} />;
}
