/** Formatting helpers. All of them degrade gracefully on missing values,
 *  because the platform ships empty and fills up over time. */

const EMPTY = '—';

/** USD, no decimals: 15500 → "$15,500" */
export function usd(n?: number | null): string {
  if (n === undefined || n === null || Number.isNaN(n)) return EMPTY;
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

/** Compact USD for large sums: 2_100_000_000 → "$2.1B" */
export function usdCompact(n?: number | null): string {
  if (n === undefined || n === null || Number.isNaN(n)) return EMPTY;
  const abs = Math.abs(n);
  if (abs >= 1e9) return `$${(n / 1e9).toFixed(1).replace(/\.0$/, '')}B`;
  if (abs >= 1e6) return `$${(n / 1e6).toFixed(1).replace(/\.0$/, '')}M`;
  if (abs >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return usd(n);
}

/** Rate band: "$16,000 – $24,000/day" */
export function rateBand(low?: number, high?: number): string {
  if (low === undefined || high === undefined) return EMPTY;
  return `${usd(low)} – ${usd(high)}/day`;
}

export function pct(n?: number | null, digits = 0): string {
  if (n === undefined || n === null || Number.isNaN(n)) return EMPTY;
  return `${n.toFixed(digits)}%`;
}

/** Signed percentage with an explicit plus: 5 → "+5%" */
export function signedPct(n?: number | null): string {
  if (n === undefined || n === null || Number.isNaN(n)) return EMPTY;
  return `${n > 0 ? '+' : ''}${n.toFixed(0)}%`;
}

export function num(n?: number | null): string {
  if (n === undefined || n === null || Number.isNaN(n)) return EMPTY;
  return n.toLocaleString('en-US');
}

/** "12 Mar 2025" */
export function date(iso?: string): string {
  if (!iso) return EMPTY;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Whole days from now until an ISO date. Negative once past. */
export function daysUntil(iso?: string): number | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return Math.ceil((d.getTime() - Date.now()) / 86_400_000);
}

/** "18 days", "6 months", "overdue" */
export function expiresIn(iso?: string): string {
  const days = daysUntil(iso);
  if (days === undefined) return EMPTY;
  if (days < 0) return 'Overdue';
  if (days < 45) return `${days} day${days === 1 ? '' : 's'}`;
  const months = Math.round(days / 30);
  if (months < 18) return `${months} month${months === 1 ? '' : 's'}`;
  return `${(days / 365).toFixed(1)} years`;
}

/** "2h ago", "4d ago" */
export function timeAgo(iso?: string): string {
  if (!iso) return EMPTY;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return EMPTY;
  const mins = Math.floor((Date.now() - then) / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date(iso);
}

/** Initials for the avatar block: "Operations Team" → "OT" */
export function initials(name?: string): string {
  if (!name) return '··';
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');
}

/** Shows a value, or a styled placeholder when it has not been recorded. */
export function orDash(v?: string | number | null): string {
  if (v === undefined || v === null || v === '') return EMPTY;
  return String(v);
}
