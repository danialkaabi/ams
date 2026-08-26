# 07 · Delivery Roadmap

Engineering delivery mapped to the go-to-market roadmap. The sequencing principle: ship
the data competitors do not hold before spending on the data everyone can buy.

---

## Year 1 — Win on contracts & ownership

**Target: 5–8 paying accounts · ~$300K–500K ARR · proof that contract data alone sells**

| Product | Status in this repo |
| --- | --- |
| Ship Fleet, Companies, Contracts & Projects to production quality | ✅ Designed and built as working screens |
| Build the ownership & charter-history dataset — the defensible layer | ✅ Modelled (7 tiers, charter history, provenance); dataset build is the operational work |
| Positions from free/historical AIS; no satellite spend | ✅ Position age surfaced as a first-class filter so free-source latency is honest, not hidden |

**Engineering sequence**

1. Postgres schema + RLS policies ([01](01-data-model.md), [03](03-entitlements.md))
2. Ingest → extract → score → verify pipeline, analyst desk tooling ([04](04-data-pipeline.md))
3. Fleet, Companies, Contracts, Projects on the real graph
4. Auth, seats, entitlements, audit trail
5. Dashboard, portfolio, command palette

**Deliberately deferred:** satellite AIS, GO API, SOC 2 audit, mobile app.

**Commercial dependencies:** 3–5 design-partner pilots across UAE, Saudi and Qatar;
first Gulf-based commercial lead; two flagship regional events (e.g. ADIPEC).

---

## Year 2 — Scale regional leadership

**Target: 25–40 accounts · ~$2M–2.5M ARR · reference accounts in place**

| Product | Notes |
| --- | --- |
| Ship GO AI, GO Alerts & GO API | Designed here; GO AI depends on Y1 graph density to be useful |
| Licence regional satellite AIS | Funded by Y1 revenue — regional, not global |
| Enterprise security & procurement readiness (SOC 2 track) | SSO, audit export, security pack |

**Engineering sequence**

1. Alert rule engine evaluating on every ingest cycle; webhook delivery
2. GO API v1, key management, rate limiting, sandbox environment
3. GO AI over the graph with hard citation constraints ([02](02-modules.md))
4. Satellite AIS ingest; `ais_positions` partitioning at volume
5. SSO, audit export, SOC 2 controls
6. GO App (React Native) — fleet, alerts, offline maps, morning briefing

**Why AI is Year 2, not Year 1:** GO AI is only credible when the graph underneath it is
dense enough to answer without guessing. Shipping it early against a thin dataset would
teach customers it makes things up — the one impression the product cannot recover from.

---

## Year 3 — Expand beyond the Gulf

**Target: 50–85 flagship accounts · $5M+ ARR · category leadership in the Gulf**

| Product | Notes |
| --- | --- |
| Full ten-module platform live for all customers | All modules already on all plans by design |
| Partner integrations (chartering & EPC systems) | The API becomes an integration surface, not just a data feed |
| Extend data coverage to new target geographies | Follows the second regional presence (West Africa or APAC) |

**Engineering sequence**

1. Integration connectors for chartering and EPC systems
2. Multi-region data operations — coverage SLAs per basin
3. Institutionalised data quality pipeline ([04](04-data-pipeline.md) §5 metrics)
4. Scale-out: read replicas, regional caching, tenant isolation at volume

---

## Sequencing rules

1. **Ownership and contracts before positions.** Charter history is what competitors do
   not hold; AIS is what everyone can buy. Lead with the moat.
2. **Entitlements before scale.** Data scope has to be enforced in the database from
   day one — retrofitting row-level security across a live tenant base is a rewrite.
3. **Provenance before AI.** GO AI's constraint is that it cannot assert what it cannot
   trace. That is only enforceable if provenance exists on every field first.
4. **Cost follows revenue.** Satellite AIS in Year 2, funded by Year 1 revenue. Global
   coverage in Year 3, funded by the regional book.

## What is designed but not yet built

Honest statement of the gap between this repository and production:

| Item | State |
| --- | --- |
| All ten module UIs | Built, running on a seed dataset |
| Data model + entitlement logic | Built and typed; enforced in the app layer |
| Postgres schema + RLS | Specified in [01](01-data-model.md); not yet provisioned |
| Ingest pipeline | Specified in [04](04-data-pipeline.md); not yet implemented |
| Auth / SSO | Demo tenant switcher stands in for real sessions |
| GO App | Specified; not built |
| Real AIS, real fixtures, real ownership chains | The operational build — the actual company |
