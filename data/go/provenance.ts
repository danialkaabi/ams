import type { Provenance, SourceKind, VerificationState } from './types';
import { VERIFY_THRESHOLD } from './types';

/**
 * Seed helper. In production these records are written by the ingest pipeline
 * (see docs/platform/04-data-pipeline.md); here they are declared inline so the
 * prototype shows the same provenance surface the real product will.
 */
export function prov(
  confidence: number,
  source: SourceKind,
  sourceLabel: string,
  asOf: string,
  verifiedBy?: string,
): Provenance {
  const state: VerificationState = verifiedBy
    ? 'verified'
    : confidence >= VERIFY_THRESHOLD
      ? 'scored'
      : 'unverified';
  return { confidence, source, sourceLabel, asOf, state, verifiedBy };
}

export const SOURCE_LABELS: Record<SourceKind, string> = {
  broker: 'Broker report',
  operator: 'Operator disclosure',
  registry: 'Flag / class registry',
  'public-filing': 'Public filing',
  ais: 'AIS feed',
  analyst: 'GO analyst desk',
  customer: 'Customer submission',
};
