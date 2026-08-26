# 05 · System Architecture

## 1. Stack

Chosen for the shape of the problem: a connected graph, read constantly by small expert
teams, that has to stay auditable.

| Layer | Choice | Why |
| --- | --- | --- |
| Database | **PostgreSQL** with a graph overlay | The domain is relational with graph traversals, not a native graph problem. Postgres gives ACID, RLS, partitioning and JSONB provenance in one engine. |
| Platform | **Supabase** | Auth, row-level security and realtime subscriptions without building three services. RLS is the entitlement enforcement point. |
| Web | **Next.js / React** | Server-rendered where data is live, statically cached where it is not. |
| Mobile | **React Native** | GO App — shares the type layer with web. |
| Access | **Secure REST APIs + Auth** | Bearer tokens, entitlement-scoped keys, signed webhooks. |
| Positions | Free/historical AIS → licensed regional satellite AIS (Year 2) | Cost staged against revenue. |

## 2. Runtime shape

```
                     ┌──────────────────────────────────────┐
   Browser ─────────▶│  Next.js  (SSR / ISR / static)       │
   GO App ──────────▶│  React Native                        │
   Customer systems ▶│  GO API   (REST, bearer, scoped)     │
                     └──────────────┬───────────────────────┘
                                    │
                     ┌──────────────▼───────────────────────┐
                     │  Graph service                       │
                     │  · entity resolvers & traversals     │
                     │  · entitlement filter (scope)        │
                     │  · benchmark computation             │
                     │  · alert rule evaluation             │
                     └──────────────┬───────────────────────┘
                                    │
                     ┌──────────────▼───────────────────────┐
                     │  PostgreSQL (Supabase)               │
                     │  · entities + typed edges            │
                     │  · temporal versioning               │
                     │  · RLS policies per account scope    │
                     │  · ais_positions (partitioned)       │
                     └──────────────▲───────────────────────┘
                                    │
                     ┌──────────────┴───────────────────────┐
                     │  Ingest pipeline (async workers)     │
                     │  ingest → extract → score → verify   │
                     └──────────────────────────────────────┘
```

The graph service is the only writer to the read model and the only place entitlement
filtering happens outside the database. Web, mobile and API are three surfaces on one
service — not three implementations of the same rules.

## 3. Rendering strategy

| Data | Strategy |
| --- | --- |
| Marketing pages | Static |
| Vessel / company profiles | ISR — regenerate on ingest, not per request |
| Fleet queries, contracts, dashboard | Server-rendered per request (entitlement-dependent) |
| AIS positions on the map | Realtime subscription |

In the prototype, profiles are `getStaticProps` with `fallback: 'blocking'` for the
long tail — the same posture as production ISR.

## 4. Security

| Control | Implementation |
| --- | --- |
| AuthN | Supabase Auth; SSO (SAML/OIDC) for enterprise accounts |
| AuthZ — features | Plan entitlements checked in the graph service |
| AuthZ — rows | Postgres RLS keyed on account data scope; API keys inherit account scope |
| Audit | Every read logged with user, entity and timestamp; exportable (see `/go/admin`) |
| Transport | TLS only; HSTS |
| Secrets | Managed secret store; no credentials in the repo |
| Compliance | SOC 2 track as part of Year 2 enterprise/procurement readiness |

**The rule that matters:** an API key can never read what its account cannot see. Scope
is resolved once, at the session/key level, and enforced in the database — not
re-implemented per endpoint.

## 5. Environments

| Env | Purpose |
| --- | --- |
| `local` | Seed dataset (what this repo ships), no external feeds |
| `sandbox` | Customer-facing API testing; synthetic data, stable IDs |
| `staging` | Production mirror, anonymised rates |
| `production` | Live |

## 6. Repository layout

```
data/go/          Knowledge-graph model, seed data and traversals
  types.ts          Entities, taxonomy, ownership tiers, provenance
  graph.ts          Edge traversals (vesselNode, companyNode, projectNode)
  accounts.ts       Plans, entitlements, data-scope checks
  {vessels,companies,contracts,projects,zones,market,alerts}.ts

components/go/    Platform UI
  AppShell.tsx      Sidebar, top bar, account switcher
  CommandPalette.tsx  ⌘K search across the graph
  AccountContext.tsx  Current tenant + entitlement hook
  ui.tsx            StatTile, Panel, Confidence, Gate, Masked, RateRange, Meter…
  MarketingLayout.tsx

pages/go/         Routes — public surface + the ten modules
styles/go.css     Design system, scoped under `.go`
docs/platform/    This documentation
```

## 7. Design system

Scoped entirely under `.go` so it never collides with the AMS marketing site sharing
this repository. Dark data-terminal surface, one accent plus one secondary, semantic
status colours, tabular numerics throughout.

```
--bg      #070b14      --acc     #2fd4c6   (primary / teal)
--panel   #0e1524      --acc-2   #7c86ff   (secondary / AI)
--text    #e8eef8      --ok      #3fcf8e   --warn  #f2b33d   --bad  #ff6b6b
```

Type: Inter for UI, IBM Plex Mono for every number, identifier and label. Any figure a
user might compare down a column is tabular-numeric — misaligned digits are a
correctness problem in a rates table, not a taste problem.
