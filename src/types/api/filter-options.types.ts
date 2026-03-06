/**
 * Filter options API types
 * Used for /api/events/filter-options endpoint
 */

export interface FilterOptionsData {
  sports: string[];
  eventTypes: string[];
  locations: string[];
  prices: number[];
}

export interface FilterOptionsResponse {
  success: boolean;
  message: string;
  data: FilterOptionsData;
}
