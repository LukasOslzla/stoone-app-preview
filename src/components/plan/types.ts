/** Rectangle on a plan image, in percent of the image size (0–100). */
export type PlanRect = { x: number; y: number; width: number; height: number };

/** Something that can be marked on a plan: a unit, a house, a sector… */
export type PlanItem = {
  id: string;
  /** Main label, e.g. "A.803". */
  name: string;
  /** Secondary label, e.g. "3+kk". */
  detail?: string;
  /** Marked area; `null` while the item is not marked yet. */
  area: PlanRect | null;
  /**
   * Optional hint where an unmarked item roughly belongs. Drawn as a dashed
   * box so the user knows what is still missing.
   */
  placeholder?: PlanRect;
};
