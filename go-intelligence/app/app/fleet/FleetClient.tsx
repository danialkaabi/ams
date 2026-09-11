'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import PageHead from '@/components/app/PageHead';
import Panel from '@/components/ui/Panel';
import EmptyState from '@/components/ui/EmptyState';
import Badge, { statusTone } from '@/components/ui/Badge';
import {
  IconChevron,
  IconClose,
  IconDownload,
  IconFleet,
  IconPortfolio,
  IconSearch,
} from '@/components/ui/Icons';
import {
  ALL_SIZE_CLASSES,
  REGIONS,
  VESSEL_CATEGORIES,
  VESSEL_STATUSES,
  VESSEL_SUBTYPES,
  type VesselCategory,
} from '@/lib/taxonomy';
import { VESSELS } from '@/data/vessels';
import { companyName } from '@/data/companies';
import { orDash } from '@/lib/format';

/** One collapsible group in the filter rail. */
function RailSection({
  label,
  children,
  defaultOpen = false,
}: {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rail-section">
      <button
        className="rail-head"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {label}
        <IconChevron size={13} />
      </button>
      {open && <div className="rail-body">{children}</div>}
    </div>
  );
}

function Option({
  label,
  on,
  onToggle,
  count,
}: {
  label: string;
  on: boolean;
  onToggle: () => void;
  count?: number;
}) {
  return (
    <button className={`rail-opt${on ? ' is-on' : ''}`} onClick={onToggle}>
      <span className="checkbox">
        {on && (
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#04121f" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m4.5 12.5 5 5 10-11" />
          </svg>
        )}
      </span>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
      {count !== undefined && <span className="rail-count">{count}</span>}
    </button>
  );
}

type FacetKey = 'category' | 'subType' | 'sizeClass' | 'region' | 'status';

const FACET_LABEL: Record<FacetKey, string> = {
  category: 'Category',
  subType: 'Sub-type',
  sizeClass: 'Size class',
  region: 'Region',
  status: 'Status',
};

export default function FleetClient() {
  const [facets, setFacets] = useState<Record<FacetKey, string[]>>({
    category: [],
    subType: [],
    sizeClass: [],
    region: [],
    status: [],
  });
  const [search, setSearch] = useState('');

  const toggle = (key: FacetKey, value: string) =>
    setFacets((f) => ({
      ...f,
      [key]: f[key].includes(value)
        ? f[key].filter((v) => v !== value)
        : [...f[key], value],
    }));

  const clearAll = () =>
    setFacets({ category: [], subType: [], sizeClass: [], region: [], status: [] });

  const activeChips = (Object.keys(facets) as FacetKey[]).flatMap((k) =>
    facets[k].map((v) => ({ key: k, value: v })),
  );

  /** Count how many records match a single facet value, so the rail shows
   *  real counts rather than decorative ones. */
  const countFor = (key: FacetKey, value: string) => {
    if (VESSELS.length === 0) return undefined;
    return VESSELS.filter((v) => String(v[key as keyof typeof v] ?? '') === value)
      .length;
  };

  const results = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return VESSELS.filter((v) => {
      for (const key of Object.keys(facets) as FacetKey[]) {
        const selected = facets[key];
        if (selected.length === 0) continue;
        const value = String(v[key as keyof typeof v] ?? '');
        if (!selected.includes(value)) return false;
      }
      if (!needle) return true;
      return (
        v.name.toLowerCase().includes(needle) ||
        v.imo.includes(needle) ||
        (v.mmsi ?? '').includes(needle)
      );
    });
  }, [facets, search]);

  /** Sub-types shown depend on which categories are selected. */
  const visibleSubTypes = useMemo(() => {
    const cats =
      facets.category.length > 0
        ? (facets.category as VesselCategory[])
        : (VESSEL_CATEGORIES as readonly VesselCategory[]);
    return Array.from(new Set(cats.flatMap((c) => VESSEL_SUBTYPES[c] ?? [])));
  }, [facets.category]);

  return (
    <>
      <PageHead
        eyebrow="Intelligence · GO Fleet"
        title="Fleet"
        sub="Full vessel-type taxonomy, size class, ownership, AIS position and in-zone filters — combined in one query."
        actions={
          <>
            <button className="btn btn--ghost btn--sm" disabled={results.length === 0}>
              <IconPortfolio size={14} />
              Save as portfolio
            </button>
            <button className="btn btn--ghost btn--sm" disabled={results.length === 0}>
              <IconDownload size={14} />
              Export to Excel
            </button>
          </>
        }
      />

      <div className="fleet-layout">
        {/* ---------- Filter rail ---------- */}
        <div className="rail">
          <Panel
            title="Filter"
            action={
              activeChips.length > 0 ? (
                <button
                  className="link-arrow"
                  style={{ fontSize: 11.5 }}
                  onClick={clearAll}
                >
                  Clear
                </button>
              ) : undefined
            }
          >
            <RailSection label="Vessel type" defaultOpen>
              {VESSEL_CATEGORIES.map((c) => (
                <Option
                  key={c}
                  label={c}
                  on={facets.category.includes(c)}
                  onToggle={() => toggle('category', c)}
                  count={countFor('category', c)}
                />
              ))}
            </RailSection>

            <RailSection label="Sub-type">
              {visibleSubTypes.map((s) => (
                <Option
                  key={s}
                  label={s}
                  on={facets.subType.includes(s)}
                  onToggle={() => toggle('subType', s)}
                  count={countFor('subType', s)}
                />
              ))}
            </RailSection>

            <RailSection label="Size class">
              {ALL_SIZE_CLASSES.map((s) => (
                <Option
                  key={s}
                  label={s}
                  on={facets.sizeClass.includes(s)}
                  onToggle={() => toggle('sizeClass', s)}
                  count={countFor('sizeClass', s)}
                />
              ))}
            </RailSection>

            <RailSection label="Region">
              {REGIONS.map((r) => (
                <Option
                  key={r}
                  label={r}
                  on={facets.region.includes(r)}
                  onToggle={() => toggle('region', r)}
                  count={countFor('region', r)}
                />
              ))}
            </RailSection>

            <RailSection label="Status">
              {VESSEL_STATUSES.map((s) => (
                <Option
                  key={s}
                  label={s}
                  on={facets.status.includes(s)}
                  onToggle={() => toggle('status', s)}
                  count={countFor('status', s)}
                />
              ))}
            </RailSection>

            {/* The remaining strategy-book filter groups. They need fields
                that only exist once records carry them, so they are shown
                but inert until then. */}
            {['Built', 'Features', 'Company', 'Energy efficiency', 'AIS raw', 'AIS derived', 'Transactions'].map(
              (label) => (
                <RailSection label={label} key={label}>
                  <p style={{ fontSize: 11.5, color: 'var(--text-5)', padding: '4px 8px', lineHeight: 1.55 }}>
                    Activates once vessel records carry this field.
                  </p>
                </RailSection>
              ),
            )}
          </Panel>
        </div>

        {/* ---------- Results ---------- */}
        <div className="stack g16" style={{ minWidth: 0 }}>
          <div className="query-bar">
            <span className="chip-op">Vessel type is</span>
            {activeChips.length === 0 ? (
              <span style={{ fontSize: 12.5, color: 'var(--text-5)' }}>
                No filters applied — showing everything in the database
              </span>
            ) : (
              activeChips.map((c) => (
                <span className="chip" key={`${c.key}-${c.value}`}>
                  <span className="chip-op" style={{ padding: 0 }}>
                    {FACET_LABEL[c.key]}
                  </span>
                  {c.value}
                  <button
                    onClick={() => toggle(c.key, c.value)}
                    aria-label={`Remove ${c.value}`}
                  >
                    <IconClose size={11} />
                  </button>
                </span>
              ))
            )}
          </div>

          <div className="search">
            <span className="search-icon">
              <IconSearch size={15} />
            </span>
            <input
              className="input"
              placeholder="Search vessel name, IMO or MMSI…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Panel
            title={
              VESSELS.length === 0
                ? 'Results'
                : `Results · ${results.length} vessel${results.length === 1 ? '' : 's'} match`
            }
            action={
              <span className="mono" style={{ fontSize: 11, color: 'var(--text-5)' }}>
                {VESSELS.length} in database
              </span>
            }
          >
            {VESSELS.length === 0 ? (
              <EmptyState
                icon={<IconFleet size={22} />}
                title="No vessels in the database yet"
                body="GO Fleet is the offshore vessel database. The filter rail, taxonomy and query builder are live — they just have nothing to query. Add your first vessels and this table fills in."
                file="data/vessels.ts"
                fields={[
                  'imo',
                  'name',
                  'category',
                  'subType',
                  'sizeClass',
                  'status',
                  'flag',
                  'built',
                  'region',
                  'ownership',
                  'position',
                  'charterHistory',
                ]}
              />
            ) : results.length === 0 ? (
              <EmptyState
                icon={<IconSearch size={22} />}
                title="No vessels match this query"
                body="Loosen a filter or clear the query to see the full database."
              />
            ) : (
              <div className="table-scroll">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Vessel</th>
                      <th>IMO</th>
                      <th>Size class</th>
                      <th>Owner</th>
                      <th>Region</th>
                      <th className="th-num">Days in zone</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((v) => (
                      <tr key={v.imo}>
                        <td className="td-strong">
                          <Link href={`/app/fleet/${v.imo}`} className="link-arrow" style={{ fontSize: 13 }}>
                            {v.name}
                          </Link>
                        </td>
                        <td className="mono">{v.imo}</td>
                        <td>{orDash(v.sizeClass ?? v.subType)}</td>
                        <td>{orDash(companyName(v.registeredOwnerId))}</td>
                        <td>{orDash(v.region)}</td>
                        <td className="td-num">{orDash(v.position?.daysInZone)}</td>
                        <td>
                          <Badge tone={statusTone(v.status)} dot>
                            {v.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
