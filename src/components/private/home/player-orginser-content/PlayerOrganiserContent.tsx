import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import type { Organiser } from '@screens/home/Home.types';
import { spacing } from '@theme';
import { FeaturedOrganisersSection } from './sections/FeaturedOrganisersSection';
import { PickedForYouSection } from './components/PickedForYouSection';
import { PICKED_ORGANISERS } from './data/playerOrginser.data';
import { useHome } from '@screens';
import { FlexView } from '@components';

interface PlayerOrginserContentProps {
  topOrganisers: Organiser[];
  isAuthenticated: boolean;
  onOrganiserPress: (id: number | string, communityName?: string) => void;
}

export const PlayerOrganiserContent: React.FC<PlayerOrginserContentProps> = ({
  // topOrganisers,
  onOrganiserPress,
}) => {
  // Get communities data from context
  const { communities, isLoadingCommunities, communitiesError } = useHome();

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {/* Top Organisers Section - Only show for unauthenticated users */}

      {/* Featured Organisers Section */}
      <FeaturedOrganisersSection
        communities={communities}
        isLoadingCommunities={isLoadingCommunities}
        communitiesError={communitiesError}
        onOrganiserPress={onOrganiserPress}
      />

      {/* Picked for you Section */}
      <PickedForYouSection
        organisers={PICKED_ORGANISERS}
        communities={communities}
        isLoadingCommunities={isLoadingCommunities}
        communitiesError={communitiesError}
        onOrganiserPress={(id, communityName) =>
          onOrganiserPress(id, communityName)
        }
      />

      <FlexView width={"100%"} height={100} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  featuredCardContainer: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
});
