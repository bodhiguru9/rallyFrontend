import React, { useEffect, useMemo, useState } from 'react';
import { useWindowDimensions, ActivityIndicator } from 'react-native';
import { Carousel, TextDs } from '@components';
import { FeaturedOrganiserCard } from './FeaturedOrganiserCard';
import { styles } from '../../player-home-content/style/PlayerHomeContent.styles';
import { FlexView } from '@designSystem/atoms/FlexView';
import { ArrowIcon } from '@components/global/ArrowIcon';
import { spacing, colors } from '@theme';
import { logger } from '@dev-tools';
import { PickedOrganiserData, type CommunityData } from '../components/PickedForYouSection/PickedForYouSection';
import type { IconType } from '../components/PickedOrganiserCard';


// Available background colors for communities
const BACKGROUND_COLORS: (string | string[])[] = [
  '#10B981', // Green
  '#3B82F6', // Blue
  '#FFB6C1', // Light pink
  ['#FF6B9D', '#C44569'], // Pink to purple gradient
  ['#FFE66D', '#A8E6CF'], // Yellow to light blue gradient
];

// Map sports to icon types
const getIconType = (sports: string[]): IconType => {
  const sportsLower = sports.map((s) => s.toLowerCase());
  if (sportsLower.includes('badminton')) {
    return 'badminton';
  }
  if (sportsLower.includes('padel')) {
    return 'padel';
  }
  if (sportsLower.includes('social') || sportsLower.includes('socials')) {
    return 'social';
  }
  return 'custom';
};

interface FeaturedOrganisersSectionProps {
  communities?: CommunityData[];
  isLoadingCommunities?: boolean;
  communitiesError?: Error | null;
  onOrganiserPress: (id: number | string, communityName?: string) => void;
}

export const FeaturedOrganisersSection: React.FC<FeaturedOrganisersSectionProps> = ({
  communities = [],
  isLoadingCommunities = false,
  communitiesError = null,
  onOrganiserPress,
}) => {
  const { width: screenWidth } = useWindowDimensions();

  // Transform API data to PickedOrganiserData format
  const communitiesData = useMemo(() => {
    if (!communities || communities.length === 0) {
      return [];
    }

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
        tags: community.sports.slice(0, 2), // Limit to first 2 sports
        additionalTagsCount: community.sports.length > 2 ? community.sports.length - 2 : undefined,
        communityName: community.communityName, // Store communityName for navigation
      };
    });
  }, [communities]);

  // Use communities data
  const displayData = useMemo(() => {
    return communitiesData;
  }, [communitiesData]);

  // Compute the initial active index based on displayData
  const initialActiveIndex = useMemo(() => {
    const dataLength = Array.isArray(displayData) ? displayData.length : 0;
    const index = dataLength > 0 ? Math.floor(dataLength / 2) : 0;
    logger.debug('Computed initial active index', { value: index, dataLength });
    return index;
  }, [displayData]);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const cardWidth = 250;
  const overlapOffset = 20;
  const sidePadding = Math.max(0, (screenWidth - cardWidth) / 2);

  useEffect(() => {
    setActiveIndex(initialActiveIndex);
  }, [initialActiveIndex]);

  if (isLoadingCommunities) {
    return (
      <FlexView mt={spacing.base} alignItems="center" justifyContent="center" py={spacing.xl}>
        <ActivityIndicator size="large" color={colors.primary} />
      </FlexView>
    );
  }

  if (communitiesError || displayData.length === 0) {
    return null;
  }

  return (
    <FlexView mt={spacing.base}>
      <FlexView
        alignItems="center"
        flexDirection="row"
        justifyContent="space-between"
        px={spacing.lg}
      >
        <TextDs style={styles.featuredTitle}>Top Organisers</TextDs>
        <ArrowIcon variant="right" />
      </FlexView>

      <Carousel
        data={displayData}
        itemWidth={cardWidth}
        itemSpacing={-overlapOffset}
        initialIndex={initialActiveIndex}
        onIndexChange={setActiveIndex}
        contentContainerStyle={[
          styles.horizontalScroll,
          { paddingHorizontal: sidePadding },
        ]}
        renderItem={({ item, index, animatedIndex }) => {
          const pickedData = item as PickedOrganiserData;
          // Find the original community data to pass to the card
          const communityData = communities.find(
            (c) => c.userId === parseInt(pickedData.id.replace('community-', ''))
          );

          if (!communityData) {
            return null;
          }

          return (
            <FlexView style={index === 0 ? undefined : { marginLeft: -overlapOffset }}>
              <FeaturedOrganiserCard
                organiser={communityData}
                onPress={() => {
                  onOrganiserPress(communityData.userId, pickedData.communityName);
                }}
                width={cardWidth}
                index={index}
                animatedIndex={animatedIndex}
                isActive={index === activeIndex}
                hostedCount={pickedData.hostedCount}
                attendeesCount={pickedData.attendeesCount}
              />
            </FlexView>
          );
        }}
      />
    </FlexView>
  );
};
