import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Users } from 'lucide-react-native';
import { colors, typography } from '@theme';
import { ProgressBar } from '@components/global';
import { EventCard, TextDs, FlexView } from '@components';
import { ScrollView, TouchableOpacity, Image } from 'react-native';
import type { RootStackParamList } from '@navigation';
import type { EventData } from '@app-types';
import type { PackageDetail } from './PackageDetailScreen.types';
import { styles } from './style/PackageDetailScreen.styles';

type PackageDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PackageDetail'
>;

type PackageDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'PackageDetail'
>;

const createMockEvent = (overrides: Partial<EventData>): EventData => ({
  id: overrides.id ?? overrides.eventId ?? 'event-1',
  eventId: overrides.eventId ?? overrides.id ?? 'event-1',
  mongoId: overrides.mongoId ?? 'mock-mongo-id',
  eventName: overrides.eventName ?? 'Weekly Social',
  eventImages: overrides.eventImages ?? [],
  eventVideo: overrides.eventVideo ?? null,
  eventType: overrides.eventType ?? 'social',
  eventSports: overrides.eventSports ?? ['Padel'],
  eventDateTime: overrides.eventDateTime ?? new Date().toISOString(),
  eventFrequency: overrides.eventFrequency ?? [],
  eventLocation: overrides.eventLocation ?? 'Al Quoz Academy, Dubai',
  eventDescription: overrides.eventDescription ?? '',
  eventGender: overrides.eventGender ?? null,
  eventSportsLevel: overrides.eventSportsLevel ?? null,
  eventMinAge: overrides.eventMinAge ?? null,
  eventMaxAge: overrides.eventMaxAge ?? null,
  eventLevelRestriction: overrides.eventLevelRestriction ?? null,
  eventMaxGuest: overrides.eventMaxGuest ?? 20,
  eventPricePerGuest: overrides.eventPricePerGuest ?? 0,
  IsPrivateEvent: overrides.IsPrivateEvent ?? false,
  eventOurGuestAllowed: overrides.eventOurGuestAllowed ?? false,
  eventApprovalReq: overrides.eventApprovalReq ?? false,
  eventRegistrationStartTime: overrides.eventRegistrationStartTime ?? null,
  eventRegistrationEndTime: overrides.eventRegistrationEndTime ?? null,
  eventStatus: overrides.eventStatus ?? 'upcoming',
  eventCreatorEmail: overrides.eventCreatorEmail ?? 'organiser@rally.app',
  eventCreatorName: overrides.eventCreatorName ?? 'Berry Badminton',
  eventCreatorProfilePic: overrides.eventCreatorProfilePic ?? null,
  eventTotalAttendNumber: overrides.eventTotalAttendNumber ?? 0,
  createdAt: overrides.createdAt ?? new Date().toISOString(),
  updatedAt: overrides.updatedAt ?? new Date().toISOString(),
  timeUntilStart: overrides.timeUntilStart ?? undefined,
  creator: overrides.creator ?? null,
  participants: overrides.participants ?? [],
  participantsCount: overrides.participantsCount ?? 0,
  waitlist: overrides.waitlist ?? [],
  waitlistCount: overrides.waitlistCount ?? 0,
  spotsInfo: overrides.spotsInfo ?? {
    totalSpots: 20,
    spotsBooked: 4,
    spotsLeft: 16,
    spotsFull: false,
  },
  counts: overrides.counts ?? null,
  userJoinStatus: overrides.userJoinStatus ?? null,
  availableSpots: overrides.availableSpots ?? 16,
  isFull: overrides.isFull ?? false,
});

// Mock data - replace with actual API call
const mockPackageDetails: Record<string, PackageDetail> = {
  '1': {
    id: '1',
    title: 'Standard Offer',
    organizerName: 'Berry Badminton',
    organizerAvatar: undefined,
    validity: '3 months',
    sport: 'Pilates',
    purchasedOn: '23 Oct, 2024',
    eventTypes: ['Social', 'Class'],
    totalEvents: 10,
    usedEvents: 2,
    expiresOn: '23 Jan, 2025',
    events: [
      createMockEvent({
        id: 'pkg1-event1',
        eventName: 'Under 19 Weekly Social',
        eventSports: ['Table Tennis'],
        eventType: 'social',
        eventDateTime: '2025-10-24T13:00:00.000Z',
        eventLocation: 'Al Quoz Academy, Dubai',
        eventCreatorName: 'Berry Badminton',
      }),
      createMockEvent({
        id: 'pkg1-event2',
        eventName: 'Tennis Americano',
        eventSports: ['Tennis'],
        eventType: 'social',
        eventDateTime: '2025-10-25T13:00:00.000Z',
        eventLocation: 'Maria Tennis Academy, Dubai',
        eventCreatorName: 'Berry Badminton',
      }),
    ],
  },
  '2': {
    id: '2',
    title: 'Elite Sessions',
    organizerName: 'Smash Club',
    organizerAvatar: undefined,
    validity: '6 months',
    sport: 'Badminton',
    purchasedOn: '11 Nov, 2024',
    eventTypes: ['Social', 'Training'],
    totalEvents: 20,
    usedEvents: 5,
    expiresOn: '11 May, 2025',
    events: [
      createMockEvent({
        id: 'pkg2-event1',
        eventName: 'Advanced Badminton Clinic',
        eventSports: ['Badminton'],
        eventType: 'training',
        eventDateTime: '2025-11-02T18:00:00.000Z',
        eventLocation: 'RAK Sports Complex',
        eventCreatorName: 'Smash Club',
      }),
      createMockEvent({
        id: 'pkg2-event2',
        eventName: 'Doubles League Night',
        eventSports: ['Badminton'],
        eventType: 'social',
        eventDateTime: '2025-11-05T19:30:00.000Z',
        eventLocation: 'Sharjah Indoor Arena',
        eventCreatorName: 'Smash Club',
      }),
    ],
  },
};

export const PackageDetailScreen: React.FC = () => {
  const navigation = useNavigation<PackageDetailScreenNavigationProp>();
  const route = useRoute<PackageDetailScreenRouteProp>();
  const { packageId } = route.params;
  
  // In a real app, fetch package detail by packageId
  const [packageDetail] = useState<PackageDetail>(
    mockPackageDetails[packageId] ?? mockPackageDetails['1'],
  );

  const handleEventPress = (eventId: string) => {
    // Navigate to event details
    // navigation.navigate('EventDetails', { eventId });
  };

  const handleBookmark = (eventId: string) => {
    // Bookmark/share action placeholder
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <FlexView style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </FlexView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Package Info Card */}
        <FlexView style={styles.packageCard}>
          <FlexView style={styles.organizerSection}>
            <FlexView style={styles.avatarContainer}>
              {packageDetail.organizerAvatar ? (
                <Image
                  source={{ uri: packageDetail.organizerAvatar }}
                  style={styles.avatar}
                />
              ) : (
                <FlexView style={styles.avatarPlaceholder}>
                  <Users size={32} color={colors.text.secondary} />
                </FlexView>
              )}
            </FlexView>
            <FlexView style={styles.organizerInfo}>
              <TextDs style={styles.packageTitle}>
                {packageDetail.title} ({packageDetail.validity})
              </TextDs>
              <TextDs style={styles.purchasedDate}>
                Purchased on {packageDetail.purchasedOn}
              </TextDs>
            </FlexView>
          </FlexView>
        </FlexView>

        {/* Package Usage Section */}
        <FlexView style={styles.usageSection}>
          <TextDs style={[styles.sectionTitle, { fontSize: typography.fontSize[20] }]}>Package Usage</TextDs>
          <FlexView style={styles.usageContent}>
            <FlexView style={styles.usageInfo}>
              <FlexView style={styles.usageHeaderRow}>
                <TextDs style={styles.usageText}>
                  {packageDetail.usedEvents}/{packageDetail.totalEvents}
                </TextDs>
                <TextDs style={styles.expiresText}>Expires on {packageDetail.expiresOn}</TextDs>
              </FlexView>
              <ProgressBar
                current={packageDetail.usedEvents}
                total={packageDetail.totalEvents}
                containerStyle={styles.progressBar}
              />
            </FlexView>
          </FlexView>
        </FlexView>

        {/* Upcoming Events */}
        <FlexView style={styles.eventsSection}>
          {/* <TextDs style={styles.sectionTitle}>Upcoming Events</TextDs> */}
          <FlexView style={styles.eventsList}>
            {packageDetail.events.map((event, index) => (
              <FlexView key={`${event.eventId}-${index}`} style={styles.eventCardWrapper}>
                <EventCard
                  id={event.eventId}
                  event={event}
                  onPress={handleEventPress}
                  onBookmark={handleBookmark}
                  hidePrice
                />
              </FlexView>
            ))}
          </FlexView>
        </FlexView>
      </ScrollView>
    </SafeAreaView>
  );
};

