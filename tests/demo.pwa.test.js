import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'

const ROOT = new URL('..', import.meta.url).pathname
const DEMO = join(ROOT, 'demo')
const read = (p) => readFileSync(join(ROOT, p), 'utf8')

const html = read('demo/index.html')
const sw = read('demo/sw.js')
const manifest = JSON.parse(read('demo/manifest.webmanifest'))
const vercel = JSON.parse(read('vercel.json'))

test('the manifest carries what the install prompt requires', () => {
  assert.equal(manifest.name, 'BhavSetu')
  assert.equal(manifest.short_name, 'BhavSetu')
  assert.equal(manifest.theme_color, '#8C2F4A')
  assert.equal(manifest.background_color, '#F5F4EE')
  assert.equal(manifest.display, 'standalone')
  assert.equal(manifest.start_url, '.')

  const bySize = (s) => manifest.icons.filter((i) => i.sizes === s)
  for (const size of ['192x192', '512x512']) {
    assert.ok(bySize(size).length > 0, `manifest has no ${size} icon`)
    assert.ok(
      bySize(size).some((i) => i.type === 'image/png'),
      `the ${size} icon must be a PNG for the install prompt`,
    )
  }
  assert.ok(
    manifest.icons.some((i) => (i.purpose ?? '').includes('maskable')),
    'no maskable icon: Android will letterbox it',
  )
})

/** PNG IHDR: width and height are big-endian uint32 at byte 16. */
function pngSize(path) {
  const b = readFileSync(path)
  assert.equal(b.readUInt32BE(0), 0x89504e47, `${path} is not a PNG`)
  return [b.readUInt32BE(16), b.readUInt32BE(20)]
}

test('the icons are real PNGs at the sizes they claim', () => {
  for (const [file, want] of [
    ['icons/icon-192.png', 192],
    ['icons/icon-512.png', 512],
    ['icons/apple-touch-icon.png', 180],
  ]) {
    const [w, h] = pngSize(join(DEMO, file))
    assert.deepEqual([w, h], [want, want], `${file} is ${w}x${h}`)
  }
})

test('the meta tags the two presentation modes depend on are present', () => {
  const needles = [
    'viewport-fit=cover',
    'name="theme-color" content="#8C2F4A"',
    'name="apple-mobile-web-app-capable" content="yes"',
    'rel="manifest"',
    'rel="apple-touch-icon"',
    'property="og:title" content="BhavSetu — Know the price. Reach the buyer. Get paid."',
    'property="og:description"',
  ]
  for (const n of needles) assert.ok(html.includes(n), `index.html is missing: ${n}`)
})

test('safe-area insets reach the bottom nav and the mic button', () => {
  assert.match(html, /--sab:env\(safe-area-inset-bottom/, 'no bottom inset in the mobile layout')
  assert.match(html, /nav\{[^}]*padding-bottom:var\(--sab\)/, 'the nav does not clear the home bar')
  assert.match(html, /\.fab\{[^}]*bottom:calc\(52px \+ var\(--sab\)\)/)
  assert.match(html, /main\{[^}]*padding:18px 18px calc\(120px \+ var\(--sab\)\)/)
})

test('the demo makes no third-party request', () => {
  const offenders = []
  for (const file of readdirSync(DEMO, { recursive: true })) {
    const full = join(DEMO, String(file))
    if (!/\.(html|css|js|webmanifest|json)$/.test(String(file))) continue
    for (const url of readFileSync(full, 'utf8').match(/https?:\/\/[^\s'"()<>]+/g) ?? []) {
      if (/^https?:\/\/(www\.)?w3\.org\//.test(url)) continue
      offenders.push(`${file}: ${url}`)
    }
  }
  assert.deepEqual(offenders, [], `the demo would hit the network:\n${offenders.join('\n')}`)
})

test('every asset index.html references exists on disk', () => {
  const refs = [
    ...[...html.matchAll(/(?:href|src)="(?!https?:|#)([^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/url\('([^']+)'\)/g)].map((m) => m[1]),
  ]
  assert.ok(refs.length > 5, 'suspiciously few references parsed')
  for (const ref of new Set(refs)) {
    assert.ok(existsSync(join(DEMO, ref)), `index.html references a missing file: ${ref}`)
  }
})

test('the service worker precaches exactly the shell that exists', () => {
  const shell = [...sw.matchAll(/'\.\/([^']*)'/g)].map((m) => m[1])
  for (const entry of shell) {
    if (entry === '') continue
    assert.ok(existsSync(join(DEMO, entry)), `sw.js precaches a missing file: ${entry}`)
  }
  const onDisk = [
    ...readdirSync(join(DEMO, 'fonts')).filter((f) => f.endsWith('.woff2')).map((f) => `fonts/${f}`),
    ...readdirSync(join(DEMO, 'icons')).map((f) => `icons/${f}`),
  ]
  for (const file of onDisk) {
    assert.ok(shell.includes(file), `${file} ships but is not precached, so it breaks offline`)
  }
  assert.match(sw, /addEventListener\('fetch'/, 'no fetch handler: not installable')
  assert.match(html, /serviceWorker.*register\('sw\.js'\)/s, 'index.html never registers the worker')
})

test('the font subsets cover every character the demo renders', () => {
  const coverage = JSON.parse(read('demo/fonts/coverage.json'))
  const covered = new Set([...coverage.charset])
  const missing = new Set()
  for (const ch of html) {
    const code = ch.codePointAt(0)
    if (code < 0x20) continue
    if (!covered.has(ch)) missing.add(ch)
  }
  assert.deepEqual(
    [...missing],
    [],
    `demo/index.html changed without re-running scripts/subset-demo-fonts.py; ` +
      `these characters have no glyph: ${[...missing].join(' ')}`,
  )
})

test('vercel serves the demo at the production root, with no build step', () => {
  assert.equal(vercel.outputDirectory, 'demo')
  assert.equal(vercel.buildCommand, null)
  assert.equal(vercel.framework, null)
})
