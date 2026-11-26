import type { Metadata } from "next";
import { Styleguide } from "@/components/styleguide/Styleguide";

export const metadata: Metadata = { title: "Styleguide" };

/** Living overview of the design tokens and shared components. */
export default function StyleguideRoute() {
  return <Styleguide />;
}
