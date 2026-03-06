/**
 * OpenStreetMap Nominatim location search proxy route.
 *
 * Use this in your Node/Express backend so the frontend never calls Nominatim
 * directly (Nominatim requires a valid User-Agent and rate limits apply).
 *
 * Add to your Express app, e.g.:
 *   const locationSearchRoute = require('./location-search-route');
 *   app.post('/api/location-search', locationSearchRoute);
 *
 * Request: POST /api/location-search
 * Body:    { "query": "search string" }
 *
 * Response: JSON array of Nominatim result objects (same shape as Nominatim API).
 */

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'RallyApp/1.0 (Event location search)';

module.exports = async function locationSearchHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const query = typeof req.body?.query === 'string' ? req.body.query.trim() : '';
  if (!query) {
    return res.status(400).json({ error: 'Missing or invalid "query"' });
  }

  const params = new URLSearchParams({
    q: query,
    format: 'json',
    addressdetails: '1',
    limit: '5',
  });
  const url = `${NOMINATIM_URL}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('[location-search] Nominatim error', response.status, text);
      return res.status(502).json({
        error: 'Location service temporarily unavailable',
      });
    }

    const data = await response.json();
    return res.json(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error('[location-search] Proxy error', err);
    return res.status(502).json({
      error: 'Failed to search location',
    });
  }
};
