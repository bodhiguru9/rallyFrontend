/**
 * Structured location returned by EventLocationSearch (OpenStreetMap Nominatim).
 * Used for event creation and display.
 */
export interface EventLocation {
  name: string;
  displayName: string;
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  /** OpenStreetMap place_id (optional, for bonus storage). */
  placeId?: number;
  /** Bounding box [south, north, west, east] (optional). */
  boundingBox?: [number, number, number, number];
  /** GeoJSON type and coordinates (optional). */
  geojson?: {
    type: string;
    coordinates: [number, number] | [number, number, number];
  };
}

/**
 * Raw suggestion item returned by the location-search API (backend proxy → Nominatim).
 */
export interface LocationSuggestionResponse {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    name?: string;
    road?: string;
    house_number?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    postcode?: string;
    country_code?: string;
  };
  boundingbox?: [string, string, string, string];
  geojson?: {
    type: string;
    coordinates: [number, number] | [number, number, number];
  };
}
