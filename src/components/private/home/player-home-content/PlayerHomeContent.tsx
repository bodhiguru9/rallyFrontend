import React from 'react';
import { TextDs, FlexView } from '@components';
import { ScrollView, RefreshControl } from 'react-native';
import { colors } from '@theme';
import { TopOrganisersSection, FeaturedEventsSection, PickedEventsSection, YourCalendarSection } from './sections';
import type { PlayerHomeContentProps } from './PlayerHomeContent.types';
import { styles } from './style/PlayerHomeContent.styles';

export const PlayerHomeContent: React.FC<PlayerHomeContentProps> = ({
  events,
  featuredEvents,
  pickedEvents,
  calendarEvents,
  isLoadingEvents,
  eventsError,
  topOrganisers,
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
  onOrganiserPress,
  onBookmark,
  isAuthenticated,
  onRefresh,
  refreshing = false,
}) => {
  // Loading state
  if (isLoadingEvents) {
    return (
      <FlexView style={styles.loadingContainer}>
        <TextDs style={styles.loadingText}>Loading events...</TextDs>
      </FlexView>
    );
  }

  // Error state
  if (eventsError) {
    return (
      <FlexView style={styles.errorContainer}>
        <TextDs style={styles.errorText}>Failed to load events. Please try again.</TextDs>
      </FlexView>
    );
  }

  // Empty state
  if (featuredEvents.length === 0 && pickedEvents.length === 0) {
    return (
      <FlexView style={styles.emptyContainer}>
        <TextDs style={styles.emptyText}>No events found</TextDs>
        <TextDs style={styles.emptySubtext}>Check back later for upcoming events</TextDs>
      </FlexView>
    );
  }

  // Main content
  return (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        ) : undefined
      }
    >
      {/* Top Organisers Section */}
      <TopOrganisersSection
        topOrganisers={topOrganisers}
        onOrganiserPress={onOrganiserPress}
        isAuthenticated={isAuthenticated}
      />

      {/* Your Calendar Section - Only show for authenticated users */}
      {isAuthenticated && (
        <YourCalendarSection
          events={calendarEvents}
          onEventPress={onEventPress}
          onBookmark={onBookmark}
        />
      )}

      {/* Featured Events Section */}
      <FeaturedEventsSection events={events} onEventPress={onEventPress} onBookmark={onBookmark} />

      {/* Picked for you Section */}
      <PickedEventsSection
        pickedEvents={pickedEvents}
        sportsFilters={sportsFilters}
        eventTypeFilters={eventTypeFilters}
        locationFilters={locationFilters}
        priceFilters={priceFilters}
        dateFilters={dateFilters}
        toggleSportsFilter={toggleSportsFilter}
        toggleEventTypeFilter={toggleEventTypeFilter}
        toggleLocationFilter={toggleLocationFilter}
        togglePriceFilter={togglePriceFilter}
        selectDate={selectDate}
        loadMoreDates={loadMoreDates}
        canLoadMore={canLoadMore}
        onEventPress={onEventPress}
        onBookmark={onBookmark}
      />
    </ScrollView>
  );
};
