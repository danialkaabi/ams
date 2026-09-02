import type { NextApiRequest, NextApiResponse } from 'next';
import { VESSELS } from '@/data/go/vessels';

interface FleetVessel {
  imo: string;
  mmsi: string;
  name: string;
}

interface FleetResponse {
  vessels: FleetVessel[];
  coverage: {
    trackable: number;
    withIMO: number;
    withMMSI: number;
    unidentifiable: number;
    total: number;
  };
}

export default function handler(req: NextApiRequest, res: NextApiResponse<FleetResponse>) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      vessels: [],
      coverage: {
        trackable: 0,
        withIMO: 0,
        withMMSI: 0,
        unidentifiable: 0,
        total: VESSELS.length,
      },
    });
  }

  // Extract identifiable vessels (IMO or MMSI)
  const vessels: FleetVessel[] = VESSELS.filter((v) => v.imo || v.mmsi).map((v) => ({
    imo: v.imo || '0',
    mmsi: v.mmsi || '0',
    name: v.name,
  }));

  // Calculate coverage
  const withIMO = VESSELS.filter((v) => v.imo && v.imo !== '0').length;
  const withMMSI = VESSELS.filter((v) => v.mmsi && v.mmsi !== '0').length;
  const trackable = VESSELS.filter((v) => (v.imo && v.imo !== '0') || (v.mmsi && v.mmsi !== '0')).length;
  const unidentifiable = VESSELS.length - trackable;

  return res.status(200).json({
    vessels,
    coverage: {
      trackable,
      withIMO,
      withMMSI,
      unidentifiable,
      total: VESSELS.length,
    },
  });
}
