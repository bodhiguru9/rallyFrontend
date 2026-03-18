import React from 'react';
import { ScrollView, TouchableOpacity, Image, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation';
import { spacing } from '@theme';
import { styles } from './style/EventDetailsScreen.styles';
import { MembersModal } from './MembersModal';
import { CancelBookingModal } from './cancel-booking-modal';
import { BookingModal } from './BookingModal';
import { Dropdown } from '@designSystem/molecules/dropdown';
import { IconTag } from '@components/global/IconTag';
import { images } from '@assets/images';
import { Calendar1, Users, ChevronUp } from 'lucide-react-native';
import { formatDate, calculateSpotsFilled } from '@utils';
import { resolveImageUri } from '@utils/image-utils';
import { YellowBanner, EventDetailsMap } from './components';
import { Card } from '@components/global/Card';
import { Seperator, TextDs, ImageDs, Avatar } from '@components';
import { ArrowIcon } from '@components/global/ArrowIcon';
import { ParticipantProfiles } from '@designSystem/materials/ParticipantProfiles';
import { useEventDetails } from './use-event-details';
import { FlexView } from '@designSystem/atoms/FlexView';
import { BackdropBlur } from '@components/global/BackdropBlur';

/** Maps policyJoind (organiser's refund policy) to human-readable text. Returns null only for invalid values. */
const getRefundPolicyText = (policyJoind?: string | null): string | null => {
  switch (policyJoind) {
    case 'before-event':
      return 'Refund allowed before the day of the event. Cancel before the event day to receive a full refund.';
    case 'until-start':
      return 'Refund allowed until event starts. Cancel anytime before the event starts to receive a full refund.';
    case 'no-restrictions':
      return 'No restrictions. Refunds are allowed as per the organiser\'s discretion.';
    default:
      return null;
  }
};

/** For paid events: use organiser's policy or default to before-event if API doesn't return it yet. */
const getRefundPolicyForDisplay = (policyJoind?: string | null, isPaidEvent?: boolean): string | null => {
  const text = getRefundPolicyText(policyJoind);
  if (text) return text;
  // Backend may not return policyJoind yet; show default (matches create-event placeholder)
  return isPaidEvent ? getRefundPolicyText('before-event') : null;
};
type EventDetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'EventDetails'
>;

export const EventDetailsScreen: React.FC = () => {
  const navigation = useNavigation<EventDetailsScreenNavigationProp>();
  const insets = useSafeAreaInsets();

  const {
    event,
    isLoading,
    isAuthenticated,
    user,
    isOrganiser,
    guestsCount,
    setGuestsCount,
    isMembersModalVisible,
    totalPrice,
    variant,
    buttonText,
    handleShare,
    handleSignIn,
    handleBookNow,
    isBookingModalVisible,
    handleCloseBookingModal,
    handleOpenMembersModal,
    handleCloseMembersModal,
    getRefundDate,
    showPayNow,
    handlePayNow,
    canCancelBooking,
    isCancelBookingModalVisible,
    handleCloseCancelBookingModal,
    handleCancelBooking,
    handleCancelBookingSuccess,
    handleApplePay,
    handleBookEvent,
    cancelBookingId,
    cancelVariant,
    eventId,
    pendingInvitation,
    acceptInvitationMutation,
    declineInvitationMutation,
    isBookingEvent,
    isLeavingEvent,
    isRegistrationEnded,
  } = useEventDetails();


  const handleOrganiserPress = () => {
    const organiserId = event?.creator?.userId;
    if (!organiserId) {
      return;
    }
    navigation.navigate('PlayerOrgEventDetails', { organiserId: String(organiserId) });
  };
  const canInviteGuests =
    !pendingInvitation &&
    !isOrganiser &&
    event?.eventOurGuestAllowed !== false;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <FlexView style={styles.loadingContainer}>
          <TextDs style={styles.loadingText}>Loading event details...</TextDs>
        </FlexView>
      </SafeAreaView>
    );
  }

  if (!event) {
    return null;
  }

  const isPaidEvent = event.eventPricePerGuest != null && event.eventPricePerGuest > 0;
  const refundPolicyText = getRefundPolicyForDisplay(event.policyJoind, isPaidEvent);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <FlexView style={styles.header}>
        <ArrowIcon variant="left" onClick={() => navigation.goBack()} />
        <TextDs style={styles.headerTitle}>Event Details</TextDs>
        <FlexView style={styles.headerRight} />
      </FlexView>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Event Overview Card */}
        <FlexView style={styles.card}>
          <FlexView style={styles.eventOverview}>
            <Image
              source={
                resolveImageUri(
                  event.eventImages?.[0] ||
                  event.gameImages?.[0] ||
                  (event as any).eventImage ||
                  (event as any).creatorProfilePic ||
                  event.creator?.profilePic
                )
                  ? {
                    uri: resolveImageUri(
                      event.eventImages?.[0] ||
                      event.gameImages?.[0] ||
                      (event as any).eventImage ||
                      (event as any).creatorProfilePic ||
                      event.creator?.profilePic
                    )
                  }
                  : images.blackLogo
              }
              style={styles.eventImage}
            />
            <FlexView style={styles.eventInfo}>
              <TextDs style={styles.eventTitle}>{event.eventName}</TextDs>
              <TextDs style={styles.organizerName}>
                by {event.creator?.fullName || event.eventCreatorName || 'Unknown Organizer'}
              </TextDs>
              <FlexView style={styles.categoriesContainer}>
                <IconTag title={event.eventSports?.[0] ?? 'Sport'} variant="orange" />
                <IconTag title={event.eventType ?? 'Event'} variant="teal" />
              </FlexView>
            </FlexView>
            <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
              <ImageDs image="PaperPlane" size={24} />
            </TouchableOpacity>
          </FlexView>
        </FlexView>

        {/* Date and Location Card */}
        <FlexView style={styles.card}>
          <FlexView style={styles.infoRow}>
            <ImageDs image="Time" size={16} />
            <TextDs style={styles.infoText}>{formatDate(event.eventDateTime ?? '', 'display-range')}</TextDs>
          </FlexView>
          <FlexView style={styles.infoRow}>
            <ImageDs image="LocationPin" size={16} />
            <TextDs style={styles.infoText}>{event.eventLocation}</TextDs>
          </FlexView>
          <FlexView style={styles.mapContainer}>
            <EventDetailsMap address={event.eventLocation} />
          </FlexView>
        </FlexView>

        {/* Approval Needed Banner - only show if event is private and requires approval */}
        <YellowBanner
          variant={variant}
          eventRegistrationStartTime={event.eventRegistrationStartTime}
        />

        {/* Members & Guests Card */}
        <Card style={{ padding: spacing.base, marginBottom: spacing.base }}>
          <TextDs style={styles.cardTitle}>Members & Guests</TextDs>
          <FlexView style={styles.membersSection}>
            {/* Guest count dropdown - only show if guests are allowed, user hasn't joined, and there's no pending request/payment. Organisers cannot book. */}
            {event.eventOurGuestAllowed !== false &&
              !event?.isJoined &&
              !event?.userJoinStatus?.hasRequest &&
              event?.userJoinStatus?.action !== 'payment-pending' &&
              !pendingInvitation &&
              canInviteGuests ?
              (
                <Dropdown
                  // label="Number of Guests"
                  placeholder="Select guests"
                  options={
                    event.spotsInfo?.spotsLeft && event.spotsInfo.spotsLeft > 0
                      ? Array.from({ length: Math.min(event.spotsInfo.spotsLeft, event.eventMaxGuest || 1) }, (_, i) => ({
                        label: `${i + 1} ${i + 1 === 1 ? 'Person' : 'People'}`,
                        value: String(i + 1),
                      }))
                      : []
                  }
                  value={String(guestsCount)}
                  onSelect={(value) => setGuestsCount(Number(value))}
                  disabled={!event.spotsInfo?.spotsLeft || event.spotsInfo.spotsLeft === 0}
                  containerStyle={{ marginBottom: spacing.sm, width: 140 }}
                />
              ) : (
                <TextDs style={[styles.guestsCount, { textAlign: 'left', marginHorizontal: 0, marginBottom: spacing.sm, flex: 1 }]}>
                  {guestsCount > 1 ? `1 Member & ${guestsCount - 1} ${guestsCount - 1 === 1 ? 'Guest' : 'Guests'}` : '1 Member'}
                </TextDs>
              )}
            <FlexView style={styles.spotsAndParticipants}>
              <TouchableOpacity onPress={handleOpenMembersModal} activeOpacity={0.7} style={{ marginRight: spacing.sm }}>
                <TextDs style={styles.spotsAvailable}>{event.availableSpots !== undefined && event.availableSpots > 0
                  ? 'Spots Available'
                  : 'Waiting List'}
                </TextDs>
              </TouchableOpacity>
              <ParticipantProfiles
                participants={event.participants ?? []}
                onViewAllPress={handleOpenMembersModal}
              />
            </FlexView>
          </FlexView>
          {event.eventPricePerGuest && event.eventPricePerGuest > 0 ? (
            <TextDs style={styles.refundText}>Refundable until {getRefundDate()}</TextDs>
          ) : null}
        </Card>

        {/* About Event Card */}
        <Card style={{ marginBottom: spacing.base }}>
          <TextDs style={styles.cardTitle}>About Event</TextDs>
          <TextDs style={styles.descriptionText}>
            {event.eventDescription ||
              `Join us for an exciting ${event.eventType} event. A perfect mix of sport, fun, and community!`}
          </TextDs>
          <Seperator />
          {/* Restrictions Card */}
          <TextDs style={styles.cardTitle}>Restrictions</TextDs>
          <TextDs style={styles.restrictionsText}>Male Only, 12-24 yrs, Intermediate Level</TextDs>
        </Card>

        {/* Refund Policy Card - show for paid events (uses organiser's policy or default) */}
        {isPaidEvent && refundPolicyText != null && (
            <Card style={{ marginBottom: spacing.base }}>
              <TextDs style={styles.cardTitle}>Refund Policy</TextDs>
              <TextDs style={styles.refundPolicyText}>{refundPolicyText}</TextDs>
            </Card>
          )}

        {/* Payment Details Card */}
        {event.isJoined && (
          <Card style={{ marginBottom: spacing.base }}>
            <TextDs style={styles.cardTitle}>Payment Details</TextDs>
            <FlexView style={styles.paymentSectionRow}>
              <FlexView style={styles.paymentMethodRow}>
                <TextDs size={16} weight="semibold" color='blueGray'>
                  <ImageDs image="DhiramIcon" size={14} style={{ marginRight: 4 }} />
                  {totalPrice || event.eventPricePerGuest || 0}
                </TextDs>
                <TextDs style={styles.paymentMethodText}>
                  Paid via Apple pay
                </TextDs>
              </FlexView>
              <TextDs style={styles.bookingIdText}>
                Booking ID: {cancelBookingId ? `#RLY-${cancelBookingId.substring(0, 8).toUpperCase()}` : '#RLY-UNKNOWN'}
              </TextDs>
            </FlexView>
          </Card>
        )}

        {/* Organiser Profile Card */}
        <TouchableOpacity
          style={[styles.card, { marginBottom: spacing.base }]}
          onPress={handleOrganiserPress}
          activeOpacity={0.8}
        >
          <FlexView style={styles.organizerSection}>
            <FlexView style={styles.organizerAvatarWrap}>
              <Avatar
                imageUri={event.creator?.profilePic || event.eventCreatorProfilePic}
                fullName={event.creator?.fullName || event.eventCreatorName}
                size="xl"
              />
            </FlexView>
            <FlexView flex={1} gap={spacing.md}>
              <TextDs size={14} weight="regular">
                {event.creator?.fullName || event.eventCreatorName || 'Unknown Organizer'}
              </TextDs>
              <FlexView style={styles.organizerStats}>
                <IconTag
                  title={`${event.creator?.eventsCreated || 0} Hosted`}
                  icon='calendarHosted'
                  variant="purple"
                />
                <IconTag
                  title={`${event.creator?.totalAttendees || 0} Attendees`}
                  icon='multipleUser'
                  variant="yellow"
                />
              </FlexView>
            </FlexView>
          </FlexView>
        </TouchableOpacity>
      </ScrollView>

      {/* Pay Now / Cancel Booking - Organisers cannot book events (e.g. from tag search) */}
      {/* Combined Sticky Footer Container */}
      {!isOrganiser && (
        <View style={styles.persistentFooter}>
          <BackdropBlur intensity={80} px={spacing.base} pb={insets.bottom + spacing.sm} pt={spacing.sm}>

            {/* 1. THE TOTAL ROW: Only show this in the 'Book Now' flow AND only when modal is hidden and not pending invitation */}
            {(!event?.isJoined && event?.userJoinStatus?.action !== 'payment-pending' && !pendingInvitation) && !isBookingModalVisible && (
              <FlexView style={[styles.card, { marginBottom: spacing.base, opacity: isRegistrationEnded ? 0.6 : 1 }]}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={!isAuthenticated ? handleSignIn : handleBookNow}
                  disabled={isBookingEvent || event?.isPending || isRegistrationEnded}
                >
                  <FlexView flexDirection="row" alignItems="center" justifyContent="space-between" style={{ marginBottom: spacing.md }}>
                    <TextDs style={[styles.cardTitle, { marginBottom: 0 }]}>Payment Details</TextDs>
                    {!isRegistrationEnded && <ChevronUp size={20} color="#000" />}
                  </FlexView>
                </TouchableOpacity>
                <FlexView style={styles.footerTotalRow}>
                  <TextDs style={styles.totalLabel}>Total ({guestsCount})</TextDs>
                  <FlexView flexDirection="row" alignItems="center" gap={spacing.xs}>
                    <ImageDs image="dhiramIcon" size={14} style={styles.priceIcon} />
                    <TextDs size={16} weight='semibold' color='blueGray'>{totalPrice.toFixed(2)}</TextDs>
                  </FlexView>
                </FlexView>
              </FlexView>
            )}

            {/* 2. THE BUTTONS: Your existing conditional logic lives here */}
            {pendingInvitation ? (
              // --- INVITATION BLOCK ---
              <FlexView flexDirection="row" gap={spacing.sm} style={{ marginTop: spacing.xs }}>
                <TouchableOpacity
                  style={[styles.cancelButton, { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)' }]}
                  onPress={() => declineInvitationMutation.mutate(pendingInvitation.inviteId ?? '')}
                  disabled={declineInvitationMutation.isPending}
                >
                  <TextDs style={styles.cancelButtonText}>
                    {declineInvitationMutation.isPending ? 'Declining...' : 'Decline'}
                  </TextDs>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.bookButton, { flex: 1 }]}
                  onPress={() => acceptInvitationMutation.mutate(pendingInvitation.inviteId ?? '')}
                  disabled={acceptInvitationMutation.isPending}
                >
                  <TextDs style={styles.bookButtonText}>
                    {acceptInvitationMutation.isPending ? 'Accepting...' : 'Accept Invite'}
                  </TextDs>
                </TouchableOpacity>
              </FlexView>
            ) : event?.isJoined || event?.userJoinStatus?.action === 'payment-pending' ? (
              // --- FIRST BLOCK (Joined/Pending) ---
              showPayNow ? (
                <TouchableOpacity style={styles.bookButton} onPress={handlePayNow} disabled={isBookingEvent}>
                  <TextDs style={styles.bookButtonText}>{isBookingEvent ? 'Processing...' : 'Pay Now'}</TextDs>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.cancelButton, !canCancelBooking && styles.cancelButtonDisabled]}
                  onPress={handleCancelBooking}
                  disabled={isLeavingEvent || !canCancelBooking}
                >
                  <TextDs style={[styles.cancelButtonText, !canCancelBooking && styles.cancelButtonTextDisabled]}>
                    {isLeavingEvent ? 'Cancelling...' : 'Cancel Booking'}
                  </TextDs>
                </TouchableOpacity>
              )
            ) : (
              // --- SECOND BLOCK (Book Now/Sign In) ---
              !isAuthenticated ? (
                <TouchableOpacity style={styles.bookButton} onPress={handleSignIn}>
                  <TextDs style={styles.bookButtonText}>Sign Up</TextDs>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.bookButton, (isBookingEvent || event?.isPending || isRegistrationEnded) && styles.bookButtonDisabled]}
                  onPress={handleBookNow}
                  disabled={isBookingEvent || event?.isPending || isRegistrationEnded}
                >
                  <TextDs style={styles.bookButtonText}>{buttonText}</TextDs>
                </TouchableOpacity>
              )
            )}
          </BackdropBlur>
        </View>
      )}

      {/* Members Modal */}
      {
        event && (
          <MembersModal
            visible={isMembersModalVisible}
            eventTitle={event.eventName ?? 'Event'}
            organizerName={event.creator?.fullName || event.eventCreatorName || 'Unknown Organizer'}
            participants={
              event.participants?.map((p) => {
                const rawGuestCount = (p as any).guestCount ?? (p as any).guest_count ?? 0;
                // If it's the current user, we can also fallback to the state guestsCount if available
                const finalGuestCount = p.userId === user?.userId
                  ? Math.max(rawGuestCount, Math.max(0, guestsCount - 1))
                  : rawGuestCount;

                return {
                  ...p,
                  userId: p.userId,
                  userType: p.userType || 'player',
                  email: p.email || '',
                  mobileNumber: p.mobileNumber || '',
                  profilePic: p.profilePic,
                  fullName: p.fullName,
                  dob: p.dob,
                  gender: p.gender,
                  sport1: p.sport1,
                  sport2: p.sport2,
                  joinedAt: p.joinedAt,
                  guestsCount: finalGuestCount,
                };
              }) || []
            }
            spotsFilled={calculateSpotsFilled(event, user?.userId, guestsCount)}
            totalSpots={event.eventMaxGuest ?? event.spotsInfo?.totalSpots ?? 0}
            onClose={handleCloseMembersModal}
          />
        )
      }

      {/* Cancel Booking Modal – shown when user cancels after refund deadline (no refund) */}
      <CancelBookingModal
        visible={isCancelBookingModalVisible}
        onClose={handleCloseCancelBookingModal}
        bookingId={cancelBookingId}
        variant={cancelVariant as any}
        onCancelSuccess={handleCancelBookingSuccess}
      />
      <BookingModal
        visible={isBookingModalVisible}
        totalPrice={totalPrice}
        currency="AED"
        guestsCount={guestsCount}
        eventId={eventId}
        onClose={handleCloseBookingModal}
        onBookEvent={handleBookEvent}
        onApplePay={handleApplePay}
        primaryButtonText="Book Event"
      />

    </SafeAreaView>
  );
};
