/** Standard page header for app screens: title, one line of orientation,
 *  and the actions that belong to the screen. */
export default function PageHead({
  eyebrow,
  title,
  sub,
  actions,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="page-head">
      <div style={{ minWidth: 0 }}>
        {eyebrow && (
          <span className="eyebrow" style={{ marginBottom: 9 }}>
            {eyebrow}
          </span>
        )}
        <h1 className="page-title">{title}</h1>
        {sub && <p className="page-sub">{sub}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </header>
  );
}
