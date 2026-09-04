import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import { useAccount } from './AccountContext';
import CommandPalette from './CommandPalette';
import {
  IconAdmin, IconAi, IconAlerts, IconApi, IconCompanies, IconContracts,
  IconDashboard, IconFleet, IconLock, IconMaps, IconMarket, IconMenu,
  IconPortfolio, IconProjects, IconSearch,
} from './Icons';
import type { AccountType, FeatureKey } from '@/data/go/types';
import { PLAN_ORDER, PLANS, DEMO_ACCOUNTS } from '@/data/go/accounts';
import { UNREAD_ALERTS } from '@/data/go/alerts';
import { VESSELS } from '@/data/go/vessels';
import { CONTRACTS } from '@/data/go/contracts';
import { PROJECTS } from '@/data/go/projects';

type NavItem = {
  href: string;
  label: string;
  icon: (p: { className?: string }) => JSX.Element;
  feature?: FeatureKey;
  count?: number;
};

const GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: 'Intelligence',
    items: [
      { href: '/go/dashboard', label: 'Dashboard', icon: IconDashboard },
      { href: '/go/fleet', label: 'Fleet', icon: IconFleet, feature: 'fleet', count: VESSELS.length },
      { href: '/go/companies', label: 'Companies', icon: IconCompanies, feature: 'companies' },
      { href: '/go/contracts', label: 'Contracts', icon: IconContracts, feature: 'contracts', count: CONTRACTS.length },
      { href: '/go/projects', label: 'Projects', icon: IconProjects, feature: 'projects', count: PROJECTS.length },
    ],
  },
  {
    title: 'Analysis',
    items: [
      { href: '/go/maps', label: 'Maps & Layers', icon: IconMaps, feature: 'maps' },
      { href: '/go/market', label: 'Market', icon: IconMarket, feature: 'market' },
      { href: '/go/ai', label: 'GO AI', icon: IconAi, feature: 'ai' },
    ],
  },
  {
    title: 'Workspace',
    items: [
      { href: '/go/alerts', label: 'Alerts', icon: IconAlerts, feature: 'alerts', count: UNREAD_ALERTS },
      { href: '/go/portfolio', label: 'My Portfolio', icon: IconPortfolio },
      { href: '/go/api', label: 'API', icon: IconApi, feature: 'api' },
      { href: '/go/admin', label: 'Account', icon: IconAdmin },
    ],
  },
];

export default function AppShell({
  children,
  title,
  wide,
}: {
  children: ReactNode;
  title: string;
  wide?: boolean;
}) {
  const router = useRouter();
  const { account, plan, user, setAccountType, can } = useAccount();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => setNavOpen(false), [router.asPath]);

  return (
    <div className="go">
      <Head>
        <title>{`${title} — GO Intelligence`}</title>
        <meta
          name="description"
          content="GO Intelligence by Gemini Offshore — the commercial intelligence platform for the offshore energy industry."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="go-app">
        <aside className={`go-sidebar ${navOpen ? 'open' : ''}`}>
          <Link href="/go" className="go-brand">
            <div className="go-brand-mark">GEMINI OFFSHORE</div>
            <div className="go-brand-sub">GO Intelligence</div>
          </Link>

          {GROUPS.map((g) => (
            <nav className="go-navgroup" key={g.title}>
              <span className="eyebrow">{g.title}</span>
              {g.items.map((item) => {
                const locked = item.feature ? !can(item.feature) : false;
                const active = router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`go-navlink ${active ? 'active' : ''} ${locked ? 'locked' : ''}`}
                    title={locked ? `${item.label} is not included on the ${plan.name} account` : undefined}
                  >
                    <Icon />
                    {item.label}
                    {locked ? <IconLock /> : item.count ? <span className="go-count">{item.count}</span> : null}
                  </Link>
                );
              })}
            </nav>
          ))}

          <div className="go-sidebar-foot">
            <span className="eyebrow">Current plan</span>
            <div style={{ fontSize: 13, marginTop: 6 }}>{plan.name}</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 4 }}>
              {account.seatsUsed}/{plan.seats} seats · renews {new Date(account.renewalDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
            </div>
          </div>
        </aside>

        <div className="go-main">
          <header className="go-topbar">
            <button className="go-menu-btn" aria-label="Toggle navigation" onClick={() => setNavOpen((v) => !v)}>
              <IconMenu />
            </button>

            <button className="go-search" onClick={() => setCmdOpen(true)} aria-label="Search the graph" style={{ background: '#8B3A3A', borderColor: '#6B2A2A', color: '#E0E0E0' }}>
              <IconSearch />
              Search vessel name, company, IMO, MMSI…
              <kbd style={{ borderColor: '#6B2A2A', color: '#B8B8B8', background: '#6B2A2A' }}>⌘K</kbd>
            </button>

            <div className="go-topbar-right">
              <div className="go-acct" title="Demo tenant switcher — entitlements below are enforced for real">
                <span className="eyebrow" style={{ letterSpacing: '0.12em' }}>Acct</span>
                <select
                  value={account.type}
                  onChange={(e) => setAccountType(e.target.value as AccountType)}
                  aria-label="Switch account"
                >
                  {PLAN_ORDER.map((t) => (
                    <option key={t} value={t}>
                      {DEMO_ACCOUNTS[t].organisation} · {PLANS[t].name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="go-avatar" title={`${user.name} · ${user.role}`}>
                {user.initials}
              </div>
            </div>
          </header>

          <main className={`go-page ${wide ? 'go-page-wide' : ''}`}>{children}</main>
        </div>
      </div>

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
}
