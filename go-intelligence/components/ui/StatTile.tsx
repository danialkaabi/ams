type Accent = 'blue' | 'gold' | 'green' | 'amber' | 'red';

/**
 * A headline figure. When `value` is undefined the tile renders its
 * zero-state rather than a zero — an empty platform should read as
 * "nothing recorded yet", never as "we measured zero".
 */
export default function StatTile({
  label,
  value,
  foot,
  accent = 'blue',
  empty = false,
}: {
  label: string;
  value: string | number;
  foot?: React.ReactNode;
  accent?: Accent;
  empty?: boolean;
}) {
  return (
    <div className={`stat stat--${accent}`}>
      <div className="stat-label">{label}</div>
      <div className={`stat-value${empty ? ' stat-value--empty' : ''}`}>{value}</div>
      {foot && <div className="stat-foot">{foot}</div>}
    </div>
  );
}
