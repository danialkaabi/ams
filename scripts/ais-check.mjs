#!/usr/bin/env node

/**
 * AIS Diagnostic Tool
 * Walks the AIS pipeline and reports the first failure with fixes.
 *
 * Usage:
 *   node scripts/ais-check.mjs                    # Check dev server
 *   AIS_ENDPOINT=https://platform.example.com/api/positions node scripts/ais-check.mjs  # Check prod
 */

import http from 'http';
import https from 'https';

const API_ENDPOINT = process.env.AIS_ENDPOINT || 'http://localhost:3000/api/positions';
const INGEST_SECRET = process.env.AIS_INGEST_SECRET || 'dev-secret-key';

function request(url, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const client = u.protocol === 'https:' ? https : http;

    const req = client.request(u, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
    });

    let data = '';
    req.on('response', (res) => {
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ status: res.statusCode, body: data });
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function check() {
  console.log('\n📡 AIS Pipeline Diagnostic\n');
  console.log(`Endpoint: ${API_ENDPOINT}`);
  console.log(`Secret: ${INGEST_SECRET}\n`);

  // Step 1: Check endpoint reachability
  console.log('Step 1: Endpoint reachability...');
  try {
    const res = await request(API_ENDPOINT, 'GET');
    if (res.status === 200 || res.status === 405) {
      console.log('✓ Endpoint is reachable');
    } else if (res.status === 404) {
      console.error('✗ Endpoint not found (404)');
      console.error('  → Ensure /api/positions endpoint exists on the server');
      process.exit(1);
    } else {
      console.error(`✗ Server error: ${res.status}`);
      console.error(`  Body: ${res.body.slice(0, 200)}`);
      process.exit(1);
    }
  } catch (e) {
    console.error(`✗ Cannot reach endpoint: ${e.message}`);
    console.error(`  → Check the server is running and URL is correct`);
    process.exit(1);
  }

  // Step 2: Ingest a test position
  console.log('\nStep 2: Testing ingest (POST)...');
  const testPayload = {
    positions: [
      {
        mmsi: 123456789,
        imo: '9999999',
        name: 'Test Vessel',
        category: 'OSV',
        lat: 27.9,
        lon: 49.15,
        speedKn: 2.5,
        headingDeg: 118,
        updated: Date.now(),
      },
    ],
    secret: INGEST_SECRET,
  };

  try {
    const res = await request(API_ENDPOINT, 'POST', testPayload);
    if (res.status === 200 || res.status === 201) {
      console.log('✓ Position ingested successfully');
    } else if (res.status === 401) {
      console.error('✗ Secret rejected (401)');
      console.error(`  → Set AIS_INGEST_SECRET in .env.local or environment`);
      console.error(`  → Current secret: ${INGEST_SECRET}`);
      process.exit(1);
    } else {
      console.error(`✗ Ingest failed: ${res.status}`);
      console.error(`  Body: ${res.body.slice(0, 200)}`);
      process.exit(1);
    }
  } catch (e) {
    console.error(`✗ Ingest failed: ${e.message}`);
    process.exit(1);
  }

  // Step 3: Retrieve positions
  console.log('\nStep 3: Testing retrieval (GET)...');
  try {
    const res = await request(API_ENDPOINT, 'GET');
    if (res.status === 200) {
      const data = JSON.parse(res.body);
      const count = Array.isArray(data.positions) ? data.positions.length : 0;
      console.log(`✓ Retrieved ${count} position(s)`);
      if (count > 0) {
        const latest = data.positions[0];
        console.log(`  Latest: ${latest.name} (MMSI ${latest.mmsi}) at ${latest.lat.toFixed(4)}°N ${latest.lon.toFixed(4)}°E`);
      }
    } else {
      console.error(`✗ Retrieval failed: ${res.status}`);
      console.error(`  Body: ${res.body.slice(0, 200)}`);
      process.exit(1);
    }
  } catch (e) {
    console.error(`✗ Retrieval failed: ${e.message}`);
    process.exit(1);
  }

  console.log('\n✅ All checks passed! AIS pipeline is working.\n');
  console.log('Next steps:');
  console.log('  1. Start the worker: MOCK_AIS=1 npm run ais');
  console.log('  2. In another terminal: npm run dev');
  console.log('  3. Open http://localhost:3000/go/maps to see live positions');
}

check().catch((e) => {
  console.error(`\n✗ Fatal error: ${e.message}`);
  process.exit(1);
});
