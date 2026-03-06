/**
 * Nominatim location search proxy WITH IN-MEMORY CACHE.
 * Use this in production to cut 80–90% of Nominatim requests and avoid 509 rate limits.
 *
 * GET /api/location-search?q=...
 * - Normalizes query (trim, lowerCase).
 * - Returns cached result if present.
 * - Otherwise calls Nominatim, caches, and returns. TTL 5 minutes.
 */

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'RallyApp/1.0 (Event location search)';
const CACHE_TTL_MS = 5 * 60 * 1000;

const cache = new Map();

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCached(key, data) {
  cache.set(key, {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
  setTimeout(() => cache.delete(key), CACHE_TTL_MS);
}

module.exports = async function locationSearchHandlerCached(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const raw = typeof req.query?.q === 'string' ? req.query.q : '';
  const q = raw.trim().toLowerCase();
  if (!q || q.length < 3) {
    return res.json([]);
  }

  const cacheKey = q;
  const cached = getCached(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  try {
    const url = `${NOMINATIM_URL}?${new URLSearchParams({
      q: raw.trim(),
      format: 'json',
      addressdetails: '1',
      limit: '5',
    }).toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      console.error('[location-search] Nominatim error', response.status);
      return res.status(502).json({ error: 'Upstream failed' });
    }

    const data = await response.json();
    const results = Array.isArray(data) ? data : [];
    setCached(cacheKey, results);
    return res.json(results);
  } catch (err) {
    console.error('[location-search] Proxy error', err);
    return res.status(500).json({ error: 'Search failed' });
  }
};
