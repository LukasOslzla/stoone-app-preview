"use client";

import type { ReactNode } from "react";
import { useSelectedLayoutSegment } from "next/navigation";

/** Renders its children only on the project dashboard (no sub-page selected). */
export function DashboardOnly({ children }: { children: ReactNode }) {
  const segment = useSelectedLayoutSegment();
  return segment === null ? children : null;
}
