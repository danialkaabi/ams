import type { Project } from './types';

/**
 * GO PROJECTS — field developments, EPC awards and the tender pipeline.
 *
 * Empty by design. Add projects here and the phase pipeline, CAPEX
 * totals and vessel-demand forecast populate.
 *
 * Minimum required fields: id, name, operator, region, phase.
 * See data/types.ts for the full schema.
 */
export const PROJECTS: Project[] = [];

export function getProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}
