# 03 · Accounts & Entitlements

The commercial model in one sentence: **three accounts, one platform**. Every account
runs the same product with all ten modules live from day one. What scales is seats,
data scope, export and API.

This is a deliberate positioning choice — "Full platform, flat price". Competitors sell
modules; selling the whole system removes the entire upsell negotiation from the deal
and makes the platform stickier the moment a team adopts it.

## 1. The three accounts

| | Shipowner / Operator | Financier | NOC & EPC Contractor |
| --- | --- | --- | --- |
| **Price** | $25,000/yr | $50,000/yr | $75,000/yr |
| **For** | Vessel owners and operators managing their own fleet commercially | Lenders, lessors and investors monitoring fleet and market exposure | NOCs and EPC contractors overseeing multi-operator activity |
| **Seats** | 10 | 15 | 50 |
| **Data scope** | Own fleet + regional market benchmarks | Financed fleet exposure + regional benchmarks | Full regional fleet, contract and field data across all operators |
| **Core modules** | All ten | All ten | All ten |
| **Excel export** | — | ✓ | ✓ |
| **API access** | — | — | ✓ |
| **Support** | Dedicated AM, business hours | Dedicated AM, business hours | AM + CSM, out-of-hours priority |

At an average contract value of $60k–$100k, the $5M ARR target needs roughly 50–85
flagship accounts. The NOC/EPC tier is the one that gets there — which is why it is the
featured tier on the pricing page and why API access sits only there.

## 2. Feature matrix

```
                fleet companies contracts projects maps market ai alerts app export api
shipowner         ✓       ✓         ✓        ✓      ✓     ✓    ✓    ✓     ✓    —    —
financier         ✓       ✓         ✓        ✓      ✓     ✓    ✓    ✓     ✓    ✓    —
noc-epc           ✓       ✓         ✓        ✓      ✓     ✓    ✓    ✓     ✓    ✓    ✓
```

Implemented as `PLANS[type].features: FeatureKey[]` in `data/go/accounts.ts`, checked
through `useAccount().can(feature)`.

## 3. Data scope — the part that matters

Feature gating is easy. Data scope is the commercially sensitive one.

| Scope | Sees in full |
| --- | --- |
| `own-fleet` | Vessels and fixtures where the account's own company is in the ownership chain |
| `financed-fleet` | The above, plus every company whose tonnage the account finances |
| `full-regional` | Everything, across all operators in the region |

**What is always public inside the platform:** vessel particulars, ownership chains,
fields, projects, tender pipeline, and market benchmarks. These are the graph.

**What is scoped:** commercially sensitive fixture detail — principally the day rate and
its benchmark variance.

### Restricted, not hidden

Out-of-scope rows still render, with the rate shown as `restricted`:

```
Falcon Guard   AHTS   QatarEnergy   restricted   —   77 days   Expiring Soon
```

This is a product decision with a commercial motive. Hiding the row entirely makes the
platform feel thin on a lower tier. Showing the row and masking the number makes the
value of the upgrade concrete and visible on every screen — the user can see there are
34 fixtures in this basin and that they can read 6 of them.

Enforcement is at three levels:

1. **Database** — row-level security policy on `contracts` (see
   [01-data-model.md](01-data-model.md) §7)
2. **Graph layer** — `canSeeCommercialDetail(account, companyId)` and
   `scopedContracts(account)` in `data/go/graph.ts`
3. **UI** — `<Masked />` renders the placeholder with an explanatory tooltip

A key issued through the API inherits the account's scope. A key can never read what
the account itself cannot see.

## 4. Seats

Seats are per named user, not concurrent. `seatUtilisation()` drives the admin screen
meter; above 80% the tile turns amber, which is the natural moment for the account
manager to open an expansion conversation. Seats are added pro rata mid-term without
re-papering the contract.

## 5. Trying it in the prototype

The account switcher in the top bar moves between three demo tenants — Falcon Marine
Services (shipowner), ICBC Financial Leasing (financier) and ADNOC Offshore (NOC/EPC).
The entitlement checks downstream are real: switch to the shipowner account and export
buttons disable, the API screen becomes a gate, and every rate outside Falcon's own
fleet masks to `restricted`.

Selection persists to `localStorage` so a prospect's chosen view survives a reload.
