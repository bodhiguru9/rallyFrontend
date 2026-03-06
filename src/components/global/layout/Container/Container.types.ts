import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

export interface ContainerProps {
  /**
   * Child components to render inside the container
   */
  children: ReactNode;

  /**
   * Whether to show the back button in the top-left
   * @default false
   */
  showBackButton?: boolean;

  /**
   * Custom back button handler (overrides default navigation.goBack())
   */
  onBackPress?: () => void;

  /**
   * Whether to show the Header component
   * @default false
   */
  showHeader?: boolean;

  /**
   * User type for the header (player or organiser)
   * @default 'player'
   * @deprecated This prop is no longer needed as the header determines user type from auth store
   */
  userType?: 'player' | 'organiser';

  /**
   * Notification count badge (for player header)
   */
  notificationCount?: number;

  /**
   * Handler for search button press
   */
  onSearchPress?: () => void;

  /**
   * Handler for notification button press
   */
  onNotificationPress?: () => void;

  /**
   * Handler for profile/avatar press
   */
  onProfilePress?: () => void;

  /**
   * Handler for sign up button press (unauthenticated player)
   */
  onSignUpPress?: () => void;

  /**
   * Whether to show the BottomNavigation component
   * @default false
   */
  showBottomNav?: boolean;

  /**
   * Active tab for bottom navigation
   */
  activeTab?: 'explore' | 'profile' | 'calendar' | 'home' | 'create';

  /**
   * User initials for header avatar (player)
   */
  userInitials?: string;

  /**
   * User avatar URL for header (organiser)
   */
  userAvatar?: string;

  /**
   * Handler for explore tab press (player bottom nav)
   */
  onExplorePress?: () => void;

  /**
   * Handler for calendar tab press (player bottom nav)
   */
  onCalendarPress?: () => void;

  /**
   * Handler for profile tab press in bottom nav (player)
   */
  onBottomProfilePress?: () => void;

  /**
   * Handler for home tab press (organiser bottom nav)
   */
  onHomePress?: () => void;

  /**
   * Handler for create tab press (organiser bottom nav)
   */
  onCreatePress?: () => void;

  /**
   * Whether to use the gradient background
   * @default true
   */
  useGradientBackground?: boolean;

  /**
   * Whether to wrap in SafeAreaView
   * @default true
   */
  useSafeArea?: boolean;

  /**
   * Custom container styles
   */
  style?: ViewStyle;

  /**
   * Custom content container styles
   */
  contentStyle?: ViewStyle;

  /**
   * Whether to enable keyboard avoiding behavior
   * @default false
   */
  keyboardAvoiding?: boolean;
}
