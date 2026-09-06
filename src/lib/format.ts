import type { Locale } from '../i18n/index.tsx'

const DEVANAGARI_DIGITS = '०१२३४५६७८९'

/** mr and hi render numerals in Devanagari. en stays Latin. */
export function localizeDigits(input: string, locale: Locale): string {
  if (locale === 'en') return input
  return input.replace(/[0-9]/g, (d) => DEVANAGARI_DIGITS[Number(d)])
}

/** Indian grouping (1,58,100), then localized digits. */
export function formatNumber(n: number, locale: Locale): string {
  return localizeDigits(new Intl.NumberFormat('en-IN').format(n), locale)
}

export function formatINR(n: number, locale: Locale): string {
  return `₹${formatNumber(n, locale)}`
}

/** Signed delta with the spec's triangle: "▲ ₹120" / "▼ ₹120". */
export function formatDelta(n: number, locale: Locale): string {
  return `${n >= 0 ? '▲' : '▼'} ${formatINR(Math.abs(n), locale)}`
}

/**
 * Chart axes and data labels keep Latin digits in every locale — CLAUDE.md
 * rule 2 exempts charts, where Devanagari numerals crowd a tight axis.
 */
export function formatChartNumber(n: number): string {
  return new Intl.NumberFormat('en-IN').format(n)
}
