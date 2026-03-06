import type { RootStackParamList } from '@navigation';
import type { UserType } from '@app-types';
import { useAuthStore } from '@store';

/**
 * Route names extracted from RootStackParamList for type safety
 */
export type RouteName = keyof RootStackParamList;

/**
 * Route categories for access control
 */
export enum RouteCategory {
  PUBLIC = 'public',
  PROTECTED = 'protected',
  PLAYER_ONLY = 'player_only',
  ORGANISER_ONLY = 'organiser_only',
  AUTH = 'auth', // Auth flow routes (sign in, sign up, etc.)
}

/**
 * Public routes - accessible without authentication
 */
export const PUBLIC_ROUTES: RouteName[] = [
  'Home', // Universal entry point for all users
  'EventDetails', // Event details can be viewed publicly
];

/**
 * Auth flow routes - only accessible when NOT authenticated
 */
export const AUTH_ROUTES: RouteName[] = [
  'SignIn',
  'SignUp',
  'VerifyOTP',
  'ProfileSetup',
  'ForgotPassword',
  'CreateNewPassword',
];

/**
 * Protected routes - require authentication but accessible by all user types
 */
export const PROTECTED_ROUTES: RouteName[] = ['BookingConfirmation', 'EditProfile', 'Preferences'];

/**
 * Player-only routes - require authentication and player user type
 */
export const PLAYER_ROUTES: RouteName[] = [
  'PlayerProfile',
  'PlayerNotifications',
  'PaymentMethods',
  'PurchasedPackages',
  'PackageDetail',
];

/**
 * Organiser-only routes - require authentication and organiser user type
 */
export const ORGANISER_ROUTES: RouteName[] = ['CreateEvent', 'OrganiserProfile', 'AllFollowers'];

/**
 * Route configuration map for quick lookups
 */
const ROUTE_CONFIG: Record<RouteName, RouteCategory> = {
  // Public routes
  Home: RouteCategory.PUBLIC,
  EventDetails: RouteCategory.PUBLIC,
  Booking: RouteCategory.PROTECTED,
  RequestSent: RouteCategory.PROTECTED,
  SignUp: RouteCategory.AUTH,
  SignIn: RouteCategory.AUTH,
  PlayerOrginser: RouteCategory.PUBLIC,
  PlayerOrgEventDetails: RouteCategory.PUBLIC,
  EventOrginserProfilePlayer: RouteCategory.PUBLIC,
  PlanDetails: RouteCategory.PUBLIC,

  // Auth routes
  VerifyOTP: RouteCategory.AUTH,
  ProfileSetup: RouteCategory.AUTH,
  ForgotPassword: RouteCategory.AUTH,
  CreateNewPassword: RouteCategory.AUTH,

  // Protected routes (all user types)
  BookingConfirmation: RouteCategory.PROTECTED,
  EditProfile: RouteCategory.PROTECTED,
  Preferences: RouteCategory.PROTECTED,

  // Player-only routes
  PlayerProfile: RouteCategory.PLAYER_ONLY,
  ChangePassword: RouteCategory.PLAYER_ONLY,
  PlayerNotifications: RouteCategory.PLAYER_ONLY,
  PlayerCalendar: RouteCategory.PLAYER_ONLY,
  PaymentMethods: RouteCategory.PLAYER_ONLY,
  PurchasedPackages: RouteCategory.PLAYER_ONLY,
  PackageDetail: RouteCategory.PLAYER_ONLY,
  Search: RouteCategory.PLAYER_ONLY,
  TagSearch: RouteCategory.PLAYER_ONLY,

  // Organiser-only routes
  CreateEvent: RouteCategory.ORGANISER_ONLY,
  OrganiserProfile: RouteCategory.ORGANISER_ONLY,
  OrganiserSettings: RouteCategory.ORGANISER_ONLY,
  AllFollowers: RouteCategory.ORGANISER_ONLY,
  OrganiserAnalytics: RouteCategory.ORGANISER_ONLY,
  OrganiserAnalyticsEventDetails: RouteCategory.ORGANISER_ONLY,
  OrganiserEventsHosted: RouteCategory.ORGANISER_ONLY,
  OrganiserMembers: RouteCategory.ORGANISER_ONLY,
  OrganiserMemberJoinedEvents: RouteCategory.ORGANISER_ONLY,
  OrganiserTransactions: RouteCategory.ORGANISER_ONLY,
  OrganiserNotifications: RouteCategory.ORGANISER_ONLY,
  OrganiserProfileSettings: RouteCategory.ORGANISER_ONLY,
  OrganiserAttendees: RouteCategory.ORGANISER_ONLY,
  OrganiserProfileEdit: RouteCategory.ORGANISER_ONLY,
  OrganiserBankDetails: RouteCategory.ORGANISER_ONLY,
  OrganiserSubscription: RouteCategory.ORGANISER_ONLY,
  OrganiserPackages: RouteCategory.ORGANISER_ONLY,
  OrganiserPackageDetail: RouteCategory.ORGANISER_ONLY,
  OrganiserPackagePlayerDetail: RouteCategory.ORGANISER_ONLY,
  OrganiserCalendar: RouteCategory.ORGANISER_ONLY,
  OrganiserEventDetails: RouteCategory.ORGANISER_ONLY,
};

/**
 * Route Service - Manages route access control and navigation utilities
 */
export const routeService = {
  /**
   * Get the category of a route
   */
  getRouteCategory: (routeName: RouteName): RouteCategory => {
    return ROUTE_CONFIG[routeName] || RouteCategory.PROTECTED;
  },

  /**
   * Check if a route is accessible based on auth state and user type
   */
  canAccessRoute: (
    routeName: RouteName,
    userType?: UserType | null,
    isAuthenticated?: boolean,
  ): boolean => {
    const category = routeService.getRouteCategory(routeName);
    const authState = isAuthenticated ?? useAuthStore.getState().isAuthenticated;
    const currentUserType = userType ?? useAuthStore.getState().user?.userType ?? null;

    switch (category) {
      case RouteCategory.PUBLIC:
        // Public routes are always accessible
        return true;

      case RouteCategory.AUTH:
        // Auth routes are only accessible when NOT authenticated
        return !authState;

      case RouteCategory.PROTECTED:
        // Protected routes require authentication
        return authState;

      case RouteCategory.PLAYER_ONLY:
        // Player routes require authentication and player user type
        return authState && currentUserType === 'player';

      case RouteCategory.ORGANISER_ONLY:
        // Organiser routes require authentication and organiser user type
        // Handle both 'organiser' (API) and 'organiser' (model) variants
        return authState && currentUserType === 'organiser';

      default:
        // Default to protected (require auth)
        return authState;
    }
  },

  /**
   * Get the default route for authenticated users based on user type
   * Note: Home now handles both player and organiser UI internally
   */
  getDefaultRoute: (_userType?: UserType | null): RouteName => {
    // Always return Home - it handles both player and organiser
    return 'Home';
  },

  /**
   * Get the default route for unauthenticated users
   */
  getAuthRoute: (): RouteName => {
    return 'SignIn';
  },

  /**
   * Check if a route requires authentication
   */
  requiresAuth: (routeName: RouteName): boolean => {
    const category = routeService.getRouteCategory(routeName);
    return category !== RouteCategory.PUBLIC && category !== RouteCategory.AUTH;
  },

  /**
   * Check if a route is part of the auth flow
   */
  isAuthRoute: (routeName: RouteName): boolean => {
    return routeService.getRouteCategory(routeName) === RouteCategory.AUTH;
  },

  /**
   * Check if a route is public
   */
  isPublicRoute: (routeName: RouteName): boolean => {
    return routeService.getRouteCategory(routeName) === RouteCategory.PUBLIC;
  },

  /**
   * Get redirect route when authentication state changes
   * Returns the appropriate route based on auth state and user type
   */
  getRedirectRoute: (): RouteName => {
    const { user, isAuthenticated } = useAuthStore.getState();

    if (!isAuthenticated || !user) {
      return routeService.getAuthRoute();
    }

    return routeService.getDefaultRoute(user.userType);
  },

  /**
   * Validate if user can navigate to a route
   * Returns true if accessible, throws error or returns false if not
   */
  validateRouteAccess: (
    routeName: RouteName,
    options?: { throwError?: boolean; userType?: UserType | null; isAuthenticated?: boolean },
  ): boolean => {
    const { throwError = false } = options ?? {};
    const canAccess = routeService.canAccessRoute(
      routeName,
      options?.userType,
      options?.isAuthenticated,
    );

    if (!canAccess && throwError) {
      const category = routeService.getRouteCategory(routeName);
      throw new Error(
        `Access denied: Route "${routeName}" requires ${category}. Current user does not have access.`,
      );
    }

    return canAccess;
  },

  /**
   * Get all routes for a specific category
   */
  getRoutesByCategory: (category: RouteCategory): RouteName[] => {
    return (Object.keys(ROUTE_CONFIG) as RouteName[]).filter(
      (route) => ROUTE_CONFIG[route] === category,
    );
  },

  /**
   * Get all routes accessible to a user type
   */
  getAccessibleRoutes: (userType?: UserType | null, isAuthenticated?: boolean): RouteName[] => {
    const authState = isAuthenticated ?? useAuthStore.getState().isAuthenticated;
    const currentUserType = userType ?? useAuthStore.getState().user?.userType ?? null;

    return (Object.keys(ROUTE_CONFIG) as RouteName[]).filter((route) =>
      routeService.canAccessRoute(route, currentUserType, authState),
    );
  },
};
