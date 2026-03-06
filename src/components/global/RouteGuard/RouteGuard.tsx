import React, { useEffect } from 'react';
import { FlexView } from '@components';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityIndicator } from 'react-native';
import { routeService } from '@services/route-service';
import { useAuthStore } from '@store';
import type { RootStackParamList } from '@navigation';
import { colors } from '@theme';
import { logger } from '@dev-tools/logger';
import type { RouteGuardProps } from './RouteGuard.types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * RouteGuard Component
 * Protects routes by checking access permissions
 * Redirects to appropriate screen if access is denied
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({ routeName, children, fallback }) => {
  const navigation = useNavigation<NavigationProp>();
  const { user, isAuthenticated } = useAuthStore();
  const [isChecking, setIsChecking] = React.useState(true);
  const [hasAccess, setHasAccess] = React.useState(false);

  useEffect(() => {
    const checkAccess = () => {
      const canAccess = routeService.canAccessRoute(
        routeName,
        user?.userType ?? null,
        isAuthenticated
      );

      setHasAccess(canAccess);
      setIsChecking(false);

      if (!canAccess) {
        logger.warn('RouteGuard: Access denied', {
          route: routeName,
          userType: user?.userType,
          isAuthenticated,
        });

        // Redirect to appropriate screen
        const redirectRoute = routeService.getRedirectRoute();
        navigation.reset({
          index: 0,
          routes: [{ name: redirectRoute as any }],
        });
      }
    };

    checkAccess();
  }, [routeName, user, isAuthenticated, navigation]);

  if (isChecking) {
    return (
      fallback || (
        <FlexView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </FlexView>
      )
    );
  }

  if (!hasAccess) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};
