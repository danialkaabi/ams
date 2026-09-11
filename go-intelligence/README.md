# GO Intelligence

**Offshore commercial intelligence platform — by Gemini Offshore.**

One connected knowledge graph for offshore commercial decisions: vessels,
companies, contracts, projects, infrastructure and market data.

This repository is the **complete platform design**. Every screen, every
filter, every layout is built and working. **No records are included** —
the vessel, company, contract, project and market data is yours to add.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build        # production build
npm run start        # serve the production build
```

---

## Deploying to Vercel

1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New → Project**.
3. Import the repository. Vercel detects Next.js automatically — the
   defaults are correct and no environment variables are required.
4. Deploy.

Every push to the default branch redeploys.

---

## What is here

### Public site

| Route       | Screen                                                        |
| ----------- | ------------------------------------------------------------- |
| `/`         | Landing — vision, problem, solution, ten modules, data pipeline, competitive position |
| `/platform` | Module detail and the offshore charter cycle                   |
| `/pricing`  | The three account types                                        |
| `/company`  | Vision, market opportunity, three-year roadmap, leadership, contact |
| `/login`    | Sign-in (not yet wired to an identity provider)                |

### The platform

| Route                  | Module                                               |
| ---------------------- | ---------------------------------------------------- |
| `/app`                 | Dashboard — fleet, utilisation, rates, portfolio, alerts |
| `/app/fleet`           | GO Fleet — the vessel database and query builder      |
| `/app/fleet/[imo]`     | Vessel profile — particulars, benchmark, charter history |
| `/app/companies`       | GO Companies — owners, operators, counterparties       |
| `/app/companies/[id]`  | Company profile — seven management tiers, fleet, charter history |
| `/app/contracts`       | GO Contracts — the live charter book                   |
| `/app/projects`        | GO Projects — field developments and the tender pipeline |
| `/app/maps`            | GO Maps & Layers — spatial intelligence                |
| `/app/market`          | GO Market — day-rate benchmarks and utilisation        |
| `/app/ai`              | GO AI — the commercial agent                          |
| `/app/alerts`          | GO Alerts — the signal feed                           |
| `/app/portfolio`       | My Portfolio — saved vessel watchlists                |
| `/app/data`            | **Data Manager — start here to add records**          |
| `/app/api`             | GO API — endpoints and keys                           |
| `/app/settings`        | Account, workspace defaults, integrations             |

---

## Adding your data

Open **`/app/data`** in the running app. It lists every record type, the
file it lives in, the fields it requires, and what each one feeds.

All records live in `/data` as typed arrays:

| File                 | Export                            |
| -------------------- | --------------------------------- |
| `data/vessels.ts`    | `VESSELS`                         |
| `data/companies.ts`  | `COMPANIES`                       |
| `data/contracts.ts`  | `CONTRACTS`                       |
| `data/projects.ts`   | `PROJECTS`                        |
| `data/market.ts`     | `RATE_BENCHMARKS`, `UTILISATION`  |
| `data/alerts.ts`     | `ALERTS`                          |
| `data/portfolio.ts`  | `PORTFOLIOS`                      |
| `data/account.ts`    | `ACCOUNT`                         |

Add an object to the array and every count, chart, filter and table across
the platform recalculates from it. Nothing is hard-coded into a page.

The allowed values — vessel categories, sub-types, size classes, regions,
the seven management tiers, project phases, contract statuses — are in
`lib/taxonomy.ts`. TypeScript rejects anything outside them, so a typo
fails at build time rather than showing up as a wrong row on a screen.

Full field-by-field schemas are in `data/types.ts`.

### Example

```ts
// data/vessels.ts
export const VESSELS: Vessel[] = [
  {
    imo: '9784521',
    name: 'Vessel Name',
    category: 'OSV',
    subType: 'AHTS',
    sizeClass: 'AHTS (Large)',
    status: 'On Hire',
    flag: 'Panama',
    built: 2018,
    region: 'Middle East Gulf',
    registeredOwnerId: 'your-company-id',
  },
];
```

---

## Design system

The palette, typography and layout language are taken from the Gemini
Offshore strategy book:

- **Ground** — deep navy `#0a0f1a`, with a panel stack up through `#26375c`
- **Instrumentation** — steel blue `#5fa8e8` for accents, hairlines and active states
- **Gold** — `#d6a44e`, used sparingly for premium tiers, section rules and emphasis
- **Signal** — green `#5fbf7a`, amber `#e0a94e`, red `#e05a5a`
- **Wordmark** — wide-tracked uppercase, the brand's most recognisable signature
- **Numbers** — tabular monospace everywhere figures are compared

Everything lives in `app/globals.css`, organised in numbered sections from
tokens through to the marketing site. There is no CSS framework and no UI
library — the whole system is about 1,500 lines of plain CSS driven by
custom properties.

Empty states are treated as a primary experience rather than an edge case:
the platform ships with no records, so each one explains what the screen is
for, which fields a record carries, and which file to add it to.

---

## Structure

```
app/                 Routes (Next.js App Router)
  globals.css        The entire design system
  page.tsx           Landing
  app/               The platform, behind the app shell
components/
  ui/                Panel, StatTile, Badge, EmptyState, Wordmark, Icons
  app/               AppShell, sidebar nav, command palette, PageHead
  marketing/         Site nav, footer, layout
data/                Record modules — your data goes here
  types.ts           Full schemas
lib/
  taxonomy.ts        Controlled vocabularies
  format.ts          Formatting helpers
  plans.ts           The three account types
```

---

## Not yet connected

The platform is intentionally front-end only. These are the seams to wire
up, listed in the app at `/app/settings`:

- **Authentication** — `/login` currently links straight through to `/app`
- **Database** — swap the `/data` exports for queries; no screen changes
- **AIS provider** — live vessel positions
- **Map tiles** — a basemap for GO Maps & Layers
- **Language model** — answers for GO AI
- **Email / CRM** — the contact form and alert delivery

---

## Stack

Next.js 14 (App Router) · React 18 · TypeScript · plain CSS. No runtime
dependencies beyond React and Next.

---

## Moving this into its own repository

This project is self-contained — it has its own `package.json` and needs
nothing from the directory above it. To give it a dedicated repository:

1. Create a new **empty** repository on GitHub (no README, no `.gitignore`).
2. From the repository root:

```bash
cp -r go-intelligence /tmp/go-intelligence
cd /tmp/go-intelligence
git init
git add -A
git commit -m "GO Intelligence — platform design"
git branch -M main
git remote add origin https://github.com/<you>/<new-repo>.git
git push -u origin main
```

3. Import that repository on Vercel.

Alternatively, deploy straight from this repository by setting Vercel's
**Root Directory** to `go-intelligence` — no file moves required.
