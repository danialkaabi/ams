import type { NextApiRequest, NextApiResponse } from 'next';

const INGEST_SECRET = process.env.AIS_INGEST_SECRET || 'dev-secret-key';
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

interface Position {
  mmsi: number;
  imo: string;
  name: string;
  category: string;
  lat: number;
  lon: number;
  speedKn: number;
  headingDeg: number | null;
  updated: number;
}

interface PositionsResponse {
  positions: Position[];
  source: 'memory' | 'upstash' | 'empty';
  timestamp: number;
}

// In-memory storage for development (lost on restart)
let positionsStore: Position[] = [];

/**
 * GET /api/positions — Retrieve latest position snapshot
 * POST /api/positions — Ingest new positions (requires AIS_INGEST_SECRET)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<PositionsResponse | { error: string }>) {
  if (req.method === 'GET') {
    return handleGet(res);
  } else if (req.method === 'POST') {
    return handlePost(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGet(res: NextApiResponse<PositionsResponse | { error: string }>) {
  // Try Upstash first (serverless), fall back to memory (dev)
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      const result = await fetch(`${UPSTASH_URL}/get/ais:positions`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      });

      if (result.ok) {
        const { result: data } = await result.json();
        const positions = data ? JSON.parse(data) : [];
        return res.status(200).json({
          positions,
          source: 'upstash',
          timestamp: Date.now(),
        });
      }
    } catch (e) {
      console.error('Upstash GET failed:', (e as Error).message);
      // Fall through to memory
    }
  }

  // Return from memory (dev mode)
  return res.status(200).json({
    positions: positionsStore,
    source: 'memory',
    timestamp: Date.now(),
  });
}

async function handlePost(req: NextApiRequest, res: NextApiResponse<PositionsResponse | { error: string }>) {
  const { positions, secret } = req.body;

  // Validate secret
  if (secret !== INGEST_SECRET) {
    return res.status(401).json({ error: 'Unauthorized: invalid secret' });
  }

  if (!Array.isArray(positions)) {
    return res.status(400).json({ error: 'Positions must be an array' });
  }

  // Validate each position
  for (const p of positions) {
    if (typeof p.mmsi !== 'number' || typeof p.lat !== 'number' || typeof p.lon !== 'number') {
      return res.status(400).json({ error: 'Invalid position format' });
    }
  }

  // Store to Upstash if available (serverless), otherwise memory (dev)
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      const result = await fetch(`${UPSTASH_URL}/set/ais:positions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
        body: JSON.stringify(JSON.stringify(positions)),
      });

      if (result.ok) {
        return res.status(201).json({
          positions,
          source: 'upstash',
          timestamp: Date.now(),
        });
      }
    } catch (e) {
      console.error('Upstash SET failed:', (e as Error).message);
      // Fall through to memory
    }
  }

  // Store to memory (dev mode)
  positionsStore = positions;
  return res.status(201).json({
    positions,
    source: 'memory',
    timestamp: Date.now(),
  });
}
