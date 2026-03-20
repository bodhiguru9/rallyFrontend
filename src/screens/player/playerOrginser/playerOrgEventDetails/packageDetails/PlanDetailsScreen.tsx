import React, { useMemo, useState } from 'react';
import { TextDs, FlexView, ImageDs } from '@components';
import { ActivityIndicator, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation';
import { useQueryClient } from '@tanstack/react-query';
import { PlanHeader } from './components/PlanHeader';
import { PlanSection } from './components/PlanSection';
import { PlanTags } from './components/PlanTags';
import { InfoRow } from './components/InfoRow';
import { CreditsCard } from './components/CreditsCard';
import { OrganiserCard } from './components/OrganiserCard';
import { PaymentFooter } from './components/PaymentFooter';
import { colors, spacing, getFontStyle, borderRadius } from '@theme';
import { logger } from '@dev-tools';
import { ORGANISER_DATA } from '../data/organiserEventDetails.data';
import { usePackageDetails, usePlayerPurchasedPackages, usePurchasePackage } from '@hooks';
import { useAuthStore } from '@store';
import { findActivePurchaseForPackage } from '@utils';
import { BookingModal } from '@screens/event-details/BookingModal';
import type { BookingModalPaymentPayload } from '@screens/event-details/BookingModal/BookingModal.types';
import { PlanPurchasedModal } from './components/PlanPurchasedModal';

type PlanDetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PlanDetails'
>;

export const PlanDetailsScreen: React.FC = () => {
  const navigation = useNavigation<PlanDetailsScreenNavigationProp>();
  const route = useRoute();
  const packageId = (route.params as { packageId?: string })?.packageId;
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data: myPackagesData } = usePlayerPurchasedPackages({
    enabled: !!packageId && isAuthenticated,
  });

  const activePurchase = useMemo(
    () => findActivePurchaseForPackage(myPackagesData, packageId),
    [myPackagesData, packageId],
  );

  // If no packageId provided, show error and navigate back
  React.useEffect(() => {
    if (!packageId) {
      logger.error('PlanDetailsScreen: No packageId provided in route params');
      Alert.alert('Error', 'Invalid package. Please try again.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
  }, [packageId, navigation]);

  const { data, isLoading, isFetching } = usePackageDetails(packageId);
  const [isPurchaseModalVisible, setIsPurchaseModalVisible] = useState(false);
  const [isPurchasedPopupVisible, setIsPurchasedPopupVisible] = useState(false);
  const [purchaseResponse, setPurchaseResponse] = useState<any>(null);
  const purchaseMutation = usePurchasePackage(packageId || '', {
    showSuccessAlert: false,
    onSuccess: (response: any) => {
      setPurchaseResponse(response);
      setIsPurchasedPopupVisible(true);
    },
  });

  const details = useMemo(() => {
    const root: any = (data as any)?.data ?? data;
    const candidate: any =
      root?.package ?? root?.packageDetails ?? root?.details ?? root?.data ?? root;

    const p: any = candidate ?? {};
    const eventTypeRaw = p.eventType ?? p.eventTypes ?? p.event_type;
    const eventTypes = Array.isArray(eventTypeRaw)
      ? eventTypeRaw.filter(Boolean).map(String)
      : typeof eventTypeRaw === 'string'
        ? eventTypeRaw.split(',').map((v: string) => v.trim()).filter(Boolean)
        : [];

    const tags = eventTypes.map((t: string) => {
      const key = String(t).toLowerCase();
      const icon = key === 'social' ? 'users' : key === 'class' ? 'book-open' : key === 'tournament' ? 'award' : 'tag';
      const label = key ? key.charAt(0).toUpperCase() + key.slice(1) : 'Tag';
      return { label, icon };
    });

    const validityMonths = typeof p.validityMonths === 'number' ? p.validityMonths : undefined;
    const duration =
      validityMonths && validityMonths > 0
        ? `${validityMonths} ${validityMonths === 1 ? 'month' : 'months'}`
        : typeof p.validity === 'string'
          ? p.validity
          : '—';

    const sports: string[] = Array.isArray(p.sports) ? p.sports : [];
    const activities = sports.length ? sports.join(', ') : 'All Sports';

    const title = String(p.packageName ?? p.title ?? 'Package');
    const about = String(p.packageDescription ?? p.description ?? '—');
    const price = Number(p.packagePrice ?? p.price ?? 0);
    const credits = Number(p.maxEvents ?? p.credits ?? 0); // Use maxEvents as credits
    const currency = String(p.currency ?? 'AED');
    const validity = typeof p.validity === 'string'
      ? p.validity
      : validityMonths
        ? `${duration}`
        : '—';

    const creator = p.creator ?? {};
    const organiserName = String(
      creator.fullName ?? p.organiserName ?? p.organizerName ?? p.communityName ?? ORGANISER_DATA.name,
    );
    const organiserImage = String(
      creator.profilePic ?? p.organiserProfilePic ?? p.organizerAvatar ?? p.profilePic ?? ORGANISER_DATA.profileImage,
    );
    const hostedCount = Number(
      creator.eventsCreated ?? p.hostedCount ?? p.eventsHosted ?? ORGANISER_DATA.hostedCount,
    );
    const attendeesCount = Number(
      creator.totalAttendees ?? p.attendeesCount ?? p.totalAttendees ?? ORGANISER_DATA.attendeesCount,
    );

    const hasActivePurchaseFromApi = !!(
      p.hasActivePurchase ??
      p.userHasActivePurchase ??
      (p.activePurchaseId != null && String(p.activePurchaseId).length > 0)
    );

    return {
      title,
      tags,
      duration,
      activities,
      about,
      price,
      credits,
      currency,
      validity,
      organiserName,
      organiserImage,
      hostedCount,
      attendeesCount,
      total: Number.isFinite(price) ? price : 0,
      hasActivePurchaseFromApi,
    };
  }, [data]);

  const hasActivePurchase = !!activePurchase || details.hasActivePurchaseFromApi;

  const handleBuyNow = () => {
    logger.info('Buy Now pressed for package:', packageId);
    if (!packageId) {
      return;
    }
    setIsPurchaseModalVisible(true);
  };

  const handleClosePurchaseModal = () => setIsPurchaseModalVisible(false);

  const handlePurchase = async (payload?: BookingModalPaymentPayload) => {
    if (!packageId) {
      return;
    }
    // close modal first (same pattern as event booking flow)
    setIsPurchaseModalVisible(false);

    try {
      await purchaseMutation.mutateAsync({
        promoCode: payload?.promoCode ?? null,
        amount: payload?.amount,
        currency: payload?.currency,
        cardLast4: payload?.cardLast4 ?? null,
        expiryMonth: payload?.expiryMonth ?? null,
        expiryYear: payload?.expiryYear ?? null,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : '';
      const alreadyOwned = /already have an active purchase/i.test(msg);
      if (alreadyOwned) {
        queryClient.invalidateQueries({ queryKey: ['player-my-packages'] });
        return;
      }
      setIsPurchaseModalVisible(true);
    }
  };

  const handleViewOwnedPackage = () => {
    if (activePurchase?.purchaseId) {
      navigation.navigate('PackageDetail', { purchaseId: activePurchase.purchaseId });
    } else {
      navigation.navigate('PurchasedPackages');
    }
  };

  const handleViewCredits = () => {
    setIsPurchasedPopupVisible(false);
    navigation.navigate('PurchasedPackages');
  };

  const isBusy = isLoading || isFetching;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <PlanHeader />

      {isBusy ? (
        <FlexView style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
        </FlexView>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Main Blue-Bordered Card Container */}
            <FlexView style={styles.mainContentCard}>
              {/* Plan Title & Tags */}
              <PlanSection title={details.title} titleStyle={styles.planTitle}>
                <PlanTags tags={details.tags} />
              </PlanSection>

              {/* Duration and Activities */}
              <PlanSection title="" style={styles.infoSection}>
                <InfoRow icon="calendar" text={details.duration} />
                <InfoRow icon="map-pin" text={details.activities} />
              </PlanSection>

              {/* About Offer */}
              <PlanSection title="About Offer" titleStyle={styles.sectionTitle}>
                <TextDs style={styles.description}>{details.about}</TextDs>
              </PlanSection>

              {/* Price & Credits */}
              <PlanSection title="Price & Credits" titleStyle={styles.sectionTitle}>
                <FlexView style={styles.priceRow}>
                  <FlexView style={styles.priceLeft}>
                    <ImageDs image="DhiramIcon" size={18} />
                    <TextDs style={styles.priceValueText}>{details.price}</TextDs>
                  </FlexView>
                  <TextDs style={styles.creditsText}>{details.credits} credits</TextDs>
                </FlexView>
              </PlanSection>

              {/* Redeemable Credits Card */}
              <CreditsCard credits={details.credits} validity={details.validity} />

              {/* Organizer Details */}
            </FlexView>
            {!!details.organiserImage && (
              <OrganiserCard
                name={details.organiserName}
                profileImage={details.organiserImage}
                hostedCount={details.hostedCount}
                attendeesCount={details.attendeesCount}
              />
            )}
          </ScrollView>

          {/* This footer now handles the Total and Buy Now button */}
          <PaymentFooter
            total={details.total}
            currency={details.currency}
            onBuyNow={handleBuyNow}
            hasActivePurchase={hasActivePurchase}
            onViewOwnedPackage={handleViewOwnedPackage}
          />
        </>
      )}

      {/* Modals remain same */}
      <BookingModal
        visible={isPurchaseModalVisible}
        totalPrice={details.total}
        currency={details.currency || 'AED'}
        guestsCount={1}
        onClose={handleClosePurchaseModal}
        onBookEvent={handlePurchase}
        primaryButtonText={purchaseMutation.isPending ? 'Buying...' : 'Buy Package'}
      />

      <PlanPurchasedModal
        visible={isPurchasedPopupVisible}
        onClose={() => setIsPurchasedPopupVisible(false)}
        onViewCredits={handleViewCredits}
        creditsAdded={purchaseResponse?.data?.purchase?.maxEvents ?? details.credits}
        packageName={purchaseResponse?.data?.purchase?.packageName ?? details.title}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9F6', // Light greenish-white background from image
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.base,
    paddingBottom: spacing.xl,
  },
  mainContentCard: {
    // backgroundColor: '#FFFDEF80', // Very light green internal background
    borderRadius: borderRadius.lg,
    // borderWidth: 2,
    padding: spacing.md,
    gap: spacing.md,
  },
  planTitle: {
    ...getFontStyle(20, 'bold'),
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  infoSection: {
    backgroundColor: '#FFFDEF80',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    gap: spacing.xs,
  },
  description: {
    backgroundColor: '#FFFDEF80',
    ...getFontStyle(14, 'regular'),
    color: colors.text.primary,
    lineHeight: 18,
  },
  priceRow: {
    backgroundColor: '#FFFDEF80',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "flex-start",
    // backgroundColor: colors.background.white,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  priceLeft: {
    backgroundColor: '#FFFDEF80',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  priceValueText: {
    backgroundColor: '#FFFDEF80',
    ...getFontStyle(18, 'bold'),
    color: colors.primary, // Darker blue for price
  },
  creditsText: {
    backgroundColor: '#FFFDEF80',
    ...getFontStyle(14, 'regular'),
    color: colors.text.secondary,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});