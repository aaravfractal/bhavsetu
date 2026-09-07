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

## Deferred — Evergreen premium skin (7 Sep 2026)

deferred: Evergreen premium skin, revisit on branch feat/evergreen after internal
round, pending a design package that exists.

Evergreen conflicts with CLAUDE.md rule 1 and with the already-submitted deck; brand
consistency through the 9 Sep internal round wins. The token swap committed earlier
today was reverted in full (`635cbbf`), so the locked Kanda palette, the Sawali scrim
and the rule 9 motion doctrine all stand exactly as they were. The referenced design
package — `BhavSetu Premium.dc.html`, the Farmer App and Hindi `.dc.html` files, the
Handoff PDF — is not in the repo or anywhere on this machine, which is the second
reason not to build against it yet.

## Wednesday state — verified (7 Sep 2026)

`demo/index.html` was driven through the presenter-panel order end to end in a real
DOM (jsdom, installed outside the repo so nothing here changed). All 33 beats pass:
the Home reveal completes and the hero reads ₹1,850 with the verdict visible, the
verdict tap opens three staged reasons, the mic sheet builds its waveform, the chart
reveals volume, candles, averages and forecast band, the calculator computes, lots and
buyers render, hold-to-accept flips the lot to करार झाला and lands on Money, delivery
releases escrow with the season total and extra-earned counting up, offline toggles
both ways and toasts in Marathi, and the QR renders for the deployed origin. Repo
suite: 44 tests passing, build green.

One discrepancy found and deliberately NOT changed, because nothing else changes before
the round — it needs a decision, not a patch. The sell-or-store calculator computes a
gain of **₹3,920** on 20q (20 × (2100 − 1850 − 54), with cold storage at the locked
₹18/q/week for three weeks). The deck, `docs/frontend-spec.md` (§6.4 and the demo flow)
and `docs/master-prompt.md` all state **₹4,200**. On stage at demo step 5 the presenter
says "Store, gain ₹4,200" while the screen reads ₹3,920 — a ₹280 gap. Reaching ₹4,200
from the locked inputs would need storage at about ₹40/q for three weeks rather than
₹54, so this is a reconciliation between the demo and the deck, not a typo. Either the
storage rate in the demo changes or the deck figure does; both are outside this
session's scope.

## Session 3 — Every dead end closed, the loop closed with it (7 Sep 2026)

Four commits against `demo/index.html`, architecture unchanged: static files in `/demo`,
no backend, no build step, no new dependencies. Everything that would be a server is one
state object written through to `localStorage`, so a reload on stage lands where the
presenter left off.

**Phase A — no tap answers with nothing.** The bank report is now a real single-page A4
PDF built in the page and downloaded. Devanagari in PDF needs either an embedded CID font
subset (another ~60 KB on top of the 310 KB of faces already precached, plus a font
writer) or the page rasterised; we draw the report on a canvas with the Mukta face the app
has already loaded and embed that canvas as one JPEG image XObject with `/DCTDecode`, so
the JPEG bytes go into the stream untouched and nothing is fetched. It carries the farmer,
season, 18 completed deals, the season total — a ledger that sums to the ₹4,12,600 the
Money screen already showed — and a BhavScore-style line. Every screen gained a 56px
speaker wired to `speechSynthesis`, falling back mr → hi → en and saying which it got.
All three bid rows, the nearby-mandi rows, the cold-storage call, the voice sheet's two
spec buttons and the alert channel picker are wired.

**Phase B — the auction, end to end.** A countdown chip on the lot, a new bid landing on
its own after 24s and re-sorting the list by net to the farmer, one round of counter-offer
with live money math, and an accept that walks the lot through करार झाला → पैसे रोखले →
वाहतूक → पैसे मिळाले from My Lots rather than only from the presenter panel. The 3-step
add-lot flow from §6.5 with camera capture, a token-drawn sample photo for laptops,
grading in 1.5s and the 4-farmers/85q pooling map from §6.8. Price alerts persist with
delete, and the presenter can fire one as a full-screen incoming call.

**Phase C — the missing surfaces.** Onboarding (§6.1) behind a once-only flag, skippable
and re-runnable. A "For Government" tab on the desktop shell carrying the MSAMB view from
§8 with the §9 risk table, a schematic inline-SVG map, three time series and a Marathi
advisory preview. One reasons sheet now sits behind every verdict, including the
store-or-sell one, whose footer carries the live deduction math.

**Phase D — finish line.** Service worker bumped to `bhavsetu-demo-v2`; the precache list
is unchanged and still complete because every new surface is inline (canvas, inline SVG,
data URLs). Presenter panel rewritten to the 12-beat order.

Verified in headless Chromium at 360×800 and 1280×860: every beat passes, no console
errors, nothing scrolls sideways. Offline cold start with the origin server killed renders
the whole app, loads both faces from cache, runs the auction and grading, and still
downloads the PDF. `prefers-reduced-motion` leaves nothing hidden or mid-animation. Repo
suite 44/44, build green. Demo shell is 37.6 KB gzipped plus the 310 KB font precache.

One bug the run-through caught: `.shelltabs` declared `display:flex` further down the
sheet than the mobile media query that hid it, so the government tab floated over the
phone header at 360px. The override now sits last in the sheet.

The ₹3,920 vs ₹4,200 store-or-sell gap recorded above is unchanged and still open.

## Session 4 — Consented QR access (7 Sep 2026)

The farmer identity gained a second tier, and a consent flow to reach it. Still no
backend and no new dependencies: the requester, the farmer's device and the grant
token all live in one page.

**Tier 1, the public trust card.** `?id=BS-NSK-0412-7729` — or the presenter's scan
buttons — opens a Kanda-barred card carrying ID, name, taluka, BhavScore with its bar,
deals, on-time percentage and the grade history as a bar strip. It carries no rupee
figure, no phone number and no buyer name, and a test asserts that rather than trusting
the markup.

**Tier 2, the full record, behind one OTP.** The requester picks who they are (Buyer /
Bank / FPO / Government) and asks. The farmer's own device answers — a second phone frame
beside the first on a desktop shell, the same node covering the screen as an incoming
request on a phone — reads the request aloud, and offers परवानगी द्या / नाकारा. Allow
shows a six-digit OTP, spoken through the existing TTS; the requester types it and the
record opens: every deal with its money math, escrow history, alerts, recorded storage
decisions, season and extra-earned totals, and the bank-report PDF. Three wrong entries
lock the requester out for ten minutes in Marathi. Deny shows the farmer declined, and
nothing else.

**The grant is the feature.** Each request becomes a row in a consent ledger scoped to
requester type plus farmer ID, valid 24 hours, and the farmer's Profile lists who saw
what and when with a revoke button. Revoking flips the requester's open screen to
"परवानगी संपली" within a second. A Bank grant does not let a Buyer in — the test proves
the scope holds across a reload.

**Copy.** 57 keys, complete in mr / hi / en, switched by the onboarding language picker.
All of it is new copy, not verbatim in the spec, and is marked TODO-mr / TODO-hi for
native review. The rest of the demo's copy is unchanged inline Marathi.

BhavScore is roadmap item 14 in `docs/master-prompt.md`, whose tier is marked "never build
scope this cycle". Built because the request asked for it explicitly, and flagged here
rather than done quietly. It is computed from the deal ledger (on-time, count, grade mix,
volume) and shows its inputs under the number instead of asserting a score.

Service worker at `bhavsetu-demo-v3`; the precache list is unchanged because everything
new is markup, inline SVG and the QR encoder already in the file.

Two layout bugs the run-through caught, both fixed: on a phone the farmer's overlay
covered the requester's OTP input, so the loop could not be completed — the farmer now
hands the screen back after reading the OTP out, and revoke moves to the Profile there.
And the fixed shell tab strip overlapped the phone frames once a second frame widened the
row; the desktop shell now reserves a 66px strip and the frames take the height that is
left, which holds at 1024×768 through 1440×900.

Verified at 360×800 (35 checks) and 1280×860 (34 checks), plus offline: the public card
renders from cache with the origin killed, and asking for consent refuses in Marathi with
the reason. Suite 44/44. Demo shell 48.8 KB gzipped.

## Session 5 — Transport, shelf life, quality pooling, trust, Q-commerce, next season (7 Sep 2026)

Six features, all of them extensions of surfaces that already existed. One new card,
no new screen: the demo still has the same eleven sections it had this morning.

**Transport is part of the money now.** Every bid carries a mode — बायर पिकअप /
शेतकरी डिलिव्हरी / खर्च वाटून / एकत्र ट्रक — and the rupees that mode costs the farmer,
above the deduction math on both the row and the sheet. A lorry is hired for a trip,
not per quintal, so a bid may carry a flat figure instead of a per-quintal one. The
board sorts by what lands in hand, never by the headline, and a card at the top of it
makes the point once: **A नाशिक फ्रेश रिटेल ₹2,000 with free buyer pickup takes home
₹39,400 on 20 q; B अन्नपूर्णा हॉटेल्स ₹2,050 with a ₹2,500 lorry the farmer hires takes
home ₹37,900. म्हणून A चांगला — ₹1,500 जास्त.** The counter-offer sheet lets him ask for
a different mode as well as a different rate; a request to be picked up for free is met
halfway at खर्च वाटून, the same way every time.

The three master-prompt bids are untouched — Sahyadri 2,050 − 85 − 30 = 1,935,
Deshmukh 1,980 − 85 − 30 = 1,865, Kisan Agro 1,940 − 50 − 30 = 1,860 — and a run-through
check asserts each of them, because the mode is a name for a deduction that was always
there, not a change to one.

**The crop has a clock.** Every lot carries a harvest date, and onion keeps about 30 days
in a kanda chawl against 60+ in cold storage. The calculator shows साठवलेले ६ / ३० दिवस
with a bar above the two columns, and the lots list carries the same line. Under seven
days left the verdict flips to विका with a Mirchi warning — जास्त थांबल्यास माल खराब होईल —
whatever the forecast is doing, and the विका verdict opens its own three reasons like
every other one. The presenter panel ages the lot to day 25 live and puts it back.

**Pooling asks about grade before it asks about distance.** A buyer who wants Grade A will
not take a truck with Grade B in it, so lots pool by grade. The map card reads
**अ दर्जा · ५ शेतकरी · १०० क्विं.** against a demand line — सह्याद्री एक्स्पोर्ट्स ला
१०० क्विं. अ दर्जा हवा — and the pool only forms while demand covers it: step the quintals
to 105 and the chip turns to पूल तयार नाही with the reason. Grade B pools separately and
says so, on the map (Haldi, dashed) and in a note naming रमेश जाधव. This needed a fifth
Grade A neighbour, which widens the spec's "४ शेतकरी, एकूण ८५ क्विंटल" in
`docs/frontend-spec.md` 6.5 to five neighbours and 115 q across both grades — flagged
here rather than done quietly, because a grade-scoped pool cannot reach 100 q without one.

**The trust bar opens.** Tapping it shows the record behind the summary: deals completed,
on-time payment, cancellations, rejections, disputes and farmer feedback. Two rejections
or any open dispute raises a Haldi सावध with the reason — देशमुख डिहायड्रेशन on
rejections, अन्नपूर्णा हॉटेल्स on a dispute — and a buyer with no history at all reads
नवीन खरेदीदार · एस्क्रो अनिवार्य. For all three the escrow switch on the bid sheet is
locked on and says why; against a clean buyer it can be waived.

**Buyers who never see a mandi.** Six buyer types now — निर्यातदार, व्यापारी,
प्रक्रिया उद्योग, क्विक कॉमर्स, रिटेल, हॉटेल — each bid card carrying its pickup terms and
its quality requirement, with type filter chips over the board. Two demo bids reach the
farm gate directly: फ्रेशबास्केट ₹1,990, 4 तासांत शेतावरून पिकअप, फक्त अ दर्जा, and
नाशिक फ्रेश रिटेल ₹2,000, बुधवारी शेतावरून स्वतः उचलतो.

**पुढील हंगाम.** One card on Profile, marked सूचक · roadmap: उन्हाळ कांदा, ₹1,900–2,300
expected Jan–Mar, मागणी जास्त, with three reasons — soil and region, this year's rain,
and how long summer onion stores. Roadmap item 24 in `docs/master-prompt.md`, static demo
data, and it never reads as a promise.

Presenter panel is now 14 beats, with controls for the transport comparison, ageing the
lot, and both trust breakdowns. Service worker at `bhavsetu-demo-v4`; the precache list is
unchanged because everything new is markup and inline SVG. Fonts re-subset to 211
characters, 329 KB across five faces.

Verified with a scripted run-through of the real page — 105 checks, green at both the
phone frame and the desktop shell, and again with the offline chrome engaged, where the
shelf-life bar, the transport comparison and every screen still render from cache. Repo
suite 44/44, build green, demo shell 59.7 KB gzipped. The one thing this session could not
do is a pixel check in a real browser: there is no Chrome on this machine and screen
capture is blocked, so layout at 360 and 1280 was reviewed in the stylesheet rather than
seen. Worth a human glance at the buyer-type chip row, which wraps to three lines at 360.
