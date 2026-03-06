import React from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { HomeContainer } from '@components/global';
import { PlayerOrganiserContent } from '@components/private/home/player-orginser-content';
import { useAuthStore } from '@store/auth-store';
import type { RootStackParamList } from '@navigation';
import { useHome } from '@screens';
import { logger } from '@dev-tools';

type PlayerOrginserScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PlayerOrginser'
>;

export const PlayerOrganiserScreen: React.FC = () => {
  const navigation = useNavigation<PlayerOrginserScreenNavigationProp>();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  const { topOrganisers, refetchEvents } = useHome();

  // Refetch events when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Invalidate cache and refetch fresh events when navigating to this screen
      queryClient.invalidateQueries({ queryKey: ['player-events'] });
      refetchEvents();
    }, [refetchEvents, queryClient]),
  );

  const handleOrganiserPress = (id: number | string, communityName?: string) => {
    logger.info(
      `Organiser pressed: ${id}${communityName ? ` (Community: ${communityName})` : ''}`,
    );

    // Convert id to string safely (handle NaN cases)
    let safeId: string;
    if (typeof id === 'number') {
      safeId = isNaN(id) ? '' : String(id);
    } else {
      safeId = id || '';
    }

    if (!communityName) {
      console.warn(
        '⚠️ [PlayerOrginserScreen] WARNING: communityName is missing for organiser:',
        id,
      );
      console.warn('⚠️ [PlayerOrginserScreen] This will cause the screen to show an error');
    }

    // If communityName is provided, use it for API call (main case)
    // Pass organiserId as backup or for non-API cards
    navigation.navigate('PlayerOrgEventDetails', {
      organiserId: safeId || undefined,
      communityName: communityName || undefined,
    });
  };

  return (
    <HomeContainer activeTab="profile" userType="player">
      <PlayerOrganiserContent
        topOrganisers={topOrganisers}
        isAuthenticated={isAuthenticated}
        onOrganiserPress={handleOrganiserPress}
      />
    </HomeContainer>
  );
};
