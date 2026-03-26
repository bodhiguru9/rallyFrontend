import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, View, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { borderRadius, colors, spacing } from '@theme';
import {
  SegmentedControl,
  FormInput,
  Toggle,
  Checkbox,
} from '@components/global';
import { TextDs, FlexView, ImageDs } from '@components';
import { Dropdown } from '@designSystem/molecules/dropdown';
import { ImageUpload } from './components/ImageUpload';
import { DateTimePickerModal } from './components/DateTimePickerModal';
import { frequencyToFormValue } from './components/DateTimePickerModal/frequencyUtils';
import { RegistrationDateTimeModal } from './components/RegistrationDateTimeModal';
import { RestrictionsModal } from './components/RestrictionsModal';
import { CompleteProfileModal } from './components/CompleteProfileModal';
import { EventLocationSearch } from './components/EventLocationSearch';
import { styles } from './style/CreateEventScreen.styles';
import type { EventLocation } from '@app-types/location.types';
import { useCreateOrganiserEvent, useEventDrafts } from '@hooks/organiser';
import { Card } from '@components/global/Card';
import { IconTag } from '@components/global/IconTag';
import { Users } from 'lucide-react-native';
import { EventCard } from '@components/global/EventCard';
import type { PlayerBooking } from '@services/booking-service';

// Hardcoded recurring events
const RECURRING_EVENTS: PlayerBooking[] = [
  {
    eventId: 'recurring-1',
    mongoId: 'recurring-mongo-1',
    eventName: 'Weekly Basketball Training',
    eventImages: [],
    eventVideo: null,
    eventType: 'training',
    eventSports: ['Basketball'],
    eventDateTime: new Date('2026-02-24T18:00:00').toISOString(),
    eventEndDateTime: null,
    eventFrequency: ['weekly'],
    eventLocation: 'Dubai Basketball Arena',
    eventDescription: 'Every Monday at 6 PM',
    eventGender: 'mixed',
    eventSportsLevel: 'intermediate',
    eventMinAge: null,
    eventMaxAge: null,
    eventLevelRestriction: null,
    eventMaxGuest: 15,
    eventPricePerGuest: 60,
    IsPrivateEvent: false,
    eventOurGuestAllowed: true,
    eventApprovalReq: false,
    eventRegistrationStartTime: null,
    eventRegistrationEndTime: null,
    eventStatus: 'upcoming',
    eventTotalAttendNumber: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    booking: {
      bookingId: null,
      joinedAt: new Date().toISOString(),
      bookingStatus: 'upcoming',
      bookingStatusValue: null,
      isPast: false,
      isOngoing: false,
      isUpcoming: true,
    },
  },
  {
    eventId: 'recurring-2',
    mongoId: 'recurring-mongo-2',
    eventName: 'Friday Badminton Session',
    eventImages: [],
    eventVideo: null,
    eventType: 'social',
    eventSports: ['Badminton'],
    eventDateTime: new Date('2026-02-28T19:00:00').toISOString(),
    eventEndDateTime: null,
    eventFrequency: ['weekly'],
    eventLocation: 'Zabeel Sports Complex',
    eventDescription: 'Every Friday at 7 PM',
    eventGender: 'mixed',
    eventSportsLevel: 'beginner',
    eventMinAge: null,
    eventMaxAge: null,
    eventLevelRestriction: null,
    eventMaxGuest: 10,
    eventPricePerGuest: 40,
    IsPrivateEvent: false,
    eventOurGuestAllowed: true,
    eventApprovalReq: false,
    eventRegistrationStartTime: null,
    eventRegistrationEndTime: null,
    eventStatus: 'upcoming',
    eventTotalAttendNumber: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    booking: {
      bookingId: null,
      joinedAt: new Date().toISOString(),
      bookingStatus: 'upcoming',
      bookingStatusValue: null,
      isPast: false,
      isOngoing: false,
      isUpcoming: true,
    },
  },
  {
    eventId: 'recurring-3',
    mongoId: 'recurring-mongo-3',
    eventName: 'Weekend Football League',
    eventImages: [],
    eventVideo: null,
    eventType: 'tournament',
    eventSports: ['Football'],
    eventDateTime: new Date('2026-03-01T10:00:00').toISOString(),
    eventEndDateTime: null,
    eventFrequency: ['weekly'],
    eventLocation: 'Sports City Football Field',
    eventDescription: 'Every Saturday at 10 AM',
    eventGender: 'mixed',
    eventSportsLevel: 'advanced',
    eventMinAge: null,
    eventMaxAge: null,
    eventLevelRestriction: null,
    eventMaxGuest: 22,
    eventPricePerGuest: 80,
    IsPrivateEvent: false,
    eventOurGuestAllowed: true,
    eventApprovalReq: false,
    eventRegistrationStartTime: null,
    eventRegistrationEndTime: null,
    eventStatus: 'upcoming',
    eventTotalAttendNumber: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    booking: {
      bookingId: null,
      joinedAt: new Date().toISOString(),
      bookingStatus: 'upcoming',
      bookingStatusValue: null,
      isPast: false,
      isOngoing: false,
      isUpcoming: true,
    },
  },
];

const SPORT_OPTIONS = [
  { label: 'Football', value: 'football', icon: 'footballBlue', color: '#3D6F92' },
  { label: 'Tennis', value: 'tennis', icon: 'tennisBlue', color: '#3D6F92' },
  { label: 'Table Tennis', value: 'table-tennis', icon: 'tableTennisBlue', color: '#3D6F92' },
  { label: 'Basketball', value: 'basketball', icon: 'basketballBlue', color: '#3D6F92' },
  { label: 'Badminton', value: 'badminton', icon: 'badmintonBlue', color: '#3D6F92' },
  { label: 'Cricket', value: 'cricket', icon: 'cricketBlue', color: '#3D6F92' },
  { label: 'Indoor Cricket', value: 'indoor-cricket', icon: 'indoorCricketBlue', color: '#3D6F92' },
  { label: 'Padel', value: 'padel', icon: 'padelBlue', color: '#3D6F92' },
  { label: 'Pickleball', value: 'pickleball', icon: 'pickleballBlue', color: '#3D6F92' },
  { label: 'Pilates', value: 'pilates', icon: 'pilatesBlue', color: '#3D6F92' },
  { label: 'Running', value: 'running', icon: 'runningBlue', color: '#3D6F92' },
];

const EVENT_TYPE_OPTIONS = [
  { label: 'Social', value: 'social', customLabel: <IconTag title="Social" /> },
  { label: 'Class', value: 'class', customLabel: <IconTag title="Class" /> },
  { label: 'Tournament', value: 'tournament', customLabel: <IconTag title="Tournament" /> },
  { label: 'Training', value: 'training', customLabel: <IconTag title="Training" /> },
];

const REFUND_POLICY_OPTIONS = [
  { label: 'Only Allowed before the day of the event', value: 'before-event' },
  // { label: 'Allowed until event starts', value: 'until-start' },
  { label: 'Not Allowed', value: 'no-refund' },
];

// Separate content component that can be used in different contexts
export const CreateEventContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationStep, setRegistrationStep] = useState<'start' | 'end'>('start');
  const [showRestrictionsModal, setShowRestrictionsModal] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [descriptionHeight, setDescriptionHeight] = useState(80);

  // Use the create organiser event hook
  const {
    formData,
    updateFormData,
    showCompleteProfileModal,
    setShowCompleteProfileModal,
    handleCreateEvent,
    handleCompleteProfileSubmit,
    isLoading,
  } = useCreateOrganiserEvent();

  const { draftCards } = useEventDrafts();

  const populateFromDraft = (draft: PlayerBooking) => {
    updateFormData('eventName', draft.eventName || '');
    updateFormData('description', draft.eventDescription || '');

    const sportName = draft.eventSports?.[0] || '';
    const sportOption = SPORT_OPTIONS.find((o) => o.label.toLowerCase() === sportName.toLowerCase());
    updateFormData('sport', sportOption ? sportOption.value : '');

    const eventTypeOption = EVENT_TYPE_OPTIONS.find((o) => o.value === draft.eventType);
    updateFormData('eventType', eventTypeOption ? eventTypeOption.value : '');

    updateFormData('maxGuests', draft.eventMaxGuest ? String(draft.eventMaxGuest) : '');
    updateFormData('pricePerGuest', draft.eventPricePerGuest ? String(draft.eventPricePerGuest) : '');

    updateFormData('isPrivate', !!draft.IsPrivateEvent);
    updateFormData('disallowGuests', !draft.eventOurGuestAllowed);
    updateFormData('approvalRequired', !!draft.eventApprovalReq);

    const restrictions = {
      gender: (draft.eventGender && draft.eventGender !== 'mixed') ? draft.eventGender : 'open',
      sportsLevel: draft.eventSportsLevel ? draft.eventSportsLevel.toLowerCase() : 'all',
      ageRange: { min: draft.eventMinAge || 0, max: draft.eventMaxAge || 100 },
      levelRestriction: draft.eventLevelRestriction || '',
    };
    updateFormData('restrictions', restrictions);

    if (draft.eventLocation) {
      updateFormData('locationRawInput', draft.eventLocation);
      updateFormData('location', null);
    }

    // Reset date/times for the new event
    updateFormData('dateTime', null);
    updateFormData('endDateTime', null);
    updateFormData('registrationStartTime', null);
    updateFormData('registrationEndTime', null);

    if (draft.eventImages?.[0]) {
      updateFormData('imageUri', draft.eventImages[0]);
    } else {
      updateFormData('imageUri', undefined);
    }

    setActiveTab(0);
  };

  return (
    <SafeAreaView style={{ flex: 1, experimental_backgroundImage: colors.gradient.mainBackground }} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <FlexView flex={1}>
        {/* Segmented Control */}
        <FlexView px={spacing.base} py={spacing.lg}>
          <SegmentedControl
            tabs={['Create', 'Drafts', 'Recurring']}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </FlexView>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!isLocationDropdownOpen}
          keyboardShouldPersistTaps="always"
        >
          {activeTab === 0 && (
            <>
              {/* Event Details */}
              <Card>
                <FlexView row gap={14} alignItems='center'>
                  <ImageUpload
                    imageUri={formData.imageUri}
                    onImageSelect={(uri) => updateFormData('imageUri', uri)}
                  />
                  <FlexView flex={1}>
                    <FormInput
                      label="Event Name"
                      labelSize={14}
                      labelWeight="semibold"
                      variant='transparent'
                      placeholder="Enter Your Event Name"
                      value={formData.eventName}
                      onChangeText={(text) => updateFormData('eventName', text)}
                      containerStyle={styles.eventNameInput}
                    />
                    <FlexView row gap={8}>
                      {formData.sport && <IconTag title={formData.sport} size='small' />}
                      {formData.eventType && <IconTag title={formData.eventType} variant='teal' size='small' />}
                    </FlexView>
                  </FlexView>
                </FlexView>
              </Card>

              <FlexView row gap={spacing.base} mb={spacing.base} mt={spacing.lg}>
                <FlexView flex={1}>
                  <Dropdown
                    placeholder="Sport"
                    options={SPORT_OPTIONS}
                    value={formData.sport}
                    onSelect={(value) => updateFormData('sport', value)}
                    containerStyle={styles.selectContainer}
                    leftIcon={!formData.sport ? <ImageDs image="SportIcon" size={20} /> : undefined}
                  />
                </FlexView>
                <FlexView flex={1}>
                  <Dropdown
                    placeholder="Event Type"
                    options={EVENT_TYPE_OPTIONS}
                    value={formData.eventType}
                    onSelect={(value) => updateFormData('eventType', value)}
                    containerStyle={styles.selectContainer}
                    leftIcon={!formData.eventType ? <ImageDs image="Nametag" size={20} /> : undefined}
                  />
                </FlexView>
              </FlexView>

              <FlexView row alignItems='center' isFullWidth gap={spacing.sm} mb={spacing.base} glassBg borderWhite py={8} borderRadius={borderRadius.lg} px={spacing.md}>
                <ImageDs image="Time" size={20} />
                <TouchableOpacity
                  onPress={() => setShowDateTimePicker(true)}
                  style={{ width: '100%' }}
                  activeOpacity={0.7}
                >
                  <FlexView flex={1} gap={4}>
                    {formData.dateTime ? (
                      <TextDs size={14} weight="regular" color="primary">
                        {formData.dateTime.toLocaleString('en-US', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short'
                        })},{' '}
                        {formData.dateTime.toLocaleString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit'
                        })} - {(formData.endDateTime ?? new Date(formData.dateTime.getTime() + 3600000)).toLocaleString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </TextDs>
                    ) : (
                      <TextDs size={14} weight="regular" color="secondary">
                        Date & Time
                      </TextDs>
                    )}
                  </FlexView>
                </TouchableOpacity>
              </FlexView>

              <EventLocationSearch
                value={
                  typeof formData.location === 'object' && formData.location !== null
                    ? formData.location
                    : typeof formData.location === 'string' && formData.location.trim()
                      ? {
                        name: formData.location.trim(),
                        displayName: formData.location.trim(),
                        latitude: 0,
                        longitude: 0,
                      }
                      : null
                }
                onChange={(location: EventLocation | null) =>
                  updateFormData('location', location)
                }
                onInputChange={(text) => updateFormData('locationRawInput', text)}
                placeholder="Location"
                leftIcon={<ImageDs image="LocationPin" size={20} />}
                onDropdownVisibilityChange={setIsLocationDropdownOpen}
              />

              <FlexView height={14} />

              <FormInput
                label=""
                placeholder="Event Description"
                value={formData.description}
                onChangeText={(text) => updateFormData('description', text)}
                leftIcon={<ImageDs image="BallpointPen" size={16} />}
                multiline
                style={{ fontSize: 14, maxHeight: 100, textAlignVertical: 'top' }}
              />

              <FlexView isFullWidth height={1} backgroundColor={colors.background.white} my={14} />

              {/* Guests Section */}
              <FlexView mb={spacing.xl}>
                <FlexView row justifyContent="space-between" alignItems="center" mb={spacing.md}>
                  <TextDs size={16} weight="semibold" color="primary">
                    Guests
                  </TextDs>
                  <TouchableOpacity
                    style={styles.restrictionsButton}
                    onPress={() => setShowRestrictionsModal(true)}
                    activeOpacity={0.7}
                  >
                    <ImageDs image="GenderIcon" size={16} />
                    <TextDs size={12} weight="medium" color="white">
                      {formData.restrictions &&
                        ((formData.restrictions.gender && formData.restrictions.gender !== 'open') ||
                          (formData.restrictions.sportsLevel && formData.restrictions.sportsLevel !== 'all') ||
                          (formData.restrictions.ageRange && (formData.restrictions.ageRange.min > 0 || formData.restrictions.ageRange.max < 100)) ||
                          !!formData.restrictions.levelRestriction?.trim())
                        ? 'Edit'
                        : 'Add Restrictions'}
                    </TextDs>
                  </TouchableOpacity>
                </FlexView>

                <FlexView row gap={spacing.md} mb={spacing.base}>
                  <FlexView flex={1}>
                    <FlexView mb={spacing.sm}>
                      <TextDs size={14} weight="medium" color="primary">
                        Capacity
                      </TextDs>
                    </FlexView>
                    <FormInput
                      label=""
                      placeholder="Maximum Guests"
                      value={formData.maxGuests}
                      onChangeText={(text) => updateFormData('maxGuests', text)}
                      keyboardType="numeric"
                      leftIcon={<ImageDs image="MultipleUsers" size={16} />}
                      containerStyle={styles.noMarginInput}
                    />
                  </FlexView>
                  <FlexView flex={1}>
                    <FlexView mb={spacing.sm}>
                      <TextDs size={14} weight="medium" color="primary">
                        Price per guest
                      </TextDs>
                    </FlexView>
                    <FormInput
                      label=""
                      placeholder="Prices in Dirham"
                      value={formData.pricePerGuest}
                      onChangeText={(text) => updateFormData('pricePerGuest', text)}
                      keyboardType="numeric"
                      leftIcon={<ImageDs image="DhiramGrayIcon" size={16} />}
                      containerStyle={styles.noMarginInput}
                    />
                  </FlexView>
                </FlexView>

                <Card style={{ marginBottom: spacing.base }}>
                  <Toggle
                    label="Private Event"
                    description="Event will not be displayed to others. Only those invited can join."
                    value={formData.isPrivate}
                    onValueChange={(value) => updateFormData('isPrivate', value)}
                    containerStyle={styles.toggleContainer}
                  />
                </Card>

                <Card style={{ marginBottom: spacing.base }}>
                  <Toggle
                    label="Disallow Guests"
                    description='Players can&apos;t add guests while joining this event.'
                    value={formData.disallowGuests}
                    onValueChange={(value) => updateFormData('disallowGuests', value)}
                    containerStyle={styles.toggleContainer}
                  />
                </Card>

                <Card style={{ marginBottom: spacing.base }}>
                  <Toggle
                    label="Approval Required"
                    description='Players will need your approval to be part of this event.'
                    value={formData.approvalRequired}
                    onValueChange={(value) => updateFormData('approvalRequired', value)}
                    containerStyle={styles.toggleContainer}
                  />
                </Card>
              </FlexView>

              <FlexView isFullWidth height={1} backgroundColor={colors.background.white} mb={spacing.base} />

              {/* Policies Section */}
              <FlexView mt={spacing.xl} mb={spacing.xl}>
                <FlexView mb={spacing.md}>
                  <TextDs size={16} weight="semibold" color="primary">
                    Policies
                  </TextDs>
                </FlexView>

                <TouchableOpacity
                  onPress={() => {
                    if (!formData.dateTime) {
                      return;
                    }
                    setRegistrationStep(formData.registrationStartTime ? 'end' : 'start');
                    setShowRegistrationModal(true);
                  }}
                  activeOpacity={0.7}
                  style={[
                    styles.registrationInputTouchable,
                    !formData.dateTime && styles.registrationInputTouchableDisabled,
                  ]}
                >
                  <FlexView row alignItems="center" gap={spacing.sm} style={styles.registrationInputInner}>
                    <ImageDs image="CalendarCheckmark" size={20} />
                    <TextDs
                      size={16}
                      weight="regular"
                      color={formData.registrationStartTime && formData.registrationEndTime ? 'primary' : 'secondary'}
                    >
                      {formData.registrationStartTime && formData.registrationEndTime
                        ? `${formData.registrationStartTime.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })} – ${formData.registrationEndTime.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`
                        : 'Registration Start & End Time'}
                    </TextDs>
                  </FlexView>
                </TouchableOpacity>

                <FlexView height={spacing.base} />
                <FlexView mb={spacing.sm}>
                  <TextDs size={14} weight="medium" color="primary">
                    Refund Policy
                  </TextDs>
                  <TextDs size={12} weight="regular" color="secondary" style={{ marginTop: 4 }}>
                    Choose when users can cancel and receive a refund
                  </TextDs>
                </FlexView>

                <Dropdown
                  placeholder="Only Allowed before the day of the event"
                  options={REFUND_POLICY_OPTIONS}
                  value={formData.registrationPolicy}
                  onSelect={(value) => updateFormData('registrationPolicy', value)}
                />

                <FlexView height={spacing.base} />

                <Checkbox
                  label="Save duplicate in drafts for future use."
                  value={formData.saveToDrafts}
                  onValueChange={(value) => updateFormData('saveToDrafts', value)}
                  containerStyle={styles.checkboxContainer}
                />
              </FlexView>
            </>
          )}

          {/* Drafts Tab */}
          {activeTab === 1 && (
            <FlexView gap={spacing.base}>
              {draftCards.length > 0 ? (
                draftCards.map((event) => (
                  <EventCard
                    key={event.eventId}
                    id={event.eventId}
                    event={event}
                    onPress={() => populateFromDraft(event)}
                    onBookmark={() => { }}
                    hideCreator
                  />
                ))
              ) : (
                <FlexView alignItems="center" justifyContent="center" py={spacing.xxl}>
                  <TextDs size={16} weight="medium" color="secondary">
                    No draft events yet
                  </TextDs>
                </FlexView>
              )}
            </FlexView>
          )}

          {/* Recurring Tab */}
          {activeTab === 2 && (
            <FlexView gap={spacing.base}>
              {RECURRING_EVENTS.length > 0 ? (
                RECURRING_EVENTS.map((event) => (
                  <EventCard
                    key={event.eventId}
                    id={event.eventId}
                    event={event}
                    onPress={() => { }}
                    onBookmark={() => { }}
                    hideCreator
                  />
                ))
              ) : (
                <FlexView alignItems="center" justifyContent="center" py={spacing.xxl}>
                  <TextDs size={16} weight="medium" color="secondary">
                    No recurring events yet
                  </TextDs>
                </FlexView>
              )}
            </FlexView>
          )}
        </ScrollView>

        {/* Create Event Button - Only show on Create tab */}
        {activeTab === 0 && (
          <FlexView
            width="100%"
            position="absolute"
            bottom={0}
            left={0}
            right={0}
          >
            <FlexView style={styles.blurContainer}>
              <TouchableOpacity
                onPress={handleCreateEvent}
                disabled={isLoading}
                activeOpacity={0.8}
                style={styles.createButton}
              >
                {Platform.OS === 'android' ? (
                  <View style={[styles.blurFill, { backgroundColor: colors.primaryDark }]} />
                ) : (
                  <BlurView intensity={50} tint="dark" style={styles.blurFill} />
                )}
                <View style={styles.createButtonContent}>
                  {isLoading ? (
                    <ActivityIndicator color={colors.text.white} />
                  ) : (
                    <TextDs size={16} weight="semibold" color="white">
                      Create Event
                    </TextDs>
                  )}
                </View>
              </TouchableOpacity>
            </FlexView>
          </FlexView>
        )}

        {/* Modals - Always available */}
        <FlexView>
          {/* Date Time Picker Modal */}
          <DateTimePickerModal
            visible={showDateTimePicker}
            onClose={() => setShowDateTimePicker(false)}
            onConfirm={(startDate, endDate, frequency) => {
              updateFormData('dateTime', startDate);
              updateFormData('endDateTime', endDate);
              if (!frequency) {
                updateFormData('frequency', []);
                updateFormData('frequencyEndDate', null);
              } else {
                updateFormData('frequency', frequencyToFormValue(frequency));
                const endDate =
                  frequency.ends !== 'never' && typeof frequency.ends === 'object'
                    ? frequency.ends.on.toISOString().split('T')[0]
                    : null;
                updateFormData('frequencyEndDate', endDate);
              }
            }}
            initialDate={formData.dateTime || undefined}
            initialStartTime={formData.dateTime ? { hour: formData.dateTime.getHours(), minute: formData.dateTime.getMinutes() } : undefined}
            initialEndTime={formData.endDateTime ? { hour: formData.endDateTime.getHours(), minute: formData.endDateTime.getMinutes() } : undefined}
            initialFrequency={formData.frequency}
          />

          {/* Registration Start & End Modal (two-step: start then end) */}
          <RegistrationDateTimeModal
            visible={showRegistrationModal}
            onClose={() => setShowRegistrationModal(false)}
            step={registrationStep}
            initialDate={
              registrationStep === 'start'
                ? formData.registrationStartTime
                : formData.registrationEndTime
            }
            registrationStartTime={formData.registrationStartTime}
            eventDateTime={formData.dateTime}
            onConfirmStart={(date) => {
              updateFormData('registrationStartTime', date);
              setRegistrationStep('end');
              // Modal stays open; calendar refreshes for end date
            }}
            onConfirmEnd={(date) => {
              updateFormData('registrationEndTime', date);
              setShowRegistrationModal(false);
            }}
          />

          {/* Restrictions Modal */}
          <RestrictionsModal
            visible={showRestrictionsModal}
            onClose={() => setShowRestrictionsModal(false)}
            onConfirm={(restrictions) => {
              updateFormData('restrictions', restrictions);
            }}
            initialGender={formData.restrictions?.gender}
            initialSportsLevel={formData.restrictions?.sportsLevel}
            initialAgeRange={formData.restrictions?.ageRange}
            initialLevelRestriction={formData.restrictions?.levelRestriction}
          />

          {/* Complete Profile Modal */}
          <CompleteProfileModal
            visible={showCompleteProfileModal}
            onClose={() => setShowCompleteProfileModal(false)}
            onSubmit={handleCompleteProfileSubmit}
          />
        </FlexView>
      </FlexView>
    </SafeAreaView>
  );
};

// Main screen component - used when navigating via React Navigation
export const CreateEventScreen: React.FC = () => {
  return <CreateEventContent />;
};
