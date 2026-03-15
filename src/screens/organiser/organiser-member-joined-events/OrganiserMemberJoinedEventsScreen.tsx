import React, { useMemo } from 'react';
import { FlexView } from '@components';
import { ActivityIndicator, Image, ScrollView } from 'react-native';
import { resolveImageUri } from '@utils/image-utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
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
  const navigation = useNavigation();
  const route = useRoute<ScreenRouteProp>();
  const { userId, fullName, profilePic } = route.params;
  const { data, isLoading } = useUserJoinedEvents(userId, 1, 20, { enabled: userId > 0 });

  const member = data?.data?.user;
  const events = useMemo(() => {
    const list = data?.data?.events || [];
    return [...list].sort((a, b) => {
      const dateA = new Date(a.eventDateTime ?? a.event_date_time ?? 0).getTime();
      const dateB = new Date(b.eventDateTime ?? b.event_date_time ?? 0).getTime();
      return dateA - dateB;
    });
  }, [data?.data?.events]);
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
              {(profilePic || member?.profilePic) ? (
                <Image source={{ uri: resolveImageUri(profilePic ?? member?.profilePic) ?? '' }} style={styles.avatar} />
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
                    onPress={(id) => navigation.navigate('OrganiserEventDetails', { eventId: String(id) })}
                    onBookmark={() => {}}
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
