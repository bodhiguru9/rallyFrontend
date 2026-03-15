import React, { useState, useMemo } from 'react';
import { TextDs, FlexView } from '@components';
import { SegmentedControl } from '@components/global';
import { Pressable, Platform, ScrollView, Image, ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  usePlayerNotifications,
  useMarkPlayerNotificationAsRead,
  useMarkAllPlayerNotificationsAsRead,
  useMyEventInvitations,
  useAcceptEventInvitation,
  useDeclineEventInvitation,
} from '@hooks';
import { colors } from '@theme';
import type { RootStackParamList } from '@navigation';
import type {
  Notification,
  NotificationTab,
} from '@components/global/notification-bottom-sheet/NotificationBottomSheet.types';
import { InvitationCard } from './components/InvitationCard';
import type { Invitation } from './components/InvitationCard/InvitationCard.types';
import { styles } from './style/PlayerNotificationsScreen.styles';

const NOTIFICATION_TABS: { value: NotificationTab; label: string }[] = [
  { value: 'general', label: 'General' },
  { value: 'invitations', label: 'Invitation' },
];

type PlayerNotificationsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PlayerNotifications'
>;

export const PlayerNotificationsScreen: React.FC = () => {
  const navigation = useNavigation<PlayerNotificationsScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<NotificationTab>('general');
  const [page] = useState(1);
  const [invitesPage] = useState(1);
  const [invitesStatus] = useState('pending');

  // Fetch notifications from API
  const { data: notificationData, isLoading, error } = usePlayerNotifications(page);
  const markAsReadMutation = useMarkPlayerNotificationAsRead();
  const markAllAsReadMutation = useMarkAllPlayerNotificationsAsRead();

  // Fetch invitations from API
  const {
    data: invitesData,
  } = useMyEventInvitations(invitesPage, invitesStatus);
  const acceptInvitationMutation = useAcceptEventInvitation();
  const declineInvitationMutation = useDeclineEventInvitation();

  // Use API data only - show all notifications (no filtering)
  const notifications: Notification[] = notificationData?.notifications || [];

  const formatInvitationTimestamp = (createdAt: string): string => {
    const date = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) { return 'Just now'; }
    if (diffMins < 60) { return `${diffMins}m`; }
    if (diffHours < 24) { return `${diffHours}h`; }
    return `${diffDays}d`;
  };

  const formatEventDateTime = (eventDateTime?: string | null): string => {
    if (!eventDateTime) { return '—'; }
    const dt = new Date(eventDateTime);
    return dt.toLocaleString(undefined, {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const pickTagColors = (label: string) => {
    const key = label.toLowerCase();
    if (key === 'social') { return { backgroundColor: '#E0F7F5', textColor: '#4ECDC4' }; }
    if (key === 'tournament') { return { backgroundColor: '#F3E5F5', textColor: '#9C27B0' }; }
    if (key === 'tennis') { return { backgroundColor: '#FEF5E7', textColor: '#F39C12' }; }
    if (key === 'padel') { return { backgroundColor: '#FEF3E7', textColor: '#FF6B35' }; }
    return { backgroundColor: '#EEF2FF', textColor: '#4F46E5' };
  };

  const getPlaceholderEventImage = () => 'https://via.placeholder.com/400x300?text=Event';

  const invitations: Invitation[] = (invitesData?.invitations || []).map((inv) => {
    const eventTitle = inv.event.eventTitle || inv.event.eventName || 'Event';
    const eventType = inv.event.eventType || 'event';
    const organiserName = inv.organiser.communityName || inv.organiser.fullName || 'Organiser';

    const tag1 = inv.event.eventCategory ? inv.event.eventCategory : undefined;
    const tag2 = inv.event.eventType ? inv.event.eventType : undefined;
    const tagLabels = [tag1, tag2].filter(Boolean) as string[];

    const eventImage =
      inv.event.eventImages?.[0] ?? getPlaceholderEventImage();

    return {
      id: inv.inviteId ?? inv.event.eventId,
      inviteId: inv.inviteId,
      message:
        inv.message ?? `${organiserName} has sent you a ${eventType} invitation.`,
      timestamp: formatInvitationTimestamp(inv.createdAt),
      organiserName,
      organiserAvatarColor: '#4ECDC4',
      organiserIcon: 'activity',
      eventName: eventTitle,
      eventImage,
      tags: tagLabels.map((label) => ({
        label,
        ...pickTagColors(label),
      })),
      dateTime: formatEventDateTime(inv.event.eventDateTime),
      location: inv.event.eventLocation || '—',
    };
  });

  const displayedNotifications = activeTab === 'general' ? notifications : [];

  const formatTimestamp = (createdAt: string): string => {
    const date = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) {
      return 'Just now';
    }
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    }
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }
    return date.toLocaleDateString();
  };

  const handleNotificationPress = (notification: Notification) => {
    // Always mark as read when clicked (using player-specific endpoint)
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.notificationId);
    }

    // Navigate based on notification type
    if (notification.data?.eventId) {
      navigation.navigate('EventDetails', { eventId: notification.data.eventId });
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleAcceptInvitation = (invitationId: string) => {
    // Call the mutation to accept the invitation
    acceptInvitationMutation.mutate(invitationId, {
      onSuccess: () => {
        // Find the original invitation data to get event details
        const originalInvitation = invitesData?.invitations?.find(
          (inv) => (inv.inviteId ?? inv.event.eventId) === invitationId
        );

        if (originalInvitation?.event?.eventId) {
          // Navigate to EventDetails screen after successfully accepting
          navigation.navigate('EventDetails', { 
            eventId: originalInvitation.event.eventId 
          });
        }
      },
      onError: (err: any) => {
        console.error('Failed to accept invitation:', err);
        // Optional: you could show a toast or alert here if it fails
      }
    });
  };

  const handleDeclineInvitation = (invitationId: string) => {
    declineInvitationMutation.mutate(invitationId);
  };

  const renderNotificationItem = (notification: Notification) => {
    // Get user/organiser info - API may return 'organiser' field for player notifications
    const userInfo = notification.organiser || notification.user;
    const userAvatar = userInfo?.profilePic || 'https://via.placeholder.com/40';

    return (
      <Pressable
        key={notification.notificationId}
        style={({ pressed }) => [
          styles.notificationItem,
          !notification.isRead && styles.notificationItemUnread,
          Platform.OS === 'ios' && pressed && { opacity: 0.7 },
        ]}
        onPress={() => handleNotificationPress(notification)}
        android_ripple={{ color: `${colors.primary}20`, borderless: false }}
      >
        <Image source={{ uri: userAvatar }} style={styles.userAvatar} />
        <FlexView style={styles.notificationContent}>
          <TextDs style={styles.notificationText}>
            {notification.message ?? notification.title ?? 'Notification'}
          </TextDs>

          <FlexView alignItems='center' justifyContent='space-between' row isFullWidth>
            <TextDs style={styles.timestamp}>{formatTimestamp(notification.createdAt)}</TextDs>

            {notification.type === 'event_request_accepted' && (
              <Pressable
                style={({ pressed }) => [
                  styles.notificationActionButton,
                  Platform.OS === 'ios' && pressed && { opacity: 0.7 },
                ]}
                onPress={() => {
                  if (notification.data?.eventId) {
                    navigation.navigate('Booking', {
                      eventId: notification.data.eventId,
                      totalPrice: notification.data.totalPrice ?? notification.data.price ?? 0,
                      currency: notification.data.currency ?? 'AED',
                      guestsCount: notification.data.guestsCount ?? 1,
                    });
                  }
                }}
                android_ripple={{ color: `${colors.primary}30`, borderless: false }}
              >
                <TextDs style={styles.notificationActionButtonText}>Pay Now</TextDs>
              </Pressable>
            )}
          </FlexView>
        </FlexView>
      </Pressable>
    );
  };

  const renderInvitations = () => {
    // Group invitations by date (for date separators)
    const groupedInvitations: { [key: string]: typeof invitations } = {};

    invitations.forEach((invitation) => {
      const dateKey = new Date(invitesData?.invitations?.find((i) => (i.inviteId ?? i.event.eventId) === invitation.id)?.createdAt || Date.now()).toLocaleDateString(
        undefined,
        { day: '2-digit', month: 'short' },
      );
      if (!groupedInvitations[dateKey]) {
        groupedInvitations[dateKey] = [];
      }
      groupedInvitations[dateKey].push(invitation);
    });

    return Object.entries(groupedInvitations).map(([date, dateInvitations]) => (
      <FlexView key={date}>
        <TextDs style={styles.dateSeparator}>{date}</TextDs>
        {dateInvitations.map((invitation) => (
          <InvitationCard
            key={invitation.id}
            invitation={invitation}
            onAccept={handleAcceptInvitation}
            onDecline={handleDeclineInvitation}
          />
        ))}
      </FlexView>
    ));
  };

  const activeTabIndex = useMemo(
    () => NOTIFICATION_TABS.findIndex((t) => t.value === activeTab),
    [activeTab],
  );

  const hasUnread = Boolean(notificationData && notificationData.unreadCount > 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header: symmetric left/right so title stays centered */}
      <FlexView style={styles.header}>
        <View style={styles.headerSide}>
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              Platform.OS === 'ios' && pressed && { opacity: 0.7 },
            ]}
            onPress={() => navigation.goBack()}
            android_ripple={{ color: `${colors.primary}30`, borderless: true, radius: 20 }}
          >
            <ArrowLeft size={24} color={colors.text.primary} />
          </Pressable>
        </View>
        <TextDs style={styles.headerTitle}>Notifications</TextDs>
        <View style={[styles.headerSide, styles.headerSideRight]}>
          {hasUnread ? (
            <Pressable
              style={({ pressed }) => [
                styles.markAllButton,
                Platform.OS === 'ios' && pressed && { opacity: 0.7 },
              ]}
              onPress={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
              android_ripple={{ color: `${colors.primary}30`, borderless: false }}
            >
              <TextDs style={styles.markAllText}>Mark all read</TextDs>
            </Pressable>
          ) : null}
        </View>
      </FlexView>

      {/* Tabs: use shared SegmentedControl */}
      <FlexView style={styles.tabWrapper}>
        <SegmentedControl
          tabs={NOTIFICATION_TABS.map((t) => t.label)}
          activeTab={activeTabIndex}
          onTabChange={(index) => setActiveTab(NOTIFICATION_TABS[index].value)}
          containerStyle={styles.tabContainer}
        />
      </FlexView>

      {/* Notifications List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {isLoading ? (
          <FlexView style={styles.emptyState}>
            <ActivityIndicator size="large" color={colors.primary} />
            <TextDs style={styles.loadingText}>Loading notifications...</TextDs>
          </FlexView>
        ) : error ? (
          <FlexView style={styles.emptyState}>
            <TextDs style={styles.emptyStateText}>Failed to load notifications</TextDs>
            <TextDs style={styles.errorSubtext}>Please try again later</TextDs>
          </FlexView>
        ) : activeTab === 'invitations' ? (
          invitations.length === 0 ? (
            <FlexView style={styles.emptyState}>
              <TextDs style={styles.emptyStateText}>No invitations</TextDs>
              <TextDs style={styles.emptySubtext}>You don&apos;t have any invitations yet</TextDs>
            </FlexView>
          ) : (
            renderInvitations()
          )
        ) : displayedNotifications.length === 0 ? (
          <FlexView style={styles.emptyState}>
            <TextDs style={styles.emptyStateText}>No notifications</TextDs>
            <TextDs style={styles.emptySubtext}>You don&apos;t have any notifications yet</TextDs>
          </FlexView>
        ) : (
          displayedNotifications.map(renderNotificationItem)
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
