import Link from 'next/link';

/**
 * The Gemini Offshore / GO Intelligence lockup.
 *
 * The wide-tracked uppercase setting is the brand's most recognisable
 * signature — it is how both marks are set throughout the strategy book,
 * and it is reproduced here rather than reinterpreted.
 */
export default function Wordmark({
  href = '/',
  size = 'md',
  stacked = true,
}: {
  href?: string | null;
  size?: 'sm' | 'md' | 'lg';
  stacked?: boolean;
}) {
  const markClass =
    size === 'lg' ? 'wordmark wordmark--lg' : size === 'sm' ? 'wordmark wordmark--sm' : 'wordmark';

  const inner = (
    <span className="stack" style={{ gap: stacked ? 3 : 0 }}>
      <span className={markClass} style={{ fontSize: size === 'md' ? 13 : undefined }}>
        GO Intelligence
      </span>
      {stacked && (
        <span className="shell-brand-sub">Gemini Offshore</span>
      )}
    </span>
  );

  if (!href) return inner;
  return (
    <Link href={href} aria-label="GO Intelligence — home">
      {inner}
    </Link>
  );
}
