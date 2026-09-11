'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Wordmark from '@/components/ui/Wordmark';
import CommandPalette, { useCommandPalette } from './CommandPalette';
import { NAV } from './nav';
import { IconAlerts, IconMenu, IconSearch, IconClose } from '@/components/ui/Icons';
import { initials } from '@/lib/format';
import { ACCOUNT } from '@/data/account';
import { VESSELS } from '@/data/vessels';
import { COMPANIES } from '@/data/companies';
import { CONTRACTS } from '@/data/contracts';
import { PROJECTS } from '@/data/projects';
import { ALERTS } from '@/data/alerts';

const TIER_LABEL: Record<string, string> = {
  shipowner: 'Shipowner / Operator',
  financier: 'Financier',
  'noc-epc': 'NOC & EPC Contractor',
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { open: paletteOpen, setOpen: setPaletteOpen } = useCommandPalette();

  // Counts come straight off the record arrays, so the sidebar is an
  // honest reflection of what is actually in the platform.
  const counts: Record<string, number> = {
    vessels: VESSELS.length,
    companies: COMPANIES.length,
    contracts: CONTRACTS.length,
    projects: PROJECTS.length,
    alerts: ALERTS.filter((a) => !a.read).length,
  };

  const isActive = (href: string) =>
    href === '/app' ? pathname === '/app' : pathname.startsWith(href);

  return (
    <div className="shell">
      <aside className={`shell-sidebar${sidebarOpen ? ' is-open' : ''}`}>
        <div className="shell-brand">
          <Wordmark href="/app" size="md" />
        </div>

        <nav className="shell-nav" aria-label="Platform">
          {NAV.map((group) => (
            <div className="nav-group" key={group.label}>
              <div className="nav-group-label">{group.label}</div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const count = item.countKey ? counts[item.countKey] : undefined;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-item${isActive(item.href) ? ' is-active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={16} />
                    {item.label}
                    {count !== undefined && count > 0 && (
                      <span className="nav-count">{count}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="shell-account">
          <Link href="/app/settings" className="account-card">
            <span className="avatar">{initials(ACCOUNT.userName)}</span>
            <span className="stack grow" style={{ minWidth: 0 }}>
              <span className="account-name">{ACCOUNT.organisation}</span>
              <span className="account-org">{TIER_LABEL[ACCOUNT.tier]}</span>
            </span>
          </Link>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="shell-scrim" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="shell-main">
        <header className="shell-topbar">
          <button
            className="icon-btn sidebar-toggle"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
          >
            {sidebarOpen ? <IconClose size={16} /> : <IconMenu size={16} />}
          </button>

          <button className="topbar-search" onClick={() => setPaletteOpen(true)}>
            <IconSearch size={14} />
            <span className="hide-sm">Search vessel name, company, IMO, MMSI…</span>
            <span className="kbd">⌘K</span>
          </button>

          <div className="row g8" style={{ marginLeft: 'auto' }}>
            <Link
              href="/app/alerts"
              className="icon-btn"
              aria-label={`Alerts${counts.alerts ? ` (${counts.alerts} unread)` : ''}`}
            >
              <IconAlerts size={16} />
            </Link>
            <Link href="/" className="btn btn--ghost btn--sm hide-sm">
              Exit to site
            </Link>
          </div>
        </header>

        <main className="shell-page">{children}</main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
