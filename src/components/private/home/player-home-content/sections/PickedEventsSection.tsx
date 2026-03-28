import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { spacing } from '@theme';
import { DateFilter, FilterDropdown, Seperator, TextDs } from '@components';
import { EventDateGroup } from './EventDateGroup';
import type { FilterOption, DateFilter as DateFilterType } from '@screens/home/Home.types';

import { styles } from '../style/PlayerHomeContent.styles';
import { FlexView } from '@designSystem/atoms/FlexView';
import { EventData } from '@app-types';
import { useLocationStore } from '@store/location-store';
import { expandRecurringEvents } from '@utils/recurrence-utils';
import { useAsyncExpandedEvents } from '@hooks/use-async-expanded-events';
import { parseLocalDate } from '@utils/date-utils';
import { locationSearchService } from '@services/location-search-service';

const isSameCalendarDay = (eventDateTime: string, fullDate: string): boolean => {
  const d1 = new Date(eventDateTime);
  const d2 = parseLocalDate(fullDate);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

const getDistanceKm = (
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
): number => {
  const dLat = toRadians(toLat - fromLat);
  const dLng = toRadians(toLng - fromLng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(fromLat)) *
      Math.cos(toRadians(toLat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
};

const getEventKey = (event: EventData): string => {
  return String(event.mongoId ?? event.eventId ?? event.id);
};

const parseCoordinatesFromLocationText = (
  locationText: string | null | undefined,
): { latitude: number; longitude: number } | null => {
  if (!locationText) {
    return null;
  }

  // Matches: "28.67974,77.1738497" (with optional spaces)
  const simplePair = locationText.match(/(-?\d{1,2}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)/);
  if (simplePair) {
    const latitude = Number(simplePair[1]);
    const longitude = Number(simplePair[2]);
    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      return { latitude, longitude };
    }
  }

  // Matches: "lat: 28.67 ... lng: 77.17" and variants
  const latLngPair = locationText.match(
    /(?:lat|latitude)\s*[:=]\s*(-?\d{1,2}(?:\.\d+)?).*?(?:lng|lon|longitude)\s*[:=]\s*(-?\d{1,3}(?:\.\d+)?)/i,
  );
  if (latLngPair) {
    const latitude = Number(latLngPair[1]);
    const longitude = Number(latLngPair[2]);
    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      return { latitude, longitude };
    }
  }

  return null;
};

const toFiniteNumber = (value: unknown): number | null => {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const getEventCoordinates = (event: EventData): { latitude: number; longitude: number } | null => {
  const eventWithFallbacks = event as EventData & {
    latitude?: unknown;
    longitude?: unknown;
    lat?: unknown;
    lng?: unknown;
    geojson?: { coordinates?: unknown };
    coordinates?: unknown;
  };

  const latitude = toFiniteNumber(event.eventLatitude ?? eventWithFallbacks.latitude ?? eventWithFallbacks.lat);
  const longitude = toFiniteNumber(event.eventLongitude ?? eventWithFallbacks.longitude ?? eventWithFallbacks.lng);

  if (latitude == null || longitude == null) {
    const coordsFromText = parseCoordinatesFromLocationText(event.eventLocation);
    if (coordsFromText) {
      return coordsFromText;
    }

    const coordsCandidate =
      (eventWithFallbacks.geojson as { coordinates?: unknown } | undefined)?.coordinates ??
      eventWithFallbacks.coordinates;

    if (Array.isArray(coordsCandidate) && coordsCandidate.length >= 2) {
      // GeoJSON usually stores [longitude, latitude]
      const lng = toFiniteNumber(coordsCandidate[0]);
      const lat = toFiniteNumber(coordsCandidate[1]);
      if (lat != null && lng != null) {
        return { latitude: lat, longitude: lng };
      }
    }

    return null;
  }

  return { latitude, longitude };
};

interface PickedEventsSectionProps {
  pickedEvents: EventData[];
  sportsFilters: FilterOption[];
  eventTypeFilters: FilterOption[];
  locationFilters: FilterOption[];
  priceFilters: FilterOption[];
  dateFilters: DateFilterType[];
  toggleSportsFilter: (id: string) => void;
  toggleEventTypeFilter: (id: string) => void;
  toggleLocationFilter: (id: string) => void;
  togglePriceFilter: (id: string) => void;
  selectDate: (fullDate: string | null) => void;
  loadMoreDates: () => void;
  canLoadMore: boolean;
  onEventPress: (id: string, occurrenceStart?: string, occurrenceEnd?: string) => void;
  onBookmark: (id: string) => void;
  showPastEvents?: boolean;
}

export const PickedEventsSection: React.FC<PickedEventsSectionProps> = ({
  pickedEvents,
  sportsFilters,
  eventTypeFilters,
  locationFilters,
  priceFilters,
  dateFilters,
  toggleSportsFilter,
  toggleEventTypeFilter,
  toggleLocationFilter,
  togglePriceFilter,
  selectDate,
  loadMoreDates,
  canLoadMore,
  onEventPress,
  onBookmark,
  showPastEvents = false,
}) => {
  const { expandedEvents = [] } = useAsyncExpandedEvents(pickedEvents);
  
  const { lastCoordinates } = useLocationStore();
  const [resolvedEventCoordinates, setResolvedEventCoordinates] = useState<
    Record<string, { latitude: number; longitude: number }>
  >({});
  const geocodeCacheRef = useRef<Record<string, { latitude: number; longitude: number } | null>>({});

  // Get selected IDs for each filter type (for UI display)
  const selectedSportsIds = useMemo(
    () => sportsFilters.filter((f) => f.isActive).map((f) => f.id),
    [sportsFilters],
  );
  const selectedEventTypeIds = useMemo(
    () => eventTypeFilters.filter((f) => f.isActive).map((f) => f.id),
    [eventTypeFilters],
  );
  const selectedLocationIds = useMemo(
    () => locationFilters.filter((f) => f.isActive).map((f) => f.id),
    [locationFilters],
  );
  const selectedPriceIds = useMemo(
    () => priceFilters.filter((f) => f.isActive).map((f) => f.id),
    [priceFilters],
  );

  // Get selected filter values for actual filtering
  const selectedSportsValues = useMemo(
    () => sportsFilters.filter((f) => f.isActive && f.id !== 'all-sports').map((f) => f.value.toLowerCase()),
    [sportsFilters],
  );
  const selectedEventTypeValues = useMemo(
    () => eventTypeFilters.filter((f) => f.isActive && f.id !== 'all-event-types').map((f) => f.value.toLowerCase()),
    [eventTypeFilters],
  );
  const selectedDistanceKm = useMemo(() => {
    const activeLocationFilter = locationFilters.find((f) => f.isActive);
    if (!activeLocationFilter || activeLocationFilter.value === 'everywhere') {
      return null;
    }

    const parsed = Number(activeLocationFilter.value);
    return Number.isFinite(parsed) ? parsed : null;
  }, [locationFilters]);
  const selectedPriceValues = useMemo(
    () => priceFilters.filter((f) => f.isActive).map((f) => Number(f.value)),
    [priceFilters],
  );

  const selectedDateFullDate = useMemo(
    () => dateFilters.find((d) => d.isSelected)?.fullDate ?? null,
    [dateFilters],
  );

  // Date range from filters (for expanding recurring events)
  const dateRangeStrings = useMemo(
    () => dateFilters.map((f) => f.fullDate).filter((d): d is string => !!d),
    [dateFilters],
  );

  // Run all filters except distance; distance is applied after optional geocode fallback resolves.
  const eventsBeforeDistance = useMemo(() => {
    let filtered = expandedEvents;

    const now = new Date();
    if (!showPastEvents) {
      filtered = filtered.filter((event) => {
        const eventStartDate = new Date(event.eventDateTime);
        const eventEndDate = event.eventEndDateTime ? new Date(event.eventEndDateTime) : null;

        if (eventEndDate) {
          return eventEndDate >= now;
        }

        return eventStartDate >= now;
      });
    }

    if (selectedDateFullDate) {
      filtered = filtered.filter((event) =>
        isSameCalendarDay(event.eventDateTime, selectedDateFullDate),
      );
    }

    if (selectedSportsValues.length > 0) {
      filtered = filtered.filter((event) => {
        const eventSportsLower = event.eventSports.map((sport) => sport.toLowerCase());
        return selectedSportsValues.some((selectedSport) =>
          eventSportsLower.includes(selectedSport),
        );
      });
    }

    if (selectedEventTypeValues.length > 0) {
      filtered = filtered.filter((event) => {
        const eventTypeLower = String(event.eventType).toLowerCase();
        return selectedEventTypeValues.includes(eventTypeLower);
      });
    }

    if (selectedPriceValues.length > 0) {
      filtered = filtered.filter((event) => {
        return selectedPriceValues.some((selectedPrice) => event.eventPricePerGuest <= selectedPrice);
      });
    }

    return filtered;
  }, [
    expandedEvents,
    dateRangeStrings,
    showPastEvents,
    selectedDateFullDate,
    selectedSportsValues,
    selectedEventTypeValues,
    selectedPriceValues,
  ]);

  const eventsNeedingGeocode = useMemo(() => {
    if (
      selectedDistanceKm == null ||
      lastCoordinates?.latitude == null ||
      lastCoordinates?.longitude == null
    ) {
      return [] as EventData[];
    }

    return eventsBeforeDistance.filter((event) => {
      if (getEventCoordinates(event)) {
        return false;
      }

      const key = getEventKey(event);
      if (resolvedEventCoordinates[key]) {
        return false;
      }

      return Boolean(event.eventLocation?.trim());
    });
  }, [
    selectedDistanceKm,
    lastCoordinates?.latitude,
    lastCoordinates?.longitude,
    eventsBeforeDistance,
    resolvedEventCoordinates,
  ]);

  useEffect(() => {
    if (eventsNeedingGeocode.length === 0) {
      return;
    }

    let isCancelled = false;

    const geocodeMissingEvents = async () => {
      for (const event of eventsNeedingGeocode) {
        if (isCancelled) {
          return;
        }

        const locationText = event.eventLocation?.trim();
        if (!locationText) {
          continue;
        }

        const eventKey = getEventKey(event);

        const cached = geocodeCacheRef.current[locationText];
        if (cached !== undefined) {
          if (cached) {
            setResolvedEventCoordinates((prev) => {
              if (prev[eventKey]) {
                return prev;
              }
              return { ...prev, [eventKey]: cached };
            });
          }
          continue;
        }

        try {
          const results = await locationSearchService.search({ query: locationText });
          const first = results[0];
          const coords = first
            ? { latitude: first.latitude, longitude: first.longitude }
            : null;

          geocodeCacheRef.current[locationText] = coords;

          if (coords && !isCancelled) {
            setResolvedEventCoordinates((prev) => ({ ...prev, [eventKey]: coords }));
          }
        } catch {
          geocodeCacheRef.current[locationText] = null;
        }

        // Respect public Nominatim limits (~1 req/sec)
        await new Promise((resolve) => setTimeout(resolve, 1100));
      }
    };

    geocodeMissingEvents();

    return () => {
      isCancelled = true;
    };
  }, [eventsNeedingGeocode]);

  // Filter events by all selected filters
  const filteredEvents = useMemo(() => {
    let filtered = eventsBeforeDistance;

    // Filter by distance radius from user's last known coordinates.
    // If coordinates are unavailable, we skip distance filtering and show all.
    if (
      selectedDistanceKm != null &&
      lastCoordinates?.latitude != null &&
      lastCoordinates?.longitude != null
    ) {
      filtered = filtered.filter((event) => {
        const eventCoordinates = getEventCoordinates(event) ?? resolvedEventCoordinates[getEventKey(event)];
        if (!eventCoordinates) {
          return false;
        }

        const distanceKm = getDistanceKm(
          lastCoordinates.latitude,
          lastCoordinates.longitude,
          eventCoordinates.latitude,
          eventCoordinates.longitude,
        );

        return distanceKm <= selectedDistanceKm;
      });
    }

    return filtered;
  }, [
    eventsBeforeDistance,
    selectedDistanceKm,
    resolvedEventCoordinates,
    lastCoordinates?.latitude,
    lastCoordinates?.longitude,
  ]);

  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped: { [key: string]: EventData[] } = {};

    filteredEvents.forEach((event) => {
      const eventDate = new Date(event.eventDateTime);
      const dateKey = `${eventDate.getDate()} ${eventDate.toLocaleString('en', { month: 'short' })}`;

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });

    // Sort events within each date group chronologically (oldest to newest)
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => new Date(a.eventDateTime).getTime() - new Date(b.eventDateTime).getTime());
    });

    // Sort the date groups chronologically (oldest to newest)
    return Object.entries(grouped).sort((a, b) => {
      return new Date(a[1][0].eventDateTime).getTime() - new Date(b[1][0].eventDateTime).getTime();
    });
  }, [filteredEvents]);

  // Get day label from date string (e.g., "24 Oct" -> "Saturday")
  const getDayLabel = (dateStr: string): string => {
    try {
      // Parse "24 Oct" format - we'll use current year as reference
      const currentYear = new Date().getFullYear();
      const [day, month] = dateStr.split(' ');
      const monthMap: { [key: string]: number } = {
        Jan: 0,
        Feb: 1,
        Mar: 2,
        Apr: 3,
        May: 4,
        Jun: 5,
        Jul: 6,
        Aug: 7,
        Sep: 8,
        Oct: 9,
        Nov: 10,
        Dec: 11,
      };

      if (day && month && monthMap[month] !== undefined) {
        const date = new Date(currentYear, monthMap[month], parseInt(day));
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()] || '';
      }
      return '';
    } catch {
      return '';
    }
  };

  return (
    <FlexView>
      <TextDs size={16} weight='semibold' style={{ paddingHorizontal: spacing.base, marginBottom: 10 }}>Picked for you</TextDs>

      {/* Filter Dropdowns */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersScrollContainer}
      >
        {sportsFilters.length > 0 && (
          <FilterDropdown
            label="Sports"
            options={sportsFilters}
            selectedIds={selectedSportsIds}
            onToggle={toggleSportsFilter}
          />
        )}
        {eventTypeFilters.length > 0 && (
          <FilterDropdown
            label="Event Type"
            options={eventTypeFilters}
            selectedIds={selectedEventTypeIds}
            onToggle={toggleEventTypeFilter}
          />
        )}
        {locationFilters.length > 0 && (
          <FilterDropdown
            label="Location"
            options={locationFilters}
            selectedIds={selectedLocationIds}
            onToggle={toggleLocationFilter}
            align='right'
            alwaysShowLabel
          />
        )}
        {priceFilters.length > 0 && (
          <FilterDropdown
            label="Price"
            options={priceFilters}
            selectedIds={selectedPriceIds}
            onToggle={togglePriceFilter}
            align='right'
            isMultiSelect={false}
          />
        )}
      </ScrollView>

      {/* Date Filter */}
      <DateFilter
        dates={dateFilters}
        onSelectDate={selectDate}
        onScrollNearEnd={loadMoreDates}
        canLoadMore={canLoadMore}
      />

      <FlexView minHeight={400}>
        {/* Event Date Groups - Show all events grouped by date */}
        {eventsByDate.length === 0 ? (
          <FlexView style={styles.emptyContainer}>
            <TextDs style={styles.emptyText}>No events found</TextDs>
          </FlexView>
        ) : (
          eventsByDate.map(([date, events], index) => (
            <EventDateGroup
              key={date}
              title={date}
              dayLabel={getDayLabel(date)}
              events={events}
              styleVariant={
                index === 0 ? 'default' : index === eventsByDate.length - 1 ? 'last' : 'alt'
              }
              isLast={index === eventsByDate.length - 1}
              onEventPress={onEventPress}
              onBookmark={onBookmark}
            />
          ))
        )}
      </FlexView>

      <Seperator spacing="xxl" />
    </FlexView>
  );
};
