import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { routeService, type RouteName } from '@services/route-service';
import { useAuthStore } from '@store';
import type { RootStackParamList } from '@navigation';
import { logger } from '@dev-tools/logger';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Hook to navigate to a route with automatic access validation
 * Redirects to appropriate screen if access is denied
 */
export const useNavigationGuard = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, isAuthenticated } = useAuthStore();

  /**
   * Navigate to a route with access validation
   * If access is denied, redirects to appropriate default route
   */
  const navigateWithGuard = (routeName: RouteName, params?: any) => {
    const canAccess = routeService.canAccessRoute(
      routeName,
      user?.userType ?? null,
      isAuthenticated
    );

    if (!canAccess) {
      logger.warn('Navigation blocked - access denied', {
        route: routeName,
        userType: user?.userType,
        isAuthenticated,
      });

      // Redirect to appropriate screen
      const redirectRoute = routeService.getRedirectRoute();
      navigation.navigate(redirectRoute as any);
      return false;
    }

    navigation.navigate(routeName as any, params);
    return true;
  };

  /**
   * Check if a route is accessible without navigating
   */
  const canNavigateTo = (routeName: RouteName): boolean => {
    return routeService.canAccessRoute(routeName, user?.userType ?? null, isAuthenticated);
  };

  /**
   * Reset navigation stack and navigate to route with guard
   * Useful for post-login navigation
   */
  const resetAndNavigate = (routeName: RouteName, params?: any) => {
    const canAccess = routeService.canAccessRoute(
      routeName,
      user?.userType ?? null,
      isAuthenticated
    );

    if (!canAccess) {
      const redirectRoute = routeService.getRedirectRoute();
      navigation.reset({
        index: 0,
        routes: [{ name: redirectRoute as any }],
      });
      return false;
    }

    navigation.reset({
      index: 0,
      routes: [{ name: routeName as any, params }],
    });
    return true;
  };

  return {
    navigateWithGuard,
    canNavigateTo,
    resetAndNavigate,
  };
};

/**
 * Hook to protect a route - redirects if access is denied
 * Use this in screen components that should be protected
 */
export const useRouteProtection = (routeName: RouteName) => {
  const navigation = useNavigation<NavigationProp>();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const canAccess = routeService.canAccessRoute(
      routeName,
      user?.userType ?? null,
      isAuthenticated
    );

    if (!canAccess) {
      logger.warn('Route access denied - redirecting', {
        route: routeName,
        userType: user?.userType,
        isAuthenticated,
      });

      const redirectRoute = routeService.getRedirectRoute();
      navigation.reset({
        index: 0,
        routes: [{ name: redirectRoute as any }],
      });
    }
  }, [routeName, user, isAuthenticated, navigation]);
};
