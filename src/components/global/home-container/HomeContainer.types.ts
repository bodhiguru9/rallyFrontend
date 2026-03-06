import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

export interface HomeContainerProps {
  /**
   * Child components to render inside the container
   */
  children: ReactNode;

  /**
   * Active tab for bottom navigation
   * @required
   */
  activeTab: 'explore' | 'profile' | 'calendar' | 'home' | 'create';

  /**
   * User type for the header and navigation
   * If not provided, will be detected from auth store
   * @default Auto-detected from auth store
   */
  userType?: 'player' | 'organiser';

  /**
   * Whether to show the Header component
   * @default true
   */
  showHeader?: boolean;

  /**
   * Whether to show the BottomNavigation component
   * @default true
   */
  showBottomNav?: boolean;

  /**
   * Whether to show the back button in the top-left
   * @default false
   */
  showBackButton?: boolean;

  /**
   * Whether to use the gradient background
   * @default true
   */
  useGradientBackground?: boolean;

  /**
   * Whether to enable keyboard avoiding behavior
   * @default false
   */
  keyboardAvoiding?: boolean;

  /**
   * Custom content container styles
   */
  contentStyle?: ViewStyle;
}
