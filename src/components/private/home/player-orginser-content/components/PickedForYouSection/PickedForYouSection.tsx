import React, { useMemo, useState } from 'react';
import { TextDs, FlexView } from '@components';
import { StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';
import { PickedOrganiserCard, type IconType } from '../PickedOrganiserCard';
import { FilterDropdown } from '@components/global/filter-dropdown/FilterDropdown';
import { useFilterOptions } from '@hooks/use-events';


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

  // Fetch dynamic sports options
  const { data: filterOptions } = useFilterOptions();
  
  const sportsOptions = useMemo(() => {
    const defaultOption = { id: 'all-sports', label: 'All Sports', value: 'all' };
    if (!filterOptions?.sports) return [defaultOption];
    
    const apiOptions = filterOptions.sports.map(sport => {
      const id = sport.toLowerCase().replace(/\s+/g, '-');
      const words = sport.split(/[- ]+/);
      const camel = words[0].toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
      const icon = camel + 'Icon';

      return {
        id,
        label: sport,
        value: id,
        icon
      };
    });

    return [defaultOption, ...apiOptions];
  }, [filterOptions?.sports]);

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
  console.log('OPTIONS PASSED:', sportsOptions.map(o => o.id));
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
      const sport = sportsOptions.find(opt => opt.id === id);
      return sport ? sport.label : id;
    });

    return `No events for ${selectedLabels.join(', ')} yet.`;
  };

  return (
    <FlexView style={styles.container}>
      <FlexView style={styles.header}>
        <TextDs style={styles.title}>Picked for you</TextDs>
        <FilterDropdown
          label="Sports"
          options={sportsOptions}
          selectedIds={selectedSportIds}
          onToggle={handleToggleSport}
          align="right"
          isMultiSelect={true}
        />
      </FlexView>

      {/* 3. MULTI-SELECT DROPDOWN ROW */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersScrollContainer}
      >

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
                onPress={(pressedId, cardCommunityName) => {
                  const finalCommunityName = cardCommunityName || item.communityName;
                  const cleanId = pressedId.startsWith('community-') ? pressedId.replace('community-', '') : pressedId;
                  onOrganiserPress(cleanId, finalCommunityName || undefined);
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