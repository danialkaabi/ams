/** Minimal 16px stroke icon set — one visual language across the whole platform. */
type P = { className?: string };

const base = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const IconFleet = (p: P) => (
  <svg {...base} className={`go-ico ${p.className ?? ''}`}>
    <path d="M3 17l1.6-5.4a1 1 0 0 1 1-.7h12.8a1 1 0 0 1 1 .7L21 17" />
    <path d="M12 11V5m-4 0h8" />
    <path d="M2.5 17c1.6 0 1.6 1.6 3.2 1.6S7.3 17 8.9 17s1.6 1.6 3.2 1.6S13.7 17 15.3 17s1.6 1.6 3.2 1.6 1.6-1.6 3-1.6" />
  </svg>
);

export const IconCompanies = (p: P) => (
  <svg {...base} className={`go-ico ${p.className ?? ''}`}>
    <rect x="3" y="4" width="8" height="16" rx="1" />
    <rect x="13" y="9" width="8" height="11" rx="1" />
    <path d="M6 8h2M6 12h2M6 16h2M16 13h2M16 17h2" />
  </svg>
);

export const IconContracts = (p: P) => (
  <svg {...base} className={`go-ico ${p.className ?? ''}`}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5M9 13h6M9 17h4" />
  </svg>
);

export const IconProjects = (p: P) => (
  <svg {...base} className={`go-ico ${p.className ?? ''}`}>
    <path d="M3 20h18M6 20V9m5 11V4m5 16v-7m5 7V11" />
  </svg>
);

export const IconMaps = (p: P) => (
  <svg {...base} className={`go-ico ${p.className ?? ''}`}>
    <path d="M9 4L3 6.5v13L9 17l6 2.5 6-2.5v-13L15 7z" />
    <path d="M9 4v13M15 7v12.5" />
  </svg>
);

export const IconMarket = (p: P) => (
  <svg {...base} className={`go-ico ${p.className ?? ''}`}>
    <path d="M3 16.5l5-5 3.5 3.5L21 5.5" />
    <path d="M15.5 5.5H21v5.5" />
  </svg>
);

export const IconAi = (p: P) => (
  <svg {...base} className={`go-ico ${p.className ?? ''}`}>
    <path d="M12 3l1.9 4.6L18.5 9l-4.6 1.9L12 15.5l-1.9-4.6L5.5 9l4.6-1.4z" />
    <path d="M18 16l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
  </svg>
);

export const IconAlerts = (p: P) => (
  <svg {...base} className={`go-ico ${p.className ?? ''}`}>
    <path d="M18 8a6 6 0 1 0-12 0c0 6-2.5 7-2.5 7h17S18 14 18 8" />
    <path d="M13.7 19a2 2 0 0 1-3.4 0" />
  </svg>
);

export const IconPortfolio = (p: P) => (
  <svg {...base} className={`go-ico ${p.className ?? ''}`}>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7M3 12h18" />
  </svg>
);

export const IconApi = (p: P) => (
  <svg {...base} className={`go-ico ${p.className ?? ''}`}>
    <path d="M9 8l-4 4 4 4M15 8l4 4-4 4M13.5 5l-3 14" />
  </svg>
);

export const IconDashboard = (p: P) => (
  <svg {...base} className={`go-ico ${p.className ?? ''}`}>
    <rect x="3" y="3" width="7.5" height="8" rx="1.4" />
    <rect x="13.5" y="3" width="7.5" height="5" rx="1.4" />
    <rect x="3" y="14" width="7.5" height="7" rx="1.4" />
    <rect x="13.5" y="11" width="7.5" height="10" rx="1.4" />
  </svg>
);

export const IconAdmin = (p: P) => (
  <svg {...base} className={`go-ico ${p.className ?? ''}`}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1v.3a2 2 0 1 1-4 0v-.2a1.6 1.6 0 0 0-2.8-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3.4 15H3a2 2 0 1 1 0-4h.2a1.6 1.6 0 0 0 1.1-2.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 10 4.4V4a2 2 0 1 1 4 0v.2a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7h.4a2 2 0 1 1 0 4h-.2a1.6 1.6 0 0 0-1.4 1z" />
  </svg>
);

export const IconSearch = (p: P) => (
  <svg {...base} className={`go-ico ${p.className ?? ''}`}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const IconMenu = (p: P) => (
  <svg {...base} className={`go-ico ${p.className ?? ''}`}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const IconExport = (p: P) => (
  <svg {...base} className={`go-ico ${p.className ?? ''}`}>
    <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  </svg>
);

export const IconLock = (p: P) => (
  <svg {...base} className={`go-ico ${p.className ?? ''}`}>
    <rect x="4.5" y="10" width="15" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

export const IconArrow = (p: P) => (
  <svg {...base} className={`go-ico ${p.className ?? ''}`}>
    <path d="M5 12h14m0 0-5-5m5 5-5 5" />
  </svg>
);

export const IconLayers = (p: P) => (
  <svg {...base} className={`go-ico ${p.className ?? ''}`}>
    <path d="m12 3 9 5-9 5-9-5z" />
    <path d="m3 13 9 5 9-5M3 16.5 12 21l9-4.5" />
  </svg>
);
