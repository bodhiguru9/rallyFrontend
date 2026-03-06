import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation';
import { Container } from '@components/global/layout/Container';
import { useAuthStore } from '@store/auth-store';
import { usePlayerNotifications } from '@hooks';
import { logger } from '@dev-tools';
import type { HomeContainerProps } from './HomeContainer.types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * HomeContainer Component
 *
 * A simplified container component for screens that need both header and bottom navigation.
 * Automatically handles ALL navigation, authentication state, and notification counts.
 *
 * Key Features:
 * - Zero prop drilling - handles all navigation internally
 * - Automatically detects user type (player/organiser) from auth store
 * - Fetches notification count automatically
 * - Provides smart navigation based on user type and context
 *
 * @example
 * ```tsx
 * // Player home screen - that's it!
 * <HomeContainer activeTab="explore">
 *   <PlayerHomeContent />
 * </HomeContainer>
 *
 * // Organiser profile screen
 * <HomeContainer activeTab="home" userType="organiser">
 *   <OrganiserProfileContent />
 * </HomeContainer>
 *
 * // Calendar screen with custom styling
 * <HomeContainer activeTab="calendar" contentStyle={{ padding: 0 }}>
 *   <CalendarContent />
 * </HomeContainer>
 * ```
 */
export const HomeContainer: React.FC<HomeContainerProps> = ({
  children,
  activeTab,
  userType: userTypeProp,
  showHeader = true,
  showBottomNav = true,
  showBackButton = false,
  useGradientBackground = true,
  keyboardAvoiding = false,
  contentStyle,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const { user, isAuthenticated } = useAuthStore();

  // Automatically determine user type from auth store
  const userType = userTypeProp || (user?.userType === 'organiser' ? 'organiser' : 'player');
  const isPlayerUser = isAuthenticated && user?.userType === 'player';
  const isOrganiserUser = isAuthenticated && user?.userType === 'organiser';

  // Automatically fetch notification count for players
  const { data: playerNotificationsData } = usePlayerNotifications(1, {
    enabled: isPlayerUser,
  });

  // Automatically determine notification count
  const notificationCount =
    isPlayerUser && playerNotificationsData?.unreadCount
      ? playerNotificationsData.unreadCount
      : undefined;

  // Smart navigation handlers - all handled internally
  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  const handleNotificationPress = () => {
    if (!isAuthenticated) {
      return;
    }

    if (isPlayerUser) {
      navigation.navigate('PlayerNotifications');
    } else if (isOrganiserUser) {
      navigation.navigate('OrganiserNotifications');
    }
  };

  const handleProfilePress = () => {
    logger.info('🔵 [HomeContainer] Profile button pressed', {
      isAuthenticated,
      isPlayerUser,
      isOrganiserUser,
      userType,
      userFromStore: user,
    });

    // Navigate based on userType (derived from props or auth store)
    // Don't check authentication here because if they can see the header, they can click profile
    if (userType === 'player') {
      logger.info('🔵 [HomeContainer] Navigating to PlayerProfile');
      navigation.navigate('PlayerProfile');
    } else if (userType === 'organiser') {
      logger.info('🔵 [HomeContainer] Navigating to OrganiserProfile');
      navigation.navigate('OrganiserProfile');
    } else {
      logger.warn('🔵 [HomeContainer] Unknown userType, defaulting to PlayerProfile');
      navigation.navigate('PlayerProfile');
    }
  };

  const handleSignUpPress = () => {
    if (isAuthenticated) return;
    navigation.navigate('SignUp');
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <Container
      showHeader={showHeader}
      showBottomNav={showBottomNav}
      showBackButton={showBackButton}
      onBackPress={handleBackPress}
      userType={userType}
      activeTab={activeTab}
      notificationCount={notificationCount}
      onSearchPress={handleSearchPress}
      onNotificationPress={handleNotificationPress}
      onProfilePress={handleProfilePress}
      onSignUpPress={handleSignUpPress}
      useGradientBackground={useGradientBackground}
      useSafeArea={true}
      keyboardAvoiding={keyboardAvoiding}
      contentStyle={contentStyle}
    >
      {children}
    </Container>
  );
};
