import type { Metadata } from 'next';
import Link from 'next/link';
import PageHead from '@/components/app/PageHead';
import Panel from '@/components/ui/Panel';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { IconAPI, IconShield } from '@/components/ui/Icons';
import { ACCOUNT } from '@/data/account';
import { PLANS } from '@/lib/plans';

export const metadata: Metadata = {
  title: 'API Access',
  description: 'GO API — the same graph the screens run on, in your own systems.',
};

const ENDPOINTS = [
  { method: 'GET', path: '/v1/vessels', desc: 'Query the fleet by type, size class, region, status and position' },
  { method: 'GET', path: '/v1/vessels/{imo}', desc: 'One vessel with ownership, position and charter history' },
  { method: 'GET', path: '/v1/companies', desc: 'Owners, operators and counterparties' },
  { method: 'GET', path: '/v1/companies/{id}', desc: 'One company with all seven management tiers' },
  { method: 'GET', path: '/v1/contracts', desc: 'The charter book, filterable by expiry window' },
  { method: 'GET', path: '/v1/projects', desc: 'Field developments, awards and the tender pipeline' },
  { method: 'GET', path: '/v1/market/benchmarks', desc: 'Day-rate bands by region and size class' },
  { method: 'GET', path: '/v1/alerts', desc: 'Signals raised against your account' },
];

export default function ApiPage() {
  const plan = PLANS.find((p) => p.tier === ACCOUNT.tier);
  const hasApi = plan?.features.includes('API') ?? false;

  return (
    <>
      <PageHead
        eyebrow="Platform · GO API"
        title="API Access"
        sub="The same graph the screens run on, inside your own systems."
      />

      <Panel style={{ marginBottom: 16 }}>
        <div className="panel-body between wrapflex">
          <div className="row g12">
            <span className="empty-mark" style={{ width: 40, height: 40, marginBottom: 0 }}>
              <IconShield size={18} />
            </span>
            <div>
              <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 600 }}>
                {plan?.name} account
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-4)', marginTop: 3 }}>
                {hasApi
                  ? 'API access is included with this account type.'
                  : 'API access is included with the NOC & EPC Contractor account.'}
              </div>
            </div>
          </div>
          <Badge tone={hasApi ? 'green' : 'grey'} dot>
            {hasApi ? 'Included' : 'Not included'}
          </Badge>
        </div>
      </Panel>

      <Panel title="API keys" style={{ marginBottom: 16 }}>
        <EmptyState
          icon={<IconAPI size={22} />}
          title="No keys issued"
          body="Keys are scoped per environment, so a staging integration can never read production data. Key issuance needs a backend — wire this screen to your auth service when you build it."
          primaryHref="/app/settings"
          primaryLabel="Open settings"
        />
      </Panel>

      <Panel title="Endpoints" style={{ marginBottom: 16 }}>
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Method</th>
                <th>Path</th>
                <th>Returns</th>
              </tr>
            </thead>
            <tbody>
              {ENDPOINTS.map((e) => (
                <tr key={e.path}>
                  <td>
                    <Badge tone="blue">{e.method}</Badge>
                  </td>
                  <td className="mono td-strong">{e.path}</td>
                  <td style={{ whiteSpace: 'normal', color: 'var(--text-4)' }}>{e.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Example request">
        <div className="panel-body">
          <div className="well">
            <pre
              className="mono"
              style={{
                margin: 0,
                fontSize: 11.5,
                lineHeight: 1.75,
                color: 'var(--text-3)',
                overflowX: 'auto',
                whiteSpace: 'pre',
              }}
            >
{`curl https://api.gointelligence.example/v1/vessels \\
  -H "Authorization: Bearer $GO_API_KEY" \\
  -G \\
  -d sizeClass="AHTS (Large)" \\
  -d region="Middle East Gulf" \\
  -d status="Off Hire"`}
            </pre>
          </div>
          <p className="muted" style={{ fontSize: 12, marginTop: 14 }}>
            This is the intended shape of the API. No endpoints are served yet —
            the platform currently reads records directly from the modules
            listed in{' '}
            <Link href="/app/data" className="link-arrow" style={{ fontSize: 12 }}>
              Data Manager
            </Link>
            .
          </p>
        </div>
      </Panel>
    </>
  );
}
