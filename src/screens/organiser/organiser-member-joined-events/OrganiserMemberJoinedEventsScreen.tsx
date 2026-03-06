import React, { useMemo } from 'react';
import { FlexView } from '@components';
import { ActivityIndicator, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation';
import { Card } from '@components/global/Card';
import { EventCard } from '@components/global/EventCard';
import { TextDs } from '@designSystem/atoms/TextDs';
import { useUserJoinedEvents } from '@hooks/organiser';
import { colors, spacing } from '@theme';
import { styles } from './style/OrganiserMemberJoinedEventsScreen.styles';

type ScreenRouteProp = NativeStackScreenProps<
  RootStackParamList,
  'OrganiserMemberJoinedEvents'
>['route'];

export const OrganiserMemberJoinedEventsScreen: React.FC = () => {
  const route = useRoute<ScreenRouteProp>();
  const { userId, fullName, profilePic } = route.params;
  const { data, isLoading } = useUserJoinedEvents(userId, 1, 20, { enabled: userId > 0 });

  const member = data?.data?.user;
  const events = useMemo(() => data?.data?.events || [], [data?.data?.events]);
  const totalCount = data?.data?.pagination?.totalCount ?? events.length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {isLoading ? (
        <FlexView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </FlexView>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Card style={styles.memberCard}>
            <FlexView style={styles.memberRow}>
              {profilePic ? (
                <Image source={{ uri: profilePic }} style={styles.avatar} />
              ) : (
                <FlexView style={styles.avatarPlaceholder}>
                  <TextDs size={14} weight="regular" color="primary">
                    {(fullName || member?.fullName)?.[0] || 'U'}
                  </TextDs>
                </FlexView>
              )}
              <FlexView style={styles.memberInfo}>
                <TextDs size={14} weight="regular" color="primary">
                  {fullName || member?.fullName || 'Member'}
                </TextDs>
                <TextDs size={14} weight="regular" color="secondary">
                  Booked {totalCount} Events
                </TextDs>
              </FlexView>
            </FlexView>
          </Card>

          <TextDs size={14} weight="regular" color="primary" style={styles.sectionTitle}>
            Joined Events
          </TextDs>

          <FlexView style={styles.cardsList}>
            {events.length > 0 ? (
              events.map((event) => {
                const totalSpots = event.eventMaxGuest || 0;
                const spotsBooked = event.eventTotalAttendNumber || 0;
                const spotsFull = totalSpots > 0 && spotsBooked >= totalSpots;
                return (
                  <EventCard
                    key={event.eventId}
                    id={event.eventId}
                    event={event as any}
                    onPress={() => { }}
                    onBookmark={() => { }}
                    spotsStatusLabel={spotsFull ? 'Fully Booked' : 'Spots Available'}
                    hidePrice={false}
                  />
                );
              })
            ) : (
              <TextDs size={14} weight="regular" color="tertiary" align="center">
                No joined events found.
              </TextDs>
            )}
          </FlexView>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};
