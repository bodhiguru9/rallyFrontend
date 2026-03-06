import React, { useMemo, useState } from 'react';
import { TextDs, FlexView } from '@components';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';
import { PickedOrganiserCard, type IconType } from '../PickedOrganiserCard';
import { FilterDropdown } from '@components/global/filter-dropdown/FilterDropdown';

// --- ADD YOUR COMPLETE MASTER LIST OF SPORTS HERE ---
// The 'icon' string MUST match exactly what your ImageDs expects (e.g., 'TennisIcon', 'padel', etc.)
// --- COMPLETE MASTER LIST OF SPORTS ---
// Generated directly from your getSportIcon mapping
const APP_SPORTS_OPTIONS = [
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
  // 1. STATE: Start with an empty array. FilterDropdown will show the default label ("All Sports") when empty.
  const [selectedSportIds, setSelectedSportIds] = useState<string[]>([]);

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
    // If nothing is checked, show everything
    if (selectedSportIds.length === 0) {
      return displayData;
    }

    // If items are checked, show communities that have AT LEAST ONE of the checked sports
    return displayData.filter((item) =>
      item.tags.some((tag) => selectedSportIds.includes(tag.toLowerCase()))
    );
  }, [displayData, selectedSportIds]);

  const handleToggleSport = (id: string) => {
    setSelectedSportIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id); // Remove if already checked
      }
      return [...prev, id]; // Add if not checked
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

        {/* 3. MULTI-SELECT DROPDOWN */}
        <FilterDropdown
          label="All Sports" // This shows when selectedSportIds is empty
          options={APP_SPORTS_OPTIONS} // Passing the global static list, NO "All Sports" option inside
          selectedIds={selectedSportIds}
          onToggle={handleToggleSport}
          align="right"
          isMultiSelect={true} // Enables checkboxes and multi-select behavior
        />
      </FlexView>

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    zIndex: 10,
  },
  title: {
    ...getFontStyle(16, 'bold'),
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