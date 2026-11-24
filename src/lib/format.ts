/** Czech formatting helpers shared by the UI. */

const numberFormat = new Intl.NumberFormat("cs-CZ");

/** 2024 → "2 024" (non-breaking space as the thousands separator). */
export function formatNumber(value: number) {
  return numberFormat.format(value);
}

/** 6946000 → "6 946 000 Kč" */
export function formatPrice(value: number) {
  return `${formatNumber(value)} Kč`;
}

/**
 * Picks the Czech plural form: `plural(2, ["návštěva", "návštěvy", "návštěv"])`.
 * Forms are for 1, 2–4 and everything else.
 */
export function plural(count: number, forms: [string, string, string]) {
  if (count === 1) return forms[0];
  if (count >= 2 && count <= 4) return forms[1];
  return forms[2];
}

/** "2026-11-03" → "3. 11." */
export function formatDayMonth(isoDate: string) {
  const [, month, day] = isoDate.split("-").map(Number);
  return `${day}. ${month}.`;
}

/** 1258291 → "1,2 MB", 860160 → "840 kB" */
export function formatFileSize(bytes: number) {
  const megabyte = 1024 * 1024;
  if (bytes >= megabyte) {
    return `${(bytes / megabyte).toFixed(1).replace(".", ",")} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} kB`;
}

/**
 * "z 5" / "ze 4" — the preposition gets an extra "e" before numbers whose
 * name starts with a consonant cluster or "s" (dvou, tří, čtyř, sedmi, sta).
 */
export function outOf(total: number) {
  const tens = total % 100;
  const withE =
    [2, 3, 4, 7, 12, 13, 14, 17].includes(tens) ||
    (tens >= 70 && tens <= 79) ||
    (total >= 100 && tens === 0);
  return `${withE ? "ze" : "z"} ${total}`;
}
