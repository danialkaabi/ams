import AppShell from '@/components/go/AppShell';
import { useAccount } from '@/components/go/AccountContext';
import { Disclaimer, Gate, Meter, PageHead, Panel, StatTile } from '@/components/go/ui';

const ENDPOINTS = [
  { method: 'GET', path: '/v1/vessels', desc: 'Query the fleet by type, size class, region, owner, AIS state and in-zone predicates.' },
  { method: 'GET', path: '/v1/vessels/{imo}', desc: 'Full vessel record including the seven-tier ownership chain and charter history.' },
  { method: 'GET', path: '/v1/companies', desc: 'Owners, operators, charterers and financiers with management-tier counts.' },
  { method: 'GET', path: '/v1/companies/{id}/fleet', desc: 'Every vessel where this company holds any of the seven management roles.' },
  { method: 'GET', path: '/v1/contracts', desc: 'Charter book with expiry, rate and benchmark variance, scoped to your entitlements.' },
  { method: 'GET', path: '/v1/projects', desc: 'Field developments, tender pipeline and vessel demand forecasts.' },
  { method: 'GET', path: '/v1/market/benchmarks', desc: 'Day-rate bands by region, vessel type and size class, with 12-month history.' },
  { method: 'GET', path: '/v1/positions', desc: 'Latest AIS positions for vessels in scope, with position age and zone membership.' },
  { method: 'POST', path: '/v1/alerts/rules', desc: 'Create a watch rule and receive matching events on your webhook.' },
  { method: 'POST', path: '/v1/exports', desc: 'Queue a bulk export of any query result set; poll or receive a webhook when ready.' },
];

export default function Api() {
  const { can, plan, account } = useAccount();

  if (!can('api')) {
    return (
      <AppShell title="API">
        <PageHead
          eyebrow="Workspace · GO API"
          title="GO API"
          lede="Programmatic access to the whole graph — the same data the screens run on, in your own systems."
        />
        <Gate feature="GO API" upgradeTo="NOC & EPC Contractor">
          API access is included on the NOC &amp; EPC Contractor account. Your current plan is{' '}
          {plan.name}.
        </Gate>
        <div style={{ marginTop: 14 }}>
          <Panel title="WHAT THE API COVERS" flush>
            <div className="go-tablewrap">
              <table className="go-table">
                <tbody>
                  {ENDPOINTS.map((e) => (
                    <tr key={e.path} style={{ opacity: 0.55 }}>
                      <td style={{ width: 60 }}>
                        <span className={`go-method ${e.method === 'POST' ? 'post' : ''}`}>{e.method}</span>
                      </td>
                      <td className="num" style={{ color: 'var(--text)' }}>
                        {e.path}
                      </td>
                      <td>{e.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="API" wide>
      <PageHead
        eyebrow="Workspace · GO API"
        title="GO API"
        lede="Programmatic access to the whole graph — the same data the screens run on, in your own chartering, ERP or BI systems."
        actions={<button className="go-btn primary">Create key</button>}
      />

      <div className="go-grid c4" style={{ marginBottom: 14 }}>
        <StatTile value="2" label="Active keys" />
        <StatTile value="184,203" label="Calls this month" tone="accent-2" />
        <StatTile value="500k" label="Monthly call allowance" />
        <StatTile value="99.95%" label="Rolling 90-day uptime" />
      </div>

      <div className="go-grid" style={{ gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', marginBottom: 14 }}>
        <Panel title="AUTHENTICATION">
          <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 12 }}>
            Bearer token over TLS. Keys are scoped to your account&apos;s entitlements — a key cannot read
            data the account itself cannot see.
          </p>
          <div className="go-code">
            <span className="c"># Available medium PSVs in the Middle East Gulf</span>
            {'\n'}curl https://api.gointelligence.com<span className="s">/v1/vessels</span> \{'\n'}
            {'  '}-H <span className="s">&quot;Authorization: Bearer $GO_API_KEY&quot;</span> \{'\n'}
            {'  '}-G \{'\n'}
            {'  '}--data-urlencode <span className="s">&quot;sub_type=PSV&quot;</span> \{'\n'}
            {'  '}--data-urlencode <span className="s">&quot;size_class=Medium&quot;</span> \{'\n'}
            {'  '}--data-urlencode <span className="s">&quot;region=Middle East Gulf&quot;</span> \{'\n'}
            {'  '}--data-urlencode <span className="s">&quot;status=Off hire&quot;</span>
          </div>
          <p className="eyebrow" style={{ marginTop: 16, marginBottom: 8 }}>Response</p>
          <div className="go-code">
{`{
  `}<span className="k">&quot;data&quot;</span>{`: [
    {
      `}<span className="k">&quot;imo&quot;</span>{`: `}<span className="s">&quot;9612847&quot;</span>{`,
      `}<span className="k">&quot;name&quot;</span>{`: `}<span className="s">&quot;Gulf Pioneer&quot;</span>{`,
      `}<span className="k">&quot;sub_type&quot;</span>{`: `}<span className="s">&quot;PSV&quot;</span>{`,
      `}<span className="k">&quot;size_class&quot;</span>{`: `}<span className="s">&quot;Medium&quot;</span>{`,
      `}<span className="k">&quot;status&quot;</span>{`: `}<span className="s">&quot;Off hire&quot;</span>{`,
      `}<span className="k">&quot;ownership&quot;</span>{`: {
        `}<span className="k">&quot;beneficial_owner&quot;</span>{`: `}<span className="s">&quot;Meridian Offshore&quot;</span>{`,
        `}<span className="k">&quot;registered_owner&quot;</span>{`: `}<span className="s">&quot;Meridian Pioneer Navigation Inc&quot;</span>{`
      },
      `}<span className="k">&quot;confidence&quot;</span>{`: `}<span className="n">90</span>{`,
      `}<span className="k">&quot;source&quot;</span>{`: `}<span className="s">&quot;Marshall Islands registry&quot;</span>{`,
      `}<span className="k">&quot;as_of&quot;</span>{`: `}<span className="s">&quot;2026-08-19&quot;</span>{`
    }
  ],
  `}<span className="k">&quot;meta&quot;</span>{`: { `}<span className="k">&quot;total&quot;</span>{`: `}<span className="n">3</span>{`, `}<span className="k">&quot;scope&quot;</span>{`: `}<span className="s">&quot;full-regional&quot;</span>{` }
}`}
          </div>
          <p className="go-note" style={{ marginTop: 12 }}>
            Every record carries <span className="mono">confidence</span>, <span className="mono">source</span> and{' '}
            <span className="mono">as_of</span>. If your pipeline gates on data quality, gate on those fields.
          </p>
        </Panel>

        <div style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
          <Panel title="KEYS" flush>
            <div className="go-tablewrap">
              <table className="go-table" style={{ minWidth: 0 }}>
                <tbody>
                  <tr>
                    <td>
                      <strong>Production</strong>
                      <div className="mono" style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
                        go_live_••••••••••4f2a
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="go-pill ok">
                        <span className="go-dot" />
                        Active
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Sandbox</strong>
                      <div className="mono" style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
                        go_test_••••••••••9c31
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="go-pill acc2">
                        <span className="go-dot" />
                        Test
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="USAGE THIS MONTH">
            <div style={{ display: 'grid', gap: 14 }}>
              <Meter label="Call allowance" value={37} suffix="%" />
              <Meter label="Rate limit headroom" value={82} suffix="%" tone="ok" />
              <Meter label="Bulk export credits" value={45} suffix="%" tone="two" />
            </div>
            <p className="go-note" style={{ marginTop: 14 }}>
              Account: {account.organisation} · scope {plan.dataScope} · 600 requests/minute.
            </p>
          </Panel>

          <Panel title="WEBHOOKS">
            <p style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.55 }}>
              Alert rules created through the API deliver to your endpoint as signed JSON. Events cover
              renewals, off-hire, zone entry and exit, tender openings, benchmark moves and ownership
              changes.
            </p>
          </Panel>
        </div>
      </div>

      <Panel title="ENDPOINTS" note="v1 · REST over TLS" flush>
        <div className="go-tablewrap">
          <table className="go-table">
            <tbody>
              {ENDPOINTS.map((e) => (
                <tr key={e.path}>
                  <td style={{ width: 60 }}>
                    <span className={`go-method ${e.method === 'POST' ? 'post' : ''}`}>{e.method}</span>
                  </td>
                  <td className="num" style={{ color: 'var(--text)', whiteSpace: 'nowrap' }}>
                    {e.path}
                  </td>
                  <td>{e.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div style={{ marginTop: 14 }}>
        <Disclaimer>
          Illustrative API console. Endpoints, keys and usage figures shown here are for concept
          demonstration.
        </Disclaimer>
      </div>
    </AppShell>
  );
}
