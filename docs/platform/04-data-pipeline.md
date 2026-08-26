# 04 · Data Pipeline

> "Every data point is scored, verified and traceable — because a wrong rate or a wrong
> owner costs real money."

This is the layer that has to be right before anything else matters. A beautiful screen
over bad ownership data is worse than no product, because it will be trusted.

## 1. The five stages

```
   ┌─────────┐   ┌─────────┐   ┌───────┐   ┌────────┐   ┌─────────┐
   │ INGEST  │──▶│ EXTRACT │──▶│ SCORE │──▶│ VERIFY │──▶│ IMPROVE │
   └─────────┘   └─────────┘   └───────┘   └────────┘   └─────────┘
        │                                       │            │
   staging store                          analyst desk   model feedback
   (source attached)                    (below threshold)  (corrections)
```

### 1 · Ingest

Sources: broker reports, operator disclosures, flag and class registries, public
filings, AIS feeds, customer submissions.

Every record lands in a staging store **with its source attached**. Nothing enters the
graph anonymously — a value whose origin is unknown cannot be scored, and a value that
cannot be scored cannot be published.

### 2 · Extract

AI parses documents, PDFs and filings into typed entities and relationships.
Deterministic parsing where a schema exists (registry feeds, AIS); model-driven
extraction where it does not (broker PDFs, press releases, charter confirmations).

The extractor emits an entity **plus a per-field certainty**, not just an entity.

### 3 · Score

Every field gets a confidence score from four inputs:

| Input | Weight | Reasoning |
| --- | --- | --- |
| Source reliability | high | A flag registry beats a market rumour |
| Corroboration | high | Two independent sources agreeing is the strongest signal available |
| Recency | medium | A rate from 2022 is not a rate |
| Extraction certainty | medium | How confident the parser was about this specific field |

```
band     score    treatment
─────────────────────────────────────────────────────────────────
high     85–100   Published. Safe to fix on, subject to broker confirmation.
medium   70–84    Published with the score shown. Flagged where a decision rests on it.
low      <70      Queued to the analyst desk. Never presented as fixable data.
```

`VERIFY_THRESHOLD = 70`.

### 4 · Verify

Anything below threshold goes to the analyst desk. An analyst confirms against a
primary document, and the record gains `verifiedBy` and moves to `state: 'verified'`.

The queue is prioritised by **commercial blast radius**, not by age: an unverified
beneficial owner on a vessel that three customers have in their portfolio outranks an
unverified build year on a vessel nobody watches.

### 5 · Improve

Analyst corrections and customer-submitted fixes are written back as training signal,
so the same class of extraction error becomes rarer. This is the compounding advantage
— the dataset gets more defensible with every correction, and the correction cost per
record falls over time.

## 2. Four guarantees

| Guarantee | Meaning |
| --- | --- |
| **Confidence-scored** | Every single field, not just the record |
| **Human-verified** | Everything below threshold, before it publishes |
| **Full audit trail** | Source to screen, on every value |
| **Source-linked** | Every field traceable to where it came from |

These are not marketing copy — they are the `Provenance` type
([01-data-model.md](01-data-model.md) §4), rendered by the `<Confidence />` and
`<SourceLine />` components, and returned on every API record.

## 3. AIS strategy

Deliberately staged, because satellite AIS is the single largest data cost in this
business and spending it before there is revenue is how offshore data startups die.

| Phase | Source | Cost posture |
| --- | --- | --- |
| **Year 1** | Free and historical AIS sources | No satellite spend. Positions are good enough to support in-zone queries and days-in-field. |
| **Year 2** | Licensed **regional** satellite AIS | Funded by Year 1 revenue. Regional, not global — the launch market is the Gulf. |
| **Year 3** | Extended coverage into new target basins | Follows the second regional presence. |

This is why Year 1 positioning leads with **ownership chains, charter history and
contracts** — the data competitors do not hold and that does not require satellite
spend — and defers live tracking. See [07-roadmap.md](07-roadmap.md).

## 4. The defensible layer

Anyone can buy AIS. The moat is:

1. **Seven-tier ownership across 12,000+ offshore vessels.** Expensive to build,
   expensive to keep current, and it decays without maintenance — which is exactly what
   makes it defensible.
2. **Charter history and rates.** Who fixed what, at what rate, for how long. This is
   relationship-sourced, not scrapeable, and it is what the founder network is for.
3. **The connections between them.** Ownership + rates + fields + projects in one graph
   is the thing no single competitor holds (see the landscape table on `/go`).

## 5. Quality metrics to run the desk on

| Metric | Target |
| --- | --- |
| Fields above threshold | > 90% of published fields |
| Analyst queue age (p90) | < 5 working days |
| Corroboration rate on rates | ≥ 2 sources on 60% of published fixtures |
| Ownership chain currency | 100% of tier-1 accounts' counterparties re-verified within 90 days |
| Correction rate (customer-reported errors) | Falling quarter on quarter |
