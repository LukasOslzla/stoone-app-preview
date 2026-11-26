/** Sales status of a unit and how it is labelled and coloured across the app. */

export type UnitStatus =
  "free" | "reserved" | "preReserved" | "sold" | "notForSale";

export const unitStatuses: Record<
  UnitStatus,
  { label: string; color: string }
> = {
  free: { label: "Volné", color: "#6FD13C" },
  reserved: { label: "Rezervováno", color: "#CA9377" },
  preReserved: { label: "Předrezervace", color: "#A26D55" },
  sold: { label: "Prodáno", color: "#F0524B" },
  notForSale: { label: "Není na prodej", color: "#5A5A62" },
};
