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
  bg: '#F6F4ED',
  surface: '#FFFFFF',
  ink: '#221E17',
  ink2: '#6A6154',
  primary: '#1E5A40',
  primaryPressed: '#154431',
  primarySoft: '#E3EFE7',
  price: '#A87806',
  priceSoft: '#F8F1DF',
  gain: '#1F7A46',
  gainSoft: '#E4F0E8',
  loss: '#B23A2A',
  offline: '#6B6B66',
}

/** The two stops either side of primary in the CTA and mic gradient. */
const GRADIENT = { ctaFrom: '#2A6E4F', ctaTo: '#154732' }

/** Hairlines, scrim and frost are ink at low alpha, never separate hues. */
const ALPHA = {
  line: 'rgba(34, 30, 23, 0.05)',
  scrim: 'rgba(34, 30, 23, 0.45)',
  frost: 'rgba(255, 255, 255, 0.78)',
}

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

test('hairline, scrim and frost are the approved alpha values', () => {
  for (const [name, value] of Object.entries(ALPHA)) {
    assert.match(
      theme,
      new RegExp(`\\b${name}:\\s*'${value.replace(/[()./]/g, '\\$&')}'`),
      `theme.ts has changed the "${name}" alpha token`,
    )
  }
})

test('the CTA gradient stops are unchanged', () => {
  for (const [name, hex] of Object.entries(GRADIENT)) {
    assert.match(theme, new RegExp(`\\b${name}:\\s*'${hex}'`))
  }
  assert.match(theme, /cta:\s*'linear-gradient\(180deg, #2A6E4F, #1E5A40 55%, #154732\)'/)
})

test('the verdict mapping never swaps', () => {
  assert.match(theme, /sell:\s*color\.gain/)
  assert.match(theme, /hold:\s*color\.price/)
  assert.match(theme, /warn:\s*color\.loss/)
})

test('the locked motion values are unchanged', () => {
  assert.match(theme, /ease:\s*'cubic-bezier\(0\.22, 1, 0\.36, 1\)'/)
  assert.match(theme, /screen:\s*'360ms'/)
  assert.match(theme, /screenRise:\s*'12px'/)
  assert.match(theme, /sheet:\s*'440ms'/)
  assert.match(theme, /overlay:\s*'280ms'/)
  assert.match(theme, /fast:\s*'120ms'/)
  assert.match(theme, /confirm:\s*'400ms'/)
  assert.match(theme, /count:\s*'800ms'/)
  assert.match(theme, /pressScale:\s*'0\.96'/)
})

test('the locked sizes are unchanged', () => {
  assert.match(theme, /tap:\s*'56px'/)
  assert.match(theme, /cta:\s*'64px'/)
  assert.match(theme, /mic:\s*'72px'/)
  assert.match(theme, /priceHero:\s*\{ size: '72px'[^}]*tracking: '-0\.035em'/)
  assert.match(theme, /card:\s*'20px'/)
  assert.match(theme, /minBodySize = '13px'/)
})

test('the type stack is the system stack plus Mukta, with Tiro for verdicts only', () => {
  const families = theme.match(/^export const font = \{[\s\S]*?\n\} as const/m)[0]
  assert.match(families, /-apple-system, BlinkMacSystemFont, 'SF Pro Text'/)
  assert.match(families, /'Mukta'/, 'Mukta must stay in the stack; it carries Devanagari')
  assert.match(families, /verdict:[\s\S]*'Tiro Devanagari Marathi'/)
  assert.equal(
    /Poppins|Inter|Roboto|Lato/.test(families),
    false,
    'a display face crept into the stack',
  )
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
  const allowed = new Set(
    [...Object.values(LOCKED), ...Object.values(GRADIENT)].map((h) => h.toUpperCase()),
  )
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
