import Link from 'next/link';
import { useMemo, useState } from 'react';
import AppShell from '@/components/go/AppShell';
import { useAccount } from '@/components/go/AccountContext';
import {
  Confidence, Disclaimer, Empty, Gate, PageHead, Panel, Status,
} from '@/components/go/ui';
import { IconExport } from '@/components/go/Icons';
import { VESSELS } from '@/data/go/vessels';
import { COMPANY_BY_ID } from '@/data/go/companies';
import { ZONES, ZONE_BY_ID } from '@/data/go/zones';
import { REGIONS } from '@/data/go/types';
import type { Region, SizeClass, VesselCategory, VesselStatus, VesselSubType } from '@/data/go/types';

/** The filter groups down the left rail — mirrors the taxonomy the desk actually queries on. */
const FILTER_GROUPS = [
  'Vessel type', 'Built', 'Sizes', 'Vessel', 'Features',
  'Company', 'Energy Efficiency', 'AIS raw', 'AIS derived', 'Transactions',
];

const CATEGORIES: VesselCategory[] = ['OSV', 'OCV', 'MODU', 'OFFSHORE PRODUCTION', 'FLOATER WET', 'RENEWABLE'];

const SUB_TYPES: Record<VesselCategory, VesselSubType[]> = {
  OSV: ['PSV', 'AHTS', 'AHT', 'FSV', 'CREW BOAT', 'STANDBY / ERRV', 'OCEAN GOING TUG'],
  OCV: ['DSV', 'CONSTRUCTION / OCV', 'WELL INTERVENTION', 'ACCOMMODATION', 'CABLE LAY'],
  MODU: ['JACK-UP', 'SEMI-SUB', 'DRILLSHIP'],
  'OFFSHORE PRODUCTION': ['FPSO', 'FSO'],
  'FLOATER WET': ['FSO'],
  RENEWABLE: ['WIND SOV', 'WTIV'],
};

const SIZES: SizeClass[] = ['Small', 'Medium', 'Large', 'Very Large', 'Super Large'];

const AIS_STATUSES = ['Underway', 'On DP', 'At anchor', 'Moored'] as const;

type Query = {
  categories: VesselCategory[];
  subTypes: VesselSubType[];
  sizes: SizeClass[];
  region: Region | '';
  zoneId: string;
  maxPositionAgeHours: number | '';
  aisStatus: string;
  minDaysInZone: number | '';
  status: VesselStatus | '';
  builtFrom: number | '';
  ownerId: string;
};

const EMPTY: Query = {
  categories: [], subTypes: [], sizes: [], region: '', zoneId: '',
  maxPositionAgeHours: '', aisStatus: '', minDaysInZone: '', status: '',
  builtFrom: '', ownerId: '',
};

function toggle<T>(list: T[], v: T): T[] {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

export default function Fleet() {
  const { can, plan } = useAccount();
  const [q, setQ] = useState<Query>(EMPTY);
  const [activeCat, setActiveCat] = useState<VesselCategory>('OSV');
  const [ran, setRan] = useState(true);

  const owners = useMemo(
    () => Array.from(new Set(VESSELS.map((v) => v.ownerId))).map((id) => COMPANY_BY_ID.get(id)!).filter(Boolean),
    [],
  );

  const results = useMemo(() => {
    if (!ran) return [];
    return VESSELS.filter((v) => {
      if (q.categories.length && !q.categories.includes(v.category)) return false;
      if (q.subTypes.length && !q.subTypes.includes(v.subType)) return false;
      if (q.sizes.length && !q.sizes.includes(v.sizeClass)) return false;
      if (q.region && v.region !== q.region) return false;
      if (q.zoneId && v.ais.zoneId !== q.zoneId) return false;
      if (q.maxPositionAgeHours !== '' && v.ais.ageHours > q.maxPositionAgeHours) return false;
      if (q.aisStatus && v.ais.status !== q.aisStatus) return false;
      if (q.minDaysInZone !== '' && (v.ais.daysInZone ?? 0) < q.minDaysInZone) return false;
      if (q.status && v.status !== q.status) return false;
      if (q.builtFrom !== '' && v.built < q.builtFrom) return false;
      if (q.ownerId && v.ownerId !== q.ownerId) return false;
      return true;
    });
  }, [q, ran]);

  const chips: { label: string; clear: () => void }[] = [
    ...q.categories.map((c) => ({ label: `Category: ${c}`, clear: () => setQ({ ...q, categories: toggle(q.categories, c) }) })),
    ...q.subTypes.map((s) => ({ label: `Type: ${s}`, clear: () => setQ({ ...q, subTypes: toggle(q.subTypes, s) }) })),
    ...q.sizes.map((s) => ({ label: `Size: ${s}`, clear: () => setQ({ ...q, sizes: toggle(q.sizes, s) }) })),
    ...(q.region ? [{ label: `Region: ${q.region}`, clear: () => setQ({ ...q, region: '' as const }) }] : []),
    ...(q.zoneId ? [{ label: `In zone: ${ZONE_BY_ID.get(q.zoneId)?.name}`, clear: () => setQ({ ...q, zoneId: '' }) }] : []),
    ...(q.maxPositionAgeHours !== '' ? [{ label: `Position < ${q.maxPositionAgeHours}h`, clear: () => setQ({ ...q, maxPositionAgeHours: '' as const }) }] : []),
    ...(q.aisStatus ? [{ label: `AIS: ${q.aisStatus}`, clear: () => setQ({ ...q, aisStatus: '' }) }] : []),
    ...(q.minDaysInZone !== '' ? [{ label: `Days in zone ≥ ${q.minDaysInZone}`, clear: () => setQ({ ...q, minDaysInZone: '' as const }) }] : []),
    ...(q.status ? [{ label: `Status: ${q.status}`, clear: () => setQ({ ...q, status: '' as const }) }] : []),
    ...(q.builtFrom !== '' ? [{ label: `Built ≥ ${q.builtFrom}`, clear: () => setQ({ ...q, builtFrom: '' as const }) }] : []),
    ...(q.ownerId ? [{ label: `Owner: ${COMPANY_BY_ID.get(q.ownerId)?.name}`, clear: () => setQ({ ...q, ownerId: '' }) }] : []),
  ];

  if (!can('fleet')) {
    return (
      <AppShell title="Fleet">
        <Gate feature="GO Fleet" upgradeTo="NOC & EPC Contractor" />
      </AppShell>
    );
  }

  return (
    <AppShell title="Fleet" wide>
      <PageHead
        eyebrow="Intelligence · GO Fleet"
        title="GO Fleet"
        lede="Full vessel-type taxonomy, size class, ownership, AIS position and in-zone filters — combined in one query."
      />

      {/* Active query — always visible so the user can see exactly what they asked for. */}
      <div className="go-chipbar">
        <span className="eyebrow">Vessel type is</span>
        {chips.length === 0 && <span className="go-chip">All vessels</span>}
        {chips.map((c) => (
          <span className="go-chip" key={c.label}>
            {c.label}
            <button onClick={() => c.clear()} aria-label={`Remove ${c.label}`}>
              ×
            </button>
          </span>
        ))}
        {chips.length > 0 && (
          <button className="go-btn sm ghost" style={{ marginLeft: 'auto' }} onClick={() => setQ(EMPTY)}>
            Clear all
          </button>
        )}
      </div>

      <div className="go-filters" style={{ marginBottom: 14 }}>
        <div className="go-filtercol">
          <div className="go-filtercol-head">
            <span className="eyebrow">Filter</span>
          </div>
          <div className="go-filtercol-body">
            {FILTER_GROUPS.map((g) => (
              <button key={g} className="go-filteritem" type="button">
                {g}
                <span className="chev">›</span>
              </button>
            ))}
          </div>
        </div>

        <div className="go-filtercol">
          <div className="go-filtercol-head">
            <span className="eyebrow">Category</span>
          </div>
          <div className="go-filtercol-body">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`go-filteritem ${q.categories.includes(c) ? 'on' : ''}`}
                onClick={() => {
                  setActiveCat(c);
                  setQ({ ...q, categories: toggle(q.categories, c) });
                }}
              >
                {c}
                <span className="go-count">{VESSELS.filter((v) => v.category === c).length}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="go-filtercol">
          <div className="go-filtercol-head">
            <span className="eyebrow">Sub-type · {activeCat}</span>
          </div>
          <div className="go-filtercol-body">
            {SUB_TYPES[activeCat].map((s) => (
              <button
                key={s}
                className={`go-filteritem ${q.subTypes.includes(s) ? 'on' : ''}`}
                onClick={() => setQ({ ...q, subTypes: toggle(q.subTypes, s) })}
              >
                {s}
                <span className="go-count">{VESSELS.filter((v) => v.subType === s).length}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="go-filtercol">
          <div className="go-filtercol-head">
            <span className="eyebrow">Size class · AIS · inside zone</span>
          </div>
          <div className="go-filtercol-body controls">
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {SIZES.map((s) => (
                <button
                  key={s}
                  className={`go-chip ${q.sizes.includes(s) ? 'on' : ''}`}
                  style={q.sizes.includes(s) ? { background: 'var(--acc-dim)', color: 'var(--acc)', borderColor: 'var(--acc)' } : undefined}
                  onClick={() => setQ({ ...q, sizes: toggle(q.sizes, s) })}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="go-grid c2" style={{ gap: 10 }}>
              <div className="go-field">
                <label htmlFor="f-zone">Zone</label>
                <select id="f-zone" className="go-select" value={q.zoneId} onChange={(e) => setQ({ ...q, zoneId: e.target.value })}>
                  <option value="">Any zone</option>
                  {ZONES.filter((z) => z.kind === 'field').map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="go-field">
                <label htmlFor="f-age">Position age</label>
                <select
                  id="f-age"
                  className="go-select"
                  value={q.maxPositionAgeHours}
                  onChange={(e) => setQ({ ...q, maxPositionAgeHours: e.target.value === '' ? '' : Number(e.target.value) })}
                >
                  <option value="">Any age</option>
                  <option value={2}>&lt; 2 hours</option>
                  <option value={6}>&lt; 6 hours</option>
                  <option value={24}>&lt; 24 hours</option>
                </select>
              </div>

              <div className="go-field">
                <label htmlFor="f-ais">AIS status</label>
                <select id="f-ais" className="go-select" value={q.aisStatus} onChange={(e) => setQ({ ...q, aisStatus: e.target.value })}>
                  <option value="">Any</option>
                  {AIS_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="go-field">
                <label htmlFor="f-days">Days in zone</label>
                <select
                  id="f-days"
                  className="go-select"
                  value={q.minDaysInZone}
                  onChange={(e) => setQ({ ...q, minDaysInZone: e.target.value === '' ? '' : Number(e.target.value) })}
                >
                  <option value="">Any</option>
                  <option value={7}>≥ 7 days</option>
                  <option value={30}>≥ 30 days</option>
                </select>
              </div>

              <div className="go-field">
                <label htmlFor="f-region">Region</label>
                <select id="f-region" className="go-select" value={q.region} onChange={(e) => setQ({ ...q, region: e.target.value as Region | '' })}>
                  <option value="">All regions</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="go-field">
                <label htmlFor="f-owner">Company</label>
                <select id="f-owner" className="go-select" value={q.ownerId} onChange={(e) => setQ({ ...q, ownerId: e.target.value })}>
                  <option value="">Any owner</option>
                  {owners.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="go-field">
                <label htmlFor="f-status">Commercial status</label>
                <select id="f-status" className="go-select" value={q.status} onChange={(e) => setQ({ ...q, status: e.target.value as VesselStatus | '' })}>
                  <option value="">Any</option>
                  {(['On hire', 'Off hire', 'Standby', 'Transit', 'In yard'] as VesselStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="go-field">
                <label htmlFor="f-built">Built from</label>
                <select
                  id="f-built"
                  className="go-select"
                  value={q.builtFrom}
                  onChange={(e) => setQ({ ...q, builtFrom: e.target.value === '' ? '' : Number(e.target.value) })}
                >
                  <option value="">Any year</option>
                  {[2005, 2010, 2015, 2020].map((y) => (
                    <option key={y} value={y}>
                      {y} or newer
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button className="go-btn primary" onClick={() => setRan(true)}>
              Run query
            </button>
          </div>
        </div>
      </div>

      <Panel
        title={`RESULTS · ${results.length} VESSELS MATCH`}
        actions={
          <>
            <button className="go-btn sm" disabled={!can('export')} title={can('export') ? undefined : `Excel export is not included on the ${plan.name} account`}>
              <IconExport /> Export to Excel
            </button>
            <button className="go-btn sm ghost">Save as portfolio</button>
          </>
        }
        flush
      >
        <div className="go-tablewrap" style={{ maxHeight: 620, overflowY: 'auto' }}>
          <table className="go-table">
            <thead>
              <tr>
                <th>Vessel</th>
                <th>IMO</th>
                <th>Size class</th>
                <th>Owner</th>
                <th>Region</th>
                <th>Days in zone</th>
                <th>Status</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {results.slice(0, 120).map((v) => (
                <tr key={v.imo}>
                  <td>
                    <Link href={`/go/fleet/${v.imo}`} className="go-link">
                      {v.name}
                    </Link>
                  </td>
                  <td className="num">{v.imo}</td>
                  <td>
                    {v.subType} <span style={{ color: 'var(--text-3)' }}>({v.sizeClass})</span>
                  </td>
                  <td>
                    <Link href={`/go/companies/${v.ownerId}`} className="go-link">
                      {COMPANY_BY_ID.get(v.ownerId)?.name ?? v.ownership.beneficialOwner}
                    </Link>
                  </td>
                  <td>{v.region}</td>
                  <td className="num">{v.ais.daysInZone ?? '—'}</td>
                  <td>
                    <Status value={v.status} />
                  </td>
                  <td>
                    <Confidence p={v.provenance} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {results.length === 0 && <Empty>No vessels match this query. Loosen a filter and run again.</Empty>}
          {results.length > 120 && (
            <div style={{ padding: '12px 14px', fontSize: 12, color: 'var(--text-3)', borderTop: '1px solid var(--line)' }}>
              Showing the first 120 of {results.length} matches. Narrow the query or export the full set.
            </div>
          )}
        </div>
      </Panel>

      <div style={{ marginTop: 14 }}>
        <Disclaimer>
          Fleet records are confidence-scored at field level. Anything below 70% is queued for analyst
          verification before it is treated as fixable data.
        </Disclaimer>
      </div>
    </AppShell>
  );
}
