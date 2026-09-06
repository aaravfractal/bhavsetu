import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'

const ROOT = new URL('..', import.meta.url).pathname

/**
 * The locked token table from CLAUDE.md. Written out here on purpose: this file
 * is the independent copy that catches a drift in src/tokens/theme.ts.
 */
const LOCKED = {
  bg: '#F5F4EE',
  surface: '#FFFFFF',
  ink: '#2B1F16',
  ink2: '#5C4A3C',
  line: '#D9D2C5',
  primary: '#8C2F4A',
  primarySoft: '#F3E3E8',
  price: '#C98A0A',
  priceSoft: '#FBF3E2',
  gain: '#1F7A46',
  gainSoft: '#E4F0E8',
  loss: '#B3261E',
  offline: '#6B6B66',
}

/** Approved 7 Sep 2026 as "Sawali (scrim)": Mati at 45%, not a new hue. */
const SCRIM = 'rgb(43 31 22 / 45%)'

const theme = readFileSync(join(ROOT, 'src/tokens/theme.ts'), 'utf8')

test('theme.ts carries every locked colour, spelled exactly', () => {
  for (const [name, hex] of Object.entries(LOCKED)) {
    assert.match(
      theme,
      new RegExp(`\\b${name}:\\s*'${hex}'`),
      `theme.ts is missing or has changed colour token "${name}" (${hex})`,
    )
  }
})

test('the Sawali scrim is the approved value', () => {
  assert.match(theme, new RegExp(`scrim:\\s*'${SCRIM.replace(/[()/]/g, '\\$&')}'`))
})

test('the verdict mapping never swaps', () => {
  assert.match(theme, /sell:\s*color\.gain/)
  assert.match(theme, /hold:\s*color\.price/)
  assert.match(theme, /warn:\s*color\.loss/)
})

test('the locked motion values are unchanged', () => {
  assert.match(theme, /ease:\s*'cubic-bezier\(0\.2, 0\.8, 0\.2, 1\)'/)
  assert.match(theme, /fast:\s*'120ms'/)
  assert.match(theme, /confirm:\s*'400ms'/)
  assert.match(theme, /count:\s*'800ms'/)
})

test('the locked sizes are unchanged', () => {
  assert.match(theme, /tap:\s*'56px'/)
  assert.match(theme, /cta:\s*'64px'/)
  assert.match(theme, /mic:\s*'72px'/)
  assert.match(theme, /priceHero:\s*\{ size: '72px'/)
  assert.match(theme, /minBodySize = '13px'/)
})

test('only two font families exist', () => {
  const families = theme.match(/^export const font = \{[\s\S]*?\n\}/m)[0]
  assert.equal((families.match(/'[A-Z][^']*'/g) ?? []).length > 0, true)
  assert.match(families, /'Mukta'/)
  assert.match(families, /'Tiro Devanagari Marathi'/)
  assert.equal(/Poppins|Inter|Roboto|Lato|Noto Sans\b(?!.*Devanagari)/.test(families), false)
})

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else out.push(full)
  }
  return out
}

test('no colour is invented anywhere outside theme.ts', () => {
  const allowed = new Set(Object.values(LOCKED).map((h) => h.toUpperCase()))
  const files = walk(join(ROOT, 'src')).filter((f) => /\.(ts|tsx|css)$/.test(f))
  files.push(join(ROOT, 'index.html'), join(ROOT, 'public/manifest.webmanifest'))

  const offenders = []
  for (const file of files) {
    if (file.endsWith('src/tokens/theme.ts')) continue
    const text = readFileSync(file, 'utf8')
    for (const hex of text.match(/#[0-9a-fA-F]{6}\b/g) ?? []) {
      if (!allowed.has(hex.toUpperCase())) offenders.push(`${file.slice(ROOT.length)}: ${hex}`)
    }
  }
  assert.deepEqual(offenders, [], `hardcoded colours found:\n${offenders.join('\n')}`)
})
