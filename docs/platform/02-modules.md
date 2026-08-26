# 02 · The Ten Modules

Every account gets all ten. What scales between plans is seats, data scope, export and
API — never which modules you may open. Each module below is specified as: the question
it answers, what it reads from the graph, what it writes back, and where it is built.

---

## GO Fleet — `/go/fleet`

**Answers** *Which vessels of this class are available, where, and who controls them?*

Query builder across the full taxonomy: category (OSV, OCV, MODU, offshore production,
floater wet, renewable) → sub-type → size class, combined with region, owner, build
year, energy efficiency, commercial status and an **AIS in-zone predicate** (zone,
position age, AIS status, days in zone).

- **Reads** `vessels`, `vessel_management`, `zones`, `companies`
- **Writes** saved queries (a portfolio is a saved query, not a copy)
- **Gating** `export` controls "Export to Excel"

The in-zone predicate is the differentiator: *"medium PSVs, position under 2 hours old,
inside Safaniya Field for 7+ days"* is one query here and three vendors elsewhere.

## GO Fleet · Vessel profile — `/go/fleet/[imo]`

Key facts, the seven-tier ownership chain, technical particulars, live AIS, the
benchmark band with the current fixture marked against it, and full charter history —
who fixed it, at what rate, for how long, on which field.

---

## GO Companies — `/go/companies`, `/go/companies/[id]`

**Answers** *Who am I actually dealing with, and have they performed before?*

Company profile carries management structure by tier (vessels where this company is
beneficial owner vs registered owner vs commercial manager…), fleet list, regional
utilisation, company-level charter history, and counterparty flags.

- **Reads** `companies`, `vessel_management`, `contracts`
- **Gating** rate columns respect data scope

## GO Contracts — `/go/contracts`

**Answers** *What rolls off, and where am I mispriced?*

Live charter book sorted by expiry, with rate-vs-benchmark variance computed against
the GO Market midpoint for the vessel's class and basin, renewal exposure bucketed by
quarter, and annualised contract value.

- **Reads** `contracts`, `rate_benchmarks`, `vessels`
- **Writes** renewal status transitions
- **Gating** row-level data scope; `export`

Status is derived, not stored: `Overdue Renewal` < 0 days, `Renewal Due` ≤ 30,
`Expiring Soon` ≤ 90, else `On Hire`.

## GO Projects — `/go/projects`

**Answers** *What will this basin need, and when?*

The demand side. Pipeline by phase (Tender → Awarded → Mobilising → Execution → First
Oil), CAPEX, vessel-demand forecast per project, and a tender/bid-support surface that
links straight into fleet matching and benchmarking.

- **Reads** `projects`, `zones`, `companies`, `vessels` (via field)

## GO Maps & Layers — `/go/maps`

**Answers** *Who else is working this field, and is it tightening?*

Vessels rendered live against fields, concession blocks, platforms, pipelines and ports
with per-layer toggles, field utilisation trend over twelve months, and click-through
from a position to the full commercial profile.

- **Reads** `ais_positions` (latest per vessel), `zones`, `vessels`
- **Production** vector basemap tiles + licensed concession/platform/pipeline layers;
  the prototype ships a schematic renderer with the same interaction model

## GO Market — `/go/market`

**Answers** *What is this class worth in this basin today?*

Day-rate benchmarks by region × vessel type × size class across five basins, twelve
months of history per midpoint, a side-by-side basin comparison, and a documented
methodology (normalise → exclude outliers → publish IQR band + median).

- **Reads** `rate_benchmarks`, `contracts` (fixtures feed the band)
- **Gating** `export`

## GO AI — `/go/ai`

**Answers** *One commercial question, end to end.*

Synthesises across modules along the offshore charter cycle:
**Source** (Fleet) → **Vet** (Companies) → **Benchmark** (Market) → **Fix** (Contracts)
→ **Track** (Maps) → **Monitor** (Alerts) → **Close** (Projects).

Constraints, enforced not aspirational:

- Never asserts a rate or an owner without a traceable source record
- Never fills a gap in the graph with a plausible estimate
- Never fixes, bids or commits — it prepares the decision
- Never returns data outside the account's entitled scope

## GO Alerts — `/go/alerts`

**Answers** *What changed while I wasn't looking?*

Watch rules evaluated against the live graph on every ingest cycle. Event kinds:
contract renewal, off-hire, zone entry/exit, tender opened, rate move, ownership
change. Delivery in-app, push (GO App), email, or webhook (API accounts).

- **Reads** everything · **Writes** `alert_rules`, `alerts`

## GO API — `/go/api`

**Answers** *How do I get this into my own systems?*

REST over TLS, bearer auth, entitlement-scoped keys. Every record returns `confidence`,
`source` and `as_of` alongside the value. See [06-api.md](06-api.md).

- **Gating** `api` — NOC & EPC Contractor accounts only

## GO App — mobile (React Native)

**Answers** *What changed on my fleet overnight, away from a desk?*

Fleet, ownership and charter status; push alerts for contract and project milestones;
offline-ready field and platform maps; an AI-summarised briefing each morning.

---

## Cross-cutting surfaces

| Surface | Route | Purpose |
| --- | --- | --- |
| Dashboard | `/go/dashboard` | The one screen: fleet, utilisation, live rates, portfolio, alerts |
| My Portfolio | `/go/portfolio` | Tracked vessels — position, fixture and benchmark on one row |
| Account | `/go/admin` | Seats, entitlements, data scope, support tier, audit trail |
| Command palette | `⌘K` anywhere | One search across the whole graph — name, IMO, MMSI, company, project |
