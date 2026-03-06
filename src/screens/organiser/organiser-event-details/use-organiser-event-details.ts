import { useState, useEffect, useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation';
import { useEvent, useUpdateEvent } from '@hooks/use-events';
import { useQueryClient } from '@tanstack/react-query';
import { formatDate, shareEvent } from '@utils';
import type { EventData } from '@app-types';

type Tab = 'about' | 'members' | 'invite';

/** Form state for editing event on the same screen */
export interface OrganiserEventEditFormData {
  eventName: string;
  eventDescription: string;
  eventLocation: string;
  eventDateTime: string;
  eventMaxGuest: number;
  eventPricePerGuest: number;
  IsPrivateEvent: boolean;
  eventOurGuestAllowed: boolean;
  eventApprovalReq: boolean;
}

const defaultEditFormData: OrganiserEventEditFormData = {
  eventName: '',
  eventDescription: '',
  eventLocation: '',
  eventDateTime: '',
  eventMaxGuest: 0,
  eventPricePerGuest: 0,
  IsPrivateEvent: false,
  eventOurGuestAllowed: true,
  eventApprovalReq: false,
};

function eventToEditFormData(event: EventData): OrganiserEventEditFormData {
  return {
    eventName: event.eventName ?? '',
    eventDescription: event.eventDescription ?? '',
    eventLocation: event.eventLocation ?? '',
    eventDateTime: event.eventDateTime ?? '',
    eventMaxGuest: event.eventMaxGuest ?? 0,
    eventPricePerGuest: event.eventPricePerGuest ?? 0,
    IsPrivateEvent: event.IsPrivateEvent ?? false,
    eventOurGuestAllowed: event.eventOurGuestAllowed ?? true,
    eventApprovalReq: event.eventApprovalReq ?? false,
  };
}

type OrganiserEventDetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OrganiserEventDetails'
>;

type OrganiserEventDetailsRouteProp = NativeStackScreenProps<
  RootStackParamList,
  'OrganiserEventDetails'
>['route'];

export const useOrganiserEventDetails = () => {
  const navigation = useNavigation<OrganiserEventDetailsScreenNavigationProp>();
  const route = useRoute<OrganiserEventDetailsRouteProp>();
  const { eventId } = route.params;

  const queryClient = useQueryClient();
  const { data: event, isLoading, error } = useEvent(eventId);
  const updateEventMutation = useUpdateEvent();

  const [activeTab, setActiveTab] = useState<Tab>('members');
  const [isMembersModalVisible, setIsMembersModalVisible] = useState(false);
  const [isDeleteEventModalVisible, setIsDeleteEventModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState<OrganiserEventEditFormData>(defaultEditFormData);

  useEffect(() => {
    if (error && !isLoading) {
      navigation.navigate('Home');
    }
  }, [error, isLoading, navigation]);

  const handleShare = () => {
    if (event) {
      shareEvent({
        eventId: event.eventId ?? eventId,
        eventName: event.eventName ?? 'Event',
        creatorName: event.creator?.fullName ?? event.eventCreatorName ?? '',
        formattedDateTime: formatDate(event.eventDateTime ?? '', 'display-range'),
        eventLocation: event.eventLocation ?? undefined,
      });
    }
  };

  /** Enter edit mode and initialise form from current event */
  const handleEdit = useCallback(() => {
    if (event) {
      setEditFormData(eventToEditFormData(event));
      setActiveTab('about');
      setIsEditMode(true);
    }
  }, [event]);

  /** Exit edit mode without saving */
  const handleCancelEdit = useCallback(() => {
    setIsEditMode(false);
  }, []);

  /** Build partial payload and save, then exit edit mode */
  const handleSaveEdit = useCallback(async () => {
    if (!event?.eventId) return;
    const id = event.eventId;
    const payload: Partial<EventData> = {
      eventName: editFormData.eventName,
      eventDescription: editFormData.eventDescription,
      eventLocation: editFormData.eventLocation,
      eventDateTime: editFormData.eventDateTime,
      eventMaxGuest: editFormData.eventMaxGuest,
      eventPricePerGuest: editFormData.eventPricePerGuest,
      IsPrivateEvent: editFormData.IsPrivateEvent,
      eventOurGuestAllowed: editFormData.eventOurGuestAllowed,
      eventApprovalReq: editFormData.eventApprovalReq,
    };
    try {
      await updateEventMutation.mutateAsync({ id, event: payload });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event-details', eventId] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setIsEditMode(false);
    } catch {
      // Error handled by mutation; keep edit mode open
    }
  }, [event?.eventId, eventId, editFormData, updateEventMutation, queryClient]);

  const updateEditFormData = useCallback(<K extends keyof OrganiserEventEditFormData>(
    field: K,
    value: OrganiserEventEditFormData[K],
  ) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  /** Opens the delete-event confirmation modal. */
  const handleDeleteEvent = () => {
    if (event) {
      setIsDeleteEventModalVisible(true);
    }
  };

  const handleCloseDeleteEventModal = () => {
    setIsDeleteEventModalVisible(false);
  };

  /** Called by DeleteEventModal after delete event API succeeds. */
  const handleDeleteEventSuccess = () => {
    setIsDeleteEventModalVisible(false);
    navigation.navigate('Home');
  };

  const handleOpenMembersModal = () => {
    setIsMembersModalVisible(true);
  };

  const handleCloseMembersModal = () => {
    setIsMembersModalVisible(false);
  };

  const getRefundDate = () => {
    // Calculate refund date (day before event)
    return 'Tue 23 Oct, 3 pm';
  };

  return {
    // Data
    event,
    isLoading,
    error,
    eventId,

    // State
    activeTab,
    setActiveTab,
    isMembersModalVisible,
    isDeleteEventModalVisible,
    isEditMode,
    editFormData,
    isSaving: updateEventMutation.isPending,

    // Handlers
    handleShare,
    handleEdit,
    handleCancelEdit,
    handleSaveEdit,
    updateEditFormData,
    handleDeleteEvent,
    handleCloseDeleteEventModal,
    handleDeleteEventSuccess,
    handleOpenMembersModal,
    handleCloseMembersModal,
    getRefundDate,
  };
};
