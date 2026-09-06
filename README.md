# BhavSetu

Marathi voice-first price discovery and market linkage for Maharashtra onion
farmers. SIH 2026 entry, Government of Maharashtra, Software category.
Team Fractal Verse, GEHU Dehradun.

भाव कळेल. बाजार मिळेल. पैसे मिळतील. — Know the price. Reach the buyer. Get paid.

## Run it

```
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build
npm test           # node --test, no runner dependency
npm run lint
```

`/gallery` renders every locked token and shared component in all three
locales, with a strings table showing what still needs native review.

## Read before changing anything

| File | What it settles |
|---|---|
| `CLAUDE.md` | Hard rules and the locked token table |
| `docs/frontend-spec.md` | Screen-by-screen layout, copy and states |
| `docs/master-prompt.md` | Product context, feature tiers, demo figures |
| `docs/roadmap.md` | Session order and locked decisions |
| `docs/data_sources.md` | API findings from Session 1 |
| `docs/CHANGELOG.md` | What each session shipped |

Full submission README lands in Session 13.
