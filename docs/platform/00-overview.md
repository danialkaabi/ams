# GO Intelligence — Platform Design

**Gemini Offshore · GO Intelligence**
Design of record for the offshore commercial intelligence platform described in the
Founder Strategy Book (v2.0).

---

## 1. What this is

GO Intelligence is a commercial intelligence platform for the offshore energy industry.
It connects **vessels, companies, contracts, projects, infrastructure and market data**
into one live knowledge graph, and puts a commercial decision on every screen.

The strategic premise, restated as an engineering premise:

| Strategy says | So the platform must |
| --- | --- |
| "Connected, not collected" | Model the domain as a **graph with typed edges**, not six independent tables behind six independent screens |
| "Built for decisions" | Every screen opens on an **answer** (exposure, variance, availability), not a raw list |
| "AI explains. People decide." | GO AI **synthesises across modules** and cites its sources; it never fixes, bids or commits |
| "Data you can actually trade on" | **Confidence, source and as-of travel with every field**, all the way to the API response |
| "Full platform, flat price" | Entitlements gate **seats, data scope, export and API** — never which modules you may open |

## 2. The four layers

```
┌─────────────────────────────────────────────────────────────────┐
│  SURFACE     Web app · GO App (mobile) · GO API · Excel export  │
├─────────────────────────────────────────────────────────────────┤
│  MODULES     Fleet · Companies · Contracts · Projects · Maps ·  │
│              Market · AI · Alerts   (ten, all on every account) │
├─────────────────────────────────────────────────────────────────┤
│  GRAPH       Typed entities + edges, temporally versioned,      │
│              entitlement-scoped at the row level                │
├─────────────────────────────────────────────────────────────────┤
│  PIPELINE    Ingest → Extract → Score → Verify → Improve        │
└─────────────────────────────────────────────────────────────────┘
```

Each layer only talks to the one below it. The modules never reach past the graph into
raw ingest; the surface never reaches past the modules into the graph.

## 3. Document map

| Doc | Covers |
| --- | --- |
| [01-data-model.md](01-data-model.md) | Entities, edges, the seven ownership tiers, Postgres schema |
| [02-modules.md](02-modules.md) | All ten modules — what each answers, what it reads, what it writes |
| [03-entitlements.md](03-entitlements.md) | The three accounts, the feature matrix, data scope enforcement |
| [04-data-pipeline.md](04-data-pipeline.md) | Ingest → improve, confidence scoring, the analyst desk |
| [05-architecture.md](05-architecture.md) | System architecture, stack, security, environments |
| [06-api.md](06-api.md) | GO API surface, auth, scoping, webhooks |
| [07-roadmap.md](07-roadmap.md) | Year 1–3 delivery mapped to the GTM roadmap |

## 4. What is built in this repository

A working prototype of the whole platform lives under `/go`:

**Commercial surface (public)**

| Route | Purpose |
| --- | --- |
| `/go` | Product landing — problem, solution, ten modules, competitive position, packages |
| `/go/modules` | Module-by-module walkthrough with the questions each answers |
| `/go/data` | Data & technology — the pipeline, confidence bands, the stack |
| `/go/pricing` | Three accounts, full comparison matrix, buyer FAQ |

**The platform (authenticated surface)**

| Route | Module |
| --- | --- |
| `/go/dashboard` | GO Dashboard — fleet, utilisation, live rates, portfolio, alerts |
| `/go/fleet` · `/go/fleet/[imo]` | GO Fleet — query builder and vessel profile |
| `/go/companies` · `/go/companies/[id]` | GO Companies — directory and 7-tier profile |
| `/go/contracts` | GO Contracts — live charter book and renewal exposure |
| `/go/projects` | GO Projects — pipeline by phase, tender and bid support |
| `/go/maps` | GO Maps & Layers — live spatial view with layer toggles |
| `/go/market` | GO Market — benchmarks across five basins |
| `/go/ai` | GO AI — the commercial agent and the charter cycle |
| `/go/alerts` | GO Alerts — signal feed and watch rules |
| `/go/portfolio` | My Portfolio — tracked vessels |
| `/go/api` | GO API — keys, endpoints, usage |
| `/go/admin` | Account — seats, entitlements, audit trail |

The account switcher in the top bar moves between the three tenant types. The
entitlement checks downstream are the real ones — switching to the Shipowner account
genuinely masks out-of-scope rates and disables export and API.

## 5. Design principles

1. **Every screen opens on an answer.** A charter book that does not lead with what
   rolls off in 90 days is a spreadsheet with extra steps.
2. **Trust is a UI component.** Confidence bars, source lines and as-of dates are
   first-class, not a footnote. A number without provenance is not shippable.
3. **Restricted, not hidden.** Data outside an account's scope renders as
   `restricted` rather than vanishing. The user always knows a fixture exists, and
   what it would take to see it.
4. **Density over decoration.** This is a tool read for eight hours a day by expert
   users. Tabular numerics, tight vertical rhythm, dark surface, one accent.
5. **The graph is the product.** Any screen that cannot be traversed from — vessel to
   owner to charter to field to project to benchmark — is a missed connection.
