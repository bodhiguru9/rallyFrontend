import React, { useMemo, useState } from 'react';
import { TextDs, FlexView } from '@components';
import { ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import type { RootStackParamList } from '@navigation';
import { userService } from '@services/user-service';
import { useOrganiserEvents } from '@hooks';
import { useOrganiserPackages } from '@hooks/organiser';
import { EventCard } from '@components/global/EventCard';
import { colors } from '@theme';
import { OrganiserProfileHeader } from '../playerOrginser/playerOrgEventDetails/components/OrganiserProfileHeader';
import { PackagesSection } from '../playerOrginser/playerOrgEventDetails/components/PackagesSection';
import {
  ORGANISER_DATA,
  type PackageData,
} from '../playerOrginser/playerOrgEventDetails/data/organiserEventDetails.data';
import { styles } from './style/EventOrginserProfilePlayer.styles';
import { Loader } from '@components/global/Loader';
import { ArrowIcon } from '@components/global/ArrowIcon';

type EventOrginserProfilePlayerNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'EventOrginserProfilePlayer'
>;

type EventOrginserProfilePlayerRouteProp = RouteProp<
  RootStackParamList,
  'EventOrginserProfilePlayer'
>;

export const EventOrginserProfilePlayer: React.FC = () => {
  const navigation = useNavigation<EventOrginserProfilePlayerNavigationProp>();
  const route = useRoute<EventOrginserProfilePlayerRouteProp>();
  const { organiserId } = route.params;
  const [activeTab, setActiveTab] = useState<'events' | 'packages'>('events');

  const { data, isLoading, refetch: refetchOrganiser } = useQuery({
    queryKey: ['organiser-user', organiserId],
    queryFn: () => userService.getUserById(organiserId),
    enabled: !!organiserId,
  });

  const organiser = data?.data?.user;
  // API response includes isFollowing, profileVisibility, and isRequested even if not in base User type
  const organiserWithFollowStatus = organiser as typeof organiser & {
    isFollowing?: boolean;
    profileVisibility?: 'public' | 'private';
    isRequested?: boolean;
  };
  const isFollowing = organiserWithFollowStatus?.isFollowing ?? false;
  const isPrivateProfile = organiserWithFollowStatus?.profileVisibility === 'private';
  const isRequested = organiserWithFollowStatus?.isRequested ?? false;
  const shouldHideContent = isPrivateProfile && !isFollowing;

  // Fetch organiser events only if content should be visible and organiser data is loaded
  const {
    data: eventsData,
    isLoading: isLoadingEvents,
    error: eventsError,
  } = useOrganiserEvents(Number(organiserId), 1, 20, {
    enabled: !isLoading && !shouldHideContent,
  });

  const events = eventsData?.data?.events || [];

  // Fetch organiser packages only if content should be visible and organiser data is loaded
  const {
    data: packagesData,
    isLoading: isLoadingPackages,
    error: packagesError,
  } = useOrganiserPackages(Number(organiserId), {
    enabled: !isLoading && !shouldHideContent && activeTab === 'packages',
  });

  // Transform API packages to PackageData format
  const packages: PackageData[] = useMemo(() => {
    if (!packagesData?.data?.packages) {
      return [];
    }

    return packagesData.data.packages.map((pkg) => ({
      id: pkg.packageId,
      title: pkg.packageName,
      validity: `${pkg.validityMonths} ${pkg.validityMonths === 1 ? 'month' : 'months'}`,
      sport: pkg.sports && pkg.sports.length > 0 ? pkg.sports.join(', ') : 'All Sports',
      eventType: pkg.eventType || 'All Events',
      numberOfEvents: pkg.maxEvents,
      price: pkg.packagePrice,
      currency: '฿', // Default currency, can be updated if API provides it
    }));
  }, [packagesData]);

  const profileData = useMemo(() => {
    const fallbackName = ORGANISER_DATA.name;
    const fullName = organiser?.fullName || fallbackName;
    const profileImage = organiser?.profilePic || ORGANISER_DATA.profileImage;
    const tags =
      organiser?.sports?.length
        ? organiser.sports
        : [organiser?.sport1, organiser?.sport2].filter(Boolean).length
          ? ([organiser?.sport1, organiser?.sport2].filter(Boolean) as string[])
          : ORGANISER_DATA.tags;

    return {
      ...ORGANISER_DATA,
      name: fullName,
      creatorName: fullName,
      profileImage,
      tags,
      hostedCount: organiser?.eventsCreated ?? ORGANISER_DATA.hostedCount,
      attendeesCount: organiser?.totalAttendees ?? ORGANISER_DATA.attendeesCount,
      subscribersCount: organiser?.followersCount ?? ORGANISER_DATA.subscribersCount,
    };
  }, [organiser]);

  const handlePackagePress = (packageId: string) => {
    navigation.navigate('PlanDetails', { packageId });
  };

  const handleEventPress = (eventId: string) => {
    navigation.navigate('EventDetails', { eventId });
  };

  const handleBookmark = (_eventId: string) => {
    // Bookmark functionality can be implemented here
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <FlexView style={styles.header}>
          <ArrowIcon variant="left" onClick={() => navigation.goBack()} />
        </FlexView>
        <OrganiserProfileHeader
          name={profileData.name}
          creatorName={profileData.creatorName}
          isVerified={profileData.isVerified}
          profileImage={profileData.profileImage}
          hostedCount={profileData.hostedCount}
          followersCount={profileData.attendeesCount}
          subscribersCount={profileData.subscribersCount}
          description={profileData.description}
          tags={profileData.tags}
          organiserId={organiserId}
          isFollowing={isFollowing}
          isRequested={isRequested}
          isPrivateCommunity={isPrivateProfile}
          hideCreatorName
          onSubscribeSuccess={() => {
            refetchOrganiser();
          }}
        />

        {!isLoading && !shouldHideContent && (
          <>
            <FlexView style={styles.tabRow}>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'events' && styles.tabButtonActive]}
                onPress={() => setActiveTab('events')}
                activeOpacity={0.8}
              >
                <TextDs style={[styles.tabText, activeTab === 'events' && styles.tabTextActive]}>
                  Events
                </TextDs>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'packages' && styles.tabButtonActive]}
                onPress={() => setActiveTab('packages')}
                activeOpacity={0.8}
              >
                <TextDs style={[styles.tabText, activeTab === 'packages' && styles.tabTextActive]}>
                  Packages
                </TextDs>
              </TouchableOpacity>
            </FlexView>

            {activeTab === 'packages' ? (
              <>
                {isLoadingPackages ? (
                  <FlexView style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <TextDs style={styles.loadingText}>Loading packages...</TextDs>
                  </FlexView>
                ) : packagesError ? (
                  <FlexView style={styles.emptyState}>
                    <TextDs style={styles.emptyStateText}>Failed to load packages</TextDs>
                  </FlexView>
                ) : packages.length === 0 ? (
                  <FlexView style={styles.emptyState}>
                    <TextDs style={styles.emptyStateText}>No packages available</TextDs>
                  </FlexView>
                ) : (
                  <PackagesSection packages={packages} onPackagePress={handlePackagePress} />
                )}
              </>
            ) : (
              <FlexView style={styles.eventsContainer}>
                {isLoadingEvents ? (
                  <FlexView style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <TextDs style={styles.loadingText}>Loading events...</TextDs>
                  </FlexView>
                ) : eventsError ? (
                  <FlexView style={styles.emptyState}>
                    <TextDs style={styles.emptyStateText}>Failed to load events</TextDs>
                  </FlexView>
                ) : events.length === 0 ? (
                  <FlexView style={styles.emptyState}>
                    <TextDs style={styles.emptyStateText}>No events available</TextDs>
                  </FlexView>
                ) : (
                  <FlatList
                    data={events}
                    keyExtractor={(item) => item.eventId}
                    renderItem={({ item }) => (
                      <EventCard
                        id={item.eventId}
                        event={item}
                        onPress={handleEventPress}
                        onBookmark={handleBookmark}
                      />
                    )}
                    contentContainerStyle={styles.eventsList}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={false}
                  />
                )}
              </FlexView>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
