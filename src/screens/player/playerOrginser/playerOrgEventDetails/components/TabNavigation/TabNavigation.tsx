import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { spacing } from '@theme';
import { ScrollView } from 'react-native-gesture-handler';
import { FilterDropdown, FlexView } from '@components';
import type { FilterOption } from '@screens/home/Home.types';

type TabType = 'events' | 'packages';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  sportsFilters?: FilterOption[];
  eventTypeFilters?: FilterOption[];
  locationFilters?: FilterOption[];
  priceFilters?: FilterOption[];
  toggleSportsFilter?: (id: string) => void;
  toggleEventTypeFilter?: (id: string) => void;
  toggleLocationFilter?: (id: string) => void;
  togglePriceFilter?: (id: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  sportsFilters = [],
  eventTypeFilters = [],
  locationFilters = [],
  priceFilters = [],
  toggleSportsFilter,
  toggleEventTypeFilter,
  toggleLocationFilter,
  togglePriceFilter,
}) => {
  // Get selected IDs for each filter type
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

  return (
    <FlexView style={styles.wrapper}>
      {/* Filter Dropdowns - Only show for Events tab */}
      {activeTab === 'events' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          {sportsFilters.length > 0 && toggleSportsFilter && (
            <FilterDropdown
              label="Sports"
              options={sportsFilters}
              selectedIds={selectedSportsIds}
              onToggle={toggleSportsFilter}
            />
          )}
          {eventTypeFilters.length > 0 && toggleEventTypeFilter && (
            <FilterDropdown
              label="Event Type"
              options={eventTypeFilters}
              selectedIds={selectedEventTypeIds}
              onToggle={toggleEventTypeFilter}
            />
          )}
          {locationFilters.length > 0 && toggleLocationFilter && (
            <FilterDropdown
              label="Location"
              options={locationFilters}
              selectedIds={selectedLocationIds}
              onToggle={toggleLocationFilter}
            />
          )}
          {priceFilters.length > 0 && togglePriceFilter && (
            <FilterDropdown
              label="Price"
              options={priceFilters}
              selectedIds={selectedPriceIds}
              onToggle={togglePriceFilter}
            />
          )}
        </ScrollView>
      )}
    </FlexView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.base,
    // Ensure the wrapper doesn't clip children
    zIndex: 1000,
    elevation: 10, // Necessary for Android z-index
  },
  filtersScroll: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    // CRITICAL: Prevent the horizontal scroll from clipping the vertical dropdown
    overflow: 'visible',
  },
});
