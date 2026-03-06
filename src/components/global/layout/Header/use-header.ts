import { useState, useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '@store';

import { usePlayerNotifications, useOrganiserNotifications } from '@hooks/use-notifications';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation';

interface UseHeaderProps {
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
  onSignUpPress?: () => void;
  notificationCount?: number;
}

export const useHeader = (props?: UseHeaderProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Auth store selectors
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const selectedLocation = useAuthStore((state) => state.selectedLocation);
  const setSelectedLocation = useAuthStore((state) => state.setSelectedLocation);


  // Local state
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Derived values
  const userType = user?.userType || 'player';
  const userAvatar = user?.profilePic || null;

  const userInitials = useMemo(() => {
    if (!user?.fullName) {
      return undefined;
    }
    const names = user.fullName.split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
  }, [user]);

  // Get locations from filter options or fallback to default
  // const locations = useMemo(
  //   () => filterOptions?.locations || ['Dubai', 'Delhi', 'Mumbai', 'Gurugram'],
  //   [filterOptions],
  // );
  const locations = useMemo(
    () => ['Dubai', 'Abu Dhabi', 'Sharjah', 'RAK'],
    [],
  );

  // Fetch notifications based on user type (only if authenticated)
  const { data: playerNotifications } = usePlayerNotifications(1, {
    enabled: isAuthenticated && userType === 'player',
  });
  const { data: organiserNotifications } = useOrganiserNotifications(1, {
    enabled: isAuthenticated && userType === 'organiser',
  });

  // Get unread count based on user type
  const unreadCount = useMemo(() => {
    if (!isAuthenticated) {
      return 0;
    }
    if (userType === 'player') {
      return playerNotifications?.unreadCount || 0;
    }
    if (userType === 'organiser') {
      return organiserNotifications?.unreadCount || 0;
    }
    return 0;
  }, [isAuthenticated, userType, playerNotifications, organiserNotifications]);

  // Default handlers
  const handleSearchPress = useCallback(() => {
    console.log('🔍 [Header] Search button pressed');
    if (props?.onSearchPress) {
      props.onSearchPress();
    } else {
      // Default behavior - navigate to search screen
      try {
        console.log('🔍 [Header] Navigating to Search screen');
        navigation.navigate('Search');
      } catch (error) {
        console.error('🔍 [Header] Navigation error:', error);
      }
    }
  }, [props, navigation]);

  const handleNotificationPress = useCallback(() => {
    if (props?.onNotificationPress) {
      props.onNotificationPress();
    } else {
      navigation.navigate('OrganiserNotifications');
      // Default behavior - navigate to notifications screen
      // TODO: Add notifications screen navigation when available

    }
  }, [props]);

  const handleProfilePress = useCallback(() => {
    if (props?.onProfilePress) {
      props.onProfilePress();
    } else {
      // Default behavior - navigate to profile screen
      // TODO: Add profile screen navigation when available
    }
  }, [props]);

  const handleSignUpPress = useCallback(() => {
    if (props?.onSignUpPress) {
      props.onSignUpPress();
    } else {
      // Default behavior - navigate to sign up screen
      navigation.navigate('SignUp');
    }
  }, [props, navigation]);

  // Location dropdown handlers
  const toggleLocationDropdown = useCallback(() => {
    setShowLocationDropdown((prev) => !prev);
  }, []);

  const selectLocation = useCallback(
    (location: string) => {
      setSelectedLocation(location);
      setShowLocationDropdown(false);
    },
    [setSelectedLocation],
  );

  return {
    // User data
    user,
    userType,
    isAuthenticated,
    userAvatar,
    userInitials,

    // Location data
    selectedLocation,
    locations,
    showLocationDropdown,

    // Handlers
    handleSearchPress,
    handleNotificationPress,
    handleProfilePress,
    handleSignUpPress,
    toggleLocationDropdown,
    selectLocation,

    // Notification count (use prop override if provided, otherwise use fetched count)
    notificationCount: props?.notificationCount ?? unreadCount,
  };
};
