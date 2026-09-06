/**
 * BhavSetu design tokens — "Evergreen".
 *
 * Single source of truth. Mirrors the token block in CLAUDE.md. Never add or
 * change a value here without a matching line in that table. Nothing in src/
 * may hardcode a colour, radius, duration or easing — read it from here, or
 * from the CSS custom properties emitted by `themeCss()`.
 *
 * Supersedes the earlier Kanda maroon system (7 Sep 2026).
 * tests/tokens.lock.test.js fails the build if a stray hex appears anywhere.
 */

export const color = {
  /** Page — warm ivory */
  bg: '#F6F4ED',
  /** Cards, sheets */
  surface: '#FFFFFF',
  /** Primary text */
  ink: '#221E17',
  /** Secondary text. The farmer app never goes lighter than this. */
  ink2: '#6A6154',
  /** Deep evergreen — brand, primary buttons, mic FAB, active tab */
  primary: '#1E5A40',
  /** Pressed and hover state for anything primary */
  primaryPressed: '#154431',
  /** Primary tint — selected states, tint backgrounds */
  primarySoft: '#E3EFE7',
  /** Antique gold — the big price number, hold verdict, forecast band, escrow held */
  price: '#A87806',
  /** Antique gold tint */
  priceSoft: '#F8F1DF',
  /** Emerald — price up, sell verdict, payment released */
  gain: '#1F7A46',
  /** Emerald tint */
  gainSoft: '#E4F0E8',
  /** Terracotta — price down, glut warning, errors */
  loss: '#B23A2A',
  /** Offline banner, cached-data badge, stale chrome */
  offline: '#6B6B66',
} as const

export type ColorToken = keyof typeof color

/** Hairlines and shadows are ink at low alpha, not separate hues. */
export const alpha = {
  /** Hairline card and input borders */
  line: 'rgba(34, 30, 23, 0.05)',
  /** Sheet and overlay scrim */
  scrim: 'rgba(34, 30, 23, 0.45)',
  /** Frosted tab bar ground */
  frost: 'rgba(255, 255, 255, 0.78)',
} as const

/** The two stops either side of `primary` in the CTA and mic gradient. */
export const gradient = {
  ctaFrom: '#2A6E4F',
  ctaTo: '#154732',
  cta: 'linear-gradient(180deg, #2A6E4F, #1E5A40 55%, #154732)',
} as const

/** Verdict → colour. Fixed mapping, never swapped. */
export const verdictColor = {
  sell: color.gain,
  hold: color.price,
  warn: color.loss,
} as const

export type Verdict = keyof typeof verdictColor

/** Spacing. 8px unit. */
export const space = {
  xs: '4px',
  s: '8px',
  m: '16px',
  l: '24px',
  xl: '32px',
  xxl: '48px',
  /** screen padding, mobile */
  screen: '20px',
} as const

export const radius = {
  /** chips, inputs */
  s: '10px',
  /** buttons */
  m: '14px',
  /** large buttons, primary CTA */
  l: '16px',
  /** cards, sheets */
  card: '20px',
  /** mic button, verdict chip, pills */
  pill: '999px',
} as const

/** Layered soft shadows: a tight contact shadow under a wide ambient one. */
export const elevation = {
  card: '0 1px 2px rgba(34, 30, 23, 0.04), 0 8px 24px rgba(34, 30, 23, 0.06)',
  raised: '0 1px 2px rgba(34, 30, 23, 0.04), 0 12px 32px rgba(34, 30, 23, 0.08)',
  /** Inset highlight along the top of the gradient CTA and mic FAB. */
  insetHighlight: 'inset 0 1px 0 rgba(255, 255, 255, 0.18)',
} as const

export const size = {
  /** minimum tap target, every interactive element */
  tap: '56px',
  /** primary CTA, farmer app */
  cta: '64px',
  /** primary CTA, tablet and desktop */
  ctaWide: '48px',
  /** mic FAB */
  mic: '72px',
  /** camera capture button */
  capture: '80px',
  /** icon, farmer app */
  icon: '28px',
  /** icon, FPO and government */
  iconSmall: '20px',
  /** farmer frame */
  frameW: '360px',
  frameH: '800px',
} as const

/** Frosted chrome, per the iOS-grade tab bar. */
export const frost = {
  blur: 'blur(24px) saturate(1.8)',
  /** Overlay backdrops sit behind sheets. */
  overlayBlur: 'blur(4px)',
} as const

/**
 * System stack first so the app looks native on the device it runs on; Mukta
 * carries Devanagari. Tiro Devanagari Marathi is verdict words only.
 */
export const font = {
  ui: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Mukta', 'Noto Sans Devanagari', 'Nirmala UI', 'Kohinoor Devanagari', system-ui, sans-serif",
  verdict:
    "'Tiro Devanagari Marathi', 'Noto Serif Devanagari', 'Kohinoor Devanagari', Georgia, serif",
} as const

/** Type scale. */
export const type = {
  priceHero: { size: '72px', line: '76px', weight: 800, tracking: '-0.035em', family: font.ui },
  priceTablet: { size: '48px', line: '52px', weight: 800, tracking: '-0.03em', family: font.ui },
  priceDesktop: { size: '40px', line: '44px', weight: 800, tracking: '-0.02em', family: font.ui },
  verdict: { size: '32px', line: '38px', weight: 400, tracking: '0', family: font.verdict },
  heading: { size: '22px', line: '28px', weight: 700, tracking: '-0.01em', family: font.ui },
  bodyMr: { size: '18px', line: '28px', weight: 500, tracking: '0', family: font.ui },
  bodyEn: { size: '14px', line: '20px', weight: 400, tracking: '0', family: font.ui },
  dataLabel: { size: '14px', line: '20px', weight: 600, tracking: '0', family: font.ui },
  numerals: { size: '16px', line: '24px', weight: 600, tracking: '0', family: font.ui },
} as const

/** Smallest permitted body text anywhere. */
export const minBodySize = '13px'

export const motion = {
  /** Screen rise and general entrances. */
  ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
  /** Screens enter with a 12px rise and a fade. */
  screen: '360ms',
  screenRise: '12px',
  /** Bottom sheets spring up. */
  sheet: '440ms',
  /** Overlays and scrims fade. */
  overlay: '280ms',
  /** Taps and toggles. */
  fast: '120ms',
  /** Deal accepted, payment released: one fill, left to right. */
  confirm: '400ms',
  /** Count-ups. */
  count: '800ms',
  /** Every button compresses on press. */
  pressScale: '0.96',
} as const

/**
 * Emit the locked tokens as CSS custom properties. Injected once, before the
 * first paint, so no value is written down twice.
 */
export function themeCss(): string {
  const decl: string[] = []
  const push = (name: string, value: string) => decl.push(`  --${name}: ${value};`)

  for (const [k, v] of Object.entries(color)) push(`c-${kebab(k)}`, v)
  for (const [k, v] of Object.entries(alpha)) push(`c-${kebab(k)}`, v)
  for (const [k, v] of Object.entries(gradient)) push(`g-${kebab(k)}`, v)
  for (const [k, v] of Object.entries(verdictColor)) push(`c-verdict-${k}`, v)
  for (const [k, v] of Object.entries(space)) push(`sp-${k}`, v)
  for (const [k, v] of Object.entries(radius)) push(`r-${k}`, v)
  for (const [k, v] of Object.entries(elevation)) push(`el-${kebab(k)}`, v)
  for (const [k, v] of Object.entries(size)) push(`sz-${kebab(k)}`, v)
  for (const [k, v] of Object.entries(frost)) push(`fx-${kebab(k)}`, v)
  for (const [k, v] of Object.entries(font)) push(`ff-${k}`, v)
  for (const [k, v] of Object.entries(motion)) push(`mo-${kebab(k)}`, v)
  for (const [k, v] of Object.entries(type)) {
    push(`fs-${kebab(k)}`, v.size)
    push(`lh-${kebab(k)}`, v.line)
    push(`fw-${kebab(k)}`, String(v.weight))
    push(`tr-${kebab(k)}`, v.tracking)
  }
  push('fs-min', minBodySize)

  return `:root {\n${decl.join('\n')}\n}`
}

function kebab(s: string): string {
  return s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
}
