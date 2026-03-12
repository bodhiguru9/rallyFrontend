import React, { useMemo, useState } from 'react';
import { Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation';
import { IconTag } from '@components/global/IconTag';
import { Card } from '@components/global/Card';
import { FlexView, ImageDs, TextDs, Avatar } from '@components';
import { useEvent } from '@hooks/use-events';
import { colors, spacing } from '@theme';
import { formatDate, shareEvent } from '@utils';
import { Map } from 'lucide-react-native';
import { styles } from './style/OrganiserAnalyticsEventDetailsScreen.styles';
import { styles as eventStyles } from '@screens/event-details/style/EventDetailsScreen.styles';

type ScreenRouteProp = NativeStackScreenProps<
  RootStackParamList,
  'OrganiserAnalyticsEventDetails'
>['route'];

export const OrganiserAnalyticsEventDetailsScreen: React.FC = () => {
  const route = useRoute<ScreenRouteProp>();
  const { eventId } = route.params;
  const { data: event, isLoading } = useEvent(eventId);
  const [activeTab, setActiveTab] = useState<'about' | 'members'>('about');

  const restrictionsText = useMemo(() => {
    const parts: string[] = [];
    if (event?.eventMinAge && event?.eventMaxAge) {
      parts.push(`${event.eventMinAge} - ${event.eventMaxAge} yrs`);
    }
    if (event?.eventSportsLevel) {
      parts.push(`${event.eventSportsLevel} Level`);
    }
    return parts.length > 0 ? parts.join(', ') : 'No restrictions';
  }, [event?.eventMinAge, event?.eventMaxAge, event?.eventSportsLevel]);

  const guestAllowanceText = useMemo(() => {
    const maxGuests = event?.eventMaxGuest ? `${event.eventMaxGuest} members max` : 'Guest limit N/A';
    const waitlist = event?.spotsInfo?.spotsFull || (event?.waitlistCount || 0) > 0 ? 'Allows Waitlist' : 'Waitlist Closed';
    return `${maxGuests}, ${waitlist}`;
  }, [event?.eventMaxGuest, event?.spotsInfo?.spotsFull, event?.waitlistCount]);

  const eventTypeText = useMemo(() => {
    const visibility = event?.IsPrivateEvent ? 'Private' : 'Public';
    const approval = event?.eventApprovalReq ? ': Approval Required' : '';
    return `${visibility}${approval}`;
  }, [event?.IsPrivateEvent, event?.eventApprovalReq]);

  if (isLoading) {
    return (
      <SafeAreaView style={eventStyles.container}>
        <FlexView style={eventStyles.loadingContainer}>
          <TextDs style={eventStyles.loadingText}>Loading event details...</TextDs>
        </FlexView>
      </SafeAreaView>
    );
  }

  if (!event) {
    return null;
  }

  const handleShare = () => {
    shareEvent({
      eventId: event.eventId ?? eventId,
      eventName: event.eventName ?? 'Event',
      creatorName: event.creator?.fullName ?? event.eventCreatorName ?? '',
      formattedDateTime: formatDate(event.eventDateTime ?? '', 'display-range'),
      eventLocation: event.eventLocation ?? undefined,
    });
  };

  return (
    <SafeAreaView style={eventStyles.container} edges={['top']}>
      <FlexView style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'about' ? styles.tabActive : styles.tabInactive]}
          onPress={() => setActiveTab('about')}
          activeOpacity={0.8}
        >
          <TextDs size={14} weight="regular" color={activeTab === 'about' ? 'white' : 'secondary'}>
            About
          </TextDs>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'members' ? styles.tabActive : styles.tabInactive]}
          onPress={() => setActiveTab('members')}
          activeOpacity={0.8}
        >
          <TextDs size={14} weight="regular" color={activeTab === 'members' ? 'white' : 'secondary'}>
            Members
          </TextDs>
        </TouchableOpacity>
      </FlexView>

      <ScrollView
        style={eventStyles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={eventStyles.scrollContent}
      >
        {activeTab === 'about' && (
          <>
            <FlexView style={eventStyles.card}>
              <FlexView style={eventStyles.eventOverview}>
                <Image
                  source={{ uri: event.eventImages?.[0] || 'https://via.placeholder.com/150' }}
                  style={eventStyles.eventImage}
                />
                <FlexView style={eventStyles.eventInfo}>
                  <TextDs style={eventStyles.eventTitle}>{event.eventName}</TextDs>
                  <TextDs style={eventStyles.organizerName}>
                    by {event.creator?.fullName || event.eventCreatorName || 'Unknown Organizer'}
                  </TextDs>
                  <FlexView style={eventStyles.categoriesContainer}>
                    <IconTag
                      title={event.eventSports?.[0] || 'Sport'}
                      variant="orange"
                    />
                    <IconTag
                      title={event.eventType || 'Social'}
                      variant="teal"
                    />
                  </FlexView>
                </FlexView>
                <TouchableOpacity style={eventStyles.shareButton} onPress={handleShare}>
                  <ImageDs image="PaperPlane" size={24} />
                </TouchableOpacity>
              </FlexView>
            </FlexView>

            <FlexView style={eventStyles.card}>
              <FlexView style={eventStyles.infoRow}>
                <ImageDs image="time" size={16} />
                <TextDs style={eventStyles.infoText}>
                  {formatDate(event.eventDateTime ?? '', 'display-range')}
                </TextDs>
              </FlexView>
              <FlexView style={eventStyles.infoRow}>
                <ImageDs image="locationPin" size={16} />
                <TextDs style={eventStyles.infoText}>{event.eventLocation ?? ''}</TextDs>
              </FlexView>
              <FlexView style={eventStyles.mapContainer}>
                <FlexView style={eventStyles.mapPlaceholder}>
                  <Map size={40} color={colors.text.tertiary} />
                  <TextDs style={eventStyles.mapText}>Map View</TextDs>
                </FlexView>
              </FlexView>
            </FlexView>
          </>
        )}

        {activeTab === 'about' ? (
          <>
            <Card style={eventStyles.card}>
              <TextDs style={eventStyles.cardTitle}>About Event</TextDs>
              <TextDs style={eventStyles.descriptionText}>
                {event.eventDescription || 'No description available.'}
              </TextDs>
            </Card>

            <Card style={eventStyles.card}>
              <TextDs style={eventStyles.cardTitle}>Restrictions</TextDs>
              <TextDs style={eventStyles.restrictionsText}>{restrictionsText}</TextDs>
            </Card>

            <Card style={eventStyles.card}>
              <TextDs style={eventStyles.cardTitle}>Guest Allowance</TextDs>
              <FlexView flexDirection="row" alignItems="center" gap={spacing.xs}>
                <ImageDs image="DhiramIcon" style={styles.priceIcon} />
                <TextDs size={16} weight="semibold" color='blueGray'>
                  {event.eventPricePerGuest}
                </TextDs>
                <TextDs size={12} weight="regular" color="secondary">{guestAllowanceText}</TextDs>
              </FlexView>

            </Card>

            <Card style={eventStyles.card}>
              <TextDs style={eventStyles.cardTitle}>Event Type</TextDs>
              <TextDs style={eventStyles.restrictionsText}>{eventTypeText}</TextDs>
            </Card>

            <Card style={eventStyles.card}>
              <TextDs style={eventStyles.cardTitle}>Refund Policy</TextDs>
              <TextDs style={eventStyles.restrictionsText}>Allow refunds always</TextDs>
            </Card>
          </>
        ) : (
          <FlexView style={styles.membersSection}>
            <FlexView style={styles.statsRow}>
              <FlexView style={[styles.statCard, styles.statCardActive]}>
                <TextDs size={14} weight="regular">
                  {event.participantsCount ?? (event.participants?.length ?? 0)}
                </TextDs>
                <TextDs size={14} weight="regular">
                  Joined
                </TextDs>
              </FlexView>
              <FlexView style={styles.statCard}>
                <TextDs size={14} weight="regular">
                  {event.waitlistCount ?? 0}
                </TextDs>
                <TextDs size={14} weight="regular">
                  Waitlisted
                </TextDs>
              </FlexView>
            </FlexView>

            <FlexView style={styles.progressRow}>
              <TextDs size={14} weight="regular" color="secondary">
                {event.participantsCount ?? (event.participants?.length ?? 0)}/{event.eventMaxGuest}
              </TextDs>
              <TextDs size={14} weight="regular" color="secondary">
                {event.spotsInfo?.spotsFull ? 'Waitlist Open' : 'Waitlist Closed'}
              </TextDs>
            </FlexView>
            <FlexView style={styles.progressBarTrack}>
              <FlexView
                style={[
                  styles.progressBarFill,
                  {
                    width: `${event.eventMaxGuest
                      ? Math.min(
                        ((event.participantsCount ?? (event.participants?.length ?? 0)) / event.eventMaxGuest) *
                        100,
                        100,
                      )
                      : 0
                      }%`,
                  },
                ]}
              />
            </FlexView>

            <TextDs size={14} weight="regular" color="primary" style={styles.joinedTitle}>
              Joined Players
            </TextDs>
            <FlexView style={styles.membersList}>
              {(event.participants ?? []).map((participant) => (
                <FlexView key={participant.userId} style={styles.memberCard}>
                  <FlexView style={styles.memberRow}>
                    <Avatar
                      imageUri={participant.profilePic}
                      fullName={participant.fullName}
                      size="lg"
                    />
                    <FlexView style={styles.memberInfo}>
                      <TextDs size={14} weight="regular" color="primary">
                        {participant.fullName}
                      </TextDs>
                      <TextDs size={14} weight="regular" color="secondary">
                        Joined
                      </TextDs>
                    </FlexView>
                  </FlexView>
                  <FlexView style={styles.memberPrice}>
                    <ImageDs image="DhiramIcon" style={styles.priceIcon} />
                    <TextDs size={14} weight="regular" color="blueGray">
                      {event.eventPricePerGuest}
                    </TextDs>
                  </FlexView>
                </FlexView>
              ))}
            </FlexView>
          </FlexView>
        )}
      </ScrollView>
    </SafeAreaView >
  );
};
