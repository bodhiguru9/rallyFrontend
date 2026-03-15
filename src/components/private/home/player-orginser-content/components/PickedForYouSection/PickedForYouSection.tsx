import React, { useMemo, useState } from 'react';
import { TextDs, FlexView } from '@components';
import { StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';
import { PickedOrganiserCard, type IconType } from '../PickedOrganiserCard';
import { FilterDropdown } from '@components/global/filter-dropdown/FilterDropdown';

// --- ADD YOUR COMPLETE MASTER LIST OF SPORTS HERE ---
// The 'icon' string MUST match exactly what your ImageDs expects (e.g., 'TennisIcon', 'padel', etc.)
// --- COMPLETE MASTER LIST OF SPORTS ---
// Generated directly from your getSportIcon mapping
const APP_SPORTS_OPTIONS = [
  { id: 'all-sports', label: 'All Sports', value: 'all' },
  { id: 'padel', label: 'Padel', value: 'padel', icon: 'padelIcon' },
  { id: 'badminton', label: 'Badminton', value: 'badminton', icon: 'badmintonIcon' },
  { id: 'cricket', label: 'Cricket', value: 'cricket', icon: 'cricketIcon' },
  { id: 'pickleball', label: 'Pickleball', value: 'pickleball', icon: 'pickleballIcon' },
  { id: 'tennis', label: 'Tennis', value: 'tennis', icon: 'tennisIcon' },
  { id: 'football', label: 'Football', value: 'football', icon: 'footballIcon' },
  { id: 'table-tennis', label: 'Table Tennis', value: 'table-tennis', icon: 'tableTennisIcon' },
  { id: 'basketball', label: 'Basketball', value: 'basketball', icon: 'basketballIcon' },
];


export interface PickedOrganiserData {
  id: string;
  name: string;
  subtitle?: string;
  organizerName: string;
  background: string | string[];
  profilePic: string;
  iconType: IconType;
  hostedCount: number;
  attendeesCount: number;
  tags: string[];
  additionalTagsCount?: number;
  communityName?: string;
}

export interface CommunityData {
  userId: number;
  profilePic: string;
  fullName: string;
  communityName: string;
  totalEvents: number;
  totalAttendees: number;
  sports: string[];
}

const BACKGROUND_COLORS: (string | string[])[] = [
  '#10B981',
  '#3B82F6',
  '#FFB6C1',
  ['#FF6B9D', '#C44569'],
  ['#FFE66D', '#A8E6CF'],
];

const getIconType = (sports: string[]): IconType => {
  const sportsLower = sports.map((s) => s.toLowerCase());
  if (sportsLower.includes('badminton')) return 'badminton';
  if (sportsLower.includes('padel')) return 'padel';
  if (sportsLower.includes('social') || sportsLower.includes('socials')) return 'social';
  return 'custom';
};

interface PickedForYouSectionProps {
  organisers?: PickedOrganiserData[];
  communities?: CommunityData[];
  isLoadingCommunities?: boolean;
  communitiesError?: Error | null;
  onOrganiserPress: (id: string, communityName?: string) => void;
}

export const PickedForYouSection: React.FC<PickedForYouSectionProps> = ({
  organisers,
  communities = [],
  isLoadingCommunities = false,
  communitiesError = null,
  onOrganiserPress,
}) => {
  // 1. STATE: Start with 'all-sports' checked.
  const [selectedSportIds, setSelectedSportIds] = useState<string[]>(['all-sports']);

  const communitiesData = useMemo(() => {
    if (!communities || communities.length === 0) return [];

    return communities.map((community, index): PickedOrganiserData => {
      const background = BACKGROUND_COLORS[index % BACKGROUND_COLORS.length];
      const iconType = getIconType(community.sports);

      return {
        id: `community-${community.userId}`,
        name: community.communityName.toUpperCase(),
        organizerName: community.fullName,
        profilePic: community.profilePic,
        background,
        iconType,
        hostedCount: community.totalEvents,
        attendeesCount: community.totalAttendees,
        tags: community.sports.slice(0, 2),
        additionalTagsCount: community.sports.length > 2 ? community.sports.length - 2 : undefined,
        communityName: community.communityName,
      };
    });
  }, [communities]);

  const displayData = communitiesData.length > 0 ? communitiesData : organisers || [];
  console.log('OPTIONS PASSED:', APP_SPORTS_OPTIONS.map(o => o.id));
  // 2. TRUE MULTI-SELECT FILTER LOGIC
  const filteredData = useMemo(() => {
    // If "All Sports" is checked or nothing is checked, show everything
    if (selectedSportIds.includes('all-sports') || selectedSportIds.length === 0) {
      return displayData;
    }

    // If items are checked, show communities that have AT LEAST ONE of the checked sports
    return displayData.filter((item) =>
      item.tags.some((tag) => selectedSportIds.includes(tag.toLowerCase()))
    );
  }, [displayData, selectedSportIds]);

  const handleToggleSport = (id: string) => {
    setSelectedSportIds((prev) => {
      if (id === 'all-sports') {
        return ['all-sports'];
      }
      
      let next = [...prev].filter(item => item !== 'all-sports');
      if (next.includes(id)) {
        next = next.filter((item) => item !== id);
      } else {
        next.push(id);
      }
      
      if (next.length === 0) return ['all-sports'];
      return next;
    });
  };

  // Helper to generate the empty state message
  const getEmptyStateMessage = () => {
    if (selectedSportIds.length === 0) return "No events found.";

    // Map the selected IDs back to their display labels
    const selectedLabels = selectedSportIds.map(id => {
      const sport = APP_SPORTS_OPTIONS.find(opt => opt.id === id);
      return sport ? sport.label : id;
    });

    return `No events for ${selectedLabels.join(', ')} yet.`;
  };

  return (
    <FlexView style={styles.container}>
      <FlexView style={styles.header}>
        <TextDs style={styles.title}>Picked for you</TextDs>
      </FlexView>

      {/* 3. MULTI-SELECT DROPDOWN ROW */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersScrollContainer}
      >
        <FilterDropdown
          label="Sports"
          options={APP_SPORTS_OPTIONS}
          selectedIds={selectedSportIds}
          onToggle={handleToggleSport}
          align="right"
          isMultiSelect={true}
        />
      </ScrollView>

      {isLoadingCommunities ? (
        <FlexView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </FlexView>
      ) : communitiesError ? (
        <FlexView style={styles.errorContainer}>
          <TextDs style={styles.errorText}>Failed to load communities</TextDs>
        </FlexView>
      ) : filteredData.length > 0 ? (

        // 4. THE FIX FOR VIRTUALIZED LIST ERROR: Using a mapped FlexView grid instead of FlatList
        <FlexView style={styles.grid}>
          {filteredData.map((item) => (
            <FlexView key={item.id} style={styles.cardWrapper}>
              <PickedOrganiserCard
                {...item}
                onPress={(id, cardCommunityName) => {
                  const finalCommunityName = cardCommunityName || item.communityName;
                  onOrganiserPress(id, finalCommunityName || undefined);
                }}
              />
            </FlexView>
          ))}
        </FlexView>

      ) : (
        <FlexView style={styles.emptyContainer}>
          <TextDs style={styles.errorText}>{getEmptyStateMessage()}</TextDs>
        </FlexView>
      )}
    </FlexView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    paddingHorizontal: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    zIndex: 10,
  },
  filtersScroll: {
    marginBottom: spacing.md,
    zIndex: 10,
  },
  filtersScrollContainer: {
    paddingHorizontal: spacing.base,
    paddingRight: spacing.xl,
  },
  title: {
    ...getFontStyle(16, 'semibold'),
    color: colors.text.primary,
  },
  // Updated grid styles for the map() replacement
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.md,
  },
  cardWrapper: {
    width: '48%', // Ensures 2 columns with a slight gap between them
  },
  loadingContainer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
  },
});