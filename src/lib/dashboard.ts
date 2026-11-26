/**
 * Project dashboard data.
 *
 * MOCK DATA — replace `getProjectDashboard` with a real API call. The shapes
 * below are what the dashboard components expect.
 */

import type { UnitStatus } from "@/lib/unit-status";

export type Delta = {
  label: string;
  trend?: "up" | "down";
  tone?: "positive" | "negative";
};

export type KpiIcon = "visits" | "inquiries" | "conversion" | "reserved";

export type Kpi = {
  id: string;
  label: string;
  icon: KpiIcon;
  /** Pre-formatted headline value, e.g. "187 mil. Kč". */
  value: string;
  caption: string;
  delta?: Delta;
};

export type VisitsSeries = {
  total: number;
  delta?: Delta;
  /** Upper bound of the Y axis. */
  max: number;
  /** One entry per day, oldest first. `date` is `YYYY-MM-DD`. */
  days: { date: string; value: number }[];
};

export type SalesStatus = {
  total: number;
  counts: Record<UnitStatus, number>;
};

export type FunnelStep = {
  /** Pre-formatted value, e.g. "4 486". */
  value: string;
  label: string;
  /** Explains the drop to the next step; omitted on the last one. */
  note?: string;
};

export type Campaign = { name: string; visits: number; inquiries: number };

export type TopPage = { name: string; visits: number };

export type UnitInterest = {
  unit: string;
  floor: number;
  layout: string;
  views: number;
  inquiries: number;
  price: number;
  status: UnitStatus;
};

export type UnitAlert = {
  unit: string;
  message: string;
  kind: "noInquiries" | "noViews" | "expiring";
  severity: "warning" | "critical";
};

export type ProjectDashboard = {
  insight: { eyebrow: string; text: string; actionLabel?: string };
  kpis: Kpi[];
  visits: VisitsSeries;
  salesStatus: SalesStatus;
  funnel: FunnelStep[];
  campaigns: Campaign[];
  topPages: TopPage[];
  unitsByInterest: UnitInterest[];
  alerts: UnitAlert[];
};

const dailyVisits = [
  120, 150, 125, 168, 130, 135, 115, 133, 135, 160, 192, 185, 150, 158, 155,
  178, 166, 136, 145, 130, 125, 123, 165, 150, 168, 135, 140, 145, 155, 167, 47,
];

/** 24. 10. 2026 → 23. 11. 2026 */
function visitDays() {
  const start = Date.UTC(2026, 9, 24);
  return dailyVisits.map((value, index) => ({
    date: new Date(start + index * 86_400_000).toISOString().slice(0, 10),
    value,
  }));
}

const dashboard: ProjectDashboard = {
  insight: {
    eyebrow: "AI insight · posledních 30 dní",
    text: "Návštěvy rostou rychleji než poptávky (+12,4 % vs. +8,1 %). Nejvíc zájemců ztrácíte mezi detailem jednotky a poptávkou.",
    actionLabel: "Zobrazit 3 doporučení",
  },
  kpis: [
    {
      id: "visits",
      label: "Návštěvy",
      icon: "visits",
      value: "4 486",
      caption: "oproti minulému měsíci",
      delta: { label: "+12,4 %", trend: "up" },
    },
    {
      id: "inquiries",
      label: "Poptávky",
      icon: "inquiries",
      value: "76",
      caption: "oproti minulému měsíci",
      delta: { label: "+8,1 %", trend: "up" },
    },
    {
      id: "conversion",
      label: "Konverze",
      icon: "conversion",
      value: "1,7 %",
      caption: "návštěva → poptávka",
      delta: { label: "+0,2 p. b.", trend: "up" },
    },
    {
      id: "reserved",
      label: "Rezervováno",
      icon: "reserved",
      value: "187 mil. Kč",
      caption: "21 jednotek",
      delta: { label: "+3 tento měsíc" },
    },
  ],
  visits: {
    total: 4486,
    delta: { label: "+12,4 %", trend: "up" },
    max: 200,
    days: visitDays(),
  },
  salesStatus: {
    total: 240,
    counts: {
      free: 197,
      reserved: 21,
      preReserved: 17,
      sold: 1,
      notForSale: 4,
    },
  },
  funnel: [
    {
      value: "4 486",
      label: "návštěv webu",
      note: "1,7 % návštěvníků pošle poptávku",
    },
    {
      value: "76",
      label: "poptávek",
      note: "z každých 38 poptávek je jedna rezervace",
    },
    { value: "2", label: "rezervace" },
  ],
  campaigns: [
    { name: "Google – vyhledávání", visits: 498, inquiries: 10 },
    { name: "Instagram – Reels", visits: 384, inquiries: 6 },
    { name: "Sklik – vyhledávání", visits: 210, inquiries: 3 },
    { name: "Google – bannery", visits: 164, inquiries: 2 },
  ],
  topPages: [
    { name: "Úvod", visits: 3853 },
    { name: "Ceník", visits: 3380 },
    { name: "Lokalita", visits: 1272 },
    { name: "Byt A.221", visits: 426 },
    { name: "Byt A.421", visits: 424 },
  ],
  unitsByInterest: [
    {
      unit: "A.421",
      floor: 4,
      layout: "1+kk",
      views: 2024,
      inquiries: 14,
      price: 6_946_000,
      status: "free",
    },
    {
      unit: "A.221",
      floor: 2,
      layout: "1+kk",
      views: 1864,
      inquiries: 11,
      price: 6_572_000,
      status: "free",
    },
    {
      unit: "A.321",
      floor: 3,
      layout: "1+kk",
      views: 1539,
      inquiries: 9,
      price: 6_672_000,
      status: "free",
    },
    {
      unit: "A.432",
      floor: 4,
      layout: "1,5+kk",
      views: 571,
      inquiries: 3,
      price: 9_408_000,
      status: "free",
    },
    {
      unit: "A.230",
      floor: 2,
      layout: "1,5+kk",
      views: 569,
      inquiries: 2,
      price: 8_349_000,
      status: "free",
    },
    {
      unit: "A.232",
      floor: 2,
      layout: "1,5+kk",
      views: 565,
      inquiries: 0,
      price: 8_474_000,
      status: "free",
    },
  ],
  alerts: [
    {
      unit: "A.232",
      message: "565 zobrazení, 0 poptávek",
      kind: "noInquiries",
      severity: "warning",
    },
    {
      unit: "B.604",
      message: "Žádné zobrazení za 30 dní",
      kind: "noViews",
      severity: "warning",
    },
    {
      unit: "A.118",
      message: "Předrezervace vyprší za 3 dny",
      kind: "expiring",
      severity: "critical",
    },
  ],
};

/** The mock returns the same numbers for every project. */
export async function getProjectDashboard(
  slug: string,
): Promise<ProjectDashboard> {
  void slug;
  return dashboard;
}
