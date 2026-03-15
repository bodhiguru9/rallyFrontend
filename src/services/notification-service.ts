import { apiClient } from './api/api-client';
import type { Notification } from '@components/global/notification-bottom-sheet';

export interface PaginationData {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/** Raw shape returned by the player notifications API (may use body/content/text instead of message) */
export interface PlayerNotificationApiItem {
  notificationId: string;
  type: string;
  title?: string;
  message?: string;
  body?: string;
  content?: string;
  text?: string;
  isRead?: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
  user?: unknown;
  organiser?: unknown;
  event?: unknown;
}

export interface PlayerNotificationsApiResponse {
  success: boolean;
  message: string;
  data: {
    unreadCount: number;
    notifications: PlayerNotificationApiItem[];
    pagination: PaginationData;
  };
}

export interface NotificationApiResponse {
  success: boolean;
  message: string;
  data: {
    unreadCount: number;
    notifications: Notification[];
    pagination: PaginationData;
  };
}

export interface OrganiserNotificationsApiResponse {
  success: boolean;
  message: string;
  data: {
    unreadCount: number;
    notifications: Array<{
      type: 'organiser-join-request' | 'event-join-request';
      requestId: string;
      requestSubtype?: string;
      joinRequestId?: string;
      waitlistId?: string | null;
      user: {
        userId: number;
        userType: string;
        email: string;
        mobileNumber: string;
        profilePic: string | null;
        fullName: string;
      } | null;
      event?: {
        eventId: string;
        eventTitle?: string | null;
        eventName?: string | null;
        eventCategory?: string | null;
        eventType?: string | null;
      };
      status: string;
      createdAt: string;
      requestType: string;
    }>;
    organiserJoinRequests?: number;
    eventWaitlistRequests?: number;
    eventPendingRequests?: number;
    pagination: PaginationData;
  };
}

export interface NotificationResponse {
  unreadCount: number;
  notifications: Notification[];
  pagination: PaginationData;
}

export interface AcceptRequestPayload {
  eventId: string;
  waitlistId: string;
}

export interface RejectRequestPayload {
  eventId: string;
  waitlistId: string;
}

export const notificationService = {
  /**
   * Get notifications for organiser
   * @param page - Page number (starts from 1)
   */
  getOrganiserNotifications: async (page: number = 1): Promise<NotificationResponse> => {
    const { data } = await apiClient.get<OrganiserNotificationsApiResponse>('/api/notifications/organiser', {
      params: { page },
    });
    const mappedNotifications: Notification[] = (data.data.notifications || []).map((notification) => {
      const isEventJoin = notification.type === 'event-join-request';
      const type = isEventJoin ? 'event_join_request' : 'subscription_request';
      const userName = notification.user?.fullName ?? 'Someone';
      const eventTitle = notification.event?.eventTitle ?? notification.event?.eventName ?? null;
      return {
        notificationId: notification.requestId,
        type,
        title: isEventJoin ? 'Event join request' : 'Organiser join request',
        message: isEventJoin
          ? `${userName} requested to join the waitlist for your event${eventTitle ? ` "${eventTitle}"` : ''}`
          : `${userName} requested to join your community`,
        isRead: notification.status !== 'pending',
        createdAt: notification.createdAt,
        data: {
          eventId: notification.event?.eventId,
          waitlistId: notification.waitlistId ?? undefined,
          userId: notification.user?.userId.toString(),
        },
        user: notification.user
          ? {
              userId: notification.user.userId,
              fullName: notification.user.fullName,
              email: notification.user.email,
              profilePic: notification.user.profilePic,
              userType: notification.user.userType,
            }
          : undefined,
        event: notification.event
          ? {
              eventId: notification.event.eventId,
              eventName: notification.event.eventTitle ?? notification.event.eventName ?? undefined,
            }
          : undefined,
      };
    });

    return {
      unreadCount: data.data.unreadCount,
      notifications: mappedNotifications,
      pagination: data.data.pagination,
    };
  },

  /**
   * Get notifications for player
   * Maps API response to Notification shape and derives message from API fields (message/body/content/text/title).
   * @param page - Page number (starts from 1)
   */
  getPlayerNotifications: async (page: number = 1): Promise<NotificationResponse> => {
    const { data } = await apiClient.get<PlayerNotificationsApiResponse>('/api/notifications/player', {
      params: { page },
    });
    const raw = data.data;
    const notifications: Notification[] = (raw.notifications || []).map((item) => {
      const displayMessage =
        item.message ??
        item.body ??
        item.content ??
        item.text ??
        item.title ??
        'You have a new notification';
      return {
        notificationId: item.notificationId,
        type: item.type as Notification['type'],
        title: item.title ?? 'Notification',
        message: displayMessage,
        isRead: item.isRead ?? false,
        createdAt: item.createdAt,
        data: item.data as Notification['data'],
        user: item.user as Notification['user'],
        organiser: item.organiser as Notification['organiser'],
        event: item.event as Notification['event'],
      };
    });
    return {
      unreadCount: raw.unreadCount,
      notifications,
      pagination: raw.pagination,
    };
  },

  /**
   * Mark a notification as read
   * @param notificationId - The notification ID
   */
  markAsRead: async (notificationId: string): Promise<void> => {
    await apiClient.patch(`/api/notifications/${notificationId}/read`);
  },

  /**
   * Mark a player notification as read
   * @param notificationId - The notification ID
   */
  markPlayerNotificationAsRead: async (notificationId: string): Promise<void> => {
    await apiClient.put(`/api/notifications/player/${notificationId}/read`);
  },

  /**
   * Mark all notifications as read (generic endpoint)
   */
  markAllAsRead: async (): Promise<void> => {
    await apiClient.put('/api/notifications/read-all');
  },

  /**
   * Mark all player notifications as read
   */
  markAllPlayerNotificationsAsRead: async (): Promise<void> => {
    await apiClient.put('/api/notifications/player/read-all');
  },

  /**
   * Mark all organiser notifications as read
   */
  markAllOrganiserNotificationsAsRead: async (): Promise<void> => {
    await apiClient.put('/api/notifications/organiser/read-all');
  },

  /**
   * Accept event waitlist request
   * POST /api/events/{eventId}/waitlist/{waitlistId}/accept
   */
  acceptEventWaitlistRequest: async (
    eventId: string,
    waitlistId: string,
  ): Promise<void> => {
    await apiClient.post(`/api/events/${eventId}/waitlist/${waitlistId}/accept`);
  },

  /**
   * Reject event waitlist request
   * POST /api/events/{eventId}/waitlist/{waitlistId}/reject
   */
  rejectEventWaitlistRequest: async (
    eventId: string,
    waitlistId: string,
  ): Promise<void> => {
    await apiClient.post(`/api/events/${eventId}/waitlist/${waitlistId}/reject`);
  },

  /**
   * Accept subscription/organiser join request (private organiser profile only)
   * POST /api/request/{requestId}/accept
   */
  acceptSubscriptionRequest: async (requestId: string): Promise<void> => {
    await apiClient.post(`/api/request/${requestId}/accept`);
  },

  /**
   * Reject subscription/organiser join request
   * POST /api/request/{requestId}/reject
   */
  rejectSubscriptionRequest: async (requestId: string): Promise<void> => {
    await apiClient.post(`/api/request/${requestId}/reject`);
  },
  /**
   * Delete a notification
   * @param notificationId - The notification ID
   */
  deleteNotification: async (notificationId: string): Promise<void> => {
    await apiClient.delete(`/api/notifications/${notificationId}`);
  },
};
