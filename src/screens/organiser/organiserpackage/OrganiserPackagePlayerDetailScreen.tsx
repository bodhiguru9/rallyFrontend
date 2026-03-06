import React, { useMemo } from 'react';
import { TextDs,  FlexView } from '@components';
import {ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, User } from 'lucide-react-native';
import type { RootStackParamList } from '@navigation';
import { colors } from '@theme';
import { ProgressBar } from '@components/global';
import { EventCard } from '@components/global/EventCard';
import { formatDate } from '@utils';
import { styles } from './style/OrganiserPackagePlayerDetailScreen.styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'OrganiserPackagePlayerDetail'>;
type Route = RouteProp<RootStackParamList, 'OrganiserPackagePlayerDetail'>;

import { useOrganiserPurchaseDetails } from '@hooks/organiser';

export const OrganiserPackagePlayerDetailScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { userId, packageId } = route.params;

  const { data, isLoading, isFetching } = useOrganiserPurchaseDetails(userId, {
    enabled: !!userId,
    page: 1,
    perPage: 20,
  });

  const purchase = useMemo(() => {
    const root: any = (data as any)?.data ?? data;
    const list: any[] = root?.data?.purchases ?? root?.purchases ?? [];
    if (!Array.isArray(list) || list.length === 0) {
      return null;
    }
    const found = list.find((p) => String(p?.package?.packageId ?? p?.packageId) === String(packageId));
    return found ?? list[0];
  }, [data, packageId]);

  const isBusy = isLoading || isFetching;

  const headerName = purchase?.user?.fullName ?? 'Player';
  const avatarUri = purchase?.user?.profilePic ?? null;
  const validityMonths = purchase?.package?.validityMonths ?? purchase?.validityMonths;
  const validityText =
    typeof validityMonths === 'number'
      ? `${validityMonths} ${validityMonths === 1 ? 'month' : 'months'}`
      : '—';

  const joinedOn = purchase?.purchaseDate ? formatDate(purchase.purchaseDate, 'date', { locale: 'en-GB' }) : '—';
  const expiresOn = purchase?.expiryDate ? formatDate(purchase.expiryDate, 'date', { locale: 'en-GB' }) : '—';

  const maxEvents = Number(purchase?.maxEvents ?? purchase?.package?.maxEvents ?? 0) || 0;
  const eventsRemaining = Number(purchase?.eventsRemaining ?? 0) || 0;
  const eventsJoined = Number(purchase?.eventsJoined ?? Math.max(0, maxEvents - eventsRemaining)) || 0;

  const joinedEvents = Array.isArray(purchase?.joinedEvents) ? purchase.joinedEvents : [];

  const handleEventPress = (eventId: string) => {
    // organiser viewing purchase details; keep it read-only for now
    // could navigate to EventDetails if needed
    // navigation.navigate('EventDetails', { eventId });
  };

  const handleShare = (_eventId: string) => {};

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <FlexView style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <ArrowLeft size={22} color={colors.text.primary} />
        </TouchableOpacity>
      </FlexView>

      {isBusy ? (
        <FlexView style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
        </FlexView>
      ) : !purchase ? (
        <FlexView style={styles.loadingWrap}>
          <TextDs style={styles.emptyText}>No data found</TextDs>
        </FlexView>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Player header card */}
          <FlexView style={styles.playerCard}>
            <FlexView style={styles.avatarWrap}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatar} />
              ) : (
                <FlexView style={styles.avatarFallback}>
                  <User size={18} color={colors.text.secondary} />
                </FlexView>
              )}
            </FlexView>
            <FlexView style={styles.playerInfo}>
              <TextDs style={styles.playerName}>
                {headerName} ({validityText})
              </TextDs>
              <TextDs style={styles.playerSub}>Joined on {joinedOn}</TextDs>
            </FlexView>
          </FlexView>

          {/* Usage */}
          <FlexView style={styles.usageWrap}>
            <FlexView style={styles.usageHeaderRow}>
              <TextDs style={styles.usageTitle}>Package Usage</TextDs>
            </FlexView>
            <FlexView style={styles.usageTopRow}>
              <TextDs style={styles.usageCount}>
                {eventsJoined}/{maxEvents || 0}
              </TextDs>
              <TextDs style={styles.expiresText}>Expires on {expiresOn}</TextDs>
            </FlexView>
            <ProgressBar current={eventsJoined} total={maxEvents || 1} containerStyle={styles.progressBar} />
          </FlexView>

          {/* Joined events */}
          <FlexView style={styles.eventsList}>
            {joinedEvents.map((event: any, index: number) => (
              <FlexView key={`${event.eventId ?? event.id ?? index}`} style={styles.eventCardWrap}>
                <EventCard
                  id={String(event.eventId ?? event.id ?? index)}
                  event={event}
                  onPress={handleEventPress}
                  onBookmark={handleShare}
                  hidePrice
                  spotsStatusLabel={
                    (event.spotsInfo?.spotsFull ?? false) ? 'Waitlist Open' : 'Waitlist Closed'
                  }
                />
              </FlexView>
            ))}
          </FlexView>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

