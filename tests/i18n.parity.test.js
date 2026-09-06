import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'

const ROOT = new URL('..', import.meta.url).pathname
const read = (p) => JSON.parse(readFileSync(join(ROOT, p), 'utf8'))

const TABLES = {
  mr: read('src/i18n/mr.json'),
  hi: read('src/i18n/hi.json'),
  en: read('src/i18n/en.json'),
}

/**
 * The only source of legitimate Marathi copy. CLAUDE.md rule 2: strings come
 * from the spec verbatim; anything else waits for native review behind a
 * TODO marker. Never machine-translated.
 */
const CORPUS = ['docs/frontend-spec.md', 'docs/master-prompt.md', 'docs/roadmap.md']
  .map((p) => readFileSync(join(ROOT, p), 'utf8'))
  .join('\n')
  .replace(/\s+/g, ' ')

const TODO = /^TODO-(mr|hi|en):\s*/
const keys = (table) => Object.keys(table).filter((k) => k !== '_readme')
const DEVANAGARI = /[ऀ-ॿ]/

test('every locale has exactly the same keys', () => {
  const base = keys(TABLES.en).sort()
  for (const [code, table] of Object.entries(TABLES)) {
    assert.deepEqual(keys(table).sort(), base, `${code}.json key set has drifted from en.json`)
  }
})

test('no value is empty', () => {
  for (const [code, table] of Object.entries(TABLES)) {
    for (const key of keys(table)) {
      assert.notEqual(table[key].trim(), '', `${code}.json "${key}" is empty`)
    }
  }
})

test('placeholders match across locales', () => {
  const placeholders = (s) => (s.match(/\{(\w+)\}/g) ?? []).sort().join(',')
  for (const key of keys(TABLES.en)) {
    const expected = placeholders(TABLES.en[key])
    for (const code of ['mr', 'hi']) {
      const actual = placeholders(TABLES[code][key])
      // A TODO value carries the English meaning, so it carries the same slots.
      assert.equal(actual, expected, `${code}.json "${key}" placeholders differ from en.json`)
    }
  }
})

test('no Marathi or Hindi string is invented — every one traces to the docs', () => {
  const offenders = []
  for (const code of ['mr', 'hi']) {
    for (const key of keys(TABLES[code])) {
      const value = TABLES[code][key]
      if (TODO.test(value)) continue
      if (!DEVANAGARI.test(value)) continue

      // Split on interpolation slots; every literal fragment must appear in the
      // spec or the master prompt.
      const fragments = value
        .split(/\{\w+\}/)
        .map((f) => f.replace(/\s+/g, ' ').trim())
        .filter((f) => DEVANAGARI.test(f))

      for (const fragment of fragments) {
        if (!CORPUS.includes(fragment)) {
          offenders.push(`${code}.json "${key}" → "${fragment}" is not in docs/`)
        }
      }
    }
  }
  assert.deepEqual(
    offenders,
    [],
    `Devanagari copy that is not verbatim from the spec. Either quote the spec ` +
      `or mark it TODO-<locale> and leave the English meaning:\n${offenders.join('\n')}`,
  )
})

test('mr is the default and carries the app tagline', () => {
  assert.equal(TABLES.mr['app.tagline'], 'भाव कळेल. बाजार मिळेल. पैसे मिळतील.')
  assert.equal(TABLES.mr['verdict.sell'], 'विका')
  assert.equal(TABLES.mr['verdict.hold'], 'थांबा')
  assert.equal(TABLES.mr['verdict.warn'], 'सावध')
})

test('no user-facing string is hardcoded in a component', () => {
  const files = ['src/App.tsx', 'src/screens/Gallery.tsx']
  const offenders = []
  for (const file of files) {
    for (const [i, line] of readFileSync(join(ROOT, file), 'utf8').split('\n').entries()) {
      // Devanagari outside a t() call means copy has escaped the string table.
      if (DEVANAGARI.test(line) && !/\bt\(|i18n|locale|crop\./.test(line)) {
        offenders.push(`${file}:${i + 1} ${line.trim()}`)
      }
    }
  }
  assert.deepEqual(offenders, [], `Devanagari outside the string table:\n${offenders.join('\n')}`)
})
