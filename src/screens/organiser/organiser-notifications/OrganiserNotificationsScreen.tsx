import React, { useMemo, useState } from 'react';
import { TextDs, FlexView } from '@components';
import { ActivityIndicator, Image, RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  useOrganiserNotifications,
  useAcceptRequest,
  useRejectRequest,
  useAcceptSubscriptionRequest,
  useRejectSubscriptionRequest,
  useMarkNotificationAsRead
} from '@hooks';
import { colors } from '@theme';
import { styles } from './style/OrganiserNotificationsScreen.styles';
import type { Notification } from '@components/global/notification-bottom-sheet/NotificationBottomSheet.types';
import type { RootStackParamList } from '@navigation';

type OrganiserNotificationsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const OrganiserNotificationsScreen: React.FC = () => {

  const navigation = useNavigation<OrganiserNotificationsScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<'general' | 'requests'>('general');
  const [page] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const { data: notificationData, isLoading, error, refetch } = useOrganiserNotifications(page);
  const acceptEventWaitlistMutation = useAcceptRequest();
  const rejectEventWaitlistMutation = useRejectRequest();
  const acceptSubscriptionMutation = useAcceptSubscriptionRequest();
  const rejectSubscriptionMutation = useRejectSubscriptionRequest();
  const markAsReadMutation = useMarkNotificationAsRead();

  const notifications: Notification[] = useMemo(
    () => notificationData?.notifications || [],
    [notificationData],
  );

  const requestNotifications = useMemo(
    () =>
      notifications.filter(
        (n) => n.type === 'event_join_request' || n.type === 'subscription_request',
      ),
    [notifications],
  );
  const generalNotifications = useMemo(
    () =>
      notifications.filter(
        (n) => n.type !== 'event_join_request' && n.type !== 'subscription_request',
      ),
    [notifications],
  );

  const displayedNotifications = activeTab === 'general' ? generalNotifications : requestNotifications;

  const handleAcceptRequest = (notification: Notification) => {
    if (notification.type === 'event_join_request') {
      const eventId = notification.data?.eventId;
      const waitlistId = notification.data?.waitlistId;
      if (eventId && waitlistId) {
        acceptEventWaitlistMutation.mutate({ eventId, waitlistId });
      }
    } else if (notification.type === 'subscription_request') {
      acceptSubscriptionMutation.mutate(notification.notificationId);
    }
  };

  const handleRejectRequest = (notification: Notification) => {
    if (notification.type === 'event_join_request') {
      const eventId = notification.data?.eventId;
      const waitlistId = notification.data?.waitlistId;
      if (eventId && waitlistId) {
        rejectEventWaitlistMutation.mutate({ eventId, waitlistId });
      }
    } else if (notification.type === 'subscription_request') {
      rejectSubscriptionMutation.mutate(notification.notificationId);
    }
  };
  const handleNotificationPress = (notification: Notification) => {
    // Mark as read when clicked
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.notificationId);
    }

    // Navigate to event details if it's an event-related notification
    const eventId = notification.event?.eventId || notification.data?.eventId;
    if (eventId) {
      navigation.navigate('OrganiserEventDetails', { eventId });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

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

  const renderNotificationItem = (notification: Notification) => {
    const isRequest =
      notification.type === 'event_join_request' ||
      notification.type === 'subscription_request';

    const userAvatar = notification.user?.profilePic || 'https://via.placeholder.com/40';

    const isEventJoin = notification.type === 'event_join_request';
    const isProcessing = isEventJoin
      ? acceptEventWaitlistMutation.isPending || rejectEventWaitlistMutation.isPending
      : acceptSubscriptionMutation.isPending || rejectSubscriptionMutation.isPending;
    const isRejectPending = isEventJoin
      ? rejectEventWaitlistMutation.isPending
      : rejectSubscriptionMutation.isPending;
    const isAcceptPending = isEventJoin
      ? acceptEventWaitlistMutation.isPending
      : acceptSubscriptionMutation.isPending;

    return (
      <TouchableOpacity
        key={notification.notificationId}
        style={[styles.notificationItem, !notification.isRead && styles.notificationItemUnread]}
        // activeOpacity={0.7}
        onPress={() => handleNotificationPress(notification)}
      >
        <Image source={{ uri: userAvatar }} style={styles.userAvatar} />

        <FlexView style={styles.notificationContent}>
          <TextDs style={styles.notificationText}>{notification.message}</TextDs>
          <TextDs style={styles.timestamp}>{formatTimestamp(notification.createdAt)}</TextDs>

          {isRequest && (
            <FlexView style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.declineButton, isProcessing && styles.buttonDisabled]}
                onPress={() => handleRejectRequest(notification)}
                activeOpacity={0.7}
                disabled={isProcessing}
              >
                {isRejectPending ? (
                  <ActivityIndicator size="small" color={colors.text.primary} />
                ) : (
                  <TextDs style={styles.declineButtonText}>Decline</TextDs>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.acceptButton, isProcessing && styles.buttonDisabled]}
                onPress={() => handleAcceptRequest(notification)}
                activeOpacity={0.7}
                disabled={isProcessing}
              >
                {isAcceptPending ? (
                  <ActivityIndicator size="small" color={colors.text.white} />
                ) : (
                  <TextDs style={styles.acceptButtonText}>Accept</TextDs>
                )}
              </TouchableOpacity>
            </FlexView>
          )}
        </FlexView>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlexView style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'general' && styles.tabActive]}
          onPress={() => setActiveTab('general')}
          activeOpacity={0.7}
        >
          <TextDs style={[styles.tabText, activeTab === 'general' && styles.tabTextActive]}>
            General
          </TextDs>
          {generalNotifications.filter((n) => !n.isRead).length > 0 && (
            <FlexView style={styles.badge}>
              <TextDs style={styles.badgeText}>
                {generalNotifications.filter((n) => !n.isRead).length}
              </TextDs>
            </FlexView>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'requests' && styles.tabActive]}
          onPress={() => setActiveTab('requests')}
          activeOpacity={0.7}
        >
          <TextDs style={[styles.tabText, activeTab === 'requests' && styles.tabTextActive]}>
            Requests
          </TextDs>
          {requestNotifications.filter((n) => !n.isRead).length > 0 && (
            <FlexView style={styles.badge}>
              <TextDs style={styles.badgeText}>
                {requestNotifications.filter((n) => !n.isRead).length}
              </TextDs>
            </FlexView>
          )}
        </TouchableOpacity>
      </FlexView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
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
        ) : displayedNotifications.length === 0 ? (
          <FlexView style={styles.emptyState}>
            <TextDs style={styles.emptyStateText}>No notifications</TextDs>
            <TextDs style={styles.emptySubtext}>
              {activeTab === 'general'
                ? "You don't have any notifications yet"
                : "You don't have any requests"}
            </TextDs>
          </FlexView>
        ) : (
          displayedNotifications.map(renderNotificationItem)
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
