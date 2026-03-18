import React, { useState } from 'react';
import { TextDs, FlexView } from '@components';
import { ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import type { RootStackParamList } from '@navigation';
import { useAuthStore } from '@store';
import { ProfileHeader } from './components/ProfileHeader';
import { UpcomingEventsSection } from './components/UpcomingEventsSection';
import { styles } from './style/OrganiserProfileScreen.styles';
import { userService } from '@services/user-service';
import { useOrganiserCreatedEvents } from '@hooks/organiser';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@theme';
import { showImagePickerOptions } from '@utils/image-picker';
import { useUpdateProfileImage } from '@hooks/use-update-profile-image';

type OrganiserProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OrganiserProfile'
>;

export const OrganiserProfileScreen: React.FC = () => {
  const navigation = useNavigation<OrganiserProfileScreenNavigationProp>();
  const logout = useAuthStore((state) => state.logout);
  const userId = useAuthStore((state) => state.user?.userId || 0);
  const [pendingProfileImage, setPendingProfileImage] = useState<string | null>(null);

  const { data: userResponse, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: () => userService.getUserById(userId),
    enabled: userId > 0,
  });

  const { data: createdEventsData, isLoading: isLoadingEvents } = useOrganiserCreatedEvents(
    1,
    10,
    { enabled: userId > 0 },
  );

  const { updateProfileImage, isLoading: isUpdatingImage } = useUpdateProfileImage();

  const user = userResponse?.data?.user;

  const handleEventPress = (eventId: string) => {
    navigation.navigate('OrganiserEventDetails', { eventId });
  };

  const handleEventShare = (eventId: string) => {
    // Handle share functionality
    console.log('Share event:', eventId);
  };

  const handleEditPress = async () => {
    const imageResult = await showImagePickerOptions();
    if (imageResult && imageResult.uri) {
      setPendingProfileImage(imageResult.uri);
    }
  };

  const handleSaveProfileImage = async () => {
    if (pendingProfileImage) {
      const success = await updateProfileImage(pendingProfileImage);
      if (success) {
        setPendingProfileImage(null);
      }
    }
  };

  const handleCancelProfileImagePreview = () => {
    setPendingProfileImage(null);
  };

  const handleSettingsPress = () => {
    navigation.navigate('OrganiserProfileSettings');
  };

  const handleLogoutPress = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'SignIn' }],
              });
            } catch (error) {
              console.error('Logout failed:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleSubscribersPress = () => {
    navigation.navigate('AllFollowers');
  };

  const handleAttendeesPress = () => {
    navigation.navigate('OrganiserMembers');
  };

  const handleHostedPress = () => {
    navigation.navigate('OrganiserEventsHosted');
  };

  if (isLoadingUser || isLoadingEvents) {
    return (
      <FlexView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3D6F92" />
      </FlexView>
    );
  }

  if (!user) {
    return null;
  }

  const stats = {
    hosted: user.eventsCreated ?? 0,
    attendees: user.totalAttendees ?? 0,
    subscribers: user.followersCount ?? 0,
  };

  const activityTags = (user.sports || [])
    .filter(Boolean)
    .map((sport, index) => ({
      id: `${sport}-${index}`,
      label: sport,
      icon: 'activity',
    }));

  return (
    <SafeAreaView style={{ flex: 1, experimental_backgroundImage: colors.gradient.mainBackground }}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          logoUri={pendingProfileImage || user.profilePic || undefined}
          name={user.fullName}
          communityName={user.communityName || undefined}
          isVerified={user.isEmailVerified}
          instagramHandle={user.instagramLink || undefined}
          stats={stats}
          description={user.bio || ''}
          activityTags={activityTags}
          onEditPress={handleEditPress}
          onSettingsPress={handleSettingsPress}
          onLogoutPress={handleLogoutPress}
          onSubscribersPress={handleSubscribersPress}
          onAttendeesPress={handleAttendeesPress}
          onHostedPress={handleHostedPress}
        />

        {pendingProfileImage && (
          <FlexView row gap={spacing.md} px={spacing.xl} mb={spacing.lg}>
            <TouchableOpacity
              style={[styles.cancelPreviewButton, { flex: 1 }]}
              onPress={handleCancelProfileImagePreview}
              disabled={isUpdatingImage}
            >
              <TextDs weight="medium" color="secondary">Cancel</TextDs>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.savePreviewButton, { flex: 2 }]}
              onPress={handleSaveProfileImage}
              disabled={isUpdatingImage}
            >
              {isUpdatingImage ? (
                <ActivityIndicator size="small" color={colors.text.white} />
              ) : (
                <TextDs weight="semibold" color="white">Save Changes</TextDs>
              )}
            </TouchableOpacity>
          </FlexView>
        )}

        <UpcomingEventsSection
          events={(createdEventsData?.data?.events || []).filter(e => e.eventStatus === 'upcoming' || (e.eventFrequency && e.eventFrequency.length > 0))}
          onEventPress={handleEventPress}
          onEventShare={handleEventShare}
        />
      </ScrollView>
    </SafeAreaView>
  )
};
