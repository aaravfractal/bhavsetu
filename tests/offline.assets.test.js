import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'
import { test, before } from 'node:test'

const ROOT = new URL('..', import.meta.url).pathname
const DIST = join(ROOT, 'dist')

/**
 * Rule 4: the app must fully render with the network off. That starts with the
 * built output making no third-party request at all — every byte the browser
 * needs has to come from our own origin.
 */
before(() => {
  execFileSync('npx', ['vite', 'build'], { cwd: ROOT, stdio: 'ignore' })
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

test('the built output references no external host', () => {
  const offenders = []
  for (const file of walk(DIST).filter((f) => /\.(html|css|js|webmanifest)$/.test(f))) {
    const text = readFileSync(file, 'utf8')
    for (const url of text.match(/https?:\/\/[^\s'"()]+/g) ?? []) {
      // Namespace and licence URLs are declarations, not fetches.
      if (/^https?:\/\/(www\.)?w3\.org\//.test(url)) continue
      if (/scripts\.sil\.org|openfontlicense/.test(url)) continue
      // React prints this link inside a minified error message; never fetched.
      if (url.startsWith('https://react.dev/errors/')) continue
      offenders.push(`${file.slice(DIST.length + 1)}: ${url}`)
    }
  }
  assert.deepEqual(
    offenders,
    [],
    `the built app would hit the network for these:\n${offenders.join('\n')}`,
  )
})

test('every self-hosted font file the CSS asks for exists in dist', () => {
  const css = walk(DIST)
    .filter((f) => f.endsWith('.css'))
    .map((f) => readFileSync(f, 'utf8'))
    .join('\n')

  const urls = [...css.matchAll(/url\(['"]?(\/fonts\/[^'")]+)['"]?\)/g)].map((m) => m[1])
  assert.ok(urls.length >= 12, `expected the full face set in the build, found ${urls.length}`)

  for (const url of urls) {
    assert.ok(existsSync(join(DIST, url)), `missing font file in dist: ${url}`)
  }
})

test('every face declares font-display: swap so nothing blocks first paint', () => {
  const css = readFileSync(join(ROOT, 'src/styles/fonts.css'), 'utf8')
  const faces = css.match(/@font-face\s*\{[^}]*\}/g) ?? []
  assert.ok(faces.length >= 12)
  for (const face of faces) {
    assert.match(face, /font-display:\s*swap/, 'a face is missing font-display: swap')
  }
})

test('the fallback stack covers Devanagari on every demo device', () => {
  const theme = readFileSync(join(ROOT, 'src/tokens/theme.ts'), 'utf8')
  for (const fallback of ['Noto Sans Devanagari', 'Nirmala UI', 'Kohinoor Devanagari']) {
    assert.ok(theme.includes(fallback), `font fallback stack is missing ${fallback}`)
  }
})

test('the bundle stays inside the 150 KB gzipped budget', () => {
  const shell = walk(DIST).filter((f) => /\.(html|css|js)$/.test(f))
  const total = shell.reduce((sum, f) => sum + gzipSync(readFileSync(f)).length, 0)
  assert.ok(total < 150 * 1024, `first-load shell is ${(total / 1024).toFixed(1)} KB gzipped`)
})
