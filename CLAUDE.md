# BhavSetu — rules for every session

## What this is
SIH 2026 entry (Govt of Maharashtra, Software): Marathi voice-first price
discovery + market linkage app for farmers. Reference user: onion farmer,
Niphad, Nashik. Judges see a live 5-minute demo on a phone; every decision
optimises for that demo working offline on stage.

## Read first
- docs/frontend-spec.md — screen-by-screen truth: layout, copy, states.
  If a prompt and the spec disagree, the spec wins. Say so, then follow the spec.
- docs/master-prompt.md — full product context, feature tiers, demo data.
- docs/roadmap.md — session order and locked decisions.
- docs/data_sources.md — API truth from Session 1.

## Hard rules
1. Design tokens are locked (below). Never invent a colour, font, radius,
   or easing. If a needed token is missing, stop and ask.
2. Marathi (mr) is the default locale. Every user-facing string goes in
   src/i18n/{mr,hi,en}.json from day one — no hardcoded strings, ever.
   mr/hi use Devanagari digits except inside charts. Marathi strings come
   from docs/frontend-spec.md verbatim; where the spec has no string, use
   English meaning with a TODO-mr marker for native review — never
   machine-translate new Marathi.
3. Every screen renders three states: loaded, offline (cached + timestamp
   label + grey #6B6B66 chrome), and empty/error with a Marathi message.
   A screen without its offline state is not done.
4. Offline-first: last prices cached in IndexedDB with fetch timestamp.
   The app must fully render with network off.
5. No new dependencies without listing them and why at the top of your
   reply. Budget: <150KB gzipped first load. Check with the build output.
6. Numbers use tabular-nums. Price is the largest element on any screen
   that shows one. Verdict words (विका / थांबा / सावध) render in Tiro
   Devanagari Marathi; everything else Mukta.
7. Accessibility floor: hit targets >=56px, contrast >=7:1 for farmer-app
   text, every icon has a Marathi word under it.
8. Demo data: use the fixtures in tests/fixtures (Lasalgaon onion) and the
   figures in docs/master-prompt.md. Never invent different numbers; the
   deck and video use these exact figures.
9. Motion: ease-out cubic-bezier(0.2,0.8,0.2,1); 120ms taps, 400ms single
   left-to-right Paan fill on deal-accept and payment-release, 800ms
   count-ups. No other animation. Honour prefers-reduced-motion.
10. TypeScript strict. Commit only when `npm run build` and tests pass.
    Conventional commits: feat(home): ..., fix(offline): ...
11. Verdicts are never bare: every verdict badge opens a sheet with up to
    three plain-Marathi reasons from the forecast inputs.
12. Money is never opaque: any screen showing a price the farmer will
    receive shows the deduction math (bid − transport − cess = in hand).
13. After payment release, Money screen shows "extra earned vs harvest-day
    price" per lot and a season total.

## Design tokens (locked)
Kanda (primary)   #8C2F4A, tint #F3E3E8   CTAs, mic FAB, active nav
Chuna (bg)        #F5F4EE, card #FFFFFF, line #D9D2C5
Ink               #2B1F16, secondary #5C4A3C
Paan (up/success) #1F7A46, tint #E4F0E8   price up, paid, sell verdict
Haldi (hold/warn) #C98A0A, tint #FBF3E2   hold verdict, forecast band, escrow held
Danger #B3261E · Offline #6B6B66
Type: Mukta 400-800 (UI) · Tiro Devanagari Marathi (verdict words only)
Body min 13px · price 72px · radius 6px buttons / 12px cards ·
1px #D9D2C5 borders · hard bottom edge on Bhav card, no soft shadows.
Hit targets >=56px, primary CTA 64px.

## Definition of done, every session
- Build green, no TS errors, strings in i18n table
- The screen matches docs/frontend-spec.md section for it
- Offline + empty + error states implemented
- One-paragraph summary appended to docs/CHANGELOG.md