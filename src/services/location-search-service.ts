import type { EventLocation } from '@app-types/location.types';
import { logger } from '@dev-tools/logger';
import Constants from 'expo-constants';

const GOOGLE_MAPS_SEARCH_URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json';

const getMapsApiKey = (): string => {
  return Constants.expoConfig?.extra?.GOOGLE_MAPS_API_KEY || '';
};

export interface LocationSearchParams {
  query: string;
  signal?: AbortSignal;
}

/**
 * Search for locations using Google Maps Text Search API directly.
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

  const apiKey = getMapsApiKey();
  if (!apiKey) {
    logger.warn('Google Maps API key not found. Please configure it.');
    return [];
  }

  logger.info('Place search started', { query: trimmed });

  const url = `${GOOGLE_MAPS_SEARCH_URL}?${new URLSearchParams({
    query: trimmed,
    key: apiKey,
  }).toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal,
    });

    if (!response.ok) {
      logger.error('Place search failed (non-OK response)', {
        query: trimmed,
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error('Location search failed. Please try again.');
    }

    const data = await response.json();
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      logger.error('Place search API error', { query: trimmed, status: data.status });
      throw new Error('Location search failed. Please try again.');
    }

    const results: EventLocation[] = (data.results || []).slice(0, 5).map((item: any) => ({
      name: item.name,
      displayName: item.formatted_address,
      latitude: item.geometry?.location?.lat || 0,
      longitude: item.geometry?.location?.lng || 0,
      placeId: item.place_id,
    }));

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
};
