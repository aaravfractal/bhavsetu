# Data sources: Agmarknet / MSAMB — verification findings

**Verified:** 2026-09-07 · **Target:** daily mandi price *and arrivals* for Onion @ Lasalgaon (Nashik, MH)
**Status:** 🔴 **NO-GO on all three sources as specified. Decision needed — see §5.**

Every claim below was checked against the live endpoint on 2026-09-07. Raw responses are in
`tests/fixtures/`; §6 lists the exact command that produced each file so they can be re-pulled.

> **Spec gap:** this doc was requested as "CLAUDE.md + docs/roadmap.md §4, Session 1". Neither file
> exists in this repo or anywhere under `~/Developer`. Findings below are grounded in the live APIs,
> not in the roadmap, so acceptance criteria I could not read may be unmet.

---

## 1. data.gov.in — "Current Daily Price of Various Commodities from Various Markets (Mandi)"

`GET https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070`

**Verdict: 🔴 NO-GO.** The API is healthy and pleasant to use. It just does not contain the two
things this project needs: arrivals, and history. It also did not contain Lasalgaon on the day tested.

### What works
| Property | Finding |
|---|---|
| Auth | Free API key, query param `api-key`. Public sample key works. Bad key → `403 {"error":"Key not authorised"}` |
| Rate limit | `X-Ratelimit-Limit: -1`, `X-Ratelimit-Remaining: -1` — unenforced. 20 rapid sequential calls all `200`, ~0.37 s each |
| Freshness | `updated_date` `2026-09-06T20:00:40Z`, i.e. previous evening. Updates daily |
| Volume | 10,069 records total (one day, all-India) |
| Field names | `state` `district` `market` `commodity` `variety` `grade` `arrival_date` `min_price` `max_price` `modal_price` |

Note the display names are HTML-escaped in the schema block (`Min_x0020_Price`); the `id` values above
are what filters and record keys actually use.

### Blockers
1. **No arrivals field.** The schema has ten fields and none is quantity/arrivals — only min/max/modal
   *price*. Arrivals cannot be derived from it. For a brief asking for arrivals, this alone is fatal.
2. **No historical depth — it is a single-day snapshot.** Sampled offsets 0 / 2000 / 5000 / 9000 across
   all 10,069 records: every row is `06/09/2026`. The name says "Current" and it means it.
3. **`filters[arrival_date]` is silently ignored.** Filtering to `05/09/2026` returns `total: 10069` —
   the entire dataset, unfiltered, with HTTP 200. A client would believe it received a filtered day.
   (`filters[market]=ZZZNOTAMARKET` and unknown field names *do* correctly return 0, so this is
   specific to the date field. `q=` is likewise ignored: `q=Lasalgaon` → 10,069.)
   → **Never trust a date-filtered response from this API without asserting the dates in the payload.**
4. **Lasalgaon and all of Nashik were absent on the day tested.** Maharashtra had 345 records across
   29 markets; `filters[district]=Nashik` → `total: 0`. India's largest onion market reported nothing.
   Whether this is a one-day gap or systemic is **unknown and unverifiable through this API**, because
   it holds no history to check against. Treat as a red flag needing a multi-day watch, not a proven fact.

### Traps (relevant even if the source is only used as a supplement)
- **Trailing whitespace in market names**: values are `'APMC Bhusaval '`, `'Junnar(Otur) '` — exact-match
  filters fail silently. This is why `filters[market]=Lasalgaon` returns 0 rather than erroring.
- **Sample key caps at 10 records/call** regardless of `limit` (`limit=100` → `count: 10`, `total: 465`).
  `total` is still reported honestly, so paginate via `offset`. A registered key is needed for larger pages.
- **No CORS.** No `Access-Control-Allow-Origin` on a request with `Origin: http://localhost:5173`.
  **Not callable from the browser** — bhavsetu needs a server-side proxy (`src/server/` is scaffolded and empty).
- **Date format is `DD/MM/YYYY`**, not ISO.
- **Unit inconsistency in `modal_price`**: Pune onion rows carry `13` and `8` alongside `3000`–`4500`
  elsewhere. Some rows are not ₹/quintal. Needs sanity-bounds before display.

---

## 2. Agmarknet 2.0 API — `api.agmarknet.gov.in/v1`

**Verdict: 🟡 NO-GO for automation, but it is the only source that has the right data.**

agmarknet.gov.in is now a React SPA over a JSON API. This API **does** have what data.gov.in lacks:
arrivals, history, and Lasalgaon — as three distinct markets:

```
{'id': 161,  'mkt_name': 'APMC Lasalgaon ',     'state_id': 20, 'district_id': 361}
{'id': 2139, 'mkt_name': 'Lasalgaon(Niphad) ',  'state_id': 20, 'district_id': 361}
{'id': 3448, 'mkt_name': 'Lasalgaon(Vinchur) ', 'state_id': 20, 'district_id': 361}
```
Onion is `cmdt_id 23`; Maharashtra `state_id 20`; Nashik `district_id 361`. (Same trailing-space defect —
it is upstream in Agmarknet, not introduced by data.gov.in.)

**Open, no auth:** `GET /location/state` (36 states), `GET /daily-price-arrival/filters` — a 526 KB
catalogue of 4,179 markets, 605 commodities, 2,154 varieties, 747 districts. Genuinely useful as a
reference/lookup table on its own.

**Blocked:** the endpoints that return actual observations.
- `POST /daily-price-arrival/report` → `400 {"detail":"Captcha key and captcha value are required.","code":"TOKEN_OR_CAPTCHA_REQUIRED"}`
- `GET /price-trend/wholesale-arrivals-{weekly,monthly}`, `/price-trend/varietywise-prices-*` → opaque
  `500` on every parameter spelling tried
- `GET /list-market` → `403 {"detail":"Authorization header missing"}`

So the data is reachable only behind a captcha or a logged-in bearer token. The bundle also ships
RSA password encryption and an `auth/refresh` flow, i.e. accounts exist — but this is an
**undocumented, unofficial, reverse-engineered surface** with no published contract and no stability
promise. Building the product's daily ingest on it means depending on a captcha we would have to
defeat. I don't recommend it, and I have not attempted it.

---

## 3. MSAMB

**Verdict: 🔴 NO-GO. No public data surface found.**

- `https://www.msamb.com/` — loads (200); homepage links to arrivals/price info in Marathi
- `https://www.msamb.com/ApmcDetail/ArrivalPriceInfo` — **302 → `/Home/Error`** (confirmed); the arrivals page is broken
- `https://data.msamb.com/` — 200, but is a **login-walled ASP.NET portal**

No API, no CSV/Excel export, no documented bulk access. Not paywalled in the billing sense — just closed.

---

## 4. Field-name reference (data.gov.in, confirmed against live payload)

```json
{
  "state": "Maharashtra",  "district": "Pune",   "market": "APMC Pune ",
  "commodity": "Onion",    "variety": "Local",   "grade": "Local",
  "arrival_date": "06/09/2026",
  "min_price": 1000,       "max_price": 5000,    "modal_price": 3000
}
```
Verbatim first record of `onion_maharashtra.json`. Prices are **JSON numbers** (observed `int` across
every fixture), though the schema block declares them `double` — parse defensively.
Envelope: `total`, `count`, `limit`, `offset`, `records[]`.

---

## 5. ⛔ Decision needed — recommended fallback

All three sources fail the brief as written: the open one has no arrivals and no history, the one with
arrivals is captcha-gated, and MSAMB is closed. Per your instruction I am stopping here rather than
picking one.

**Recommended: manual CSV snapshot, seeded from the Agmarknet portal's own export.**
Agmarknet publishes downloadable date-wise commodity reports through the web UI. A human pulls Onion @
Lasalgaon (all three market ids) for the desired window once, drops the CSV in `tests/fixtures/`, and we
build the ingest + UI against a fixed, real, offline dataset. Cost: one manual pull. Benefit: unblocks
Session 1 immediately, gives deterministic tests, and defers the live-feed question until the product
shape is settled.

Options, in the order I'd rank them:

| # | Option | Cost | Risk |
|---|---|---|---|
| **A** | **Manual CSV snapshot** from Agmarknet portal export (recommended) | One manual pull | Stale by design; needs a refresh story before launch |
| B | data.gov.in for *prices only*, drop arrivals from Session 1 scope | Low — API works today | Silently loses Lasalgaon on days it doesn't report; no history for charts |
| C | CEDA mirror (`agmarknet.ceda.ashoka.edu.in`) — Ashoka Univ. publishes daily/monthly/yearly Agmarknet prices *and* arrivals | ~1 day to evaluate | Third-party; licence and update cadence unverified — **I have not tested it** |
| D | Scrape Agmarknet portal HTML on a schedule | Days | Fragile; captcha likely extends to it; ToS question |

**What I need from you:** which of A–D, and — if the answer is A — the exact window and which of the
three Lasalgaon market ids to treat as canonical. I'd also suggest I spend an hour on **C** before you
commit to A, since a licensed mirror with arrivals *and* history would beat a frozen snapshot outright.

---

## 6. Fixture provenance

All captured 2026-09-07. `K` = public sample key `579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b`,
`R` = `9ef84268-d588-465a-a308-a864a43d0070`, `B` = `https://api.data.gov.in/resource/$R?api-key=$K&format=json`.

| Fixture | Command | Shows |
|---|---|---|
| `datagovin/daily_price_limit5.json` | `$B&limit=5` | Full schema block + 5 records |
| `datagovin/onion_national_limit10.json` | `$B&limit=10&filters[commodity]=Onion` | `total: 465` nationally |
| `datagovin/onion_maharashtra.json` | `…&filters[state.keyword]=Maharashtra` | All 15 MH onion rows; no Lasalgaon |
| `datagovin/onion_lasalgaon_EMPTY.json` | `$B&limit=10&filters[market]=Lasalgaon` | `total: 0` |
| `datagovin/nashik_district_EMPTY.json` | `$B&limit=10&filters[district]=Nashik` | `total: 0` |
| `datagovin/arrival_date_filter_IGNORED.json` | `$B&limit=1&filters[arrival_date]=05/09/2026` | `total: 10069` — filter ignored |
| `datagovin/error_bad_api_key.json` | `api-key=BADKEY123` | `403 Key not authorised` |
| `agmarknet2/daily_price_arrival_filters.json` | `GET /v1/daily-price-arrival/filters` | 4,179 markets incl. 3× Lasalgaon |
| `agmarknet2/location_state.json` | `GET /v1/location/state` | Open endpoint, 36 states |
| `agmarknet2/report_CAPTCHA_BLOCKED.json` | `POST /v1/daily-price-arrival/report` | `TOKEN_OR_CAPTCHA_REQUIRED` |
| `msamb/arrival_price_info_ERROR_REDIRECT.html` | `GET /ApmcDetail/ArrivalPriceInfo` | Redirect to `/Home/Error` |
| `msamb/data_portal_LOGIN_WALL.html` | `GET https://data.msamb.com/` | Login wall |
