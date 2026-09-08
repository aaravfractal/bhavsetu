# Browser pass

Everything in the two i18n commits was verified through the rendered DOM, in all
three locales, across the full presenter order. **No pixel was ever seen** — there
is no browser on the build machine. This is the list of what that leaves open, in
the order to click it, with the pass condition for each.

Deployed commit: `db0edb7ef146c064bc6a669722aa1818c6712faa`
Live: <https://bhavsetu-six.vercel.app> · deployment `bhavsetu-peo1lzxqy-aaravfractal7.vercel.app`

Budget about ten minutes. Do step 0 first or every other step is meaningless.

---

## 0. Clear the old service worker — do this before anything else

`demo/sw.js` still declares `CACHE = 'bhavsetu-demo-v4'`, unchanged since before
either i18n commit, and navigations are served **cache-first**. Any device that has
opened this demo before will keep serving the *old* `index.html` from its cache, and
because `sw.js` itself is byte-identical the browser never notices an update. This
is almost certainly why the screens you screenshotted still read `my QR`.

On every device you will demo from — presenter phone and laptop both:

- DevTools → Application → Service Workers → **Unregister**, then reload. On the
  phone: Settings → clear site data for the origin, or open it once in a private tab.
- **Pass:** view-source, or DevTools → Network → the `index.html` document, is
  **308,912 bytes**. Anything near 170,585 is the stale build — repeat this step.
- Cross-check on the page itself: the onboarding language screen shows **three
  equal cards**, not two cards and a small "Continue in English" link.

> If you would rather not rely on remembering this, bump `CACHE` to
> `'bhavsetu-demo-v5'` in `demo/sw.js` and redeploy. One character. I did not make
> that change because you said no other code changes on this commit.

---

## 1. Header language row — the one new piece of layout

Open `/` at **360 px** (phone, or DevTools at 360). Home screen, Marathi.

A language row sits between the header and the Bhav card. It did not exist before,
so it is the only thing on Home whose vertical position I could not check.

- **Pass:** one row, pill right-aligned, all three labels on **one line**
  (`मराठी · हिंदी · English`), and the ₹1,850 price still fully visible without
  scrolling.
- **Fail:** the pill wraps to two lines, collides with the 🔊/▦ buttons above it,
  or pushes the price below the fold.
- Tap each label. **Pass:** the whole screen switches instantly — no reload, no
  flash of the other language, and Home does not replay its 2-second reveal.
- **Pass:** the row is **absent** during onboarding and on the QR-scan screen
  (it is hidden there by design).

## 2. Bhav card and nav in English

Switch to English, stay at 360 px.

- **Pass:** `HOLD` renders in **Mukta 800** — a heavy sans, visibly *not* the
  serif Tiro used for थांबा. Compare by switching back and forth.
- **Pass:** all five nav labels sit on one line each: `Market · Calculator ·
  My lots · Buyers · Money`. `Calculator` is the longest — check it is not clipped
  or ellipsised.
- **Pass:** greeting reads exactly `Hello Raju · Niphad, Nashik`, digits Latin.

## 3. `#lblScore` — the shortened trust-card label

Presenter panel → **QR 🏦 Simulate scan as Bank**. This is the identity card.

I deleted the hardcoded `<span class="en">BhavScore</span>` from the markup; the
label is now built by `data-ki="score"`, so the same text is assembled at runtime.
The string is verified — the **line box** is not.

- **Pass, Marathi:** reads `भावस्कोअर BhavScore` on **one line**, the small English
  set inline after the Marathi, with the big score number directly beneath it.
- **Pass, English:** reads just `BhavScore` — the gloss disappears, no stray
  separator, no double space, no empty line left behind.
- **Fail:** the gloss drops to its own line, or an empty `<span>` opens a gap
  between the label and the number.

## 4. Identity / QR card body

Same screen, still 360 px.

- **Pass:** the three fact tiles (`व्यवहार / वेळेवर / क्विंटल`, and `deals / on time /
  quintals` in English) stay in **one row of three**. English is the longest — if it
  wraps to two rows, that is a fail worth telling me about.
- **Pass:** the grade-history bar strip spans the card width without overflowing.
- **Pass:** the yellow privacy box holds its Marathi line plus the English gloss,
  and in English mode shows the English line only.
- **Pass:** the score bar animates to its width once and settles.

## 5. `#lblMyQr` — the shortened Profile label

Tap **▦ माझा QR** in the header.

Same edit as item 3: the static `<span class="en">my QR</span>` is gone and the
label is assembled from `data-ki="myQr"`. This card is **centre-aligned**, which is
why it needs its own look — a leftover inline span shows up here as off-centre text.

- **Pass, Marathi:** `माझा QR My QR` centred on one line above the QR code.
- **Pass, English:** `My QR` centred, gloss gone, still optically centred over the
  code (this is the specific thing to look at — centring is what a stray span breaks).
- **Pass:** the QR itself renders as a crisp square and **scans** with a phone
  camera, landing on the public trust card.
- **Pass:** directly under `भावस्कोअर`, the small line reads
  `पूर्ण झालेल्या व्यवहारांवरून तयार` — **not** `BhavScore · built from completed
  deals`. That was the English-in-Marathi string this commit fixed.

## 6. Access log and timestamps

Panel → **QR 📢 Play OTP call**, allow, read the OTP into the requester screen,
unlock, then return to Profile.

- **Pass, Marathi:** the log row timestamp reads like `०८ सप्टें १९:०२` — Devanagari
  digits **and** a Marathi month. Not `08 Sept`.
- **Pass, English:** `08 Sep 19:02`, Latin throughout.
- **Pass:** the Devanagari numerals `०–९` actually render as glyphs, not tofu boxes.
  They are in the font subset, but subsets are the one thing worth eyeballing.
- **Pass:** the revoke button is reachable and the requester screen flips to
  "परवानगी संपली" within ~2 seconds of revoking.

## 7. Bank PDF

Money → **बँकेसाठी अहवाल**.

The report is drawn on a `<canvas>`, so its text shaping is the browser's, not the
DOM's. Conjuncts are the risk and I cannot see them.

- **Pass:** the Kanda header band reads `बँकेसाठी अहवाल`, and the strapline beneath
  is now fully Marathi — `BhavSetu · बँकेसाठी अहवाल · भाव कळेल…`, no `Report for bank`
  in the middle of it.
- **Pass:** conjuncts render correctly — check `व्यवहार`, `हंगामातील`, `क्विंटल`.
  Broken shaping shows as separated or reordered matras.
- **Pass:** nothing overflows the page edge; the season total sits right-aligned.
- **Pass:** **Download** produces a real PDF that opens, one A4 page.
- Switch to English and reopen. **Pass:** the whole page is English, dates read
  `02 May`, grades read `Grade A`.

## 8. Buyers board in English

Panel → **11 🔔 New bid now**, then look at the board at 360 px.

English is longer than Marathi almost everywhere; this screen has the most of it.

- **Pass:** `Ask for more` and `Accept this price` both fit their buttons on one
  line without clipping.
- **Pass:** the auction chip reads `Bidding open · 0:59` and does not wrap.
- **Pass:** buyer-type chips (`Exporter`, `Q-commerce`, `Processor`) wrap tidily.
  This row already wrapped to three lines in Marathi at 360, so wrapping is fine —
  overlapping or clipping is not.
- **Pass:** the money line reads `₹2,050 − transport ₹85 − cess ₹30 = you get ₹1,935`
  on the Sahyadri row.

## 9. Lot statuses

My lots, after accepting a bid.

- **Pass:** status pills read `Finding buyers`, `Bid received`, `Deal agreed`,
  `Payment held`, `Paid` in English and stay inside the pill — these are the longest
  strings that go into a fixed-width pill anywhere in the app.

## 10. Onboarding picker

Panel → **1 ▶ Re-run onboarding**.

- **Pass:** three cards of identical size, `मराठी` first and filled Kanda,
  `हिंदी` and `English` outlined beneath it, each ≥ 56 px tall (they are 76).
- **Pass:** all three cards **and** the `वगळा · Skip` link fit at 360 px without
  scrolling.
- **Pass:** tapping `English` switches the rest of onboarding to English immediately.

## 11. Desktop shell — 1280 px

Widen to 1280.

- **Pass:** the wordmark and its language pill sit top-right and do **not** overlap
  the presenter panel below them, nor the phone frame.
- **Pass:** the tagline under the wordmark stays Marathi in English mode. It is the
  only Devanagari allowed on an English screen, along with the pill's own
  `मराठी`/`हिंदी` labels.
- **Pass:** switching language from the shell pill updates the phone frame in place.
- **For Government** tab → Niphad → **Send Marathi advisory**. **Pass:** in English
  mode the SMS preview body is English and the meta line says it goes out in
  Marathi; in Marathi mode the body is the Marathi SMS.

## 12. Offline and reduced motion

- Panel → **✈️ Offline toggle**. **Pass:** chrome greys, the offline banner slides
  in, the language row still renders and still switches language, and every screen
  still shows its cached content with a timestamp.
- macOS System Settings → Accessibility → Display → Reduce motion, then reload.
  **Pass:** nothing animates, and every screen still lands in its finished state —
  in particular the Home price shows ₹1,850 rather than 0.

---

## What I *did* verify, so you can skip re-checking it

Not worth your ten minutes — these were asserted mechanically over 787 DOM writes
per locale, walking the full presenter order including QR, OTP, revoke and government:

- English mode writes **no Devanagari** outside the wordmark tagline and the pill labels.
- Marathi and Hindi write **no Latin UI copy** outside the deliberate English gloss
  lines, proper nouns, acronyms, ids, units and the missed-call number format.
- All three locale tables are complete; `en.json` has no TODO markers; there is no
  English content in the Marathi or Hindi tables.
- Language choice persists in `localStorage`, `?lang=en` opens in English, Marathi
  stays the default, and switching never mutates saved state.
- 44/44 repo tests, build green, every character in the file has a glyph in the
  shipped font subsets.
