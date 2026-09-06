# BhavSetu: front-end prototype spec (zero to one)

SIH 2026, Government of Maharashtra PS: "Strengthening market linkages and price discovery for farmers"
Team: Fractal Verse, GEHU

## How to use this document

Paste the whole file into Claude Design (or hand it to a designer). Section 1 is the prompt. Sections 2 to 10 are the spec it must follow. Build the Farmer app first (Section 6), then the FPO board (Section 7), then the Government dashboard (Section 8). Every screen must render with the sample data in Section 9, and every screen needs its offline, empty and error state.

---

## 1. Prompt for Claude Design

Build a clickable high-fidelity prototype of BhavSetu, a Marathi-first mobile app that tells a Maharashtra onion farmer what his crop will sell for next week, where to sell it for the best net price, and connects him to verified buyers with payment held safely until delivery.

Three surfaces, in this priority:
1. Farmer app (mobile PWA, 360 x 800 frame, one hand, low literacy, patchy network).
2. FPO buyer board (tablet, 1024 x 768).
3. Government early-warning dashboard (desktop, 1440 x 900).

Follow the design tokens in Section 4 exactly. Use the copy in Section 6 to 8 verbatim, Marathi first with English under it. Use the sample data in Section 9. Show offline, empty, loading and error states for every screen. No stock photos, no illustrations of smiling farmers, no gradient washes, no identical card grids. The one bold element is the Bhav card (Section 5); everything else stays quiet.

---

## 2. Who uses it and what they need

Primary user: Raju, 42, onion farmer, Niphad taluka, Nashik. 4 acres. Shared Android phone (Redmi, 2 GB RAM), 2G/3G most of the day, sometimes no signal. Reads Marathi slowly, prefers listening. Sells at Lasalgaon or Pimpalgaon mandi. Uses WhatsApp for voice notes.

His three questions, in order:
1. Aaj bhav kay? (What is the price today?)
2. Viku ki thambu? (Sell or wait?)
3. Kuthe viku? (Where do I sell, who buys?)

Secondary user: Sunita, FPO manager, Vinchur. Laptop or tablet, decent network. Pools lots from 40 to 80 farmers, talks to buyers, tracks payments.

Tertiary user: MSAMB district officer, desktop. Wants to know which talukas are heading into a price crash before it happens.

Design rule that follows from this: the farmer app is designed for someone holding a phone in bright sunlight with one thumb, who may not read the screen at all. Every screen has a speaker button that reads it aloud.

---

## 3. Aesthetic direction

Grounded in the subject: the mandi. Gunny sacks, chalk-marked slates showing today's rate, onion skins, red soil, midday sun. Not agritech-startup green, not government-portal blue.

Principles
- Numbers are the interface. The price is the hero on every farmer screen, set huge. Words support the number.
- One verdict per screen. The app never shows a chart without saying what to do about it.
- Sunlight contrast. Text on background contrast ratio 7:1 minimum. No light grey text anywhere in the farmer app.
- Thumb zone. Every primary action sits in the bottom 40% of the screen. Minimum tap target 56 px.
- Voice is a first-class control, not an accessibility add-on. Speaker icon top right on every farmer screen, mic button bottom centre on home.
- Marathi first, English second, smaller. Never the other way round.
- Motion only on confirmation (a deal accepted, a payment released). No entrance animations.

Things to avoid
- Cream background with terracotta accent, dark mode with a neon accent, hairline broadsheet layouts, rounded-card grids with the same shadow on every card.
- ALL-CAPS labels, eyebrow labels above headings, arrows appended to button text, middle-dot separators.
- Cartoon farmers, tractor icons, leaf logos.

---

## 4. Locked token table

### Colour

| Token | Name (Marathi) | Hex | Use |
|---|---|---|---|
| bg | Chuna | #F5F4EE | App background (lime-wash white) |
| surface | Kagad | #FFFFFF | Cards, sheets |
| ink | Mati | #2B1F16 | Primary text |
| ink-2 | Mati-2 | #5C4A3C | Secondary text (farmer app: never below this) |
| line | Reshiv | #D9D2C5 | Dividers, input borders |
| primary | Kanda | #8C2F4A | Brand, primary buttons, active tabs |
| primary-soft | Kanda-soft | #F3E3E8 | Selected states, primary tint backgrounds |
| price | Haldi | #C98A0A | The big price number, hold verdict, alerts |
| gain | Paan | #1F7A46 | Price up, sell verdict, payment released |
| loss | Mirchi | #B3261E | Price down, glut warning, errors |
| offline | Dhool | #6B6B66 | Offline banner, cached-data badge |

Verdict colour mapping (fixed, never swapped): Sell now = Paan. Hold = Haldi. Warning / crash coming = Mirchi.

### Type

| Role | Family | Weight | Size / line height |
|---|---|---|---|
| Price hero | Mukta | 800 | 72 / 76 (farmer), 48 / 52 (tablet), 40 / 44 (desktop) |
| Verdict | Tiro Devanagari Marathi | 400 | 32 / 38 |
| Heading | Mukta | 700 | 22 / 28 |
| Body Marathi | Mukta | 500 | 18 / 28 |
| Body English (secondary) | Mukta | 400 | 14 / 20, ink-2 |
| Data label | Mukta | 600 | 14 / 20 |
| Table numerals | Mukta | 600, tabular-nums | 16 / 24 |

Both families are Google Fonts with full Devanagari and Latin coverage. Mukta does all UI. Tiro Devanagari Marathi is used only for the verdict line, so it reads like a chalk-written rate on a mandi slate. Do not add a third family.

### Spacing, radius, elevation

| Token | Value |
|---|---|
| space unit | 8 px (4, 8, 16, 24, 32, 48) |
| screen padding (mobile) | 20 px |
| radius-s | 6 px (inputs, chips) |
| radius-m | 12 px (cards) |
| radius-pill | 999 px (mic button, verdict chip) |
| Bhav card elevation | 0 2px 0 #D9D2C5 (a hard bottom edge, like a slate) |
| other cards | no shadow, 1 px line border |
| min tap target | 56 x 56 px |
| primary button height | 64 px (farmer), 48 px (tablet, desktop) |

### Motion

| Token | Value |
|---|---|
| ease-out | cubic-bezier(0.2, 0.8, 0.2, 1) |
| duration-fast | 120 ms (taps, toggles) |
| duration-confirm | 400 ms (deal accepted, payment released: a single fill from left to right in Paan) |
| entrance animations | none |
| reduced motion | honour prefers-reduced-motion, all durations to 0 |

### Iconography

Lucide icons, 28 px in farmer app, 20 px elsewhere, stroke 2 px, colour = ink. Every icon in the farmer app has a Marathi word under it. No icon stands alone.

---

## 5. The signature element: Bhav card

This is the one place the design is bold. It appears on the farmer home screen and in every price context.

```
+------------------------------------------+
|  लासलगाव · कांदा            [speaker]    |
|  Lasalgaon · Onion                       |
|                                          |
|  ₹1,850                                  |   <- Mukta 800, 72px, ink
|  प्रति क्विंटल · आज                       |   <- data label, ink-2
|                                          |
|  ▲ ₹120 कालपेक्षा                         |   <- Paan if up, Mirchi if down
|                                          |
|  ────────────╱╲──╱───  10 दिवस            |   <- sparkline, 10-day forecast, price colour
|                                          |
|  थांबा                                    |   <- verdict, Tiro Devanagari, 32px, Haldi
|  ८ दिवसांनी ₹2,100 पर्यंत जाईल             |
|  Hold. Likely ₹2,100 in 8 days           |
|                                          |
|  [ पूर्ण माहिती ऐका ]                     |   <- primary button, 64px
+------------------------------------------+
```

Rules
- The number is always the largest thing on screen.
- Sparkline shows last 7 days solid and next 10 days dashed, with a light band for the confidence range. No axis labels, no grid.
- Exactly one verdict word: विका (Sell), थांबा (Hold), or सावध (Warning). Colour per Section 4.
- Card background is surface with the hard bottom edge. Nothing else on the home screen has elevation.

---

## 6. Farmer app: screens, copy, states

Frame 360 x 800. Bottom navigation, 4 items, icon + Marathi word: बाजार (Market), माझा माल (My lots), खरेदीदार (Buyers), पैसे (Money). Mic button floats above the nav, centre, 72 px, Kanda.

### 6.1 Onboarding (3 screens, skippable by voice)

Screen A: Language
- Two big buttons stacked: "मराठी" and "हिंदी". English as a small text link. No logo splash.

Screen B: Your crop and place
- "तुम्ही काय पिकवता?" / What do you grow?
- Chips: कांदा, कापूस, सोयाबीन, द्राक्षे, डाळिंब, इतर. Onion pre-selected for the demo.
- "तुमचा तालुका" / Your taluka. One input with GPS autofill button: "माझं ठिकाण घ्या" / Use my location.

Screen C: Phone number
- One input, 10 digits, large numerals. OTP arrives by SMS or by a voice call (button: "फोनवर ऐका" / Hear it on a call). This matters for feature-phone users on the IVR path.

### 6.2 Home: बाजार (Market)

Layout, top to bottom
1. Header: "नमस्कार राजू" / Hello Raju. Small offline badge appears here when cached.
2. Bhav card (Section 5) for the farmer's default crop and nearest mandi.
3. Section "जवळचे बाजार" / Nearby markets. A list, not a grid. Each row: mandi name, distance, today's price, net price after transport in bold. Sorted by net price, best first. The best row gets a Paan left border 4 px.

```
पिंपळगाव       18 km    ₹1,920    तुम्हाला ₹1,835  |
लासलगाव        11 km    ₹1,850    तुम्हाला ₹1,800
येवला          34 km    ₹1,900    तुम्हाला ₹1,760
```
4. Section "सूचना" / Alerts. Zero or one alert card. If present, Mirchi left border: "पुढच्या आठवड्यात कांद्याची आवक वाढणार. भाव पडू शकतो." / Onion arrivals rising next week. Prices may fall.
5. Bottom nav, mic.

States
- Loading: Bhav card shows the number greyed with a pulsing Haldi underline. No spinners anywhere in the app.
- Offline: Dhool banner under header: "नेटवर्क नाही. काल सकाळी ११ ची माहिती दाखवत आहे." / No network. Showing data from yesterday 11 am. Card still renders. Buttons that need network turn into "नेटवर्क आल्यावर पाठवू" / Will send when network returns.
- Error: "भाव मिळाला नाही. पुन्हा प्रयत्न करा." / Could not get price. Try again. One retry button. Never blank.

### 6.3 Voice query sheet (mic tap)

Bottom sheet, 60% height. Large waveform in Kanda while listening. Transcript appears as Marathi text under it. Example: "लासलगाव कांदा वीस क्विंटल".
Reply renders as a Bhav card inside the sheet plus a Paan or Haldi verdict line, and auto-plays audio. Two buttons: "पुन्हा विचारा" / Ask again, "बाजार पहा" / Open market.

### 6.4 Sell or store calculator

Reached from the Bhav card button "पूर्ण माहिती ऐका" or from the verdict.
- Input: quantity in quintals, big stepper.
- Two side-by-side columns, not cards: "आज विकल्यास" / If sold today, and "३ आठवडे साठवल्यास" / If stored 3 weeks.
- Each column: gross, minus transport, minus storage (only in the store column), equals net. Net in Mukta 800, 32 px.
- Below: one sentence verdict in Tiro Devanagari. "साठवा. ₹4,200 जास्त मिळतील." / Store. You gain ₹4,200.
- Storage row shows nearest cold storage name and distance, tap to call.

### 6.5 My lots: माझा माल

Empty state: a single centred line, "अजून माल नोंदवला नाही." / No lots yet. One 64 px button "माल नोंदवा" / Add a lot. Nothing else on the screen.

Add lot flow (3 steps, progress shown as 3 filled dots, no numbers)
1. Camera: full-screen viewfinder, Marathi instruction at top "कांदे पसरवून फोटो काढा" / Spread the onions and take a photo. Capture button 80 px.
2. Grade result: photo thumbnail, grade chip "अ दर्जा" / Grade A in Paan, with three small readings: size, sprouting, damage. A line "हा फोटो खरेदीदारांना दिसेल" / Buyers will see this photo.
3. Quantity and pool: quintal stepper. Toggle "जवळच्या शेतकऱ्यांसोबत एकत्र विका" / Sell together with nearby farmers, on by default. When on, show "तुमच्या १० km मध्ये ४ शेतकरी, एकूण ८५ क्विंटल" / 4 farmers within 10 km, 85 quintals total, with a small map (Section 6.8).

Lot card (in list): photo, grade chip, quintals, status pill. Status values, fixed vocabulary: "खरेदीदार शोधत आहे" (Finding buyers), "बोली आली" (Bid received), "करार झाला" (Deal agreed), "पैसे रोखले" (Payment held), "पैसे मिळाले" (Paid).

### 6.6 Buyers: खरेदीदार

List of bids on the farmer's lots. Each row: buyer name, buyer type (व्यापारी / निर्यातदार / प्रक्रिया उद्योग), price per quintal in Mukta 700, net to farmer in bold, and the buyer trust score.

Trust score is a single filled bar, 5 segments, Paan, with a one-line reason: "२३ व्यवहार, नेहमी वेळेवर पैसे" / 23 deals, always paid on time. A buyer under 3 segments shows a Haldi line: "२ वेळा माल नाकारला" / Rejected lots twice.

Accept flow: tap a bid, sheet opens with the full deal in three lines (price, quantity, delivery date and place). Button "आवाजात मान्य करा" / Accept by voice. Farmer holds the button and says "मला मान्य आहे". Waveform records. On release, the deal line fills left to right in Paan over 400 ms and the status changes to "करार झाला". This is the only animation in the app besides payment release.

Voice contract card afterwards: play button, transcript, written summary, both parties' names, date. Share to WhatsApp.

### 6.7 Money: पैसे

Top: one number, total received this season, Mukta 800, 48 px.
Below: transaction list. Each row: buyer, quintals, amount, date, status pill.
"पैसे रोखले" rows show a lock icon and the line "माल पोहोचल्यावर पैसे तुम्हाला मिळतील" / Released to you when delivery is confirmed.
Release moment: the row fills Paan left to right, then a toast "₹1,58,100 मिळाले" / ₹1,58,100 received. No confetti.

Button at bottom: "बँकेसाठी अहवाल" / Report for bank. Generates a one-page PDF: farmer name, season, lots delivered, on-time rate, grade history. Preview shown in-app.

### 6.8 Pooling map

Simple map (Mapbox light style, desaturated). Farmer's own pin in Kanda, nearby farmers with the same crop as Kanda-soft circles sized by quintals, nearest mandis as Haldi pins, cold storages as ink pins. A 10 km ring around the farmer. Tap a circle: name, quintals, grade. One button "एकत्र विका" / Pool lots.

### 6.9 Alerts and settings

Price alert: "भाव ₹ ___ च्या वर गेला की सांगा" / Tell me when price crosses ₹ ___. Delivery choice: SMS, WhatsApp, phone call. Default is phone call.

---

## 7. FPO buyer board (tablet, 1024 x 768)

Left rail 200 px: FPO name, nav (Lots, Buyers, Deals, Payments, Members). Content area with 24 px padding. English primary here, Marathi secondary, since FPO staff read English.

### 7.1 Lots table

Columns: Lot ID, Farmer(s), Crop, Grade (chip), Quintals, Location, Age, Best bid, Status. Pooled lots show a stacked-avatar count. Row click opens a right drawer 420 px with photos, grade readings, member breakdown, and the bid list.

Bulk action bar appears when rows are selected: "Pool selected", "Publish to buyers".

### 7.2 Buyer demand feed

Two-column layout. Left: live demand cards from buyers (name, type, crop, grade wanted, quantity, price, pickup window, trust bar). Right: the FPO's matching lots with a "Match" button. Export demand rows carry a small "APEDA" source tag.

### 7.3 Deals and payments

Kanban with four columns in fixed order: Bid, Agreed, In transit, Paid. Cards move on status change with the 400 ms Paan fill on Paid. Escrow amount shown as a lock chip on Agreed and In transit.

---

## 8. Government early-warning dashboard (desktop, 1440 x 900)

For MSAMB / district officers. Restrained, data-dense, English primary.

Layout
- Top bar: state name, crop selector (Onion default), date, last-updated stamp.
- Left 60%: Maharashtra choropleth by taluka. Colour scale from Chuna through Haldi to Mirchi by "glut risk score" for the next 7 days. Nashik, Ahmednagar, Pune talukas hot in the demo data.
- Right 40%: a ranked list of talukas at risk. Each row: taluka, expected arrivals vs 30-day average (as a percentage in Mukta 700), forecast price change, days until impact, suggested action (Procure / Storage subsidy / Advisory).
- Bottom strip: three time-series, side by side, all in ink with a single Haldi forecast band: arrivals, modal price, storage utilisation. Y axis labelled, X axis 30 days back and 10 forward, with a vertical "today" line.

One interaction that matters: click a taluka, right panel becomes that taluka's detail with a button "Send advisory to farmers", which previews the Marathi SMS text.

No KPI tiles with big numbers across the top. The map is the hero.

---

## 9. Sample data (use exactly, realistic for Sep 2026)

Farmer: Raju Bhaskar Shinde, Niphad, Nashik. Crop: Onion. Land: 4 acres. Default mandi: Lasalgaon.

Lasalgaon onion, modal price ₹/quintal, last 7 days: 1,640 · 1,690 · 1,720 · 1,700 · 1,730 · 1,780 · 1,850 (today).
Forecast next 10 days: 1,880 · 1,920 · 1,960 · 2,010 · 2,050 · 2,080 · 2,100 · 2,110 · 2,090 · 2,060. Confidence band ±110.
Verdict today: Hold, 8 days, target ₹2,100.

Nearby mandis today (price, distance, transport per quintal, net):
- Pimpalgaon Baswant: 1,920, 18 km, ₹85, net 1,835
- Lasalgaon: 1,850, 11 km, ₹50, net 1,800
- Yeola: 1,900, 34 km, ₹140, net 1,760
- Nashik: 1,870, 42 km, ₹165, net 1,705

Cold storage: Vinchur Agro Cold Chain, 9 km, ₹18/quintal/week.

Lots:
- LOT-0412, Raju, Onion, Grade A, 20 q, status Bid received
- LOT-0398 (pooled, 4 farmers), Onion, Grade A/B, 85 q, status Finding buyers

Buyers and bids on LOT-0412:
- Sahyadri Exports, Exporter, ₹2,050/q, trust 5/5, "31 deals, always on time"
- Kisan Agro Traders, Trader, ₹1,940/q, trust 4/5, "23 deals, always paid on time"
- Deshmukh Dehydration, Processor, ₹1,980/q, trust 2/5, "Rejected lots twice"

Money: season total ₹4,12,600. Held in escrow: ₹1,58,100 (Sahyadri, 77 q pooled share). Last received ₹86,400 on 22 Aug.

Alert: "Onion arrivals in Nashik district expected +38% next week vs 30-day average. Price may fall ₹250 to ₹400."

Government dashboard, top at-risk talukas: Niphad (+38%, -₹320, 6 days, Storage subsidy), Yeola (+31%, -₹280, 7 days, Advisory), Sinnar (+24%, -₹190, 9 days, Advisory), Rahuri (+22%, -₹170, 9 days, Advisory).

---

## 10. Component inventory

Farmer app: Bhav card, Sparkline, Verdict line, Mandi row, Alert card, Offline banner, Mic button, Voice sheet, Stepper, Column compare (sell vs store), Camera capture, Grade chip, Status pill, Trust bar, Bid row, Voice-accept button, Voice contract card, Transaction row, Pool map, Bottom nav, Toast.

FPO board: Left rail, Data table, Row drawer, Bulk action bar, Demand card, Match button, Kanban column, Lock chip.

Government: Top bar, Choropleth map, Risk list row, Time-series panel, Advisory preview modal.

Shared: Primary button (Kanda), Secondary button (outline, ink), Text input, Chip, Speaker button.

---

## 11. Demo flow the prototype must support end to end

1. Open app as Raju, home shows Bhav card with Hold verdict.
2. Tap mic, say the Lasalgaon query, sheet answers with voice.
3. Open sell-or-store calculator, see "Store, gain ₹4,200".
4. Turn on airplane mode, return to home, offline banner appears, card still shows.
5. Add lot: camera, Grade A result, pooling toggle shows 4 farmers on map.
6. Buyers tab: three bids with trust bars, accept Sahyadri by voice, Paan fill.
7. Money tab: escrow lock, then simulate delivery, Paan fill, toast.
8. Switch to FPO board: same lot in the Deals kanban moving to Paid.
9. Switch to Government dashboard: Niphad hot on the map, click, preview the Marathi advisory SMS.

Nine screens, one story, under five minutes.
