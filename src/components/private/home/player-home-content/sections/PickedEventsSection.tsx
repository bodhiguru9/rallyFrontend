import React, { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { spacing } from '@theme';
import { DateFilter, FilterDropdown, Seperator, TextDs } from '@components';
import { EventDateGroup } from './EventDateGroup';
import type { FilterOption, DateFilter as DateFilterType } from '@screens/home/Home.types';

import { styles } from '../style/PlayerHomeContent.styles';
import { FlexView } from '@designSystem/atoms/FlexView';
import { EventData } from '@app-types';

const isSameCalendarDay = (iso1: string, iso2: string): boolean => {
  const d1 = new Date(iso1);
  const d2 = new Date(iso2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
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
  onEventPress: (id: string) => void;
  onBookmark: (id: string) => void;
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
}) => {
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
  const selectedLocationValues = useMemo(
    () => locationFilters.filter((f) => f.isActive && f.id !== 'all-locations').map((f) => f.value.toLowerCase()),
    [locationFilters],
  );
  const selectedPriceValues = useMemo(
    () => priceFilters.filter((f) => f.isActive).map((f) => Number(f.value)),
    [priceFilters],
  );

  const selectedDateFullDate = useMemo(
    () => dateFilters.find((d) => d.isSelected)?.fullDate ?? null,
    [dateFilters],
  );

  // Filter events by all selected filters
  const filteredEvents = useMemo(() => {
    let filtered = pickedEvents;

    // Filter out past events - only show future and currently ongoing events
    const now = new Date();
    filtered = filtered.filter((event) => {
      const eventStartDate = new Date(event.eventDateTime);
      const eventEndDate = event.eventEndDateTime ? new Date(event.eventEndDateTime) : null;

      // If event has an end date, check if it hasn't ended yet (includes ongoing and future events)
      if (eventEndDate) {
        return eventEndDate >= now;
      }

      // If event has no end date, check if start date is today or in the future
      return eventStartDate >= now;
    });

    // Filter by date
    if (selectedDateFullDate) {
      filtered = filtered.filter((event) =>
        isSameCalendarDay(event.eventDateTime, selectedDateFullDate),
      );
    }

    // Filter by sports (if any selected)
    if (selectedSportsValues.length > 0) {
      filtered = filtered.filter((event) => {
        const eventSportsLower = event.eventSports.map((sport) => sport.toLowerCase());
        return selectedSportsValues.some((selectedSport) =>
          eventSportsLower.includes(selectedSport),
        );
      });
    }

    // Filter by event type (if any selected)
    if (selectedEventTypeValues.length > 0) {
      filtered = filtered.filter((event) => {
        const eventTypeLower = String(event.eventType).toLowerCase();
        return selectedEventTypeValues.includes(eventTypeLower);
      });
    }

    // Filter by location (if any selected)
    if (selectedLocationValues.length > 0) {
      filtered = filtered.filter((event) => {
        const eventLocationLower = event.eventLocation.toLowerCase();
        return selectedLocationValues.some((selectedLocation) =>
          eventLocationLower.includes(selectedLocation),
        );
      });
    }

    // Filter by price (if any selected) - show events with price less than or equal to selected value
    if (selectedPriceValues.length > 0) {
      filtered = filtered.filter((event) => {
        return selectedPriceValues.some((selectedPrice) => event.eventPricePerGuest <= selectedPrice);
      });
    }

    return filtered;
  }, [
    pickedEvents,
    selectedDateFullDate,
    selectedSportsValues,
    selectedEventTypeValues,
    selectedLocationValues,
    selectedPriceValues,
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
