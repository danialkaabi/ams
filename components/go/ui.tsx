import { ReactNode } from 'react';
import Link from 'next/link';
import type { Provenance, Trend } from '@/data/go/types';
import { VERIFY_THRESHOLD } from '@/data/go/types';
import { IconLock } from './Icons';

/* ---------- formatting ---------- */

export const usd = (n: number) =>
  n >= 1_000_000_000
    ? `$${(n / 1_000_000_000).toFixed(1)}B`
    : n >= 1_000_000
      ? `$${(n / 1_000_000).toFixed(1)}M`
      : `$${n.toLocaleString('en-US')}`;

export const rate = (n: number | null) => (n === null ? '—' : `$${n.toLocaleString('en-US')}`);

export const pct = (n: number) => `${n > 0 ? '+' : ''}${n}%`;

export const dateLabel = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export const monthLabel = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

/* ---------- layout primitives ---------- */

export function Panel({
  title,
  note,
  actions,
  children,
  flush,
  onClose,
}: {
  title?: string;
  note?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  /** Drop the body padding — for tables that should meet the panel edge. */
  flush?: boolean;
  /** Optional close button handler */
  onClose?: () => void;
}) {
  return (
    <section className="go-panel">
      {(title || actions || onClose) && (
        <header className="go-panel-head">
          {title && <h3>{title}</h3>}
          {note && <span className="go-panel-note">{note}</span>}
          <div style={{ marginLeft: note ? 12 : 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            {actions}
            {onClose && (
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-2)',
                  cursor: 'pointer',
                  fontSize: 18,
                  padding: '0 4px',
                  lineHeight: 1,
                }}
                title="Close"
              >
                ✕
              </button>
            )}
          </div>
        </header>
      )}
      {flush ? children : <div className="go-panel-body">{children}</div>}
    </section>
  );
}

export function PageHead({
  eyebrow,
  title,
  lede,
  actions,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="go-pagehead">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {lede && <p>{lede}</p>}
      </div>
      {actions && <div className="go-pagehead-actions">{actions}</div>}
    </div>
  );
}

export function StatTile({
  value,
  label,
  delta,
  tone,
}: {
  value: ReactNode;
  label: string;
  delta?: { value: string; dir: 'up' | 'down' | 'flat' };
  tone?: 'accent-2' | 'warn' | 'bad';
}) {
  return (
    <div className={`go-stat ${tone ?? ''}`}>
      <span className="go-stat-val">{value}</span>
      <span className="go-stat-label">{label}</span>
      {delta && <span className={`go-delta ${delta.dir}`}>{delta.value}</span>}
    </div>
  );
}

/* ---------- trust surface ---------- */

/**
 * Confidence badge. Every commercially load-bearing value on the platform can
 * carry one — this is what "data you can actually trade on" looks like in the UI.
 */
export function Confidence({ p, compact }: { p: Provenance; compact?: boolean }) {
  const band = p.confidence >= 85 ? 'high' : p.confidence >= VERIFY_THRESHOLD ? 'med' : 'low';
  const title = [
    `Confidence ${p.confidence}%`,
    `Source: ${p.sourceLabel}`,
    `As of ${dateLabel(p.asOf)}`,
    p.verifiedBy ? `Verified by ${p.verifiedBy}` : `${p.state === 'unverified' ? 'Below verification threshold — analyst review queued' : 'Auto-scored, not analyst-verified'}`,
  ].join(' · ');

  return (
    <span className={`go-conf ${band}`} title={title}>
      <span className="go-conf-bar">
        <span style={{ width: `${p.confidence}%` }} />
      </span>
      {!compact && <>{p.confidence}%{p.verifiedBy ? ' ✓' : ''}</>}
    </span>
  );
}

export function SourceLine({ p }: { p: Provenance }) {
  return (
    <span className="go-note">
      {p.sourceLabel} · as of {dateLabel(p.asOf)} ·{' '}
      {p.verifiedBy ? `verified by ${p.verifiedBy}` : p.state === 'unverified' ? 'pending analyst review' : 'auto-scored'}
    </span>
  );
}

/* ---------- status ---------- */

const TONE_BY_STATUS: Record<string, string> = {
  'On hire': 'ok',
  'On Hire': 'ok',
  Active: 'ok',
  Standby: 'warn',
  Transit: 'acc2',
  'Off hire': '',
  'Off Hire': '',
  'In yard': '',
  'Laid up': '',
  'Renewal Due': 'bad',
  'Overdue Renewal': 'bad',
  'Expiring Soon': 'warn',
  Tender: 'acc2',
  Awarded: 'acc',
  Mobilising: 'warn',
  Execution: 'ok',
  'First Oil': 'acc',
};

export function Status({ value }: { value: string }) {
  return (
    <span className={`go-pill ${TONE_BY_STATUS[value] ?? ''}`}>
      <span className="go-dot" />
      {value}
    </span>
  );
}

export function TrendMark({ trend }: { trend: Trend }) {
  const glyph = trend === 'up' ? '▲' : trend === 'down' ? '▼' : '–';
  const cls = trend === 'up' ? 'ok' : trend === 'down' ? 'bad' : '';
  return <span style={{ color: `var(--${cls || 'text-2'})`, fontSize: 10 }}>{glyph}</span>;
}

/* ---------- charts ---------- */

export function Sparkline({
  points,
  width = 96,
  height = 26,
  tone = 'var(--acc)',
}: {
  points: number[];
  width?: number;
  height?: number;
  tone?: string;
}) {
  if (points.length < 2) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const step = width / (points.length - 1);
  const d = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)},${(height - ((p - min) / span) * height).toFixed(1)}`)
    .join(' ');

  return (
    <svg className="go-spark" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <path d={d} fill="none" stroke={tone} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Meter({
  label,
  value,
  max = 100,
  suffix = '%',
  tone,
}: {
  label: string;
  value: number;
  max?: number;
  suffix?: string;
  tone?: 'two' | 'ok' | 'warn';
}) {
  return (
    <div className="go-meter">
      <div className="go-meter-top">
        <span>{label}</span>
        <strong>
          {value}
          {suffix}
        </strong>
      </div>
      <div className="go-meter-track">
        <div className={`go-meter-fill ${tone ?? ''}`} style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
      </div>
    </div>
  );
}

/** Benchmark band with the actual fixed rate marked against it. */
export function RateRange({
  low,
  high,
  actual,
}: {
  low: number;
  high: number;
  actual?: number | null;
}) {
  const pad = (high - low) * 0.35;
  const min = low - pad;
  const max = high + pad;
  const at = (v: number) => `${Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100))}%`;

  return (
    <div className="go-range" title={`Benchmark $${low.toLocaleString()}–$${high.toLocaleString()}/day`}>
      <div className="go-range-track" />
      <div className="go-range-band" style={{ left: at(low), width: `calc(${at(high)} - ${at(low)})` }} />
      {actual != null && <div className="go-range-mark" style={{ left: at(actual) }} title={`Fixed at $${actual.toLocaleString()}/day`} />}
    </div>
  );
}

/* ---------- entitlements ---------- */

/** Shown in place of a feature the current account's plan does not include. */
export function Gate({
  feature,
  upgradeTo,
  children,
}: {
  feature: string;
  upgradeTo: string;
  children?: ReactNode;
}) {
  return (
    <div className="go-gate">
      <IconLock />
      <h4 style={{ marginTop: 10 }}>{feature} is not included on this plan</h4>
      <p>
        {children ?? `Available on the ${upgradeTo} account.`} Your account manager can enable it on the
        current contract term.
      </p>
      <Link href="/go/pricing" className="go-btn primary sm">
        Compare accounts
      </Link>
    </div>
  );
}

export function Masked({ label = 'restricted' }: { label?: string }) {
  return (
    <span className="go-masked" title="Outside your account's data scope. NOC & EPC accounts see all operators.">
      {label}
    </span>
  );
}

/* ---------- misc ---------- */

export function Disclaimer({ children }: { children: ReactNode }) {
  return <p className="go-disclaimer">{children}</p>;
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <div style={{ padding: '38px 20px', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>{children}</div>
  );
}
