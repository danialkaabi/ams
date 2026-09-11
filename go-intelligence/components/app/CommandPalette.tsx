'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NAV_FLAT } from './nav';
import { IconSearch } from '@/components/ui/Icons';

/**
 * ⌘K navigator. Searches screens today; once records exist it is the
 * natural place to search vessels, companies and IMO numbers too.
 */
export default function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return NAV_FLAT;
    return NAV_FLAT.filter(
      (i) =>
        i.label.toLowerCase().includes(needle) ||
        i.group.toLowerCase().includes(needle),
    );
  }, [q]);

  useEffect(() => {
    if (open) {
      setQ('');
      setActive(0);
      // Focus after paint so the field is ready for the next keystroke.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      } else if (e.key === 'Enter') {
        const target = results[active];
        if (target) {
          router.push(target.href);
          onClose();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, results, active, router, onClose]);

  if (!open) return null;

  return (
    <div
      className="palette-scrim"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div className="palette" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          className="input palette-input"
          placeholder="Search vessel name, company, IMO, MMSI…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
        />
        <div className="palette-list">
          {results.length === 0 ? (
            <div className="palette-empty">
              No match for “{q}”.
              <br />
              <span style={{ fontSize: 12 }}>
                Vessel and company search activates once records are added.
              </span>
            </div>
          ) : (
            results.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  className={`palette-item${i === active ? ' is-active' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => {
                    router.push(item.href);
                    onClose();
                  }}
                >
                  <Icon size={15} />
                  {item.label}
                  <span className="palette-item-group">{item.group}</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

/** Small helper so the topbar and any screen can open the palette. */
export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return { open, setOpen };
}

export { IconSearch };
