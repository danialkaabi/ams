import type { ReactNode } from 'react';

/** A bordered surface with an optional mono-set header and actions. */
export default function Panel({
  title,
  action,
  children,
  padded = false,
  className = '',
  style,
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  padded?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <section className={`panel ${className}`} style={style}>
      {(title || action) && (
        <header className="panel-head">
          {typeof title === 'string' ? (
            <h2 className="panel-title">{title}</h2>
          ) : (
            title
          )}
          {action}
        </header>
      )}
      <div className={padded ? 'panel-body' : undefined}>{children}</div>
    </section>
  );
}
