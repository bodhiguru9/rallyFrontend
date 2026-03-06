export type NotificationType =
  | 'event_join_request'
  | 'event_request_accepted'
  | 'waitlist_joined'
  | 'follow'
  | 'event_joined'
  | 'booking_cancelled'
  | 'subscription_request';

export interface NotificationUser {
  userId: number;
  mongoId?: string;
  fullName: string;
  email?: string;
  profilePic?: string | null;
  userType?: string;
}

export interface NotificationEvent {
  eventId?: string;
  mongoId?: string;
  eventName?: string;
}

export interface NotificationData {
  userId?: string;
  organiserId?: string;
  eventId?: string;
  eventName?: string;
  waitlistId?: string;
  // Payment-related fields for event_request_accepted notifications
  totalPrice?: number;
  price?: number;
  currency?: string;
  guestsCount?: number;
}

export interface Notification {
  notificationId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: NotificationData;
  user?: NotificationUser;
  organiser?: NotificationUser; // For player notifications, API may return 'organiser' field
  event?: NotificationEvent;
}

export interface NotificationBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onAcceptSubscription?: (notificationId: string) => void;
  onDeclineSubscription?: (notificationId: string) => void;
  onNotificationPress?: (notification: Notification) => void;
}

export type NotificationTab = 'general' | 'invitations' | 'requests';
