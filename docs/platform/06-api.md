# 06 · GO API

REST over TLS, bearer authenticated, entitlement-scoped. Included on **NOC & EPC
Contractor** accounts.

## 1. Authentication

```bash
curl https://api.gointelligence.com/v1/vessels \
  -H "Authorization: Bearer $GO_API_KEY" \
  -G \
  --data-urlencode "sub_type=PSV" \
  --data-urlencode "size_class=Medium" \
  --data-urlencode "region=Middle East Gulf" \
  --data-urlencode "status=Off hire"
```

Keys are issued per environment (`go_live_…`, `go_test_…`) and **inherit the account's
data scope**. A key cannot read what the account itself cannot see.

## 2. Endpoints

| Method | Path | Returns |
| --- | --- | --- |
| `GET` | `/v1/vessels` | Fleet query — type, size class, region, owner, AIS state, in-zone predicates |
| `GET` | `/v1/vessels/{imo}` | Full vessel record incl. seven-tier ownership and charter history |
| `GET` | `/v1/companies` | Owners, operators, charterers, financiers with management-tier counts |
| `GET` | `/v1/companies/{id}/fleet` | Every vessel where this company holds any of the seven roles |
| `GET` | `/v1/contracts` | Charter book with expiry, rate and benchmark variance (scoped) |
| `GET` | `/v1/projects` | Field developments, tender pipeline, vessel demand forecasts |
| `GET` | `/v1/market/benchmarks` | Day-rate bands by region × type × size, with 12-month history |
| `GET` | `/v1/positions` | Latest AIS positions in scope, with position age and zone membership |
| `POST` | `/v1/alerts/rules` | Create a watch rule; matching events POST to your webhook |
| `POST` | `/v1/exports` | Queue a bulk export of any query result set |

## 3. Response shape

Every record carries provenance. This is the contract — a customer's own pipeline
should gate on `confidence`, not trust a bare number.

```json
{
  "data": [
    {
      "imo": "9612847",
      "name": "Gulf Pioneer",
      "sub_type": "PSV",
      "size_class": "Medium",
      "status": "Off hire",
      "ownership": {
        "beneficial_owner": "Meridian Offshore",
        "registered_owner": "Meridian Pioneer Navigation Inc",
        "commercial_manager": "Meridian Chartering DMCC",
        "operator": "Meridian Offshore",
        "commercially_controlled": "Meridian Offshore",
        "technical_manager": "Meridian Technical Services",
        "ism_manager": "Meridian Technical Services"
      },
      "confidence": 90,
      "source": "Marshall Islands registry",
      "as_of": "2026-08-19",
      "verified_by": "D. Kaabi"
    }
  ],
  "meta": { "total": 3, "scope": "full-regional", "page": 1, "per_page": 50 }
}
```

Out-of-scope fields return `null` with a sibling marker rather than being omitted, so a
consumer can distinguish "no rate exists" from "you may not see this rate":

```json
{ "rate_per_day": null, "rate_scope": "restricted" }
```

## 4. Rate limits & pagination

| | |
| --- | --- |
| Rate limit | 600 requests/minute per key |
| Monthly allowance | 500,000 calls (NOC & EPC) |
| Pagination | `page` / `per_page`, max 200; `meta.total` always returned |
| Bulk | Use `POST /v1/exports` beyond 10,000 rows |

## 5. Webhooks

Alert rules created via the API deliver signed JSON to your endpoint.

```json
{
  "event": "contract.renewal_due",
  "raised_at": "2026-08-26T06:10:00Z",
  "entity": { "type": "contract", "id": "ct-1001" },
  "detail": {
    "vessel": "GO Endeavour",
    "imo": "9784521",
    "charterer": "Saudi Aramco",
    "expires_in_days": 18,
    "vs_benchmark_pct": -23
  }
}
```

Event kinds: `contract.renewal_due`, `contract.expired`, `vessel.off_hire`,
`vessel.zone_entry`, `vessel.zone_exit`, `project.tender_opened`,
`market.benchmark_moved`, `company.ownership_changed`.

Signature in `X-GO-Signature` (HMAC-SHA256 over the raw body). Retries with exponential
backoff for 24 hours on non-2xx.

## 6. Versioning

`/v1` is stable. Additive changes (new fields, new endpoints) ship without a version
bump. Breaking changes ship as `/v2` with 12 months of parallel operation.
