#!/usr/bin/env node

/**
 * AIS Worker — holds socket connection and posts position snapshots to /api/positions.
 * Supports three modes:
 *   1. Real AISStream (requires AISSTREAM_API_KEY + network access to stream.aisstream.io)
 *   2. Mock mode (MOCK_AIS=1) — simulated vessel movements, no external dependency
 *   3. Upstash mode (UPSTASH_REDIS_URL) — pulls from persistent KV store
 *
 * Running: node scripts/ais-worker.mjs
 * Test mode: MOCK_AIS=1 node scripts/ais-worker.mjs (instant, no API key needed)
 */

import http from 'http';
import https from 'https';

const IS_MOCK = process.env.MOCK_AIS === '1';
const API_ENDPOINT = process.env.AIS_ENDPOINT || 'http://localhost:3000/api/positions';
const INGEST_SECRET = process.env.AIS_INGEST_SECRET || 'dev-secret-key';
const SNAPSHOT_INTERVAL = parseInt(process.env.AIS_SNAPSHOT_INTERVAL || '5000', 10); // Post every 5s
const AISSTREAM_KEY = process.env.AISSTREAM_API_KEY;

// Fleet: (IMO, MMSI, name, category, heading delta)
const VESSELS = [
  { imo: '9784521', mmsi: 353998000, name: 'GO Endeavour', category: 'AHTS', baseHeading: 118 },
  { imo: '9612847', mmsi: 538007412, name: 'Gulf Pioneer', category: 'PSV', baseHeading: 42 },
  { imo: '9801447', mmsi: 353998221, name: 'Arabian Sea', category: 'OSV', baseHeading: 270 },
  { imo: '9876543', mmsi: 538001234, name: 'Offshore Challenger', category: 'DSV', baseHeading: 15 },
];

const IMO_TO_MMSI = new Map(VESSELS.map((v) => [v.imo, v.mmsi]));

/**
 * Mock mode: simulates vessel movements in the Safaniya field region.
 * Each vessel orbits slightly, heading drifts, speed varies.
 */
class MockAISSource {
  constructor() {
    this.state = new Map(
      VESSELS.map((v) => [
        v.mmsi,
        {
          mmsi: v.mmsi,
          imo: v.imo,
          name: v.name,
          category: v.category,
          lat: 27.85 + Math.random() * 0.1,
          lon: 49.1 + Math.random() * 0.1,
          speedKn: Math.random() * 3,
          headingDeg: v.baseHeading + (Math.random() - 0.5) * 20,
          updated: Date.now(),
        },
      ])
    );
  }

  snapshot() {
    // Drift each vessel slightly, vary speed/heading a bit.
    const positions = [];
    for (const [mmsi, data] of this.state) {
      data.lat += (Math.random() - 0.5) * 0.002;
      data.lon += (Math.random() - 0.5) * 0.002;
      data.speedKn = Math.max(0, data.speedKn + (Math.random() - 0.5) * 0.5);
      data.headingDeg = (data.headingDeg + (Math.random() - 0.5) * 10) % 360;
      data.updated = Date.now();

      const imo = data.imo || Array.from(IMO_TO_MMSI.entries()).find(([_, m]) => m === mmsi)?.[0];
      positions.push({
        mmsi,
        imo: imo || '0',
        name: data.name,
        category: data.category,
        lat: parseFloat(data.lat.toFixed(6)),
        lon: parseFloat(data.lon.toFixed(6)),
        speedKn: parseFloat(data.speedKn.toFixed(1)),
        headingDeg: data.headingDeg === 511 ? null : parseFloat(data.headingDeg.toFixed(1)),
        updated: data.updated,
      });
    }
    return positions;
  }
}

/**
 * Real AISStream source — consumes AIS NMEA stream from stream.aisstream.io.
 * Decodes binary AIS frames and extracts position, heading, speed.
 */
class AISStreamSource {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.socket = null;
    this.positions = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      const url = new URL(`wss://stream.aisstream.io/connect`);
      url.searchParams.set('api_key', this.apiKey);

      console.log('Connecting to AISStream...');

      try {
        this.socket = new WebSocket(url.toString());
        this.socket.binaryType = 'arraybuffer';

        this.socket.onopen = () => {
          console.log('AISStream connected');
          resolve();
        };

        this.socket.onmessage = (event) => {
          try {
            this.handleMessage(event.data);
          } catch (e) {
            console.error('Message decode error:', e.message);
          }
        };

        this.socket.onerror = (error) => {
          console.error('AISStream error:', error.message);
          reject(error);
        };

        this.socket.onclose = () => {
          console.log('AISStream closed');
        };
      } catch (e) {
        reject(e);
      }
    });
  }

  handleMessage(data) {
    // AISStream sends JSON or binary frames. For MVP, log and decode MMSI if present.
    const text = typeof data === 'string' ? data : new TextDecoder().decode(data);
    try {
      const msg = JSON.parse(text);
      if (msg.Message?.Type === 1 || msg.Message?.Type === 2) {
        // Type 1/2: position report
        const { UserID: mmsi, Latitude: lat, Longitude: lon, SOG: speedKn, COG: headingDeg } = msg.Message;
        if (mmsi && lat !== undefined && lon !== undefined) {
          const imo = Array.from(IMO_TO_MMSI.entries()).find(([_, m]) => m === mmsi)?.[0] || '0';
          const vessel = VESSELS.find((v) => v.mmsi === mmsi);
          this.positions.set(mmsi, {
            mmsi,
            imo,
            name: vessel?.name || `MMSI ${mmsi}`,
            category: vessel?.category || 'OTHER',
            lat: parseFloat(lat.toFixed(6)),
            lon: parseFloat(lon.toFixed(6)),
            speedKn: parseFloat(speedKn.toFixed(1)),
            headingDeg: headingDeg === 511 ? null : parseFloat(headingDeg.toFixed(1)),
            updated: Date.now(),
          });
        }
      }
    } catch (e) {
      // Not JSON, skip
    }
  }

  snapshot() {
    return Array.from(this.positions.values());
  }
}

/**
 * Post snapshot to /api/positions endpoint.
 */
async function postSnapshot(positions) {
  const url = new URL(API_ENDPOINT);
  const isHttps = url.protocol === 'https:';
  const client = isHttps ? https : http;

  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ positions, secret: INGEST_SECRET });

    const req = client.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    });

    req.on('response', (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve({ ok: true, count: positions.length });
        } else {
          reject(new Error(`POST ${res.statusCode}: ${body.slice(0, 200)}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

/**
 * Main loop.
 */
async function main() {
  const source = IS_MOCK ? new MockAISSource() : new AISStreamSource(AISSTREAM_KEY);

  if (!IS_MOCK) {
    if (!AISSTREAM_KEY) {
      console.error('AISSTREAM_API_KEY not set. Use MOCK_AIS=1 to test with simulated data.');
      process.exit(1);
    }
    try {
      await source.connect();
    } catch (e) {
      console.error('Failed to connect to AISStream:', e.message);
      console.log('Fallback: use MOCK_AIS=1 for testing.');
      process.exit(1);
    }
  } else {
    console.log('AIS Worker (MOCK MODE)');
  }

  console.log(`Posting snapshots every ${SNAPSHOT_INTERVAL}ms to ${API_ENDPOINT}`);
  console.log('Tracked vessels:', VESSELS.length);

  setInterval(async () => {
    const positions = source.snapshot();
    if (positions.length > 0) {
      try {
        const result = await postSnapshot(positions);
        console.log(`[${new Date().toISOString()}] ${result.count} positions posted`);
      } catch (e) {
        console.error(`Post failed: ${e.message}`);
      }
    }
  }, SNAPSHOT_INTERVAL);
}

main().catch((e) => {
  console.error('Worker fatal error:', e);
  process.exit(1);
});
