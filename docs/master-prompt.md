# BhavSetu — master prompt v2 (everything merged, 7 Sep 2026)

This replaces every earlier prompt. Paste everything below the line into any Claude chat, write your ask in TASK at the bottom.

---

You are working on BhavSetu, Team Fractal Verse's Smart India Hackathon 2026 entry. Problem statement: Government of Maharashtra, Software category, "Strengthening market linkages and price discovery for farmers." Read all context below, then do the TASK at the end. Follow the locked decisions exactly; do not invent new colours, fonts, features, numbers or scope.

PRODUCT
BhavSetu (Marathi: price bridge) is a Marathi voice-first decision and trust layer on top of eNAM. It tells a farmer what his crop will sell for next week, where to sell it for the best net price after transport, connects him to verified buyers, and holds payment in escrow until delivery. Tagline: "Know the price. Reach the buyer. Get paid." Marathi: भाव कळेल. बाजार मिळेल. पैसे मिळतील.

Positioning: eNAM is where you trade; BhavSetu tells you when, where, at what price, and whom to trust. Never describe it as an eNAM replacement or a marketplace.

USERS
- Primary: Raju, 42, onion farmer, Niphad taluka, Nashik. Shared Android, 2G, reads Marathi slowly, prefers listening, uses WhatsApp voice notes. His three questions: price today? sell or wait? where and to whom?
- Secondary: FPO manager (tablet), pools lots from 40-80 farmers.
- Tertiary: MSAMB district officer (desktop), needs glut/shortage warning before price crashes.

FEATURES — tiered. Any slide, list or README uses exactly this tiering.

Primary (1-5):
1. Marathi voice price query over WhatsApp + IVR, zero data needed
2. Bhav chart: daily candles, 30-day and 7-day average lines, arrivals as volume bars, shaded 14-day forecast band (±110 on demo data)
3. One-word verdict on every price view: विका Sell / थांबा Hold / सावध Warning. Every verdict is TAPPABLE and opens up to three plain-Marathi reasons (e.g. "arrivals falling in Nashik", "no rain expected", "festival demand in 2 weeks"). A verdict is never shown without reasons behind it.
4. Farmer price alerts ("tell me when onion crosses ₹2,000 at Lasalgaon"), phone call default, SMS/WhatsApp
5. Net-price mandi routing after transport and cess

Supporting (6-9):
6. Store-or-sell calculator with nearest cold storage
7. Camera grading (size, sprouting, damage) creating a lot passport
8. GPS pooling: farmers within 10 km merge into one large lot, shared truck
9. Verified buyer board with trust scores and escrow release on delivery. Every bid shows the full money math before accept: bid − transport − cess = "tumhala milel" (in hand), in bold. Nothing is ever silently deducted; the farmer sees where every rupee went.

Building (10-12):
10. Voice contract: both sides accept by recorded Marathi voice, written summary generated
11. Glut AND shortage early warning, 5-7 days ahead, from cross-mandi arrivals
12. Government dashboard (MSAMB): taluka-level risk, days-to-impact, suggested action, one-click Marathi advisory

Proof feature (demo closer):
13. Extra-earned screen: after every completed sale, "Sold at ₹X via BhavSetu vs harvest-day price ₹Y = extra earned ₹Z on this lot" plus a season running total. Demo case: sold ₹2,050 vs ₹1,850 = ₹4,000 extra on 20 quintals. This is demo step 10, the closing shot before the government dashboard.

Roadmap only (never build scope this cycle):
14. BhavScore: credit history built from completed deals (quantity, grade, on-time, paid)
15. Government loan eligibility: maps BhavScore + landholding to KCC and state schemes, pre-filled application, consented transaction report to banks
16. Harvest advance: instant credit up to ~70% against an escrowed buyer contract
17. Warehouse receipt (e-NWR) loans on stored lots
18. PMFBY insurance auto-claims from geotagged photos + IMD weather evidence
19. Storage subsidy auto-claim when the government dashboard recommends it
20. MSP/NAFED procurement alerts by phone call, in-app registration
21. Input credit (seeds/fertiliser) against next confirmed sale, priced off BhavScore
22. Digital receipts ledger (cess, transport, sales) for banks, taxes, disputes
23. BhavScore consent API: farmer-permissioned data lenders pay for (business model: free for farmers forever)
24. Season crop planner: suggest next season's crop from demand, expected price, soil/region and past trends

DEMO DATA (use these exact figures everywhere)
Lasalgaon onion ₹/quintal, last 7 days: 1,640 1,690 1,720 1,700 1,730 1,780 1,850(today). Forecast 10 days: 1,880 1,920 1,960 2,010 2,050 2,080 2,100 2,110 2,090 2,060, band ±110. Verdict: थांबा Hold, target ₹2,100 in 8 days; reasons: arrivals falling in Nashik, no rain expected 10 days, festival demand in 2 weeks. Nearby mandis (price/km/net): Pimpalgaon 1,920/18/1,835 · Lasalgaon 1,850/11/1,800 · Yeola 1,900/34/1,760. Store-or-sell on 20q: store, gain ₹4,200 (Vinchur cold storage, ₹18/q/week). Bids on Lot-0412 with money math: Sahyadri Exports 2,050 − 85 transport − 30 cess = 1,935 in hand, trust 5/5 · Deshmukh Dehydration 1,980 − 85 − 30 = 1,865, trust 2/5 · Kisan Agro 1,940 − 50 − 30 = 1,860, trust 4/5. Escrow held ₹1,58,100. Extra earned: ₹4,000 on the demo lot. Early warning: Nashik arrivals +38% next week, price may fall ₹250-400, alert 6 days early. At-risk talukas: Niphad +38%, Yeola +31%, Sinnar +24%, Rahuri +22%. Impact framing: 40-60% seasonal swing; 3-4 middlemen; hold decision worth ₹4,200-5,000 on a 20q lot (label as estimate).

DEMO FLOW (10 steps, under 5 minutes, all live)
1 Home: Bhav card, Hold verdict · 2 Tap verdict → three Marathi reasons · 3 Voice query in Marathi, spoken answer · 4 Set price alert (phone call) · 5 Store-or-sell: "Store, gain ₹4,200" · 6 Airplane mode: offline banner, cached card still shows · 7 Add lot: camera → Grade A → pool 4 farmers/85q · 8 Buyers: 3 bids with money math + trust bars, voice accept · 9 Escrow lock → delivery → Paan fill + toast · 10 Extra-earned card: ₹4,000 on this lot → switch to government dashboard, Niphad hot, send Marathi advisory.

TECH (locked)
Vite React PWA <150KB first load, offline-first (IndexedDB cache with timestamp, grey #6B6B66 chrome when stale), mr default / hi / en string table, Devanagari digits in mr/hi. Data: Agmarknet (data.gov.in), MSAMB, IMD, APEDA. Forecast: gradient boosting with a ± band, never a bare number, backtested on Lasalgaon history. Voice: Bhashini STT/TTS, WhatsApp Business API, Exotel IVR. Escrow: Razorpay Route class. No blockchain.

DESIGN TOKENS (locked, never deviate)
Chuna bg #F5F4EE · card #FFFFFF · line #D9D2C5 · ink #2B1F16 · ink-2 #5C4A3C · Kanda primary #8C2F4A (tint #F3E3E8) · Haldi hold/price #C98A0A (tint #FBF3E2) · Paan sell/gain #1F7A46 (tint #E4F0E8) · Mirchi loss/warning #B3261E · Dhool offline #6B6B66. Verdict mapping never swaps: Sell=Paan, Hold=Haldi, Warning=Mirchi. Fonts: Mukta 400-800 for everything; Tiro Devanagari Marathi for verdict words only. Price is the largest element on any screen showing one (72px mobile), tabular-nums. Radius 6/12px, 1px borders, hard bottom edge on the Bhav card, no soft shadows. Marathi always above English, English smaller in ink-2. Motion: ease-out cubic-bezier(0.2,0.8,0.2,1); 120ms taps, 400ms single Paan fill on deal-accept and payment-release, 800ms count-ups; no bounce, particles, or entrance animations. Hit targets ≥56px, contrast ≥7:1, every icon has a Marathi word under it.

RULES
- One crop (onion) done properly; other crops are roadmap.
- Every farmer screen works by voice and offline; nothing depends on reading.
- Never show a forecast without its confidence band; never show a verdict without tappable reasons; never show a payout without the deduction math.
- No stock photos, illustrated farmers, tractors, or leaf logos. No gradient backgrounds. No card grids with identical shadows.
- Quantified claims stay within the demo data above; anything else is labelled estimate.
- Team: Fractal Verse, 6 members, GEHU Dehradun. Lead: Aarav Sharma.

TASK
[Write your ask here: "build the 10-slide judge deck", "build screen X per the spec", "write the 90-second video plan", "update the team PPT", "draft the README", etc. Output only what the task asks for, following everything above.]
