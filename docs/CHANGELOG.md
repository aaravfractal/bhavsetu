# BhavSetu changelog

## Session 2 — Design system scaffold (7 Sep 2026)

Rebuilt the scaffold off the completed CLAUDE.md and frontend spec. `src/tokens/theme.ts`
is now the single source for every colour, radius, size, type step, elevation and
motion value in the locked table; it emits them as CSS custom properties injected
before first paint, so no value is written down twice and `tests/tokens.lock.test.js`
fails the build if a stray hex appears anywhere in `src/`, `index.html` or the
manifest. The string table ships in all three locales with mr as the default:
every Marathi value is copied verbatim from `docs/frontend-spec.md` or
`docs/master-prompt.md`, and where those documents supply no Marathi the value
carries a `TODO-mr:` marker holding the English meaning — `t()` strips the marker
before render, and a test walks every Devanagari fragment back to the docs so
machine-translated copy cannot slip in. Hindi has no source copy at all, so all of
`hi.json` is marked `TODO-hi` pending a native speaker. Shared components: Card
(plain and the hard-bottom-edge Bhav variant), VerdictBadge, Sheet, Button, Chip,
StatusPill, TrustBar, Stepper, OfflinePill, BottomNav, MicFAB, SpeakerButton and an
inlined eleven-glyph Lucide icon set. VerdictBadge is tappable in every instance and
opens a bottom sheet with up to three plain-Marathi reasons, per rule 11; it warns in
dev if a caller passes none. `/gallery` renders the full inventory plus colour and
type scales, the three screen states (loaded, offline with grey chrome, empty/error),
the 400 ms Paan fill, and a key-by-key strings table across mr/hi/en with review
badges. Numbers render in Devanagari digits under mr/hi through `src/lib/format.ts`,
which keeps a Latin-digit path reserved for charts. Zero new dependencies: a ~40-line
history router stands in for react-router, plain CSS variables for a styling library,
and the suite runs on `node --test` including an SSR smoke render through Vite.
TypeScript strict is now on. Build is green at **73.8 KB gzipped first load**
(70.63 JS + 2.45 CSS + 0.71 HTML) against the 150 KB budget, 16 tests passing.

All four open items from the first pass are now closed.

**Sawali (scrim)** is approved at `rgb(43 31 22 / 45%)` and sits in the token table in
both `theme.ts` and CLAUDE.md, with a lock test on the value.

**Devanagari digits** stay as implemented: numbers are parameterised out of the copy
and formatted, so the hold line renders `८ दिवसांनी ₹२,१०० पर्यंत जाईल`.

**Type is now self-hosted.** Mukta 400-800 and Tiro Devanagari Marathi ship from
`public/fonts` as woff2 (devanagari and latin subsets; latin-ext dropped, the app
renders no accented Latin), declared in `src/styles/fonts.css` with
`font-display: swap`, under the OFL bundled alongside. Nothing is preloaded on
purpose — the reference user is on 2G and the 73.8 KB shell should paint before any
font round-trip, carried by a fallback stack that names Noto Sans Devanagari,
Nirmala UI and Kohinoor Devanagari so Android, Windows, iOS and macOS all have a real
Devanagari face on first paint. Verified: the built output references **no external
host at all**, and every one of the sixteen assets the page asks for resolves from
our own origin. `tests/offline.assets.test.js` builds the app and holds that line.

The cost is worth stating plainly: **the twelve faces total 727 KB**, dominated by the
five Mukta Devanagari weights at ~100 KB each. Cached after the first visit and
outside the bundle the 150 KB rule measures, but on 2G that is a slow first visit.
The lever, if you want one, is the type table: dropping to three Mukta weights
(400 / 700 / 800, folding bodyMr and dataLabel into them) would take it to about
440 KB. That changes a locked table, so it is your call, not mine.

**The 18 Marathi strings** are exported to `docs/marathi-review.md` as a
WhatsApp-pasteable block, each with its English meaning and where it appears on
screen — including the constraints that matter, like the mic and speaker words having
to be one word inside a 72 px circle. `npm run marathi-review` regenerates it from
`mr.json`, so it stays accurate as later sessions add strings.

Still outstanding, both by design: the whole of `hi.json` awaits Hindi, and true
airplane-mode offline needs the service worker and IndexedDB cache from Session 11 —
self-hosting removes the third-party dependency, it does not yet cache our own origin.
