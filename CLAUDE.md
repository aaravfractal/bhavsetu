# CLAUDE.md — bhavsetu

Working agreements for agents in this repo.

## Product principles

> ⚠️ **PARTIAL — items 1–10 are missing.** Only 11–13 below were provided (pasted into the
> session on 2026-09-07). The rest of the list, the locked design tokens, the i18n string
> table, and `docs/roadmap.md` §4 (Session 1) have not been supplied and do not exist in this
> repo. Do not invent them — ask.

11. Verdicts are never bare: every verdict badge opens a sheet with up to
    three plain-Marathi reasons from the forecast inputs.
12. Money is never opaque: any screen showing a price the farmer receives
    shows the math (bid − transport − cess = in hand).
13. After payment release, Money screen shows extra earned vs harvest-day
    price per lot and a season total.

## What these imply for the component layer

- `VerdictBadge` is **tappable by contract**, not by option — a non-interactive verdict
  badge violates principle 11. Its reasons sheet takes up to three strings, authored in
  Marathi first (mr is the default locale; hi and en follow).
- Any price display component must be able to render the full derivation, not just the
  final figure (principle 12). A component that can only show one number is the wrong shape.
- Money views are **per-lot and cumulative** (principle 13), so lot-level records need a
  harvest-day reference price retained for later comparison.

## Data sources

See [`docs/data_sources.md`](docs/data_sources.md). Current status (verified 2026-09-07):
**no live source is cleared for use.** data.gov.in carries no arrivals and no history and
was missing Lasalgaon/Nashik entirely on the day tested; the Agmarknet 2.0 API has the right
data but is captcha-gated; MSAMB is login-walled. A decision between the fallback options
(A–D in that doc) is outstanding.

Two traps to respect if anything touches data.gov.in:
- `filters[arrival_date]` is **silently ignored** — a date-filtered request returns the whole
  dataset with HTTP 200. Assert dates in the payload.
- Market names carry **trailing whitespace** (`'APMC Bhusaval '`), so exact-match filters fail
  silently rather than erroring.

## Environment

- Vite 8 + React 19 + TypeScript, dev server on `http://localhost:5173/`
- `.npmrc` sets `allow-scripts=true`. Note npm 11 does not recognise that key — it warns that
  `fsevents` install scripts are unapproved and wants `npm install-scripts approve <pkg>`.
  Vite runs fine without it.
