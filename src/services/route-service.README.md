# Route Service Documentation

The Route Service provides a centralized way to manage public and protected routes in the Rally App.

## Features

- **Route Categories**: Routes are categorized as Public, Auth, Protected, Player-only, or Organizer-only
- **Access Control**: Automatic validation of route access based on authentication state and user type
- **Type Safety**: Full TypeScript support with route name autocomplete
- **Navigation Helpers**: Hooks and utilities for safe navigation

## Route Categories

### Public Routes

Routes accessible without authentication:

- `EventDetails` - Event details can be viewed publicly

### Auth Routes

Routes only accessible when NOT authenticated:

- `SignIn`, `SignUp`, `VerifyOTP`, `ProfileSetup`, `ForgotPassword`, `CreateNewPassword`

### Protected Routes

Routes requiring authentication, accessible by all user types:

- `BookingConfirmation`, `EditProfile`, `Preferences`

### Player-Only Routes

Routes requiring authentication and player user type:

- `Home`, `PlayerProfile`, `PaymentMethods`, `PurchasedPackages`, `PackageDetail`

### Organizer-Only Routes

Routes requiring authentication and organiser user type:

- `OrganizerHome`, `CreateEvent`, `OrganizerProfile`, `AllFollowers`

## Usage

### Basic Usage

```typescript
import { routeService } from '@services/route-service';

// Check if a route is accessible
const canAccess = routeService.canAccessRoute('Home', user?.userType, isAuthenticated);

// Get default route based on auth state
const defaultRoute = routeService.getRedirectRoute();

// Check if route requires authentication
const requiresAuth = routeService.requiresAuth('PlayerProfile'); // true
const isPublic = routeService.isPublicRoute('EventDetails'); // true
```

### Using Navigation Guard Hook

```typescript
import { useNavigationGuard } from '@hooks';

const MyComponent = () => {
  const { navigateWithGuard, canNavigateTo } = useNavigationGuard();

  const handleNavigation = () => {
    // Automatically validates and redirects if access denied
    navigateWithGuard('PlayerProfile');
  };

  // Check before showing navigation button
  if (canNavigateTo('CreateEvent')) {
    return <Button onPress={() => navigateWithGuard('CreateEvent')} />;
  }
};
```

### Using Route Protection Hook in Screens

```typescript
import { useRouteProtection } from '@hooks';

const PlayerProfileScreen = () => {
  // Automatically redirects if user doesn't have access
  useRouteProtection('PlayerProfile');

  return <View>...</View>;
};
```

### Using RouteGuard Component

```typescript
import { RouteGuard } from '@components/global';

const AppNavigator = () => {
  return (
    <RouteGuard routeName="OrganizerHome">
      <OrganizerHomeScreen />
    </RouteGuard>
  );
};
```

## Adding New Routes

1. Add the route to `RootStackParamList` in `AppNavigator.tsx`
2. Add the route to the appropriate category in `route-service.ts`:
   - Add to `PUBLIC_ROUTES`, `AUTH_ROUTES`, `PROTECTED_ROUTES`, `PLAYER_ROUTES`, or `ORGANIZER_ROUTES`
   - Add to `ROUTE_CONFIG` map with the appropriate `RouteCategory`
3. Add the screen to `AppNavigator` component

## Examples

### Example: Checking Access Before Navigation

```typescript
import { routeService } from '@services';
import { useNavigation } from '@react-navigation/native';

const MyScreen = () => {
  const navigation = useNavigation();

  const handleNavigate = () => {
    if (routeService.canAccessRoute('CreateEvent')) {
      navigation.navigate('CreateEvent');
    } else {
      Alert.alert('Access Denied', 'Only organizers can create events');
    }
  };
};
```

### Example: Post-Login Navigation

```typescript
import { useNavigationGuard } from '@hooks';

const AfterLoginScreen = () => {
  const { resetAndNavigate } = useNavigationGuard();

  useEffect(() => {
    // Automatically navigate to correct home based on user type
    resetAndNavigate(routeService.getDefaultRoute());
  }, []);
};
```

## API Reference

### `routeService.canAccessRoute(routeName, userType?, isAuthenticated?)`

Checks if a route is accessible based on auth state and user type.

### `routeService.getDefaultRoute(userType?)`

Returns the default route for authenticated users based on user type.

### `routeService.getRedirectRoute()`

Returns the appropriate redirect route based on current auth state.

### `routeService.requiresAuth(routeName)`

Checks if a route requires authentication.

### `routeService.isAuthRoute(routeName)`

Checks if a route is part of the auth flow.

### `routeService.isPublicRoute(routeName)`

Checks if a route is public.

### `routeService.validateRouteAccess(routeName, options?)`

Validates route access, optionally throwing an error if denied.

### `routeService.getRoutesByCategory(category)`

Returns all routes for a specific category.

### `routeService.getAccessibleRoutes(userType?, isAuthenticated?)`

Returns all routes accessible to the specified user type.
