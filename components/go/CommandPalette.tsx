import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { VESSELS } from '@/data/go/vessels';
import { COMPANIES } from '@/data/go/companies';
import { PROJECTS } from '@/data/go/projects';

type Hit = { label: string; sub: string; kind: string; href: string };

const NAV: Hit[] = [
  { label: 'Dashboard', sub: 'Portfolio, utilisation and live rates', kind: 'Go to', href: '/go/dashboard' },
  { label: 'Fleet', sub: 'Vessel query builder', kind: 'Go to', href: '/go/fleet' },
  { label: 'Companies', sub: 'Owners, operators and counterparties', kind: 'Go to', href: '/go/companies' },
  { label: 'Contracts', sub: 'Live charter book', kind: 'Go to', href: '/go/contracts' },
  { label: 'Projects', sub: 'Field developments and tenders', kind: 'Go to', href: '/go/projects' },
  { label: 'Maps & Layers', sub: 'Live spatial view', kind: 'Go to', href: '/go/maps' },
  { label: 'Market', sub: 'Day-rate benchmarks', kind: 'Go to', href: '/go/market' },
  { label: 'GO AI', sub: 'Commercial agent', kind: 'Go to', href: '/go/ai' },
  { label: 'Alerts', sub: 'Signals and watch rules', kind: 'Go to', href: '/go/alerts' },
  { label: 'My Portfolio', sub: 'Tracked vessels', kind: 'Go to', href: '/go/portfolio' },
  { label: 'API', sub: 'Keys, endpoints and usage', kind: 'Go to', href: '/go/api' },
  { label: 'Account', sub: 'Seats, entitlements and billing', kind: 'Go to', href: '/go/admin' },
];

/** One search box across the whole graph — vessel name, IMO, MMSI, company, project. */
function search(q: string): Hit[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return NAV.slice(0, 8);

  const hits: Hit[] = [];

  NAV.forEach((n) => {
    if (n.label.toLowerCase().includes(needle)) hits.push(n);
  });

  VESSELS.forEach((v) => {
    if (
      v.name.toLowerCase().includes(needle) ||
      v.imo.includes(needle) ||
      v.mmsi.includes(needle)
    ) {
      hits.push({
        label: v.name,
        sub: `${v.subType} (${v.sizeClass}) · IMO ${v.imo} · ${v.region}`,
        kind: 'Vessel',
        href: `/go/fleet/${v.imo}`,
      });
    }
  });

  COMPANIES.forEach((c) => {
    if (c.name.toLowerCase().includes(needle)) {
      hits.push({ label: c.name, sub: `${c.role} · ${c.headquarters}`, kind: 'Company', href: `/go/companies/${c.id}` });
    }
  });

  PROJECTS.forEach((p) => {
    if (p.name.toLowerCase().includes(needle) || p.field.toLowerCase().includes(needle)) {
      hits.push({ label: p.name, sub: `${p.operator} · ${p.phase}`, kind: 'Project', href: `/go/projects#${p.id}` });
    }
  });

  return hits.slice(0, 30);
}

export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const hits = useMemo(() => search(q), [q]);

  useEffect(() => {
    if (open) {
      setQ('');
      setSel(0);
      // Focus after paint so the caret lands in the field.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => setSel(0), [q]);

  if (!open) return null;

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div
      className="go-cmd-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search GO Intelligence"
    >
      <div className="go-cmd" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          value={q}
          placeholder="Search vessel name, company, IMO, MMSI, project…"
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setSel((s) => Math.min(hits.length - 1, s + 1));
            }
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              setSel((s) => Math.max(0, s - 1));
            }
            if (e.key === 'Enter' && hits[sel]) go(hits[sel].href);
          }}
        />
        <div className="go-cmd-results">
          {hits.length === 0 && <div className="go-cmd-empty">Nothing in the graph matches “{q}”.</div>}
          {hits.map((h, i) => (
            <button
              key={`${h.href}-${h.label}-${i}`}
              className={`go-cmd-item ${i === sel ? 'sel' : ''}`}
              onMouseEnter={() => setSel(i)}
              onClick={() => go(h.href)}
            >
              <span>
                <span style={{ display: 'block', color: 'var(--text)' }}>{h.label}</span>
                <span style={{ display: 'block', fontSize: 11.5, color: 'var(--text-3)', marginTop: 2 }}>{h.sub}</span>
              </span>
              <span className="go-cmd-kind">{h.kind}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
