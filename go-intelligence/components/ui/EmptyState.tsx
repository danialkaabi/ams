import Link from 'next/link';
import { IconPlus } from './Icons';

/**
 * The platform ships with no records, so empty states are the first
 * thing anyone sees on most screens. Each one does three jobs: says what
 * the screen is for, shows the fields a record carries, and points at the
 * file where records are added.
 */
export default function EmptyState({
  icon,
  title,
  body,
  fields,
  file,
  primaryHref,
  primaryLabel,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  /** Field names a record of this type expects. */
  fields?: string[];
  /** The module the user edits to add records, e.g. "data/vessels.ts". */
  file?: string;
  primaryHref?: string;
  primaryLabel?: string;
}) {
  return (
    <div className="empty">
      <div className="empty-mark">{icon}</div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-body">{body}</p>

      {(primaryHref || file) && (
        <div className="empty-actions">
          {primaryHref && (
            <Link href={primaryHref} className="btn btn--primary btn--sm">
              <IconPlus size={14} />
              {primaryLabel ?? 'Add records'}
            </Link>
          )}
          {file && (
            <span className="btn btn--quiet btn--sm mono" style={{ cursor: 'default' }}>
              {file}
            </span>
          )}
        </div>
      )}

      {fields && fields.length > 0 && (
        <div className="schema-hint">
          <div className="schema-hint-label">Each record carries</div>
          <div className="schema-chips">
            {fields.map((f) => (
              <span key={f} className="schema-chip">
                {f}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
