import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@theme';
import { styles } from './style/OrganiserEventDetailsScreen.styles';
import { ImageDs, Seperator, TextDs, Avatar } from '@components';
import { FormInput, Toggle } from '@components/global';
import { IconTag } from '@components/global/IconTag';
import { Map, Users } from 'lucide-react-native';
import { EventDetailsMap } from '@screens/event-details/components/event-details-map/EventDetailsMap';
import { formatDate } from '@utils';
import { Card } from '@components/global/Card';
import { useOrganiserEventDetails } from './use-organiser-event-details';
import { FlexView } from '@designSystem/atoms/FlexView';
import { resolveImageUri } from '@utils/image-utils';
import { images } from '@assets/images';
import { BackdropBlur } from '@components/global/BackdropBlur';
import { MembersModal } from '@screens/event-details/MembersModal';
import { TabSelector } from './components/TabSelector';
import { MembersTab } from './components/MembersTab';
import { InviteTab } from './components/InviteTab';
import { DateTimePickerModal } from '@screens/organiser/create-event/components/DateTimePickerModal';
import { DeleteEventModal } from './components/DeleteEventModal';
import type { EventData } from '@app-types';
import { DEFAULT_DISPLAY_TIME_ZONE } from '@constants/timezones';

// type OrganiserEventDetailsScreenNavigationProp = NativeStackNavigationProp<
//   RootStackParamList,
//   'OrganiserEventDetails'
// >;

export const OrganiserEventDetailsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  const [showEditDateTimePicker, setShowEditDateTimePicker] = useState(false);

  const {
    event,
    isLoading,
    activeTab,
    setActiveTab,
    isReadOnly,
    isMembersModalVisible,
    isDeleteEventModalVisible,
    isEditMode,
    editFormData,
    isSaving,
    occurrenceStart,
    occurrenceEnd,
    handleShare,
    handleEdit,
    handleCancelEdit,
    handleSaveEdit,
    updateEditFormData,
    handleDeleteEvent,
    handleOpenMembersModal,
    handleCloseMembersModal,
    handleCloseDeleteEventModal,
    handleDeleteEventSuccess,
    invitedUserIds,
    setInvitedUserIds,
  } = useOrganiserEventDetails();

  const rawEventImage = event?.eventImages?.[0] || (event as any)?.gameImages?.[0] || (event as any)?.eventImage;
  const organizerProfilePic = event?.creator?.profilePic || (event as any)?.eventCreatorProfilePic || (event as any)?.organizerProfilePic;

  const eventImageUri = resolveImageUri(rawEventImage);
  const organizerImageUri = resolveImageUri(organizerProfilePic);

  const [imageSource, setImageSource] = useState<any>(images.blackLogo);

  React.useEffect(() => {
    if (eventImageUri) {
      setImageSource({ uri: eventImageUri });
    } else if (organizerImageUri) {
      setImageSource({ uri: organizerImageUri });
    } else {
      setImageSource(images.blackLogo);
    }
  }, [eventImageUri, organizerImageUri]);

  const handleImageError = () => {
    if (imageSource?.uri === eventImageUri && organizerImageUri) {
      setImageSource({ uri: organizerImageUri });
    } else {
      setImageSource(images.blackLogo);
    }
  };

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

  const editInitialDate = editFormData.eventDateTime
    ? (() => {
      const d = new Date(editFormData.eventDateTime);
      return Number.isNaN(d.getTime()) ? undefined : d;
    })()
    : undefined;

  // Edit mode form (About tab when isEditMode)
  const renderEditForm = () => (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <Card style={{ marginBottom: spacing.base }}>
        <FormInput
          label="Event Name"
          labelSize={16}
          labelWeight="semibold"
          variant="transparent"
          placeholder="Event name"
          value={editFormData.eventName}
          onChangeText={(text) => updateEditFormData('eventName', text)}
        />
      </Card>
      <FlexView row alignItems="center" style={styles.card} mb={spacing.base}>
        <ImageDs image="Time" size={20} />
        <TouchableOpacity
          onPress={() => setShowEditDateTimePicker(true)}
          style={{ flex: 1 }}
          activeOpacity={0.7}
        >
          <TextDs size={16} weight="regular" color={editFormData.eventDateTime ? 'primary' : 'secondary'}>
            {editFormData.eventDateTime
              ? formatDate(editFormData.eventDateTime, 'display-range', { 
                  endTime: editFormData.eventEndDateTime ?? undefined,
                  timeZone: DEFAULT_DISPLAY_TIME_ZONE 
                })
              : 'Date & Time'}
          </TextDs>
        </TouchableOpacity>
      </FlexView>
      <Card style={{ marginBottom: spacing.base }}>
        <FormInput
          placeholder="Location"
          value={editFormData.eventLocation}
          onChangeText={(text) => updateEditFormData('eventLocation', text)}
          leftIcon={<ImageDs image="LocationPin" size={20} />}
        />
      </Card>
      <Card style={{ marginBottom: spacing.base }}>
        <FormInput
          placeholder="Event Description"
          value={editFormData.eventDescription}
          onChangeText={(text) => updateEditFormData('eventDescription', text)}
          leftIcon={<ImageDs image="BallpointPen" size={20} />}
          multiline
          numberOfLines={4}
          style={{ minHeight: 80, textAlignVertical: 'top' }}
        />
      </Card>
      <Card style={{ marginBottom: spacing.base }}>
        <TextDs style={styles.cardTitle}>Guests</TextDs>
        <FlexView row gap={spacing.md}>
          <FlexView flex={1}>
            <FormInput
              placeholder="Max guests"
              value={editFormData.eventMaxGuest > 0 ? String(editFormData.eventMaxGuest) : ''}
              onChangeText={(text) => updateEditFormData('eventMaxGuest', Math.max(0, parseInt(text, 10) || 0))}
              keyboardType="numeric"
              leftIcon={<ImageDs image="MultipleUsers" size={16} />}
            />
          </FlexView>
          <FlexView flex={1}>
            <FormInput
              placeholder="Price (Dirham)"
              value={editFormData.eventPricePerGuest > 0 ? String(editFormData.eventPricePerGuest) : ''}
              onChangeText={(text) => updateEditFormData('eventPricePerGuest', Math.max(0, parseFloat(text) || 0))}
              keyboardType="numeric"
              leftIcon={<ImageDs image="DhiramGrayIcon" size={16} />}
            />
          </FlexView>
        </FlexView>
      </Card>
      <Card style={{ marginBottom: spacing.base }}>
        <Toggle
          label="Private Event"
          description="Only those invited can join."
          value={editFormData.IsPrivateEvent}
          onValueChange={(value) => updateEditFormData('IsPrivateEvent', value)}
        />
      </Card>
      <Card style={{ marginBottom: spacing.base }}>
        <Toggle
          label="Disallow Guests"
          description="Players can't add guests while joining."
          value={!editFormData.eventOurGuestAllowed}
          onValueChange={(value) => updateEditFormData('eventOurGuestAllowed', !value)}
        />
      </Card>
      <Card style={{ marginBottom: spacing.base }}>
        <Toggle
          label="Approval Required"
          description="Players need your approval to join."
          value={editFormData.eventApprovalReq}
          onValueChange={(value) => updateEditFormData('eventApprovalReq', value)}
        />
      </Card>
    </ScrollView>
  );

  // About Tab Content (read-only)
  const renderAboutTab = () => (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {/* Date and Location Card */}
      <FlexView style={styles.card}>
        <FlexView style={styles.infoRow}>
          <ImageDs image="PeachClock" size={16} />
          <TextDs style={styles.infoText}>{formatDate((occurrenceStart || event.eventDateTime) ?? '', 'display-range', { endTime: (occurrenceEnd || event.eventEndDateTime) ?? undefined, timeZone: DEFAULT_DISPLAY_TIME_ZONE })}</TextDs>
        </FlexView>
        <FlexView style={styles.infoRow}>
          <ImageDs image="GreenPin" size={16} />
          <TextDs style={styles.infoText}>{event.eventLocation ?? ''}</TextDs>
        </FlexView>
        <EventDetailsMap
          style={styles.mapContainer}
          latitude={event.eventLatitude}
          longitude={event.eventLongitude}
          address={event.eventLocation}
        />
      </FlexView>

      {/* Guest Allowance Card */}
      <Card style={{ marginBottom: spacing.base }}>
        <TextDs style={styles.cardTitle}>Guest Allowance</TextDs>
        <FlexView style={styles.guestAllowanceRow}>
          <FlexView style={styles.guestAllowanceItem}>
            <Users size={20} color={colors.text.secondary} />
            <TextDs style={styles.guestAllowanceText}>{event.eventMaxGuest || 0} members max</TextDs>
          </FlexView>
          <TextDs style={styles.guestAllowanceText}>Allows Waitlist</TextDs>
        </FlexView>
        <FlexView style={styles.participantsSection}>
          <TouchableOpacity onPress={handleOpenMembersModal} activeOpacity={0.7}>
            <TextDs style={styles.spotsAvailable}>
              {event.availableSpots !== undefined && event.availableSpots > 0
                ? `${event.spotsInfo?.spotsBooked || 0}/${event.eventMaxGuest || 0} Spots Filled`
                : 'Event Full'}
            </TextDs>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleOpenMembersModal}
            activeOpacity={0.7}
            style={styles.participantsContainer}
          >
            {event.participants?.slice(0, 3).map((participant, index) => (
              <FlexView
                key={participant.userId}
                style={[styles.participantAvatarWrap, { marginLeft: index > 0 ? -8 : 0 }]}
              >
                <Avatar
                  imageUri={participant.profilePic}
                  fullName={participant.fullName}
                  size="sm"
                />
              </FlexView>
            ))}
            {event.participants && event.participants.length > 3 && (
              <FlexView
                style={[styles.participantAvatar, styles.moreParticipants, { marginLeft: -8 }]}
              >
                <TextDs style={styles.moreParticipantsText}>
                  +{event.participants.length - 3}
                </TextDs>
              </FlexView>
            )}
          </TouchableOpacity>
        </FlexView>
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
        <TextDs style={styles.restrictionsText}>
          {event.eventGender || 'Male Only'}, {event.eventMinAge || 12}-{event.eventMaxAge || 24} yrs, {event.eventSportsLevel || 'Intermediate Level'}
        </TextDs>
      </Card>

      {/* Event Type Card */}
      <Card style={{ marginBottom: spacing.base }}>
        <TextDs style={styles.cardTitle}>Event Type</TextDs>
        <TextDs style={styles.eventTypeText}>
          {event.IsPrivateEvent ? 'Private: Approval Required' : 'Public Event'}
        </TextDs>
      </Card>

      {/* Refund Policy Card */}
      <Card style={{ marginBottom: spacing.base }}>
        <TextDs style={styles.cardTitle}>Refund Policy</TextDs>
        <TextDs style={styles.refundPolicyText}>Allow refunds always</TextDs>
      </Card>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Tabs */}
      {!isReadOnly && (
        <FlexView px={spacing.base} mb={spacing.base} backgroundColor='transparent'>
          <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />
        </FlexView>
      )}

      {/* Tab Content */}
      {activeTab === 'about' && (
        <>
          {!isEditMode && (
            <FlexView style={[styles.card, { marginHorizontal: spacing.base }]}>
              <FlexView style={styles.eventOverview}>
                <Image
                  source={imageSource || images.blackLogo}
                  onError={handleImageError}
                  style={styles.eventImage}
                />
                <FlexView style={styles.eventInfo}>
                  <TextDs style={styles.eventTitle}>{event.eventName}</TextDs>
                  <TextDs style={styles.organizerName}>
                    by {event.creator?.fullName || event.eventCreatorName || 'You'}
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
          )}
          {isEditMode ? renderEditForm() : renderAboutTab()}
        </>
      )}
      {!isReadOnly && activeTab === 'members' && (
        <FlexView style={{ flex: 1, paddingHorizontal: spacing.base, paddingTop: spacing.sm }}>
          <MembersTab event={event as EventData} onOpenMembersModal={handleOpenMembersModal} />
        </FlexView>
      )}
      {!isReadOnly && activeTab === 'invite' && (
        <FlexView style={{ flex: 1, paddingHorizontal: spacing.base, paddingTop: spacing.sm }}>
          <InviteTab
            event={event as EventData}
            invitedUserIds={invitedUserIds}
            setInvitedUserIds={setInvitedUserIds}
          />
        </FlexView>
      )}

      {/* Bottom buttons: Edit mode = Cancel (exit edit) + Save; View mode = Cancel (session) + Edit */}
      {!isReadOnly && (
        <FlexView style={[styles.bottomButtonContainer]}>
          <BackdropBlur intensity={80} px={spacing.base} pb={insets.bottom} pt={spacing.sm}>
            <FlexView style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={isEditMode ? handleCancelEdit : handleDeleteEvent}
                activeOpacity={0.8}
              >
                <TextDs style={styles.cancelButtonText}>{isEditMode ? 'Cancel' : 'Delete'}</TextDs>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editButton}
                onPress={isEditMode ? handleSaveEdit : handleEdit}
                disabled={isEditMode && isSaving}
                activeOpacity={0.8}
              >
                {isEditMode && isSaving ? (
                  <ActivityIndicator color={colors.text.white} />
                ) : (
                  <TextDs style={styles.editButtonText}>
                    {isEditMode ? 'Save' : 'Edit'}
                  </TextDs>
                )}
              </TouchableOpacity>
            </FlexView>
          </BackdropBlur>
        </FlexView>
      )}

      {/* Date/time picker for edit mode */}
      {isEditMode && (
        <DateTimePickerModal
          visible={showEditDateTimePicker}
          onClose={() => setShowEditDateTimePicker(false)}
          onConfirm={(startDate, endDate) => {
            updateEditFormData('eventDateTime', startDate.toISOString());
            updateEditFormData('eventEndDateTime', endDate.toISOString());
            setShowEditDateTimePicker(false);
          }}
          initialDate={editInitialDate}
        />
      )}

      {/* Members Modal */}
      {event && (
        <MembersModal
          visible={isMembersModalVisible}
          eventTitle={event.eventName ?? ''}
          organizerName={event.creator?.fullName || event.eventCreatorName || 'You'}
          participants={
            event.participants?.map((p) => ({
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
            })) || []
          }
          spotsFilled={event.spotsInfo?.spotsBooked || 0}
          totalSpots={event.spotsInfo?.totalSpots || 0}
          occurrenceStart={occurrenceStart}
          occurrenceEnd={occurrenceEnd}
          onClose={handleCloseMembersModal}
        />
      )}

      {/* Delete Event confirmation modal */}
      <DeleteEventModal
        visible={isDeleteEventModalVisible}
        onClose={handleCloseDeleteEventModal}
        eventId={event.eventId ?? event.id ?? null}
        onDeleteSuccess={handleDeleteEventSuccess}
      />
    </SafeAreaView>
  );
};
