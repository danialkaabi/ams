# AMS Website · GO Intelligence Platform

This repository holds two products:

1. **Al Annabi Marine Services (AMS)** — the marketing website (`/`, `/about`, `/services`, `/hse`, `/contact`)
2. **GO Intelligence by Gemini Offshore** — the offshore commercial intelligence platform (`/go/**`)

---

# Al Annabi Marine Services (AMS) — Website

The marketing website for Al Annabi Marine Services W.L.L. (AMS), a joint
venture between Sea Horizon Offshore Marine Services W.L.L. (SHM) and
Adani Harbour Services Limited, delivering tug, port, and offshore energy
support across Qatar.

Built with Next.js (static pages, no database) and deployed as a static
site — sleek, editorial design inspired by Nike, Disney, Apple, Nakilat,
and Maersk.

## Pages

- `/` — Home
- `/about` — Company story, SHM & Adani background, leadership, vision
- `/services` — Fleet classes and service segments (offshore, port, LNG)
- `/hse` — Health, Safety & Environment commitment
- `/contact` — Contact details and inquiry form

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run start
```

## Deploying on Vercel

1. Go to vercel.com and sign in ("Continue with GitHub" so it can see this
   repo).
2. Click **Add New → Project**, import this repository, and deploy — no
   environment variables required.

## Images

Real AMS vessel photography lives in `public/images/vessels/` (AMS Laffan
1/2/3/4, AMS Najam, AMS Al Wakra 1, AMS Khattaf) and is used across page
hero backgrounds and the fleet gallery on `/services`. Leadership
headshots and the logo are in `public/images/`.


---

# GO Intelligence — Platform

The offshore commercial intelligence platform described in the Gemini Offshore Founder
Strategy Book: one knowledge graph connecting vessels, companies, contracts, projects,
infrastructure and market data.

**Full design documentation: [`docs/platform/`](docs/platform/00-overview.md)**

## Routes

**Commercial surface (public)**

| Route | Purpose |
| --- | --- |
| `/go` | Product landing — problem, solution, ten modules, competitive position |
| `/go/modules` | Module walkthrough with the questions each answers |
| `/go/data` | Data & technology — pipeline, confidence bands, stack |
| `/go/pricing` | Three subscription accounts and the full comparison matrix |

**The platform**

| Route | Module |
| --- | --- |
| `/go/dashboard` | Fleet, utilisation, live rates, portfolio, alerts |
| `/go/fleet` · `/go/fleet/[imo]` | GO Fleet query builder and vessel profile |
| `/go/companies` · `/go/companies/[id]` | GO Companies directory and 7-tier profile |
| `/go/contracts` | Live charter book and renewal exposure |
| `/go/projects` | Project pipeline, tenders and bid support |
| `/go/maps` | Live spatial view with layer toggles |
| `/go/market` | Day-rate benchmarks across five basins |
| `/go/ai` | GO AI commercial agent |
| `/go/alerts` | Signal feed and watch rules |
| `/go/portfolio` | Tracked vessels |
| `/go/api` | API keys, endpoints, usage |
| `/go/admin` | Seats, entitlements, audit trail |

## Trying the entitlement model

The account switcher in the platform top bar moves between three demo tenants —
Falcon Marine Services (Shipowner, $25k), ICBC Financial Leasing (Financier, $50k) and
ADNOC Offshore (NOC & EPC, $75k). The entitlement checks are real: switching to the
shipowner account disables Excel export, gates the API screen, and masks every day rate
outside Falcon's own fleet as `restricted`.

`⌘K` opens search across the whole graph — vessel name, IMO, MMSI, company or project.

## Code layout

```
data/go/        Knowledge-graph model, seed data, traversals, entitlements
components/go/  App shell, command palette, account context, UI primitives
pages/go/       Public surface + the ten modules
styles/go.css   Design system, scoped under `.go`
docs/platform/  Design and architecture documentation
```

## Live AIS Tracking

The platform can display live vessel positions from AIS (Automatic Identification System) feeds.

**Quick start (mock mode — 5 minutes, no API key):**
```bash
npm install
MOCK_AIS=1 npm run ais:check    # Verify the pipeline
npm run dev &                    # Terminal 1: start the web app
MOCK_AIS=1 npm run ais           # Terminal 2: start the worker with simulated positions
# Open http://localhost:3000/go/maps → positions update every 5 seconds
```

**Production setup:** See [`docs/AIS-SETUP.md`](docs/AIS-SETUP.md) for:
- Switching to real AISStream.io feeds
- Deploying the worker process on Railway/Render/Heroku/Fly
- Using Upstash Redis for persistent storage
- Troubleshooting guide

**Files:**
- `scripts/ais-worker.mjs` — Collects positions, posts to API every 5s
- `scripts/ais-check.mjs` — Diagnostic tool (walks the entire pipeline)
- `pages/api/positions.ts` — Position ingest & retrieval endpoint
- `pages/api/fleet.ts` — Fleet metadata and coverage stats
- `data/ais-live.ts` — React hooks for real-time position subscriptions
- `Procfile` — Declares web + worker processes for deployment platforms

## Data

All figures, fixtures, rates and profiles in the platform are illustrative demonstration
data seeded in `data/go/`. Rate benchmarks are indicative — the product always says so
on screen.

For live vessel tracking, see the AIS setup guide above.
