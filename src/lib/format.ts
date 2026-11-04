const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

/** `2026-05` → `May 2026`, `2026` → `2026`, `2026-11-04` → `4 Nov 2026`, `present` → `Present`. */
export function formatPartialDate(value: string): string {
  if (value === 'present') return 'Present';
  const [year, month, day] = value.split('-');
  if (!year) return value;
  const monthName = month ? MONTHS[Number(month) - 1] : undefined;
  if (!monthName) return year;
  return day ? `${Number(day)} ${monthName} ${year}` : `${monthName} ${year}`;
}

/** ISO timestamp → `4 Nov 2026` in UTC, so builds are reproducible across machines. */
export function formatIsoDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** `2026-11-04` with no time → `4 Nov 2026`. */
export function formatDateOnly(value: string): string {
  return formatPartialDate(value);
}

/** A `datetime` attribute value for a partial date (`YYYY`, `YYYY-MM` or `YYYY-MM-DD`). */
export function dateTimeAttr(value: string): string | undefined {
  return value === 'present' ? undefined : value;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}
