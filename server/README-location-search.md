# Location Search Backend Proxy

The app can call **Nominatim** directly (with 1s debounce, 4-char min, backoff on 509) or use this backend proxy. **For production you should use the proxy with caching** — public Nominatim is ~1 req/s and not for production-scale autocomplete.

## Flow

1. User types in the location field (e.g. "Dubai Marina").
2. After **1s debounce** and **≥4 characters**, the app either:
   - Calls Nominatim directly (current default), or
   - Calls your backend `GET /api/location-search?q=...` if you switch the client to use the proxy.
3. Backend (if used): normalizes query, checks cache, calls Nominatim if miss, caches result (e.g. 5 min TTL), returns JSON array.
4. The app maps results to `EventLocation` and shows a dropdown; on select it stores structured data.

## Recommended: cached proxy (production)

Use the **cached** route to cut 80–90% of Nominatim requests and avoid 509:

```js
const locationSearchCached = require('./location-search-route-cached');
app.get('/api/location-search', locationSearchCached);
```

- **GET** `/api/location-search?q=delhi`
- Query normalized (trim, lowercase) and deduped via cache.
- Cache TTL 5 minutes; adjust `CACHE_TTL_MS` in the file if needed.

## Simple proxy (no cache)

```js
const locationSearchRoute = require('./location-search-route');
app.post('/api/location-search', locationSearchRoute);
```

- **POST** body `{ "query": "..." }`.
- No cache; every request hits Nominatim. Use only for low traffic or with your own rate limiting.

## Nominatim usage policy

- **~1 request per second** on the public server.
- Descriptive **User-Agent** required.
- Public Nominatim is **not** an autocomplete service; for Google-like behavior use a backend proxy + cache, or a provider (e.g. Geoapify, LocationIQ) or self-hosted Photon.

## Files

- `location-search-route.js` – Simple POST proxy (no cache).
- `location-search-route-cached.js` – **GET** proxy with in-memory cache and TTL (recommended for production).
- This README.
