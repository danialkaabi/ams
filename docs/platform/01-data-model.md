# 01 · Data Model — The Knowledge Graph

The whole product rests on one claim: these entities are **connected**, not merely
collected. That claim has to be true in the schema before it can be true on a screen.

## 1. Entities

| Entity | Key | Notes |
| --- | --- | --- |
| `Vessel` | IMO | Taxonomy, particulars, AIS state, and the seven ownership tiers |
| `Company` | slug | Owner, operator, charterer, EPC, financier — one type, many roles |
| `Contract` | id | A fixture: vessel × charterer × rate × term |
| `Project` | id | A field development, with a vessel-demand forecast attached |
| `Zone` | id | Field, block, platform, pipeline or port |
| `RateBenchmark` | region × subType × sizeClass | The published band and its 12-month history |
| `Alert` | id | A materialised signal against a watch rule |
| `Account` / `User` | id | The tenant and its seats |

## 2. Edges

These are the traversals the UI actually performs. Any entity that cannot be reached
this way is dead weight in the graph.

```
Vessel ──owned_by────────────▶ Company        (× 7 management tiers)
Vessel ──fixed_under─────────▶ Contract ──chartered_by──▶ Company
Vessel ──positioned_in───────▶ Zone
Vessel ──benchmarked_against─▶ RateBenchmark  (region × subType × sizeClass)
Contract ──performed_at──────▶ Zone
Project ──operated_by────────▶ Company
Project ──develops───────────▶ Zone ◀──positioned_in── Vessel
Alert ──raised_on────────────▶ any entity
Account ──scoped_to──────────▶ Company[]      (own or financed fleet)
```

The commercially valuable traversal — and the one competitors do not hold — is:

```
Vessel → beneficial owner → charter history → rate → benchmark → variance
```

That single path is what turns "we know where the ship is" into "we know whether you
are being paid the market rate for it".

## 3. The seven management tiers

Ownership is not one field. A vessel has seven distinct relationships to companies,
and conflating them is how counterparty risk gets missed.

| Tier | What it means commercially |
| --- | --- |
| Beneficial Owner | Ultimate economic owner behind the SPV — who actually gets paid |
| Registered Owner | Title holder on the flag registry — usually a single-ship SPV |
| Commercial Manager | Markets and fixes the vessel |
| Operator | Runs the vessel day to day |
| Commercially Controlled By | Holds the charter-out right — who you actually negotiate with |
| Technical Manager | Maintenance and class |
| ISM Manager | Safety-management certificate holder |

Modelled as `Record<OwnershipTier, string>` on the vessel and as `tierCounts` on the
company profile, so both questions answer instantly:

- *Who controls this vessel?* → read down the vessel's chain.
- *How much tonnage does this company actually control, versus merely manage?* → read
  across the company's tier counts.

## 4. Provenance — the wrapper on everything

```ts
type Provenance = {
  confidence: number;        // 0–100
  source: SourceKind;        // broker | operator | registry | public-filing | ais | analyst | customer
  sourceLabel: string;       // human-readable origin
  asOf: string;              // ISO date last confirmed
  state: 'verified' | 'scored' | 'unverified';
  verifiedBy?: string;       // analyst who confirmed it
};
```

`VERIFY_THRESHOLD = 70`. Below it, a value is `unverified` and is queued to the analyst
desk. It renders with a red confidence bar and is never treated as fixable data.

Provenance rides on the vessel, the company, the contract and the benchmark — and it
survives all the way into the API response, so a customer's own pipeline can gate on
`confidence` rather than trusting a bare number.

## 5. Postgres schema (target)

```sql
-- Companies: one table, many roles. Role is an attribute, not a subtype.
create table companies (
  id                text primary key,
  name              text not null,
  role              company_role not null,
  country           text not null,
  headquarters      text,
  founded           int,
  website           text,
  ownership_chain_depth int,
  risk_flags        jsonb default '[]',
  provenance        jsonb not null
);

create table vessels (
  imo               char(7) primary key,
  mmsi              text,
  name              text not null,
  category          vessel_category not null,
  sub_type          vessel_sub_type not null,
  size_class        size_class not null,
  built             int,
  flag              text,
  dwt               int,
  bollard_pull_t    int,
  deck_area_m2      int,
  bhp               int,
  eexi_band         char(1),
  dp_class          text,
  region            region not null,
  status            vessel_status not null,
  owner_id          text references companies(id),
  provenance        jsonb not null
);

-- The seven tiers, as edges rather than seven columns: a company can hold several
-- roles on one vessel, and roles change hands independently.
create table vessel_management (
  imo               char(7) references vessels(imo),
  tier              ownership_tier not null,
  company_id        text references companies(id),
  company_name      text not null,     -- denormalised: SPVs often aren't in `companies`
  valid_from        date not null,
  valid_to          date,              -- null = current
  provenance        jsonb not null,
  primary key (imo, tier, valid_from)
);

create table contracts (
  id                text primary key,
  imo               char(7) references vessels(imo),
  charterer_id      text references companies(id),
  owner_id          text references companies(id),
  charter_type      charter_type not null,
  rate_per_day      numeric,           -- null = off hire
  start_date        date not null,
  expiry_date       date,
  region            region not null,
  zone_id           text references zones(id),
  provenance        jsonb not null
);

create table projects (
  id                text primary key,
  name              text not null,
  operator_id       text references companies(id),
  zone_id           text references zones(id),
  region            region not null,
  capex_usd         numeric,
  vessels_needed    int,
  vessel_types      text[],
  phase             project_phase not null,
  tender_closes     date,
  epc_contractor_id text references companies(id),
  provenance        jsonb not null
);

create table rate_benchmarks (
  region            region not null,
  sub_type          vessel_sub_type not null,
  size_class        size_class not null,
  low               numeric not null,
  mid               numeric not null,
  high              numeric not null,
  as_of             date not null,
  provenance        jsonb not null,
  primary key (region, sub_type, size_class, as_of)
);

-- AIS is append-only and high-volume: partitioned by month, never updated in place.
create table ais_positions (
  imo               char(7) not null,
  ts                timestamptz not null,
  lat               double precision not null,
  lon               double precision not null,
  speed_kn          real,
  heading_deg       smallint,
  nav_status        text,
  zone_id           text,
  primary key (imo, ts)
) partition by range (ts);
```

## 6. Temporal by default

`vessel_management` and `rate_benchmarks` are versioned rather than overwritten
(`valid_from` / `valid_to`, and `as_of` respectively). Two reasons, both commercial:

1. **Defensibility.** When a customer fixes at a rate and the market moves, they need
   to show what the benchmark said on the day they fixed.
2. **Ownership changes are the signal.** A registered owner moving to a new SPV is a
   `GO Alerts` event. You cannot detect it if you overwrote the old value.

## 7. Row-level security

Data scope is enforced in the database, not the UI. Every scoped table carries a policy
keyed on the requesting account:

```sql
create policy contract_scope on contracts
  for select using (
    current_setting('go.data_scope') = 'full-regional'
    or owner_id = any (string_to_array(current_setting('go.scoped_companies'), ','))
  );
```

The UI then renders out-of-scope rows as `restricted` rather than hiding them — the
existence of a fixture is public, its rate is not. See
[03-entitlements.md](03-entitlements.md).

## 8. Where this lives in the prototype

| File | Contents |
| --- | --- |
| `data/go/types.ts` | The full entity model, taxonomy enums and the seven tiers |
| `data/go/graph.ts` | Edge traversals — `vesselNode`, `companyNode`, `projectNode` |
| `data/go/provenance.ts` | Confidence/source helper |
| `data/go/{vessels,companies,contracts,projects,zones,market,alerts,accounts}.ts` | Seed data |
