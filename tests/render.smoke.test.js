import assert from 'node:assert/strict'
import { test, after } from 'node:test'
import { createElement as h } from 'react'
import { renderToString } from 'react-dom/server'
import { createServer } from 'vite'

/**
 * Renders the real components through Vite's SSR pipeline — no browser, no new
 * dependency. Catches anything that throws at render time and proves the three
 * locales actually resolve.
 */
const vite = await createServer({
  root: new URL('..', import.meta.url).pathname,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})
after(() => vite.close())

const { I18nProvider } = await vite.ssrLoadModule('/src/i18n/index.tsx')
const { Gallery } = await vite.ssrLoadModule('/src/screens/Gallery.tsx')
const App = (await vite.ssrLoadModule('/src/App.tsx')).default

const render = (node) => renderToString(h(I18nProvider, null, node))

test('the app shell renders', () => {
  assert.ok(render(h(App)).length > 0)
})

test('the gallery renders every component without throwing', () => {
  const html = render(h(Gallery))
  for (const probe of [
    'verdict--sell',
    'verdict--hold',
    'verdict--warn',
    'trust__seg--on',
    'bottomnav',
    'micfab',
    'card--bhav',
    'offline-banner',
  ]) {
    assert.ok(html.includes(probe), `gallery is missing the ${probe} specimen`)
  }
})

test('mr is the default locale and renders Devanagari copy and numerals', () => {
  const html = render(h(Gallery))
  assert.ok(html.includes('थांबा'), 'hold verdict missing')
  assert.ok(html.includes('विका'), 'sell verdict missing')
  assert.ok(html.includes('सावध'), 'warning verdict missing')
  // Devanagari digits everywhere except charts: ₹1,850 -> ₹१,८५०
  assert.ok(html.includes('₹१,८५०'), 'price is not in Devanagari numerals')
  assert.ok(!html.includes('₹1,850'), 'Latin numerals leaked into the mr locale')
})

test('the strings table shows all three locales side by side', () => {
  const html = render(h(Gallery))
  assert.ok(html.includes('TODO-mr'), 'mr review badges missing')
  assert.ok(html.includes('TODO-hi'), 'hi review badges missing')
  assert.ok(html.includes('Lasalgaon') && html.includes('लासलगाव'), 'en and mr columns missing')
})
