# AIS Pipeline Setup Guide

This guide walks you through setting up live vessel position tracking using the AIS (Automatic Identification System) pipeline.

## Overview

The AIS pipeline has three parts:
1. **Worker** — Collects vessel positions (from mock data, AISStream, or another source) and posts them to the API
2. **API** — Stores and serves positions via `/api/positions` and fleet metadata via `/api/fleet`
3. **Client** — Fetches positions in real time via React hooks

Two modes available:
- **Mock mode** (MOCK_AIS=1) — Simulated vessel movements, instant setup, no API key needed
- **Real mode** — Live AIS from stream.aisstream.io or your own provider

## Quick Start (5 minutes, mock mode)

### 1. Copy env template
```bash
cp .env.local.example .env.local
```

### 2. Set mock mode
Edit `.env.local`:
```
MOCK_AIS=1
AIS_INGEST_SECRET=dev-secret-key
```

### 3. Install dependencies
```bash
npm install
```

### 4. Run the diagnostic
```bash
node scripts/ais-check.mjs
```

You should see:
```
Step 1: Endpoint reachability...
✓ Endpoint is reachable

Step 2: Testing ingest (POST)...
✓ Position ingested successfully

Step 3: Testing retrieval (GET)...
✓ Retrieved 1 position(s)

✅ All checks passed! AIS pipeline is working.
```

### 5. Start the system
Terminal 1 — Start the dev server:
```bash
npm run dev
```

Terminal 2 — Start the worker:
```bash
MOCK_AIS=1 npm run ais
```

You should see:
```
AIS Worker (MOCK MODE)
Posting snapshots every 5000ms to http://localhost:3000/api/positions
Tracked vessels: 4

[2026-09-02T12:34:56.789Z] 4 positions posted
[2026-09-02T12:35:01.789Z] 4 positions posted
...
```

### 6. Verify in the browser
1. Open http://localhost:3000/go/maps
2. Look at the "ACTIVE VESSELS" table — it should show live positions updating every 5 seconds
3. Check the browser console for any errors

## Switching to Real AIS (with AISStream API key)

### 1. Get an AISStream API key
Sign up for free at https://www.aisstream.io/ to get your `STREAM_API_KEY`.

### 2. Update .env.local
```
AISSTREAM_API_KEY=your-key-from-aisstream
MOCK_AIS=  # empty to disable mock mode
AIS_INGEST_SECRET=your-production-secret
```

### 3. Start the worker (real mode)
```bash
npm run ais
```

The worker will:
1. Connect to `stream.aisstream.io`
2. Decode real AIS NMEA frames
3. Extract position, heading, speed
4. Post to `/api/positions` every 5 seconds

### 4. Monitor with the diagnostic
In another terminal:
```bash
node scripts/ais-check.mjs
```

Troubleshooting:
- **Connection refused**: Check that `stream.aisstream.io` is reachable and your API key is valid
- **No positions**: AIS stream takes time to accumulate position reports; wait 30 seconds and check again
- **Switch back to mock**: Set `MOCK_AIS=1` and restart the worker

## Deployment Setup

### Railway / Render / Heroku / Fly

The `Procfile` declares both web and worker processes:
```
web: npm start
worker: MOCK_AIS='' node scripts/ais-worker.mjs
```

Set these environment variables in your platform's dashboard:
- `AISSTREAM_API_KEY` — Your AISStream key
- `AIS_INGEST_SECRET` — A strong random secret (generate with `openssl rand -hex 16`)
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` — For persistent storage across restarts (optional but recommended for production)

### Vercel (Serverless)

Vercel cannot run the worker process directly. Instead:

**Option A: Use a separate deployment for the worker**
- Deploy web app to Vercel (only the Next.js app, not the worker)
- Deploy worker to Railway/Render with the same `AIS_INGEST_SECRET` and `AIS_ENDPOINT=https://your-vercel-url/api/positions`

**Option B: Use Upstash Redis + polling from Vercel Functions**
- Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in Vercel
- Deploy worker to a sidecar service (Railway, Render, EC2, etc.)
- Both will read/write to the same Redis instance

**Recommended:** Option A for simplicity. The worker runs continuously on Railway/Render and posts to your Vercel app.

## Architecture

### Files

```
scripts/
  ais-worker.mjs          # Collects positions, posts to /api/positions
  ais-check.mjs           # Diagnostic tool

pages/api/
  positions.ts            # GET: fetch positions | POST: ingest new positions
  fleet.ts                # GET: list trackable vessels and coverage stats

data/
  ais-live.ts             # usePositions() hook for React components

Procfile                  # Declares web + worker processes for deployment
.env.local.example        # Environment variable template
```

### Flow

```
AIS Source (mock or real)
    ↓
Worker (ais-worker.mjs)
    ↓ posts every 5s
API Ingest (/api/positions POST)
    ↓ stores in memory or Upstash
Persistent Store (memory or KV)
    ↓
Browser polls /api/positions GET every 5s
    ↓
React component receives positions
    ↓
Map updates with live vessel positions
```

### Storage

**Development (in-memory):**
- Positions stored in memory on the API server
- Lost on restart (fine for testing)
- Supports single server only

**Production (Upstash Redis):**
- Positions stored in a managed Redis instance
- Survives restarts and scales across multiple API servers
- Free tier available at https://upstash.com/

## Vessel Coverage

Run `node scripts/ais-check.mjs` to see detailed fleet stats. Currently:
- 294 vessels trackable by IMO or MMSI
- 601 vessels with no identifier (can be tracked once AIS reports them)

The worker matches positions strictly:
1. First by IMO (exact match in seed data)
2. Then by MMSI (only if already known to the system)
3. Unknown MMSI reports are captured but labeled as "MMSI {number}"

## Endpoints

### GET /api/positions
Returns latest position snapshot.

```json
{
  "positions": [
    {
      "mmsi": 353998000,
      "imo": "9784521",
      "name": "GO Endeavour",
      "category": "AHTS",
      "lat": 27.901234,
      "lon": 49.151234,
      "speedKn": 2.5,
      "headingDeg": 118,
      "updated": 1725356096789
    }
  ],
  "source": "memory",
  "timestamp": 1725356100000
}
```

### POST /api/positions
Ingest new positions. Requires `AIS_INGEST_SECRET` in body.

```json
{
  "positions": [
    {
      "mmsi": 353998000,
      "imo": "9784521",
      "name": "GO Endeavour",
      "category": "AHTS",
      "lat": 27.901234,
      "lon": 49.151234,
      "speedKn": 2.5,
      "headingDeg": 118,
      "updated": 1725356096789
    }
  ],
  "secret": "your-ais-ingest-secret"
}
```

### GET /api/fleet
Returns fleet metadata and coverage stats.

```json
{
  "vessels": [
    {
      "imo": "9784521",
      "mmsi": "353998000",
      "name": "GO Endeavour"
    }
  ],
  "coverage": {
    "trackable": 294,
    "withIMO": 294,
    "withMMSI": 119,
    "unidentifiable": 601,
    "total": 895
  }
}
```

## Troubleshooting

### No positions appearing on the map

1. **Check the worker is running:**
   ```bash
   ps aux | grep ais-worker
   ```
   Should show the worker process. If not, restart it.

2. **Check the ingest is working:**
   ```bash
   node scripts/ais-check.mjs
   ```
   All three steps should pass. If not, fix the error it reports.

3. **Check the browser console:**
   http://localhost:3000 → F12 → Console
   Look for errors in fetching `/api/positions`.

4. **Check the worker logs:**
   Look for "positions posted" messages. If not, the worker may be failing silently.

### Positions stuck or stale

1. **Check the timestamp:**
   Fetch http://localhost:3000/api/positions in your browser
   The `timestamp` field should be recent (within last 5 seconds).
   If it's old, the worker isn't running.

2. **Restart both services:**
   ```bash
   # Terminal 1: Ctrl+C to stop dev server
   npm run dev
   
   # Terminal 2: Ctrl+C to stop worker
   MOCK_AIS=1 npm run ais
   ```

### "Cannot reach endpoint" error from worker

The worker tried to POST to `/api/positions` and failed.

1. **Check the URL:**
   Default is `http://localhost:3000/api/positions`
   If running on a different port, set `AIS_ENDPOINT` in `.env.local`

2. **Check the dev server is running:**
   ```bash
   curl http://localhost:3000/api/positions
   ```
   Should return JSON, not "connection refused".

3. **Check the secret:**
   The worker posts with `secret: AIS_INGEST_SECRET` in the body.
   Make sure `.env.local` has the same value on both sides:
   ```
   AIS_INGEST_SECRET=your-secret-here
   ```

### AISStream connection failed

If using real AIS and the worker fails:
1. Check your API key is correct
2. Check stream.aisstream.io is not down (check their status page)
3. Check your network allows outbound HTTPS to aisstream.io
4. Fall back to mock mode (`MOCK_AIS=1`) to verify the rest of the pipeline works

## Next Steps

Once positions are live:
1. **Integrate with the Maps module** — Build a MapLibre-based live map using the position data
2. **Add geofencing** — Detect when vessels enter/leave zones (Safaniya field, port areas, etc.)
3. **Historical playback** — Archive positions and replay vessel movements for analysis
4. **Alerts** — Notify when a vessel's position, speed, or heading changes dramatically

## Questions?

Check the diagnostic first:
```bash
node scripts/ais-check.mjs
```

It walks the entire pipeline and names the first failure with a fix.
