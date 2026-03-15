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
import { RegistrationDateTimeModal } from './components/RegistrationDateTimeModal';
import { RestrictionsModal } from './components/RestrictionsModal';
import { CompleteProfileModal } from './components/CompleteProfileModal';
import { EventLocationSearch } from './components/EventLocationSearch';
import { styles } from './style/CreateEventScreen.styles';
import type { EventLocation } from '@app-types/location.types';
import { useCreateOrganiserEvent } from '@hooks/organiser';
import { Card } from '@components/global/Card';
import { IconTag } from '@components/global/IconTag';
import { Users } from 'lucide-react-native';
import { EventCard } from '@components/global/EventCard';
import type { PlayerBooking } from '@services/booking-service';

// Hardcoded draft events
const DRAFT_EVENTS: PlayerBooking[] = [
  {
    eventId: 'draft-1',
    mongoId: 'draft-mongo-1',
    eventName: 'Morning Football Match',
    eventImages: [],
    eventVideo: null,
    eventType: 'social',
    eventSports: ['Football'],
    eventDateTime: new Date('2026-02-25T09:00:00').toISOString(),
    eventEndDateTime: null,
    eventFrequency: [],
    eventLocation: 'Dubai Sports City',
    eventDescription: 'Friendly football match',
    eventGender: 'mixed',
    eventSportsLevel: 'intermediate',
    eventMinAge: null,
    eventMaxAge: null,
    eventLevelRestriction: null,
    eventMaxGuest: 20,
    eventPricePerGuest: 50,
    IsPrivateEvent: false,
    eventOurGuestAllowed: true,
    eventApprovalReq: false,
    eventRegistrationStartTime: null,
    eventRegistrationEndTime: null,
    eventStatus: 'upcoming',
    eventTotalAttendNumber: 0,
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
    eventId: 'draft-2',
    mongoId: 'draft-mongo-2',
    eventName: 'Tennis Practice Session',
    eventImages: [],
    eventVideo: null,
    eventType: 'training',
    eventSports: ['Tennis'],
    eventDateTime: new Date('2026-02-28T16:00:00').toISOString(),
    eventEndDateTime: null,
    eventFrequency: [],
    eventLocation: 'Al Wasl Sports Club',
    eventDescription: 'Tennis practice for intermediate players',
    eventGender: 'mixed',
    eventSportsLevel: 'intermediate',
    eventMinAge: null,
    eventMaxAge: null,
    eventLevelRestriction: null,
    eventMaxGuest: 8,
    eventPricePerGuest: 75,
    IsPrivateEvent: false,
    eventOurGuestAllowed: true,
    eventApprovalReq: false,
    eventRegistrationStartTime: null,
    eventRegistrationEndTime: null,
    eventStatus: 'upcoming',
    eventTotalAttendNumber: 0,
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
  { label: 'Football', value: 'football' },
  { label: 'Tennis', value: 'tennis' },
  { label: 'Table Tennis', value: 'table-tennis' },
  { label: 'Basketball', value: 'basketball' },
  { label: 'Badminton', value: 'badminton' },
];

const EVENT_TYPE_OPTIONS = [
  { label: 'Social', value: 'social' },
  { label: 'Class', value: 'class' },
  { label: 'Tournament', value: 'tournament' },
  { label: 'Training', value: 'training' },
];

const REGISTRATION_POLICY_OPTIONS = [
  { label: 'Only Allowed before the day of the event', value: 'before-event' },
  { label: 'Allowed until event starts', value: 'until-start' },
  { label: 'No restrictions', value: 'no-restrictions' },
];

// Separate content component that can be used in different contexts
export const CreateEventContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationStep, setRegistrationStep] = useState<'start' | 'end'>('start');
  const [showRestrictionsModal, setShowRestrictionsModal] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

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
                  labelSize={16}
                  labelWeight="semibold"
                  variant='transparent'
                  placeholder="Enter Your Event Name"
                  value={formData.eventName}
                  onChangeText={(text) => updateFormData('eventName', text)}
                  containerStyle={styles.eventNameInput}
                />
                <FlexView row gap={8}>
                  {formData.sport && <IconTag title={formData.sport} size='small' />}
                  {formData.eventType && <IconTag  title={formData.eventType} variant='teal' size='small' />}
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
                leftIcon={<ImageDs image="SportIcon" size={20} />}
              />
            </FlexView>
            <FlexView flex={1}>
              <Dropdown
                placeholder="Event Type"
                options={EVENT_TYPE_OPTIONS}
                value={formData.eventType}
                onSelect={(value) => updateFormData('eventType', value)}
                containerStyle={styles.selectContainer}
                leftIcon={<ImageDs image="Nametag" size={20} />}
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
              <TextDs
                size={16} weight="regular"
                color={formData.dateTime ? 'primary' : 'secondary'}
              >
                {formData.dateTime
                  ? formData.dateTime.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })
                  : 'Date & Time'}
              </TextDs>
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
            leftIcon={<ImageDs image="BallpointPen" size={20} />}
            multiline
            numberOfLines={4}
            style={{ minHeight: 80, textAlignVertical: 'top' }}
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
                  Add Restrictions
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
                    ? `${formData.registrationStartTime.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })} – ${formData.registrationEndTime.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`
                    : 'Registration Start & End Time'}
                </TextDs>
              </FlexView>
            </TouchableOpacity>

            <FlexView height={spacing.base} />

            <Dropdown
              placeholder="Only Allowed before the day of the event"
              options={REGISTRATION_POLICY_OPTIONS}
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
              {DRAFT_EVENTS.length > 0 ? (
                DRAFT_EVENTS.map((event) => (
                  <EventCard
                    key={event.eventId}
                    id={event.eventId}
                    event={event}
                    onPress={() => {}}
                    onBookmark={() => {}}
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
                    onPress={() => {}}
                    onBookmark={() => {}}
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
            onConfirm={(date, frequency) => {
              updateFormData('dateTime', date);

              if (!frequency || frequency === 'never') {
                updateFormData('frequency', []);
              } else {
                updateFormData('frequency', [frequency]);
              }
            }}
            initialDate={formData.dateTime || undefined}
            initialFrequency={formData.frequency?.[0]}
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
