# BhavSetu — Claude Code build roadmap

Source: BhavSetu UI & Build Handoff PDF (Team Fractal Verse, SIH 2026, GoM Software track).
Deadline pressure: SIH idea-submission window is open through 20 Sep 2026 — this is not urgent against MAMORU's 8 Sep deadline. Do this after MAMORU submits.

Stack per the handoff: PWA (React), <150KB first load, SQLite/IndexedDB cache, server does forecast + alerts fan-out. Marathi default, Hindi/English string table.

---

## 0. Locked decisions

| Item | Decision |
|---|---|
| Reference user | Onion farmer, Niphad taluka, Nashik |
| Languages | mr (default) / hi / en, one string table, Devanagari digits in mr/hi |
| Screens | home · chart · alerts · calc · lots · addlot(3 steps) · buyers(+bid sheet) · money · onboarding(3) · voice sheet overlay |
| Nav | bottom nav only on home/lots/buyers/money |
| Offline | cache last prices + timestamp; stale data labelled; chrome greys to #6B6B66 |
| Audio | every screen has a voice/IVR equivalent; nothing depends on reading |
| Forecast | gradient boosting on price+arrivals+weather, always shown with a ± band, never a bare number |
| Design tokens | see section 1 below, locked, do not deviate |

---

## 1. Design tokens (paste into every Claude Code prompt)

```
Kanda (primary)   #8C2F4A, tint #F3E3E8      CTAs, mic FAB, active nav
Chuna (bg)        #F5F4EE, card #FFFFFF, line #D9D2C5
Ink               #2B1F16, secondary #5C4A3C
Paan (up/success) #1F7A46, tint #E4F0E8      price up, paid, deals
Haldi (hold/warn) #C98A0A, tint #FBF3E2      hold verdict, forecast, escrow held
Danger/offline    #B3261E / #6B6B66
Type: Mukta 400-800 (UI), Tiro Devanagari Marathi (verdicts only)
Body min 13px, price 72px, tabular-nums for ₹
Radius 6px buttons / 12px cards, 1px #D9D2C5 border
Hit targets ≥56px, primary CTA 64px
```

---

## 2. Repo layout

```
bhavsetu/
  CLAUDE.md
  README.md
  package.json
  public/
  src/
    i18n/{mr,hi,en}.json
    tokens/theme.ts
    components/ (Card, VerdictBadge, Stepper, TrustBar, BottomNav, MicFAB, OfflinePill)
    screens/
      Home.tsx
      BhavChart.tsx
      PriceAlerts.tsx
      SellOrStore.tsx
      MyLots.tsx
      AddLot/ (Photo.tsx, Pooling.tsx, Review.tsx)
      Buyers.tsx
      BidSheet.tsx
      VoiceAccept.tsx
      Money.tsx
      Onboarding/ (Language.tsx, CropsLocation.tsx, Phone.tsx)
      VoiceQuery.tsx
    state/ (screen machine, offline cache, demo controls)
    server/ (forecast stub, alerts fan-out stub)
    lib/ (agmarknet.ts, msamb.ts, imd.ts, voice.ts)
  tests/
```

---

## 3. Data sources (all public/free — verify each endpoint before wiring)

- Agmarknet (data.gov.in) — daily mandi modal prices
- MSAMB — Maharashtra arrivals (glut signal)
- IMD — weather, forecast input
- APEDA — export demand (roadmap, not MVP)
- Bhashini — Marathi/Hindi ASR + TTS
- Exotel-class IVR for zero-data calls
- WhatsApp Business API
- Razorpay Route-class escrow (payment hold/release)

None of these are confirmed reachable or free-tier-sufficient until checked. Session 1 below verifies Agmarknet and MSAMB before anything else is built on top of them.

---

## 4. Build order

### Session 1 — Verify data sources (before any UI)
```
Check Agmarknet (data.gov.in) API for daily mandi modal price data: does it need an API key, what's the rate limit, what fields does it return for onion/Lasalgaon. Same for MSAMB arrivals data. Write findings to docs/data_sources.md with real sample responses saved to tests/fixtures/. Do not write any UI code yet. If either source requires paid access or is unreachable, flag it and propose the fallback (manual CSV import, cached snapshot) before continuing.
```

### Session 2 — Scaffold + design system
```
Read CLAUDE.md and the design tokens in section 1. Scaffold a Vite + React PWA. Implement src/tokens/theme.ts, the i18n string table (mr default, hi, en) with a language switcher, and the shared components: Card, VerdictBadge (Hold/Sell in Tiro Devanagari Marathi for mr), Stepper, TrustBar (5-segment), BottomNav (4 tabs), MicFAB, OfflinePill (grey chrome + "yesterday's data" label). Commit when build is green.
```

### Session 3 — Home / Bazaar (screen 1)
```
Build Home.tsx: bhav card (modal price, Δ vs yesterday, sparkline + 10-day forecast, one-word verdict, audio CTA), nearby mandis ranked by net price, glut alert banner. Use real Agmarknet data from Session 1's fixtures. Mic FAB over bottom nav.
```

### Session 4 — Bhav chart (screen 2)
```
Build BhavChart.tsx: 30-day candles, 30/7-day averages, arrivals bars, shaded 14-day forecast band with ± confidence, verdict pinned top-right, CTA to price alerts.
```

### Session 5 — Price alerts (screen 3)
```
Build PriceAlerts.tsx: ₹50-step threshold stepper, forecast-turns-down toggle, channel choice (Call default / SMS / WhatsApp), glut warning card.
```

### Session 6 — Sell or store calculator (screen 4)
```
Build SellOrStore.tsx: side-by-side sell-today vs store-3-weeks at forecast price minus transport & storage, verdict in serif, nearest cold storage with call button.
```

### Session 7 — My lots + Add lot (screens 5, 6, 7)
```
Build MyLots.tsx (lot cards: photo, grade chip, quantity, status pill, pooled farmer count) and the 3-step AddLot flow: Photo -> instant grade (size/sprouting/damage stub) -> pooling toggle with a map of farmers within 10km.
```

### Session 8 — Buyers, bid sheet, voice accept (screens 8, 9)
```
Build Buyers.tsx (bids ranked by TrustBar, net-to-you price, plain-language trust reason), BidSheet.tsx, and VoiceAccept.tsx (hold-to-record "I agree", saved as a voice contract, shareable to WhatsApp).
```

### Session 9 — Money / escrow (screen 10)
```
Build Money.tsx: season total, escrow cards (Payment held -> released on delivery confirmation, green fill animation + toast), bank report PDF export.
```

### Session 10 — Voice query overlay + onboarding (screen 11 + onboarding)
```
Build the Mic FAB sheet (waveform, live transcript, spoken + visual answer card) and the 3-step onboarding (language -> crops+taluka via GPS -> phone/OTP with voice option).
```

### Session 11 — Offline mode + demo controls
```
Wire the offline-first cache (IndexedDB, last prices + timestamp), stale-data grey chrome across every screen, and the demo controls panel (offline toggle, re-run onboarding, reset state) for judge demos.
```

### Session 12 — Forecast + alerts backend stub
```
Build server/forecast.ts: a gradient-boosting stub over price+arrivals+weather fixtures, always returning a ± band. Build server/alerts.ts: fan-out stub for call/SMS/WhatsApp triggers. Real ML training is out of scope for the hackathon submission; this proves the interface.
```

### Session 13 — Submission pack
```
README with the SIH problem statement, screenshots of all 11 screens, the data source list, and "designed to build" vs "prototyped" status per section 4 of the handoff PDF. Demo video script following the same 3-word-per-scene job discipline as your other hackathon builds.
```

---

## 5. Feature status (from the handoff, carry into README)

**Prototyped (9):** voice price query, Bhav chart w/ 14-day forecast, one-word verdicts, price+forecast alerts, net-price mandi routing, store-or-sell calculator, camera grading & lot passport, GPS pooling, verified buyer board with trust scores and escrow.

**Designed, to build (3):** voice contract (both sides accept in Marathi), glut/shortage early warning 5-7 days ahead, government alert dashboard.

**Roadmap (not this cycle):** credit report for banks, export/processor demand feed, FPO buyer board.

---

## 6. Team note

This is a 6-person team (Fractal Verse) exercise, not solo. Assign sessions across teammates where possible — Claude Code sessions are independent enough to parallelise across screens once Session 2 (design system) is committed.
