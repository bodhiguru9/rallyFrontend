import React, { useState } from 'react';
import { TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { BottomSheetModal, TextDs, FlexView } from '@components';
import {
  useOrganiserNotifications,
  useAcceptEventJoinRequest,
  useRejectEventJoinRequest,
  useAcceptSubscription,
  useDeclineSubscription,
  useMarkNotificationAsRead,
} from '@hooks';
import { colors } from '@theme';
import type {
  NotificationBottomSheetProps,
  Notification,
  NotificationTab,
} from './NotificationBottomSheet.types';
import { styles } from './style/NotificationBottomSheet.styles';

export const NotificationBottomSheet: React.FC<NotificationBottomSheetProps> = ({
  visible,
  onClose,
  onAcceptSubscription,
  onDeclineSubscription,
  onNotificationPress,
}) => {
  const [activeTab, setActiveTab] = useState<NotificationTab>('general');
  const [page] = useState(1);

  // Fetch notifications from API
  const { data: notificationData, isLoading, error } = useOrganiserNotifications(page);
  const acceptEventJoinRequestMutation = useAcceptEventJoinRequest();
  const rejectEventJoinRequestMutation = useRejectEventJoinRequest();
  const acceptSubscriptionMutation = useAcceptSubscription();
  const declineSubscriptionMutation = useDeclineSubscription();
  const markAsReadMutation = useMarkNotificationAsRead();

  // Use API data only
  const notifications: Notification[] = notificationData?.notifications || [];

  // Handle accept request (event join or subscription)
  const handleAcceptRequest = (notification: Notification) => {
    if (notification.type === 'event_join_request') {
      // Accept event join request
      const eventId = notification.data?.eventId;
      const waitlistId = notification.data?.waitlistId;

      if (eventId && waitlistId) {
        acceptEventJoinRequestMutation.mutate({ eventId, waitlistId });
      }
    } else if (notification.type === 'subscription_request') {
      // Accept subscription request
      acceptSubscriptionMutation.mutate(notification.notificationId);
      onAcceptSubscription?.(notification.notificationId);
    }
  };

  // Handle reject/decline request (event join or subscription)
  const handleRejectRequest = (notification: Notification) => {
    if (notification.type === 'event_join_request') {
      // Reject event join request
      const eventId = notification.data?.eventId;
      const waitlistId = notification.data?.waitlistId;

      if (eventId && waitlistId) {
        rejectEventJoinRequestMutation.mutate({ eventId, waitlistId });
      }
    } else if (notification.type === 'subscription_request') {
      // Decline subscription request
      declineSubscriptionMutation.mutate(notification.notificationId);
      onDeclineSubscription?.(notification.notificationId);
    }
  };

  // Separate notifications by type
  const requestNotifications = notifications.filter(
    (n) => n.type === 'event_join_request' || n.type === 'subscription_request',
  );

  const generalNotifications = notifications.filter(
    (n) => n.type !== 'event_join_request' && n.type !== 'subscription_request',
  );

  const displayedNotifications =
    activeTab === 'general' ? generalNotifications : requestNotifications;

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
      notification.type === 'event_join_request' || notification.type === 'subscription_request';

    // Get user info
    const userAvatar = notification.user?.profilePic || 'https://via.placeholder.com/40';

    // Check if any mutation is pending for this notification
    const isProcessing =
      notification.type === 'event_join_request'
        ? acceptEventJoinRequestMutation.isPending || rejectEventJoinRequestMutation.isPending
        : acceptSubscriptionMutation.isPending || declineSubscriptionMutation.isPending;

    return (
      <TouchableOpacity
        key={notification.notificationId}
        style={[styles.notificationItem, !notification.isRead && styles.notificationItemUnread]}
        onPress={() => {
          if (!notification.isRead) {
            markAsReadMutation.mutate(notification.notificationId);
          }
          onNotificationPress?.(notification);
        }}
        activeOpacity={0.7}
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
                {(
                  notification.type === 'event_join_request'
                    ? rejectEventJoinRequestMutation.isPending
                    : declineSubscriptionMutation.isPending
                ) ? (
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
                {(
                  notification.type === 'event_join_request'
                    ? acceptEventJoinRequestMutation.isPending
                    : acceptSubscriptionMutation.isPending
                ) ? (
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
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      snapPoints={['90%']}
      enablePanDownToClose={true}
      showHandleIndicator={true}
    >
      <FlexView style={styles.container}>
        {/* Tab Selector */}
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

        {/* Notifications List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
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
      </FlexView>
    </BottomSheetModal>
  );
};
