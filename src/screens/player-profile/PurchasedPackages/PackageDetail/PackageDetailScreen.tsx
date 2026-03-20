import React, { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Users } from 'lucide-react-native';
import { colors, typography } from '@theme';
import { ProgressBar } from '@components/global';
import { EventCard, TextDs, FlexView } from '@components';
import { ActivityIndicator, ScrollView, TouchableOpacity, Image } from 'react-native';
import type { RootStackParamList } from '@navigation';
import type { PackageDetail } from './PackageDetailScreen.types';
import { styles } from './style/PackageDetailScreen.styles';
import { usePlayerMyPackagePurchaseDetail } from '@hooks';
import { coalescePackageContext, formatDate, resolveOrganizerFromPurchaseRow } from '@utils';
import type { EventData } from '@app-types';

type PackageDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PackageDetail'
>;

type PackageDetailScreenRouteProp = RouteProp<RootStackParamList, 'PackageDetail'>;

function mapMyPackagePurchaseDetail(apiData: unknown, purchaseId: string): PackageDetail | null {
  const inner: any = (apiData as any)?.data ?? apiData;
  const item: any = inner?.purchase ?? inner?.purchaseDetails ?? inner?.data ?? inner;

  if (!item || typeof item !== 'object') {
    return null;
  }

  const pkg = coalescePackageContext(item);
  const packageDefId = String(pkg.packageId ?? pkg.id ?? item.packageId ?? item.planId ?? purchaseId);

  const title = String(pkg.packageName ?? pkg.name ?? item.packageName ?? 'Package');

  const organizer = resolveOrganizerFromPurchaseRow(item, pkg);
  const organizerName = organizer.name;
  const organizerAvatar = organizer.avatar;

  const validityMonthsRaw =
    pkg.validityMonths ?? item.validityMonths ?? item.validity_months ?? item.durationMonths;
  const validityMonths = typeof validityMonthsRaw === 'number' ? validityMonthsRaw : undefined;
  const validityLabel = String(pkg.validity ?? item.validity ?? item.validity_label ?? '').trim();
  const validity =
    validityMonths && validityMonths > 0
      ? `${validityMonths} ${validityMonths === 1 ? 'month' : 'months'}`
      : validityLabel || '—';

  const sportsSource = pkg.sports ?? item.sports;
  const sports: string[] = Array.isArray(sportsSource) ? sportsSource.map(String) : [];
  const sport = sports.length ? sports.join(', ') : 'All sports';

  const eventTypeRaw =
    pkg.eventType ??
    pkg.eventTypes ??
    pkg.event_type ??
    pkg.event_types ??
    item.eventType ??
    item.eventTypes ??
    item.event_type ??
    item.event_types;
  const eventTypes = Array.isArray(eventTypeRaw)
    ? eventTypeRaw.filter(Boolean).map(String)
    : typeof eventTypeRaw === 'string'
      ? eventTypeRaw.split(',').map((v: string) => v.trim()).filter(Boolean)
      : [];

  const purchasedAt =
    item.purchasedAt ??
    item.purchaseDate ??
    item.purchased_at ??
    item.createdAt ??
    item.paidAt ??
    item.updatedAt;
  const purchasedOn = purchasedAt ? formatDate(purchasedAt, 'date') : '—';

  const expiresRaw =
    item.expiryDate ??
    item.expiresAt ??
    item.validUntil ??
    item.expiry_date ??
    pkg.expiresAt;
  const expiresOn = expiresRaw ? formatDate(expiresRaw, 'date') : '—';

  const maxEvents =
    Number(item.maxEvents ?? item.totalEvents ?? item.usageTotal ?? item.usage?.total ?? pkg.maxEvents ?? 0) || 0;

  const joined = Number(item.eventsJoined ?? item.usedEvents ?? item.events_joined ?? NaN);
  const remainingSlots = Number(
    item.eventsRemaining ?? item.remainingEvents ?? item.usageRemaining ?? item.usage?.remaining ?? NaN,
  );
  const usedFallback =
    Number(item.usedCredits ?? item.usageUsed ?? item.usage?.used ?? 0) || 0;
  let used: number;
  if (Number.isFinite(joined)) {
    used = Math.max(0, joined);
  } else if (Number.isFinite(remainingSlots) && maxEvents > 0) {
    used = Math.max(0, maxEvents - remainingSlots);
  } else {
    used = usedFallback;
  }

  const eventsRaw =
    item.events ??
    inner?.events ??
    item.bookedEvents ??
    item.joinedEvents ??
    item.upcomingEvents ??
    [];
  const eventsList = Array.isArray(eventsRaw) ? eventsRaw : [];
  const events = eventsList.filter((e: any) => e && (e.eventId || e.id)) as EventData[];

  return {
    purchaseId: String(item.purchaseId ?? item.id ?? purchaseId),
    id: packageDefId,
    title,
    organizerName,
    organizerAvatar,
    validity,
    sport,
    purchasedOn,
    eventTypes,
    totalEvents: maxEvents,
    usedEvents: used,
    expiresOn,
    events,
  };
}

export const PackageDetailScreen: React.FC = () => {
  const navigation = useNavigation<PackageDetailScreenNavigationProp>();
  const route = useRoute<PackageDetailScreenRouteProp>();
  const { purchaseId } = route.params;

  const { data, isLoading, isError, error } = usePlayerMyPackagePurchaseDetail(purchaseId);

  const packageDetail = useMemo(
    () => (data ? mapMyPackagePurchaseDetail(data, purchaseId) : null),
    [data, purchaseId],
  );

  const handleEventPress = (_eventId: string) => {
    // navigation.navigate('EventDetails', { eventId });
  };

  const handleBookmark = (_eventId: string) => {
    // placeholder
  };

  const errorMessage = error instanceof Error ? error.message : 'Failed to load package.';

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <FlexView style={[styles.header, { justifyContent: 'flex-start' }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </FlexView>
        <FlexView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </FlexView>
      </SafeAreaView>
    );
  }

  if (isError || !packageDetail) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <FlexView style={[styles.header, { justifyContent: 'flex-start' }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </FlexView>
        <FlexView style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
          <TextDs style={{ textAlign: 'center', color: colors.text.secondary }}>{errorMessage}</TextDs>
        </FlexView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
        <FlexView style={styles.packageCard}>
          <FlexView style={styles.organizerSection}>
            <FlexView style={styles.avatarContainer}>
              {packageDetail.organizerAvatar ? (
                <Image source={{ uri: packageDetail.organizerAvatar }} style={styles.avatar} />
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
              <TextDs style={styles.purchasedDate}>Purchased on {packageDetail.purchasedOn}</TextDs>
            </FlexView>
          </FlexView>
        </FlexView>

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

        <FlexView style={styles.eventsSection}>
          <FlexView style={styles.eventsList}>
            {packageDetail.events.length === 0 ? (
              <TextDs style={{ color: colors.text.secondary, marginBottom: 16 }}>
                No linked events to show yet.
              </TextDs>
            ) : null}
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
