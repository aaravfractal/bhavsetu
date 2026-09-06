/**
 * BhavSetu design tokens — LOCKED.
 *
 * Single source of truth. Mirrors the token block in CLAUDE.md and
 * docs/frontend-spec.md section 4. Never add or change a value here without a
 * matching line in that table. Nothing in src/ may hardcode a colour, radius,
 * duration or easing — read it from here (or from the CSS custom properties
 * emitted by `themeCss()`).
 *
 * tests/tokens.lock.test.js fails the build if a stray hex appears anywhere.
 */

/** Colour. Marathi names are the ones the spec uses. */
export const color = {
  /** Chuna — app background, lime-wash white */
  bg: '#F5F4EE',
  /** Kagad — cards, sheets */
  surface: '#FFFFFF',
  /** Mati — primary text */
  ink: '#2B1F16',
  /** Mati-2 — secondary text. Farmer app never goes lighter than this. */
  ink2: '#5C4A3C',
  /** Reshiv — dividers, input borders */
  line: '#D9D2C5',
  /** Kanda — brand, primary buttons, mic FAB, active tab */
  primary: '#8C2F4A',
  /** Kanda-soft — selected states, primary tint backgrounds */
  primarySoft: '#F3E3E8',
  /** Haldi — the big price number, hold verdict, forecast band, escrow held */
  price: '#C98A0A',
  /** Haldi tint */
  priceSoft: '#FBF3E2',
  /** Paan — price up, sell verdict, payment released */
  gain: '#1F7A46',
  /** Paan tint */
  gainSoft: '#E4F0E8',
  /** Mirchi — price down, glut warning, errors */
  loss: '#B3261E',
  /** Dhool — offline banner, cached-data badge, stale chrome */
  offline: '#6B6B66',
  /** Sawali — sheet and modal scrim. Mati at 45%, not a new hue. */
  scrim: 'rgb(43 31 22 / 45%)',
} as const

export type ColorToken = keyof typeof color

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
  /** inputs, chips, buttons */
  s: '6px',
  /** cards */
  m: '12px',
  /** mic button, verdict chip */
  pill: '999px',
} as const

/** The only two elevations in the app. */
export const elevation = {
  /** Bhav card: a hard bottom edge, like a chalked mandi slate. */
  bhav: `0 2px 0 ${color.line}`,
  /** Every other card: a 1px line, no shadow. */
  card: 'none',
} as const

export const size = {
  /** minimum tap target, every interactive element */
  tap: '56px',
  /** primary CTA, farmer app */
  cta: '64px',
  /** primary CTA, tablet + desktop */
  ctaWide: '48px',
  /** mic FAB */
  mic: '72px',
  /** camera capture button */
  capture: '80px',
  /** lucide icon, farmer app */
  icon: '28px',
  /** lucide icon, FPO + government */
  iconSmall: '20px',
  /** farmer frame */
  frameW: '360px',
  frameH: '800px',
} as const

/** Two families only. Never add a third. */
export const font = {
  /**
   * All UI. Self-hosted (src/styles/fonts.css) with font-display: swap, so the
   * fallbacks below carry the first paint: Noto Sans Devanagari on Android,
   * Nirmala UI on Windows, Kohinoor Devanagari on iOS and macOS.
   */
  ui: "'Mukta', 'Noto Sans Devanagari', 'Nirmala UI', 'Kohinoor Devanagari', system-ui, sans-serif",
  /** Verdict words only — reads like a chalk-written rate on a slate. */
  verdict:
    "'Tiro Devanagari Marathi', 'Noto Serif Devanagari', 'Kohinoor Devanagari', Georgia, serif",
} as const

/** Type scale. [size, lineHeight, weight] */
export const type = {
  priceHero: { size: '72px', line: '76px', weight: 800, family: font.ui },
  priceTablet: { size: '48px', line: '52px', weight: 800, family: font.ui },
  priceDesktop: { size: '40px', line: '44px', weight: 800, family: font.ui },
  verdict: { size: '32px', line: '38px', weight: 400, family: font.verdict },
  heading: { size: '22px', line: '28px', weight: 700, family: font.ui },
  bodyMr: { size: '18px', line: '28px', weight: 500, family: font.ui },
  bodyEn: { size: '14px', line: '20px', weight: 400, family: font.ui },
  dataLabel: { size: '14px', line: '20px', weight: 600, family: font.ui },
  numerals: { size: '16px', line: '24px', weight: 600, family: font.ui },
} as const

/** Smallest permitted body text anywhere. */
export const minBodySize = '13px'

export const motion = {
  ease: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  /** taps, toggles */
  fast: '120ms',
  /** deal accepted, payment released — one Paan fill, left to right */
  confirm: '400ms',
  /** count-ups */
  count: '800ms',
} as const

/**
 * Emit the locked tokens as CSS custom properties. Injected once, before the
 * first paint, so index.css and components.css can `var()` them without the
 * values being written down twice.
 */
export function themeCss(): string {
  const decl: string[] = []
  const push = (name: string, value: string) => decl.push(`  --${name}: ${value};`)

  for (const [k, v] of Object.entries(color)) push(`c-${kebab(k)}`, v)
  for (const [k, v] of Object.entries(verdictColor)) push(`c-verdict-${k}`, v)
  for (const [k, v] of Object.entries(space)) push(`sp-${k}`, v)
  for (const [k, v] of Object.entries(radius)) push(`r-${k}`, v)
  for (const [k, v] of Object.entries(elevation)) push(`el-${k}`, v)
  for (const [k, v] of Object.entries(size)) push(`sz-${kebab(k)}`, v)
  for (const [k, v] of Object.entries(font)) push(`ff-${k}`, v)
  for (const [k, v] of Object.entries(motion)) push(`mo-${k}`, v)
  for (const [k, v] of Object.entries(type)) {
    push(`fs-${kebab(k)}`, v.size)
    push(`lh-${kebab(k)}`, v.line)
    push(`fw-${kebab(k)}`, String(v.weight))
  }
  push('fs-min', minBodySize)

  return `:root {\n${decl.join('\n')}\n}`
}

function kebab(s: string): string {
  return s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
}
