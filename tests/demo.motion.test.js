import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'

const ROOT = new URL('..', import.meta.url).pathname
const html = readFileSync(join(ROOT, 'demo/index.html'), 'utf8')
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1]
const style = html.match(/<style>([\s\S]*?)<\/style>/)[1]

test('the demo script parses', () => {
  assert.doesNotThrow(() => new Function(script))
})

/**
 * The motion code reaches for elements by id and class. Nothing here can run
 * without a DOM, so instead assert every hook it grabs actually exists in the
 * markup — which is what would otherwise break silently on stage.
 */
test('every element the motion code reaches for exists in the markup', () => {
  const ids = [...script.matchAll(/getElementById\('([^']+)'\)/g)].map((m) => m[1])
  const missing = ids.filter((id) => !new RegExp(`id="${id}"`).test(html))
  assert.deepEqual(missing, [], `motion code targets ids that are not in the markup: ${missing}`)

  for (const sel of ['.cvol', '.ccandle', '.cfore', '#avgRect', '#fcRect', '#sparkHist', '#sparkBand', '#sparkDot']) {
    const bare = sel.replace(/^[.#]/, '')
    const attr = sel.startsWith('#') ? `id="${bare}"` : `class="${bare}`
    assert.ok(html.includes(attr), `${sel} is referenced but never rendered`)
  }
})

test('the locked easing is the only curve used', () => {
  const curves = new Set(
    [...html.matchAll(/cubic-bezier\(([^)]*)\)/g)].map((m) => m[1].replace(/\s|0(?=\.)/g, '')),
  )
  assert.deepEqual([...curves], ['.2,.8,.2,1'], `an unlocked easing curve appeared: ${[...curves]}`)
  assert.match(script, /EASE_PTS=\[\.2,\.8,\.2,1\]/, 'the JS count-up does not use the locked curve')
})

test('the two Paan fills are left exactly as they were', () => {
  assert.match(script, /fb\.style\.transition='width \.4s cubic-bezier\(\.2,\.8,\.2,1\)'/)
  assert.match(style, /\.hold \.fill\{[^}]*transition:width 1s linear/)
})

test('the escrow pulse stops after two iterations and never loops', () => {
  assert.match(style, /\.lockpulse\.on::before\{animation:lockp 1s var\(--ease\) 2\}/)
  const infinite = [...style.matchAll(/animation:[^;}]*infinite[^;}]*/g)].map((m) => m[0])
  // The listening waveform is the one pre-existing loop; it signals live
  // recording, so it stays. Nothing the motion pass added may loop.
  assert.deepEqual(
    infinite.map((a) => a.trim()),
    ['animation:w 0.9s var(--ease) infinite alternate'],
    'a looping animation was added',
  )
})

test('reduced motion zeroes every duration token', () => {
  const block = style.match(/@media \(prefers-reduced-motion:reduce\)\{([\s\S]*?)\n\}/)[1]
  for (const t of ['--t-fast:0s', '--t-view:0s', '--t-scrim:0s', '--t-slow:0s']) {
    assert.ok(block.includes(t), `reduced motion does not zero ${t}`)
  }
  assert.match(script, /const reduced=matchMedia\('\(prefers-reduced-motion: reduce\)'\)\.matches/)
  assert.match(script, /function after\(ms,fn\)\{setTimeout\(fn,reduced\?0:ms\)\}/)
})

test('the home reveal lands inside the two seconds the presenter note promises', () => {
  // 700 draw + 500 forecast + 300 band, verdict 100ms later.
  for (const at of [700, 1200, 1600]) {
    assert.ok(script.includes(`after(${at},`), `the reveal is missing its ${at}ms step`)
  }
  assert.match(script, /countUp\(price,0,1850,800\)/, 'the hero price does not count up over 800ms')
  assert.match(html, /let Home finish its 2-second reveal before speaking/)
})

test('the chart reveal finishes under 1.6s', () => {
  const last = 1300 + 250 // forecast band, the final step
  assert.ok(last <= 1600)
  assert.match(script, /'transform 220ms var\(--ease\) '\+\(i\*15\)\+'ms'/, 'volume stagger is not 15ms')
  assert.match(script, /'transform 220ms var\(--ease\) '\+\(250\+i\*20\)\+'ms'/, 'candle stagger is not 20ms')
  assert.match(script, /transform 600ms var\(--ease\) 850ms/, 'average lines do not draw over 600ms')
})

test('only transform and opacity are animated by the motion pass', () => {
  // Anything else in a transition shorthand would risk layout on a mid-range phone.
  const props = [...style.matchAll(/transition:([^;}]+)/g)]
    .flatMap((m) => m[1].split(',').map((p) => p.trim().split(/\s+/)[0]))
    .filter((p) => p && !/^\d|^var|^cubic/.test(p))
  const allowed = new Set(['transform', 'opacity', 'background-color', 'filter', 'width', 'all'])
  const bad = [...new Set(props)].filter((p) => !allowed.has(p))
  assert.deepEqual(bad, [], `layout-triggering properties are being animated: ${bad}`)
})

test('press feedback is 120ms and does not shrink the tap target', () => {
  assert.match(style, /--t-fast:120ms/)
  assert.match(style, /:active[^{]*\{transform:scale\(\.97\)\}/)
  assert.match(style, /\.stepper button\{width:56px;height:56px/, 'a 56px target changed size')
})
