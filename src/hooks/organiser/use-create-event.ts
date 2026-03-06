import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '@services/event-service';
import { formatErrorForAlert, logError } from '@utils/error-handler';
import { logger } from '@dev-tools/logger';
import type { RootStackParamList } from '@navigation';
import type { CreateEventFormData } from '@screens/organiser/create-event';

type CreateEventScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateEvent'>;

/**
 * Custom hook for creating organiser events
 * Handles form state, validation, API calls, and navigation
 * Uses organiser-specific event creation API with custom payload format
 */
export const useCreateOrganiserEvent = () => {
  const navigation = useNavigation<CreateEventScreenNavigationProp>();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CreateEventFormData>({
    eventName: '',
    sport: '',
    eventType: '',
    dateTime: null,
    location: null,
    description: '',
    maxGuests: '',
    pricePerGuest: '',
    isPrivate: false,
    disallowGuests: false,
    approvalRequired: false,
    registrationStartTime: null,
    registrationEndTime: null,
    registrationPolicy: '',
    saveToDrafts: false,
    frequency: [],
    eventDisallow: undefined,
    eventApprovalRequired: undefined,
  });

  const [showCompleteProfileModal, setShowCompleteProfileModal] = useState(false);

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: eventService.createOrganiserEvent,
    onSuccess: () => {
      logger.success('Event created successfully');
      // Invalidate and refetch events list to show the new event
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['organiserDashboard'] });
    },
    onError: (error: unknown) => {
      logger.error('Event creation failed', error);
    },
  });

  /**
   * Updates a specific field in the form data
   */
  const updateFormData = (field: keyof CreateEventFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Resets the form to initial state
   */
  const resetForm = () => {
    setFormData({
      eventName: '',
      sport: '',
      eventType: '',
      dateTime: null,
      location: null,
      description: '',
      maxGuests: '',
      pricePerGuest: '',
      isPrivate: false,
      disallowGuests: false,
      approvalRequired: false,
      registrationStartTime: null,
      registrationEndTime: null,
      registrationPolicy: '',
      saveToDrafts: false,
      frequency: [],
      eventDisallow: undefined,
      eventApprovalRequired: undefined,
      restrictions: undefined,
    });
  };

  /**
   * Validates the form data before submission
   */
  const validateFormData = (): string | null => {
    if (!formData.eventName.trim()) {
      return 'Event name is required';
    }
    if (!formData.sport) {
      return 'Sport is required';
    }
    if (!formData.eventType) {
      return 'Event type is required';
    }
    if (!formData.dateTime) {
      return 'Date & Time is required';
    }
    const locationDisplay =
      typeof formData.location === 'object' && formData.location !== null
        ? formData.location.displayName
        : String(formData.location ?? '');
    if (!locationDisplay.trim()) {
      return 'Location is required';
    }
    if (!formData.description.trim()) {
      return 'Event description is required';
    }
    if (!formData.maxGuests.trim()) {
      return 'Maximum guests is required';
    }
    const maxGuestsNum = parseInt(formData.maxGuests, 10);
    if (isNaN(maxGuestsNum) || maxGuestsNum <= 0) {
      return 'Maximum guests must be a positive number';
    }
    if (!formData.pricePerGuest.trim()) {
      return 'Price per guest is required';
    }
    const pricePerGuestNum = parseFloat(formData.pricePerGuest);
    if (isNaN(pricePerGuestNum) || pricePerGuestNum < 0) {
      return 'Price per guest must be a valid number';
    }
    return null;
  };

  /**
   * Formats date to ISO string for API
   */
  const formatDateForAPI = (date: Date | null): string | undefined => {
    if (!date) {
      return undefined;
    }
    return date.toISOString();
  };

  /**
   * Maps form data to API payload format
   */
  const mapFormDataToAPI = () => {
    const restrictions = formData.restrictions;

    // Map gender from restrictions (open -> empty, male -> Male, female -> Female)
    let eventGender: string | undefined;
    if (restrictions?.gender) {
      if (restrictions.gender === 'male') {
        eventGender = 'Male';
      } else if (restrictions.gender === 'female') {
        eventGender = 'Female';
      }
      // 'open' maps to undefined (no gender restriction)
    }

    // Map sports level from restrictions
    let eventSportsLevel: string | undefined;
    if (restrictions?.sportsLevel && restrictions.sportsLevel !== 'all') {
      eventSportsLevel =
        restrictions.sportsLevel.charAt(0).toUpperCase() + restrictions.sportsLevel.slice(1);
    }

    return {
      eventName: formData.eventName.trim(),
      eventSports: formData.sport,
      eventType: formData.eventType,
      eventDateTime: formatDateForAPI(formData.dateTime),
      eventLocation:
        typeof formData.location === 'object' && formData.location !== null
          ? formData.location.displayName
          : String(formData.location ?? '').trim(),
      eventDescription: formData.description.trim(),
      eventGender,
      eventSportsLevel,
      eventMinAge: restrictions?.ageRange?.min,
      eventMaxAge: restrictions?.ageRange?.max,
      eventLevelRestriction: restrictions?.levelRestriction,
      eventMaxGuest: parseInt(formData.maxGuests, 10),
      eventPricePerGuest: parseFloat(formData.pricePerGuest),
      IsPrivateEvent: formData.isPrivate,
      eventOurGuestAllowed: !formData.disallowGuests, // Inverted: disallowGuests = false means guests allowed
      eventApprovalReq: formData.approvalRequired,
      eventRegistrationStartTime: formatDateForAPI(formData.registrationStartTime),
      eventRegistrationEndTime: formatDateForAPI(formData.registrationEndTime),
      eventFrequency: formData.frequency || [],
      eventDisallow: formData.eventDisallow,
      eventApprovalRequired: formData.eventApprovalRequired,
      policyJoind: formData.registrationPolicy || undefined,
    };
  };

  /**
   * Handles the create event API call
   */
  const handleCreateEventAPI = async () => {
    try {
      const payload = {
        ...mapFormDataToAPI(),
        imageUri: formData.imageUri ?? null,
      };
      await createEventMutation.mutateAsync(payload);

      Alert.alert('Success', 'Event created successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Reset form and navigate back to Home (organiser UI)
            resetForm();
            navigation.navigate('Home');
          },
        },
      ]);
    } catch (error: unknown) {
      logError(error, 'CreateEvent - handleCreateEventAPI');
      const { title, message } = formatErrorForAlert(error, 'Create Event');
      Alert.alert(title, message);
    }
  };

  /**
   * Handles the create event button press
   * Validates form and shows complete profile modal if needed
   */
  const handleCreateEvent = () => {
    // Validate form data
    const validationError = validateFormData();
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

    // Show Complete Profile Modal first
    setShowCompleteProfileModal(true);
  };

  /**
   * Handles complete profile modal submit
   * Creates the event after profile is complete
   */
  const handleCompleteProfileSubmit = async (_profileData: unknown) => {
    // Save profile data and then create event
    // Profile data handling can be added here if needed
    setShowCompleteProfileModal(false);

    // Create event after profile is complete
    await handleCreateEventAPI();
  };

  return {
    // Form state
    formData,
    updateFormData,
    resetForm,

    // Modal state
    showCompleteProfileModal,
    setShowCompleteProfileModal,

    // Handlers
    handleCreateEvent,
    handleCreateEventAPI,
    handleCompleteProfileSubmit,

    // Loading state
    isLoading: createEventMutation.isPending,
    isError: createEventMutation.isError,
    error: createEventMutation.error,
  };
};
