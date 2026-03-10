import React from 'react';
import { Image, Pressable, Platform, StyleSheet, Alert } from 'react-native';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { colors, spacing, borderRadius } from '@theme';
import { FlexView } from '@designSystem/atoms/FlexView';
import { TextDs, ImageDs } from '@components';
import { IconTag } from '@components/global/IconTag';
import { userService } from '@services/user-service';
import { logger } from '@dev-tools/logger';
import { useAuthStore } from '@store/auth-store';
import axios from 'axios';

interface OrganiserProfileHeaderProps {
  name: string;
  instagramLink?: string;
  creatorName: string;
  isVerified?: boolean;
  profileImage: string;
  hostedCount: number;
  followersCount: number; // This is actually attendeesCount in the data
  subscribersCount: number;
  description: string;
  tags: string[];
  organiserId: string | number;
  isPrivateCommunity?: boolean;
  hideCreatorName?: boolean;
  isFollowing?: boolean;
  isRequested?: boolean;
  onSubscribeSuccess?: () => void | Promise<unknown>;
}

export const OrganiserProfileHeader: React.FC<OrganiserProfileHeaderProps> = ({
  name,
  instagramLink,
  creatorName,
  isVerified = false,
  profileImage,
  hostedCount,
  followersCount,
  subscribersCount,
  description,
  tags,
  organiserId,
  isPrivateCommunity = false,
  hideCreatorName = false,
  isFollowing = false,
  isRequested = false,
  onSubscribeSuccess,
}) => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  // Fetch follow status from API
  const { data: followStatusData } = useQuery({
    queryKey: ['follow-status', organiserId],
    queryFn: () => userService.checkFollowStatus(organiserId),
    enabled: isAuthenticated && !!organiserId,
    staleTime: 0, // Always fetch fresh data
    retry: 1,
  });

  // Use fetched status if available, otherwise fall back to prop
  const actualIsFollowing = followStatusData?.isFollowing ?? isFollowing;

  console.log('[OrganiserProfileHeader] Follow status:', {
    organiserId,
    propIsFollowing: isFollowing,
    fetchedIsFollowing: followStatusData?.isFollowing,
    actualIsFollowing,
    isAuthenticated,
  });

  // Follow organiser mutation
  const followMutation = useMutation({
    mutationFn: (id: string | number) => {
      console.log('[OrganiserProfileHeader] followMutation called with id:', id);
      return userService.followOrganiser(id);
    },
    onSuccess: async (data) => {
      console.log('[OrganiserProfileHeader] Follow success response:', data);
      logger.success('Successfully subscribed to organiser');
      Alert.alert('Success', 'You have successfully subscribed!');

      // Invalidate follow status and organiser user query to refresh follow status
      queryClient.invalidateQueries({ queryKey: ['follow-status', organiserId] });
      queryClient.invalidateQueries({ queryKey: ['organiser-user', organiserId] });

      // Refetch organiser data if callback provided
      if (onSubscribeSuccess) {
        await onSubscribeSuccess();
      }
    },
    onError: (error: unknown) => {
      console.error('[OrganiserProfileHeader] Follow error:', error);
      logger.error('Failed to subscribe', error);

      // Handle 401 Unauthorized errors specifically
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        Alert.alert('Authentication Required', 'Please log in to subscribe to this organiser.');
      } else if (axios.isAxiosError(error) && error.response?.data?.error === 'Already following this organiser') {
        // User is already following - just refresh the status to update UI
        console.log('[OrganiserProfileHeader] Already following - refreshing status');
        queryClient.invalidateQueries({ queryKey: ['follow-status', organiserId] });
        queryClient.invalidateQueries({ queryKey: ['organiser-user', organiserId] });
        Alert.alert('Info', 'You are already subscribed to this organiser.');
      } else {
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.error || error.message
          : 'Failed to subscribe. Please try again.';
        Alert.alert('Error', errorMessage);
      }
    },
  });

  // Unfollow organiser mutation
  const unfollowMutation = useMutation({
    mutationFn: (id: string | number) => {
      console.log('[OrganiserProfileHeader] unfollowMutation called with id:', id);
      return userService.unfollowOrganiser(id);
    },
    onSuccess: async (data) => {
      console.log('[OrganiserProfileHeader] Unfollow success response:', data);
      logger.success('Successfully unsubscribed from organiser');
      Alert.alert('Success', 'You have successfully unsubscribed!');

      // Invalidate follow status and organiser user query to refresh follow status
      queryClient.invalidateQueries({ queryKey: ['follow-status', organiserId] });
      queryClient.invalidateQueries({ queryKey: ['organiser-user', organiserId] });

      // Refetch organiser data if callback provided
      if (onSubscribeSuccess) {
        await onSubscribeSuccess();
      }
    },
    onError: (error: unknown) => {
      console.error('[OrganiserProfileHeader] Unfollow error:', error);
      logger.error('Failed to unsubscribe', error);

      // Handle 401 Unauthorized errors specifically
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        Alert.alert('Authentication Required', 'Please log in to unsubscribe from this organiser.');
      } else if (axios.isAxiosError(error) && error.response?.data?.error === 'Not following this organiser') {
        // User is not following - just refresh the status to update UI
        console.log('[OrganiserProfileHeader] Not following - refreshing status');
        queryClient.invalidateQueries({ queryKey: ['follow-status', organiserId] });
        queryClient.invalidateQueries({ queryKey: ['organiser-user', organiserId] });
        Alert.alert('Info', 'You are not subscribed to this organiser.');
      } else {
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.error || error.message
          : 'Failed to unsubscribe. Please try again.';
        Alert.alert('Error', errorMessage);
      }
    },
  });

  // Request to join mutation (for private communities)
  const requestToJoinMutation = useMutation({
    mutationFn: (id: string | number) => {
      console.log('[OrganiserProfileHeader] requestToJoinMutation called with id:', id);
      return userService.requestToJoin(id);
    },
    onSuccess: async (data) => {
      console.log('[OrganiserProfileHeader] Request to join success response:', data);
      logger.success('Successfully requested to join');
      Alert.alert('Success', 'Your request to join has been sent!');

      // Invalidate follow status and organiser user query to refresh status (will include isRequested: true)
      queryClient.invalidateQueries({ queryKey: ['follow-status', organiserId] });
      queryClient.invalidateQueries({ queryKey: ['organiser-user', organiserId] });

      // Refetch organiser data if callback provided
      if (onSubscribeSuccess) {
        await onSubscribeSuccess();
      }
    },
    onError: (error: unknown) => {
      console.error('[OrganiserProfileHeader] Request to join error:', error);
      logger.error('Failed to request to join', error);

      // Handle 401 Unauthorized errors specifically
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        Alert.alert(
          'Authentication Required',
          'Please log in to request to join this community.',
        );
      } else {
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.error || error.message
          : 'Failed to send request. Please try again.';
        Alert.alert('Error', errorMessage);
      }
    },
  });

  const handleSubscribe = () => {
    console.log('[OrganiserProfileHeader] ========== SUBSCRIBE BUTTON PRESSED ==========');
    console.log('[OrganiserProfileHeader] Current state:', {
      organiserId,
      isAuthenticated,
      actualIsFollowing,
      isRequested,
      isPrivateCommunity,
    });

    // Check if user is authenticated before making the request
    if (!isAuthenticated) {
      console.log('[OrganiserProfileHeader] User not authenticated - showing alert');
      Alert.alert('Authentication Required', 'Please log in to subscribe or request to join.');
      return;
    }

    // If already following, unsubscribe
    if (actualIsFollowing) {
      console.log('[OrganiserProfileHeader] Unsubscribing from organiser:', organiserId);
      logger.info('Unsubscribe pressed for organiser:', organiserId);
      unfollowMutation.mutate(organiserId);
      return;
    }

    if (isPrivateCommunity) {
      console.log('[OrganiserProfileHeader] Requesting to join private community:', organiserId);
      logger.info('Request to join pressed for organiser:', organiserId);
      requestToJoinMutation.mutate(organiserId);
    } else {
      console.log('[OrganiserProfileHeader] Subscribing to public organiser:', organiserId);
      logger.info('Subscribe pressed for organiser:', organiserId);
      followMutation.mutate(organiserId);
    }
  };

  const isSubscribing = followMutation.isPending || requestToJoinMutation.isPending || unfollowMutation.isPending;
  const formatCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const getButtonText = (): string => {
    // Determine button state
    let buttonState: 'following' | 'requestSent' | 'subscribing' | 'unsubscribing' | 'idle' | 'sign-up';

    if (isRequested) {
      buttonState = 'requestSent';
    } else if (isSubscribing) {
      // Check if it's unsubscribe or subscribe
      if (actualIsFollowing && unfollowMutation.isPending) {
        buttonState = 'unsubscribing';
      } else {
        buttonState = 'subscribing';
      }
    } else if (actualIsFollowing) {
      buttonState = 'following';
    } else if (!isAuthenticated) {
      buttonState = 'sign-up';
    } else {
      buttonState = 'idle';
    }

    // Return text based on state
    switch (buttonState) {
      case 'following':
        return 'Unsubscribe';
      case 'sign-up':
        return 'Sign Up';
      case 'requestSent':
        return 'Request sent, wait for accept';
      case 'subscribing':
        return isPrivateCommunity ? 'Sending Request...' : 'Subscribing...';
      case 'unsubscribing':
        return 'Unsubscribing...';
      case 'idle':
        return isPrivateCommunity ? 'Request to Join Sessions' : 'Subscribe';
      default:
        return 'Subscribe';
    }
  };

  return (
    <FlexView px={spacing.base} py={spacing.lg}>
      <FlexView flexDirection="row" alignItems="center" mb={spacing.md} gap={spacing.sm}>
        <Image source={{ uri: profileImage }} style={styles.profileImage} resizeMode="cover" />
        <FlexView flex={1} justifyContent="center">
          <FlexView flexDirection="row" alignItems="center" mb={spacing.xs} gap={spacing.base}>
            <TextDs size={16} weight="bold">{name}</TextDs>
            {isVerified && <ImageDs image="VerifiedIcon" size={20} />}
          </FlexView>
          <FlexView flexDirection='row' alignItems='center' gap={spacing.sm}>
            {!hideCreatorName && (
              <TextDs size={12} weight="regular" color="secondary">
                by {creatorName}
              </TextDs>

            )}
            {instagramLink && (
              <FlexView
                flexDirection='row'
                px={spacing.sm}
                height={20} // Increased height slightly for better text fit
                alignItems='center'
                gap={spacing.xs}
                borderRadius={borderRadius.full}
                borderWidth={1}
                borderColor={colors.border.white}
                backgroundColor={colors.glass.background.white}
              >
                <ImageDs image="InstaIcon" size={12} />
                <TextDs size={12} weight="regular">
                  {instagramLink}
                </TextDs>
              </FlexView>
            )}
          </FlexView>

          {/* Stats */}
          <FlexView
            mt={spacing.lg}
            flexDirection="row"
            justifyContent="space-between"
            pr={spacing.base}
          >
            <FlexView alignItems="center" gap={spacing.xs / 2}>
              <TextDs size={14} weight="bold">{hostedCount}</TextDs>
              <TextDs size={14} weight="regular">Hosted</TextDs>
            </FlexView>
            <FlexView alignItems="center" gap={spacing.xs / 2}>
              <TextDs size={14} weight="bold">{formatCount(followersCount)}</TextDs>
              <TextDs size={14} weight="regular">Attendees</TextDs>
            </FlexView>
            <FlexView alignItems="center" gap={spacing.xs / 2}>
              <TextDs size={14} weight="bold">{formatCount(subscribersCount)}</TextDs>
              <TextDs size={14} weight="regular">Subscribers</TextDs>
            </FlexView>
          </FlexView>
        </FlexView>
      </FlexView>

      {/* Description */}
      <FlexView mt={spacing.sm} mb={spacing.base}>
        <TextDs size={14} weight="regular">{description}</TextDs>
      </FlexView>

      {/* Tags */}
      <FlexView flexDirection="row" alignItems="center" gap={spacing.sm} mb={spacing.base}>
        {tags.map((tag, index) => (
          <IconTag title={tag} key={index} />
        ))}
      </FlexView>

      {/* Subscribe/Request to Join Button */}
      <Pressable
        style={({ pressed }) => [
          styles.subscribeButton,
          (isSubscribing || isRequested) && styles.subscribeButtonDisabled,
          Platform.OS === 'ios' && pressed && !isSubscribing && !isRequested && { opacity: 0.8 },
        ]}
        onPress={() => {
          console.log('[OrganiserProfileHeader] ========== PRESSABLE ONPRESS TRIGGERED ==========');
          handleSubscribe();
        }}
        disabled={isSubscribing || isRequested}
        android_ripple={{
          color: `${colors.primary}80`,
          borderless: false,
        }}
      >
        <TextDs size={14} weight="bold" color="white">
          {getButtonText()}
        </TextDs>
      </Pressable>
    </FlexView>
  );
};

const styles = StyleSheet.create({
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: borderRadius.full,
    marginRight: spacing.md,
    boxShadow: colors.boxShadow.midRaised,
  },
  subscribeButton: {
    backgroundColor: colors.primaryDark,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribeButtonDisabled: {
    opacity: 0.6,
  },
});
