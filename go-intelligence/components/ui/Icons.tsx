/** A small, consistent stroke-icon set. 1.5px strokes on a 24px grid,
 *  sized down in place so everything optically matches the type. */

interface IconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

const base = (size: number, strokeWidth: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
});

export const IconFleet = ({ size = 16, strokeWidth = 1.5, className }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="M3 17.5c1.5 0 1.5 1 3 1s1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1" />
    <path d="M5 14.5 6.2 9.6A1 1 0 0 1 7.2 8.8h9.6a1 1 0 0 1 1 .8l1.2 4.9" />
    <path d="M12 8.8V5.2" />
    <path d="M9 5.2h6" />
  </svg>
);

export const IconCompanies = ({ size = 16, strokeWidth = 1.5, className }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="M3 20.5h18" />
    <path d="M4.5 20.5V5.5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v15" />
    <path d="M13.5 20.5v-10h5a1 1 0 0 1 1 1v9" />
    <path d="M7.5 8h3M7.5 11.5h3M7.5 15h3M16 14h1M16 17h1" />
  </svg>
);

export const IconContracts = ({ size = 16, strokeWidth = 1.5, className }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="M14 3.5H6.5a1 1 0 0 0-1 1v15a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V8z" />
    <path d="M14 3.5V8h4.5" />
    <path d="M8.5 13h7M8.5 16.5h4.5" />
  </svg>
);

export const IconProjects = ({ size = 16, strokeWidth = 1.5, className }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="M3.5 20.5V9l5-3.5 5 3.5" />
    <path d="M13.5 20.5V12h7v8.5" />
    <path d="M3.5 20.5h17" />
    <path d="M7 13.5h2M7 17h2M16.5 15.5h1M16.5 18h1" />
  </svg>
);

export const IconMaps = ({ size = 16, strokeWidth = 1.5, className }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="m3.5 6.5 5.5-2 6 2 5.5-2v13l-5.5 2-6-2-5.5 2z" />
    <path d="M9 4.5v13M15 6.5v13" />
  </svg>
);

export const IconMarket = ({ size = 16, strokeWidth = 1.5, className }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="M3.5 20h17" />
    <path d="m4.5 15.5 4.5-5 3.5 3 6.5-7.5" />
    <path d="M15 6h4v4" />
  </svg>
);

export const IconAI = ({ size = 16, strokeWidth = 1.5, className }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="m12 3.5 2.1 5.2 5.4 1.8-5.4 1.8L12 17.5l-2.1-5.2L4.5 10.5l5.4-1.8z" />
    <path d="M18.5 16.5v3.5M16.75 18.25h3.5" />
  </svg>
);

export const IconAlerts = ({ size = 16, strokeWidth = 1.5, className }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="M18 9a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16S18 14 18 9" />
    <path d="M13.7 19a2 2 0 0 1-3.4 0" />
  </svg>
);

export const IconPortfolio = ({ size = 16, strokeWidth = 1.5, className }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="m12 4 2.5 5.1 5.6.8-4 3.9 1 5.6-5.1-2.7L6.9 19.4l1-5.6-4-3.9 5.6-.8z" />
  </svg>
);

export const IconDashboard = ({ size = 16, strokeWidth = 1.5, className }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <rect x="3.5" y="3.5" width="7.5" height="7" rx="1" />
    <rect x="13" y="3.5" width="7.5" height="4.5" rx="1" />
    <rect x="3.5" y="12.5" width="7.5" height="8" rx="1" />
    <rect x="13" y="10" width="7.5" height="10.5" rx="1" />
  </svg>
);

export const IconAPI = ({ size = 16, strokeWidth = 1.5, className }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="m9 8-5 4 5 4M15 8l5 4-5 4" />
  </svg>
);

export const IconSettings = ({ size = 16, strokeWidth = 1.5, className }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <circle cx="12" cy="12" r="2.75" />
    <path d="M19.1 14.4a1.4 1.4 0 0 0 .3 1.6l.1.1a1.7 1.7 0 1 1-2.4 2.4l-.1-.1a1.4 1.4 0 0 0-1.6-.3 1.4 1.4 0 0 0-.9 1.3v.2a1.7 1.7 0 1 1-3.4 0v-.1a1.4 1.4 0 0 0-.9-1.3 1.4 1.4 0 0 0-1.6.3l-.1.1a1.7 1.7 0 1 1-2.4-2.4l.1-.1a1.4 1.4 0 0 0 .3-1.6 1.4 1.4 0 0 0-1.3-.9h-.2a1.7 1.7 0 1 1 0-3.4h.1a1.4 1.4 0 0 0 1.3-.9 1.4 1.4 0 0 0-.3-1.6l-.1-.1a1.7 1.7 0 1 1 2.4-2.4l.1.1a1.4 1.4 0 0 0 1.6.3h.1a1.4 1.4 0 0 0 .9-1.3v-.2a1.7 1.7 0 1 1 3.4 0v.1a1.4 1.4 0 0 0 .9 1.3 1.4 1.4 0 0 0 1.6-.3l.1-.1a1.7 1.7 0 1 1 2.4 2.4l-.1.1a1.4 1.4 0 0 0-.3 1.6v.1a1.4 1.4 0 0 0 1.3.9h.2a1.7 1.7 0 1 1 0 3.4h-.1a1.4 1.4 0 0 0-1.3.9" />
  </svg>
);

export const IconAdmin = ({ size = 16, strokeWidth = 1.5, className }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <ellipse cx="12" cy="6" rx="7.5" ry="2.8" />
    <path d="M4.5 6v6c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8V6" />
    <path d="M4.5 12v6c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-6" />
  </svg>
);

export const IconSearch = ({ size = 16, strokeWidth = 1.5, className }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m20 20-4.8-4.8" />
  </svg>
);

export const IconPlus = ({ size = 16, strokeWidth = 1.5, className }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconArrow = ({ size = 16, strokeWidth = 1.5, className }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="M4.5 12h15M13.5 6l6 6-6 6" />
  </svg>
);

export const IconChevron = ({ size = 16, strokeWidth = 1.5, className }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="m9 5 7 7-7 7" />
  </svg>
);

export const IconCheck = ({ size = 16, strokeWidth = 1.5, className }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
);

export const IconClose = ({ size = 16, strokeWidth = 1.5, className }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconMenu = ({ size = 16, strokeWidth = 1.5, className }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const IconDownload = ({ size = 16, strokeWidth = 1.5, className }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="M12 4v11M7.5 10.5 12 15l4.5-4.5" />
    <path d="M4.5 19.5h15" />
  </svg>
);

export const IconFilter = ({ size = 16, strokeWidth = 1.5, className }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="M4 6h16l-6.5 7.5v5.5l-3 1.5v-7z" />
  </svg>
);

export const IconGraph = ({ size = 16, strokeWidth = 1.5, className }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <circle cx="6" cy="7" r="2.3" />
    <circle cx="18" cy="7" r="2.3" />
    <circle cx="12" cy="17.5" r="2.3" />
    <path d="M7.9 8.5 10.4 15.6M16.1 8.5 13.6 15.6M8.3 7h7.4" />
  </svg>
);

export const IconShield = ({ size = 16, strokeWidth = 1.5, className }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="M12 3.5 5 6.2v5.3c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6.2z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const IconMobile = ({ size = 16, strokeWidth = 1.5, className }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <rect x="7" y="2.5" width="10" height="19" rx="2" />
    <path d="M10.75 5.5h2.5" />
  </svg>
);

export const IconLayers = ({ size = 16, strokeWidth = 1.5, className }: IconProps) => (
  <svg {...base(size, strokeWidth)} className={className}>
    <path d="m12 3.5 8.5 4.5L12 12.5 3.5 8z" />
    <path d="m3.5 12.5 8.5 4.5 8.5-4.5" />
    <path d="m3.5 16.5 8.5 4.5 8.5-4.5" />
  </svg>
);
