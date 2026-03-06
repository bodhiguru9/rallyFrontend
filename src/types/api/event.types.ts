import type { EventData } from '../models/event';

export interface TagSearchEventsPagination {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  skip: number;
  hasMore: boolean;
  hasPrevious: boolean;
}

export interface TagSearchEventsSearchParams {
  eventName: string | null;
  eventType: string | null;
  eventSports: string | null;
  eventLocation: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  price: number | null;
  startDate: string | null;
}

export interface TagSearchEventsFilterOptions {
  sports: string[];
  eventTypes: string[];
  locations: string[];
  prices: number[];
}

export interface TagSearchEventsApiResponse {
  success: boolean;
  message: string;
  data: {
    events: EventData[];
    pagination: TagSearchEventsPagination;
    searchParams: TagSearchEventsSearchParams;
    filterOptions: TagSearchEventsFilterOptions;
  };
}

export interface TagSearchEventsParams {
  eventType?: string;
  eventSports?: string;
}
