/** Format a BDT amount (accepts number or numeric string) as "৳ 1,23,456.50" (South Asian grouping). */
export function formatBDT(amount: number | string): string {
  const n = typeof amount === "string" ? Number(amount) : amount;
  const formatted = new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    currencyDisplay: "symbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
  return formatted;
}

/** Gold balances are stored in the DB as integer milligrams to avoid floating-point drift. */
export function mgToGrams(mg: number | string): string {
  const n = typeof mg === "string" ? Number(mg) : mg;
  return (n / 1000).toFixed(3);
}

export function gramsToMg(grams: number | string): number {
  const n = typeof grams === "string" ? Number(grams) : grams;
  return Math.round(n * 1000);
}

export function formatGrams(mg: number | string): string {
  return `${mgToGrams(mg)} g`;
}

export function formatDateTime(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

/** Bangladesh phone numbers: 01XXXXXXXXX (11 digits, starts with 01). Accepts optional +88 prefix. */
export function normalizeBdPhone(input: string): string | null {
  const digits = input.replace(/[^\d]/g, "");
  const local = digits.startsWith("88") ? digits.slice(2) : digits;
  if (/^01[3-9]\d{8}$/.test(local)) return local;
  return null;
}
