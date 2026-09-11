type Tone = 'blue' | 'green' | 'amber' | 'red' | 'gold' | 'grey';

/** Status pill. `dot` adds the small leading indicator. */
export default function Badge({
  children,
  tone = 'grey',
  dot = false,
}: {
  children: React.ReactNode;
  tone?: Tone;
  dot?: boolean;
}) {
  return (
    <span className={`badge badge--${tone}`}>
      {dot && <span className="dot" />}
      {children}
    </span>
  );
}

/** Maps a commercial status string onto a tone, so status colour stays
 *  consistent everywhere it appears. */
export function statusTone(status?: string): Tone {
  switch (status) {
    case 'On Hire':
    case 'Active':
    case 'Underway / On DP':
    case 'First Oil':
      return 'green';
    case 'Expiring Soon':
    case 'Renewal Due':
    case 'Standby':
    case 'Transit':
    case 'Mobilising':
    case 'Tender':
      return 'amber';
    case 'Off Hire':
    case 'Overdue Renewal':
    case 'Laid Up':
      return 'red';
    case 'Awarded':
    case 'Execution':
    case 'In Port':
      return 'blue';
    default:
      return 'grey';
  }
}
