import type { ComponentType } from 'react';
import {
  IconAI,
  IconAPI,
  IconAdmin,
  IconAlerts,
  IconCompanies,
  IconContracts,
  IconDashboard,
  IconFleet,
  IconMaps,
  IconMarket,
  IconPortfolio,
  IconProjects,
  IconSettings,
} from '@/components/ui/Icons';

export interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  /** Shown as a count pill; supplied by the shell from live record counts. */
  countKey?: 'vessels' | 'companies' | 'contracts' | 'projects' | 'alerts';
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/** Grouped exactly as the strategy book sets it out. */
export const NAV: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ href: '/app', label: 'Dashboard', icon: IconDashboard }],
  },
  {
    label: 'Intelligence',
    items: [
      { href: '/app/fleet', label: 'Fleet', icon: IconFleet, countKey: 'vessels' },
      { href: '/app/companies', label: 'Companies', icon: IconCompanies, countKey: 'companies' },
      { href: '/app/contracts', label: 'Contracts', icon: IconContracts, countKey: 'contracts' },
      { href: '/app/projects', label: 'Projects', icon: IconProjects, countKey: 'projects' },
    ],
  },
  {
    label: 'Analysis',
    items: [
      { href: '/app/maps', label: 'Maps & Layers', icon: IconMaps },
      { href: '/app/market', label: 'Market', icon: IconMarket },
      { href: '/app/ai', label: 'GO AI', icon: IconAI },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { href: '/app/alerts', label: 'Alerts', icon: IconAlerts, countKey: 'alerts' },
      { href: '/app/portfolio', label: 'My Portfolio', icon: IconPortfolio },
    ],
  },
  {
    label: 'Platform',
    items: [
      { href: '/app/data', label: 'Data Manager', icon: IconAdmin },
      { href: '/app/api', label: 'API Access', icon: IconAPI },
      { href: '/app/settings', label: 'Settings', icon: IconSettings },
    ],
  },
];

/** Flat list used by the command palette. */
export const NAV_FLAT = NAV.flatMap((g) =>
  g.items.map((i) => ({ ...i, group: g.label })),
);
