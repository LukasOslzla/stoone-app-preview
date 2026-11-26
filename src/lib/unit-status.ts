/** Sales status of a unit and how it is labelled and coloured across the app. */

export type UnitStatus =
  "free" | "reserved" | "preReserved" | "sold" | "notForSale";

export const unitStatuses: Record<
  UnitStatus,
  { label: string; color: string }
> = {
  free: { label: "Volné", color: "var(--color-green)" },
  reserved: { label: "Rezervováno", color: "var(--color-copper)" },
  preReserved: { label: "Předrezervace", color: "var(--color-copper-deep)" },
  sold: { label: "Prodáno", color: "var(--color-red)" },
  notForSale: { label: "Není na prodej", color: "var(--color-neutral)" },
};
