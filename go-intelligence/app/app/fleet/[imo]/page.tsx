import type { Metadata } from 'next';
import Link from 'next/link';
import PageHead from '@/components/app/PageHead';
import Panel from '@/components/ui/Panel';
import Badge, { statusTone } from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { IconArrow, IconFleet, IconMaps } from '@/components/ui/Icons';
import { VESSELS, getVessel } from '@/data/vessels';
import { companyName } from '@/data/companies';
import { benchmarkFor } from '@/data/market';
import { orDash, rateBand, usd } from '@/lib/format';

export const metadata: Metadata = { title: 'Vessel profile' };

/** Pre-render a page per recorded vessel. With no records this simply
 *  returns nothing and every profile is rendered on demand. */
export function generateStaticParams() {
  return VESSELS.map((v) => ({ imo: v.imo }));
}

function Spec({ k, v }: { k: string; v?: string | number | null }) {
  const missing = v === undefined || v === null || v === '';
  return (
    <div className="spec">
      <div className="spec-k">{k}</div>
      <div className={`spec-v${missing ? ' spec-v--empty' : ''}`}>
        {missing ? 'Not recorded' : v}
      </div>
    </div>
  );
}

export default function VesselProfilePage({ params }: { params: { imo: string } }) {
  const vessel = getVessel(params.imo);

  if (!vessel) {
    return (
      <>
        <PageHead
          eyebrow="Intelligence · GO Fleet"
          title="Vessel profile"
          actions={
            <Link href="/app/fleet" className="btn btn--ghost btn--sm">
              Back to Fleet
            </Link>
          }
        />
        <Panel>
          <EmptyState
            icon={<IconFleet size={22} />}
            title={`No vessel recorded against IMO ${params.imo}`}
            body="This is the vessel profile layout: particulars, seven-tier ownership, current position, the regional benchmark for its size class, and the full charter history. It renders as soon as a matching record exists."
            file="data/vessels.ts"
            primaryHref="/app/fleet"
            primaryLabel="Back to Fleet"
            fields={[
              'imo',
              'name',
              'category',
              'subType',
              'sizeClass',
              'status',
              'flag',
              'built',
              'beneficialOwnerId',
              'registeredOwnerId',
              'operatorId',
              'position',
              'charterHistory',
            ]}
          />
        </Panel>
      </>
    );
  }

  const benchmark =
    vessel.region && vessel.sizeClass
      ? benchmarkFor(vessel.region, vessel.sizeClass)
      : undefined;

  return (
    <>
      <PageHead
        eyebrow="Intelligence · GO Fleet"
        title={vessel.name}
        actions={
          <>
            <Link href="/app/maps" className="btn btn--ghost btn--sm">
              <IconMaps size={14} />
              Show on map
            </Link>
            <Link href="/app/fleet" className="btn btn--quiet btn--sm">
              Back to Fleet
            </Link>
          </>
        }
      />

      <div className="row g10 wrapflex" style={{ marginBottom: 18 }}>
        <Badge tone="blue">{vessel.subType}</Badge>
        {vessel.sizeClass && <Badge tone="grey">{vessel.sizeClass}</Badge>}
        <Badge tone={statusTone(vessel.status)} dot>
          {vessel.status}
        </Badge>
      </div>

      <Panel title="Particulars" className="panel" style={{ marginBottom: 16 }}>
        <div className="spec-grid">
          <Spec k="Owner" v={companyName(vessel.registeredOwnerId)} />
          <Spec k="Flag" v={vessel.flag} />
          <Spec k="IMO" v={vessel.imo} />
          <Spec k="MMSI" v={vessel.mmsi} />
          <Spec k="Type" v={`${vessel.subType}${vessel.sizeClass ? ` — ${vessel.sizeClass}` : ''}`} />
          <Spec k="Built" v={vessel.built} />
          <Spec k="Operating in" v={vessel.operatingIn} />
          <Spec k="Field operator" v={vessel.fieldOperator} />
          <Spec k="Region" v={vessel.region} />
          <Spec k="DP class" v={vessel.dpClass} />
          <Spec k="Bollard pull" v={vessel.bollardPullT ? `${vessel.bollardPullT} t` : undefined} />
          <Spec k="Deck area" v={vessel.deckAreaM2 ? `${vessel.deckAreaM2} m²` : undefined} />
        </div>
      </Panel>

      <Panel
        title={`${vessel.sizeClass ?? vessel.subType} benchmark${vessel.region ? ` · ${vessel.region}` : ''}`}
        style={{ marginBottom: 16 }}
      >
        <div className="panel-body">
          {benchmark ? (
            <div className="between wrapflex">
              <span className="num" style={{ fontSize: 24 }}>
                {rateBand(benchmark.lowUsdPerDay, benchmark.highUsdPerDay)}
              </span>
              <span className="muted" style={{ fontSize: 12 }}>
                Indicative term rate — confirm with broker quotes
              </span>
            </div>
          ) : (
            <p className="muted" style={{ fontSize: 13 }}>
              No benchmark recorded for this size class and region. Add one to{' '}
              <span className="mono">data/market.ts</span> and it appears here,
              and as the variance column in the charter book.
            </p>
          )}
        </div>
      </Panel>

      <Panel title="Charter history">
        {!vessel.charterHistory || vessel.charterHistory.length === 0 ? (
          <EmptyState
            icon={<IconArrow size={22} />}
            title="No charter history recorded"
            body="Who fixed this vessel, at what rate, for how long and against which field — the commercial record most platforms do not hold."
            file="data/vessels.ts"
            fields={['date', 'charterType', 'ratePerDay', 'charterer', 'fieldContractedTo']}
          />
        ) : (
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Charter type</th>
                  <th className="th-num">Rate (USD/day)</th>
                  <th>Charterer</th>
                  <th>Field contracted to</th>
                </tr>
              </thead>
              <tbody>
                {vessel.charterHistory.map((c, i) => (
                  <tr key={`${c.date}-${i}`}>
                    <td className="td-strong">{c.date}</td>
                    <td>{c.charterType}</td>
                    <td className="td-num">{usd(c.ratePerDay)}</td>
                    <td>{c.charterer}</td>
                    <td>{orDash(c.fieldContractedTo)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}
