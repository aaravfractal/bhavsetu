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

## Session 2a — Deployable demo for Vercel (7 Sep 2026)

The single-file demo (found in `~/Downloads/bhavsetu-demo.html`, not yet in the repo)
now lives at `demo/index.html` as a static, zero-build-config Vercel deployment that
serves both presentation modes from one URL. Desktop is untouched — the centred phone
frame on the dark ground with the presenter panel — and mobile under 700px runs
edge-to-edge with `100dvh` and safe-area insets threaded through the bottom nav, the
mic FAB, the toast and the sheets, so nothing sits under an iPhone home bar. Content,
tokens, fixtures, Marathi copy and interactions are byte-for-byte as they were.

Installability: `manifest.webmanifest` (standalone, Kanda theme, Chuna background)
with 192 and 512 PNG icons plus a 180 apple-touch-icon, generated by pulling the "भ"
outline straight out of the Tiro Devanagari Marathi woff2 and rasterising through
`sips` — a real glyph, not a traced approximation. `sw.js` precaches the whole shell
and every font and serves cache-first, so a cold start in airplane mode is
indistinguishable from a warm one online; the in-app offline toggle stays exactly as
it was, as a presenter control. The Google Fonts link is gone: type is self-hosted and
subset to the demo's own 184 characters by `scripts/subset-demo-fonts.py`, which cuts
the five faces from 602 KB to 306 KB while keeping every conjunct, and writes a
coverage manifest so editing the copy without re-subsetting fails the build.

The presenter panel gained a "Scan to open on your phone" QR. It is encoded at runtime
from `location.origin` by a ~60-line inlined encoder (byte mode, ECC-L, versions 1-5),
so it points at whatever URL the demo is actually served from — production, preview or
laptop — with no domain baked in and no dependency added. The encoder was verified by
decoding its output with OpenCV's QR detector, the same read a phone camera performs;
those decoded matrices are pinned as fixtures against the copy inlined in the shipped
file.

`vercel.json` sets `outputDirectory: "demo"` with the build and install commands
nulled, which is what actually makes the production root serve the demo — a rewrite
alone would leave Vercel's framework detection running a Vite build and deploying
`dist` instead. 12 new tests cover the manifest, real icon dimensions, the meta tags,
safe-area wiring, third-party isolation, asset existence, precache completeness, glyph
coverage and the QR. 34 tests passing.

## Session 2b — Demo motion pass (7 Sep 2026)

Motion doctrine applied to `demo/index.html`: every animation either answers a tap or
points at a price or a verdict, nothing loops or bounces, and the only animated
properties are transform and opacity — a test walks every `transition` shorthand in
the file and fails on anything that could trigger layout. All easing is the locked
`cubic-bezier(0.2,0.8,0.2,1)`, including the JS count-ups, which solve the curve
directly rather than approximating it; a second test asserts no other curve appears
anywhere in the file.

Home opens with the hero counting 0 → ₹1,850 over 800ms, its width locked to the final
string first so tabular figures never reflow the card, then the sparkline history draws
over 700ms, the forecast reveals dashed through a clipped scale over 500ms, the ±110
band fades over 300ms, and the verdict lands as a hard cut 100ms later — 1.6s total,
which is the "2-second reveal" the presenter note now tells the speaker to wait out.
The chart stages volume bars up from their baseline at 15ms stagger, candles scaling
in at 20ms, average lines drawing through a clip over 600ms and the forecast band last,
finishing at 1.55s. Tab changes slide the incoming view 24px in the direction of nav
travel; sheets keep their 300ms slide and gain a 150ms scrim fade, with the three
reasons landing at 80ms stagger behind a verdict that compresses to 0.97 under the
thumb before the sheet opens. Money's escrow lock pulses Haldi twice and stops. Going
offline desaturates the chrome over 300ms and slides the banner down inside its own
clip so only a transform animates; coming back reverses it and toasts
"नेटवर्क परत आले · ताजी माहिती घेतली" for 2s. The two 400ms Paan fills on deal-accept
and payment-release are untouched, as instructed, and a test pins them.

`prefers-reduced-motion` zeroes four duration tokens in one place and every JS sequence
checks the same query and jumps to its final state. Added code is 2.92 KB gzipped
(9.31 KB raw, mostly comments) against the 6 KB budget, still a single dependency-free
file. Fonts were re-subset for the new toast string. 44 tests passing.

One thing left alone and worth flagging: the voice sheet's listening waveform loops
infinitely. It is pre-existing and it means "still recording", so silencing it would
cost the screen its meaning — but it is the one loop in the file, and the motion test
pins it as the only permitted one so nothing else can join it.

## Session 2c — Evergreen design system (7 Sep 2026)

The locked palette moves from Kanda maroon to Evergreen, and `CLAUDE.md`'s token block
moves with it rather than being quietly diverged from: deep evergreen #1E5A40 with the
CTA and mic gradient, warm ivory #F6F4ED page, ink #221E17 on #6A6154, emerald gains,
antique gold hold, terracotta danger. Hairlines, scrim and frost are now ink at low
alpha rather than separate hues, so `alpha` joins `color` as its own token group and
`--c-line` keeps working everywhere it was already used. Shape moves to the 20px card
and 14–16px button scale, the hard bottom edge on the Bhav card becomes the raised step
on a layered soft-shadow scale, the tab bar is frosted and the mic FAB carries the
gradient plus an inset top highlight. Type leads with the system stack and keeps Mukta
for Devanagari; Tiro stays verdict-only. Motion becomes cubic-bezier(0.22,1,0.36,1)
with the 360ms screen rise, 440ms sheet spring, 280ms overlay fade and 0.96 press,
while the two 400ms confirm fills and the 800ms count-ups are unchanged.

`tests/tokens.lock.test.js` was rewritten against the new table and still fails the
build on any stray hex, which is what caught the maroon left behind in `index.html`,
`public/manifest.webmanifest` and the favicon. Build green, 45 tests passing, first
load 74.2 KB gzipped.

Scope note: this session changed the design system only. The ten premium screens are
not built — the design package they are meant to match (`BhavSetu Premium.dc.html`, the
Farmer App and Hindi files, the Handoff PDF) is not in the repo or anywhere on this
machine. `demo/index.html` is deliberately untouched and remains maroon on the earlier
motion doctrine; re-skinning it is a separate call.
