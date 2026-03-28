import type { Organiser, FilterOption, DateFilter, City } from '@screens/home/Home.types';
import { EventData } from '@app-types';

export interface PlayerHomeContentProps {
  events: EventData[];
  // Location
  selectedCity: City;

  // Events data
  featuredEvents: EventData[];
  pickedEvents: EventData[];
  bookAgainEvents: EventData[];
  calendarEvents: EventData[];
  isLoadingEvents: boolean;
  eventsError: Error | null;

  // Organisers
  topOrganisers: Organiser[];

  // Authentication
  isAuthenticated: boolean;

  // Filter state
  sportsFilters: FilterOption[];
  eventTypeFilters: FilterOption[];
  locationFilters: FilterOption[];
  priceFilters: FilterOption[];
  dateFilters: DateFilter[];

  // Filter actions
  toggleSportsFilter: (id: string) => void;
  toggleEventTypeFilter: (id: string) => void;
  toggleLocationFilter: (id: string) => void;
  togglePriceFilter: (id: string) => void;
  selectDate: (fullDate: string | null) => void;
  loadMoreDates: () => void;
  canLoadMore: boolean;

  // Navigation handlers
  onEventPress: (id: string, occurrenceStart?: string, occurrenceEnd?: string) => void;
  onOrganiserPress: (id: string) => void;
  onBookmark: (id: string) => void;

  // Pull to refresh
  onRefresh?: () => void | Promise<void>;
  refreshing?: boolean;
}
