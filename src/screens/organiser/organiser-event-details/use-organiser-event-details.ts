import { useState, useEffect, useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation';
import { useEvent, useUpdateEvent } from '@hooks/use-events';
import { useQueryClient } from '@tanstack/react-query';
import { formatDate, shareEvent } from '@utils';
import type { EventData } from '@app-types';
import { eventInvitesService } from '@services';

type Tab = 'about' | 'members' | 'invite';

/** Form state for editing event on the same screen */
export interface OrganiserEventEditFormData {
  eventName: string;
  eventDescription: string;
  eventLocation: string;
  eventDateTime: string;
  eventEndDateTime?: string | null;
  eventMaxGuest: number;
  eventPricePerGuest: number;
  IsPrivateEvent: boolean;
  eventOurGuestAllowed: boolean;
  eventApprovalReq: boolean;
  eventFrequency?: string[];
  eventFrequencyEndDate?: string | null;
}

const defaultEditFormData: OrganiserEventEditFormData = {
  eventName: '',
  eventDescription: '',
  eventLocation: '',
  eventDateTime: '',
  eventEndDateTime: null,
  eventMaxGuest: 0,
  eventPricePerGuest: 0,
  IsPrivateEvent: false,
  eventOurGuestAllowed: true,
  eventApprovalReq: false,
  eventFrequency: [],
  eventFrequencyEndDate: null,
};

function eventToEditFormData(event: EventData): OrganiserEventEditFormData {
  return {
    eventName: event.eventName ?? '',
    eventDescription: event.eventDescription ?? '',
    eventLocation: event.eventLocation ?? '',
    eventDateTime: event.eventDateTime ?? '',
    eventEndDateTime: event.eventEndDateTime ?? null,
    eventMaxGuest: event.eventMaxGuest ?? 0,
    eventPricePerGuest: event.eventPricePerGuest ?? 0,
    IsPrivateEvent: event.IsPrivateEvent ?? false,
    eventOurGuestAllowed: event.eventOurGuestAllowed ?? true,
    eventApprovalReq: event.eventApprovalReq ?? false,
    eventFrequency: event.eventFrequency ?? [],
    eventFrequencyEndDate: event.eventFrequencyEndDate ?? null,
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
  const { eventId, isReadOnly = false, occurrenceStart, occurrenceEnd } = route.params;

  const queryClient = useQueryClient();
  const { data: event, isLoading, error } = useEvent(eventId, {
    allowPrivate: true,
    occurrenceStart,
    refetchInterval: 5000,
  });
  const updateEventMutation = useUpdateEvent();

  const [activeTab, setActiveTab] = useState<Tab>(isReadOnly ? 'about' : 'members');
  const [isMembersModalVisible, setIsMembersModalVisible] = useState(false);
  const [isDeleteEventModalVisible, setIsDeleteEventModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState<OrganiserEventEditFormData>(defaultEditFormData);
  const [invitedUserIds, setInvitedUserIds] = useState<string[]>([]);

  useEffect(() => {
    if (error && !isLoading) {
      navigation.navigate('Home');
    }
  }, [error, isLoading, navigation]);

  useEffect(() => {
    if (eventId) {
      eventInvitesService.getOrganiserEventInvites(eventId)
        .then((res) => {
          if (res?.invitations) {
            const pastInvitedIds = res.invitations
              .map((inv) => inv.player?.userId?.toString())
              .filter(Boolean) as string[];
            setInvitedUserIds((prev) => Array.from(new Set([...prev, ...pastInvitedIds])));
          }
        })
        .catch((err) => {
          console.log('Failed to fetch previous invites:', err);
        });
    }
  }, [eventId]);

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
      eventEndDateTime: editFormData.eventEndDateTime ?? undefined,
      eventMaxGuest: editFormData.eventMaxGuest,
      eventPricePerGuest: editFormData.eventPricePerGuest,
      IsPrivateEvent: editFormData.IsPrivateEvent,
      eventOurGuestAllowed: editFormData.eventOurGuestAllowed,
      eventApprovalReq: editFormData.eventApprovalReq,
      eventFrequency: editFormData.eventFrequency ?? [],
      eventFrequencyEndDate: editFormData.eventFrequencyEndDate ?? undefined,
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
    isReadOnly,

    // State
    activeTab,
    setActiveTab,
    isMembersModalVisible,
    isDeleteEventModalVisible,
    isEditMode,
    editFormData,
    isSaving: updateEventMutation.isPending,
    invitedUserIds,
    setInvitedUserIds,

    occurrenceStart,
    occurrenceEnd,
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
