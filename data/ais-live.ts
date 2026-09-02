/**
 * Real-time AIS position subscription
 * Polls /api/positions and merges updates into vessel records.
 * Matching: IMO first (strict), MMSI only if already known in fleet.
 */

export interface LivePosition {
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

export interface PositionSnapshot {
  positions: LivePosition[];
  source: 'memory' | 'upstash' | 'empty';
  timestamp: number;
}

let pollInterval: NodeJS.Timeout | null = null;
let subscribers: ((snapshot: PositionSnapshot) => void)[] = [];

/**
 * Subscribe to position updates. Callback fires on each poll (every 5s by default).
 */
export function subscribeToPositions(callback: (snapshot: PositionSnapshot) => void): () => void {
  subscribers.push(callback);

  // Start polling if not already running
  if (!pollInterval) {
    startPolling();
  }

  // Return unsubscribe function
  return () => {
    subscribers = subscribers.filter((c) => c !== callback);
    if (subscribers.length === 0) {
      stopPolling();
    }
  };
}

function startPolling() {
  const poll = async () => {
    try {
      const res = await fetch('/api/positions', {
        cache: 'no-store',
      });
      if (res.ok) {
        const snapshot: PositionSnapshot = await res.json();
        subscribers.forEach((cb) => cb(snapshot));
      }
    } catch (e) {
      console.error('Position poll failed:', e);
    }
  };

  poll(); // Initial poll immediately
  pollInterval = setInterval(poll, 5000); // Then every 5s
}

function stopPolling() {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
}

/**
 * Fetch positions once (no subscription).
 */
export async function fetchPositions(): Promise<LivePosition[]> {
  try {
    const res = await fetch('/api/positions', { cache: 'no-store' });
    if (res.ok) {
      const data: PositionSnapshot = await res.json();
      return data.positions;
    }
  } catch (e) {
    console.error('Fetch positions failed:', e);
  }
  return [];
}
