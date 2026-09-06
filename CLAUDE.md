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
   Devanagari Marathi; everything else uses the system stack, with Mukta
   carrying Devanagari.
7. Accessibility floor: hit targets >=56px, contrast >=7:1 for farmer-app
   text, every icon has a Marathi word under it.
8. Demo data: use the fixtures in tests/fixtures (Lasalgaon onion) and the
   figures in docs/master-prompt.md. Never invent different numbers; the
   deck and video use these exact figures.
9. Motion (Evergreen): cubic-bezier(0.22,1,0.36,1). Screens enter with a
   360ms rise (translateY 12px + fade); bottom sheets spring up over 440ms;
   overlays fade 280ms behind a 4px backdrop blur; buttons scale to 0.96 on
   press over 120ms; the deal-accept and payment-release fills stay a single
   400ms left-to-right sweep; count-ups 800ms. Nothing loops or bounces.
   Honour prefers-reduced-motion.
   Note: demo/index.html predates this and keeps the earlier
   cubic-bezier(0.2,0.8,0.2,1) doctrine throughout — see docs/CHANGELOG.md.
10. TypeScript strict. Commit only when `npm run build` and tests pass.
    Conventional commits: feat(home): ..., fix(offline): ...
11. Verdicts are never bare: every verdict badge opens a sheet with up to
    three plain-Marathi reasons from the forecast inputs.
12. Money is never opaque: any screen showing a price the farmer will
    receive shows the deduction math (bid − transport − cess = in hand).
13. After payment release, Money screen shows "extra earned vs harvest-day
    price" per lot and a season total.

## Design tokens (locked) — "Evergreen"
Supersedes the earlier Kanda maroon system (7 Sep 2026). Source of truth in code:
src/tokens/theme.ts, pinned by tests/tokens.lock.test.js.

Primary   #1E5A40 deep evergreen · pressed #154431 · tint #E3EFE7
CTA/mic gradient  linear-gradient(180deg,#2A6E4F,#1E5A40 55%,#154732)
Surfaces  page #F6F4ED warm ivory · card #FFFFFF · hairline rgba(34,30,23,.05)
Ink       #221E17 · secondary #6A6154
Semantic  gain/paid #1F7A46 emerald · hold/forecast #A87806 antique gold
          (tint #F8F1DF) · danger/glut #B23A2A terracotta · offline #6B6B66
Scrim     rgba(34,30,23,.45)
Type: system stack (-apple-system, BlinkMacSystemFont, 'SF Pro Text', Mukta —
Mukta carries Devanagari) · Tiro Devanagari Marathi for one-word verdicts only
Hero price 72px/800, -0.035em tracking · tabular-nums on every ₹ · body min 13px
Shape: 20px cards · 14-16px buttons · 10px chips/inputs · hairline borders
Shadows: layered and soft — 0 1px 2px rgba(34,30,23,.04),
         0 8-12px 24-32px rgba(34,30,23,.06-.08)
Chrome: frosted tab bar rgba(255,255,255,.78) + blur(24px) saturate(1.8);
        mic FAB uses the gradient plus an inset top highlight
Hit targets >=56px, primary CTA 64px.

## Definition of done, every session
- Build green, no TS errors, strings in i18n table
- The screen matches docs/frontend-spec.md section for it
- Offline + empty + error states implemented
- One-paragraph summary appended to docs/CHANGELOG.md