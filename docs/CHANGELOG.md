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

Open items for the token owner and the native reviewer:
- The token table has no scrim value; the sheet backdrop derives one from the locked
  ink at 45% alpha rather than inventing a colour. Confirm or add a token.
- The spec writes `₹2,100` in Latin digits inside a Marathi sentence while CLAUDE.md
  rule 2 mandates Devanagari digits in mr/hi. Numbers are parameterised out of the
  copy and formatted, so that line renders as `८ दिवसांनी ₹२,१०० पर्यंत जाईल`.
- Fonts load from Google Fonts. They must be self-hosted as woff2 before the stage
  demo (Session 11) so the app does not depend on the network for type.
- 18 farmer-facing keys await native Marathi (the three verdict reasons, the money
  math labels, the mic and speaker words, and the retry/close labels), plus 17 on the
  dev-only gallery surface. The whole of `hi.json` awaits Hindi. `/gallery` lists
  every one of them.
