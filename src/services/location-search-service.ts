import type { EventLocation, LocationSuggestionResponse } from '@app-types/location.types';
import { logger } from '@dev-tools/logger';

const NOMINATIM_SEARCH_URL = 'https://nominatim.openstreetmap.org/search';
const NOMINATIM_USER_AGENT = 'RallyApp/1.0 (Event location search)';

/** Backoff after 429/509: do not call Nominatim for this many ms. No automatic retry. */
const RATE_LIMIT_BACKOFF_MS = 4000;

let rateLimitBlockedUntil = 0;

/**
 * Maps a Nominatim-style response item to our structured EventLocation.
 * Extracts address fields from the address object.
 */
export function mapSuggestionToEventLocation(item: LocationSuggestionResponse): EventLocation {
  const addr = item.address ?? {};
  const city = addr.city ?? addr.town ?? addr.village ?? addr.suburb;
  const state = addr.state;
  const country = addr.country;
  const postalCode = addr.postcode;

  const name =
    addr.name ??
    ([addr.road, addr.house_number].filter(Boolean).join(' ') ||
      item.display_name.split(',')[0]?.trim() ||
      item.display_name);

  const boundingBox = item.boundingbox
    ? (item.boundingbox.map((s) => parseFloat(s)) as [number, number, number, number])
    : undefined;

  return {
    name,
    displayName: item.display_name,
    latitude: parseFloat(item.lat),
    longitude: parseFloat(item.lon),
    city,
    state,
    country,
    postalCode,
    placeId: item.place_id,
    boundingBox,
    geojson: item.geojson,
  };
}

export interface LocationSearchParams {
  query: string;
  signal?: AbortSignal;
}

/**
 * Search for locations using OpenStreetMap Nominatim API directly.
 * Public Nominatim is ~1 req/s and not for production; use a backend proxy + cache for production.
 *
 * - Debounce 1s, min 4 chars, AbortController to cancel previous request.
 * - On 429/509 we back off and do NOT retry for RATE_LIMIT_BACKOFF_MS.
 */
export async function searchLocation(params: {
  query: string;
  signal?: AbortSignal;
}): Promise<EventLocation[]> {
  const { query, signal } = params;
  const trimmed = query.trim();
  if (trimmed.length === 0) {
    return [];
  }

  const now = Date.now();
  if (now < rateLimitBlockedUntil) {
    const waitSec = Math.ceil((rateLimitBlockedUntil - now) / 1000);
    logger.warn('Place search skipped (backoff after rate limit)', {
      query: trimmed,
      waitSeconds: waitSec,
    });
    throw new Error(
      'Too many requests. Please wait a moment and try again.',
    );
  }

  logger.info('Place search started', { query: trimmed });

  const url = `${NOMINATIM_SEARCH_URL}?${new URLSearchParams({
    q: trimmed,
    format: 'json',
    addressdetails: '1',
    limit: '5',
  }).toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': NOMINATIM_USER_AGENT,
        Accept: 'application/json',
      },
      signal,
    });

    if (!response.ok) {
      const isRateLimit = response.status === 429 || response.status === 509;
      if (isRateLimit) {
        rateLimitBlockedUntil = Date.now() + RATE_LIMIT_BACKOFF_MS;
        logger.error('Place search rate limited; backoff started', {
          query: trimmed,
          status: response.status,
          backoffMs: RATE_LIMIT_BACKOFF_MS,
        });
      } else {
        logger.error('Place search failed (non-OK response)', {
          query: trimmed,
          status: response.status,
          statusText: response.statusText,
        });
      }
      throw new Error(
        isRateLimit
          ? 'Too many requests. Please wait a moment and try again.'
          : 'Location search failed. Please try again.',
      );
    }

    const data = (await response.json()) as LocationSuggestionResponse[];
    if (!Array.isArray(data)) {
      logger.warn('Place search returned non-array', { query: trimmed });
      return [];
    }

    const results = data.map(mapSuggestionToEventLocation);
    logger.info('Place search completed', {
      query: trimmed,
      count: results.length,
      suggestions: results.map((r) => ({ displayName: r.displayName, lat: r.latitude, lon: r.longitude })),
    });
    return results;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      logger.debug('Place search aborted', { query: trimmed });
      return [];
    }
    const errorPayload =
      err instanceof Error
        ? { name: err.name, message: err.message }
        : { error: String(err) };
    logger.error('Place search error', { query: trimmed, ...errorPayload });
    throw err;
  }
}

export const locationSearchService = {
  search: searchLocation,
  mapSuggestionToEventLocation,
};
