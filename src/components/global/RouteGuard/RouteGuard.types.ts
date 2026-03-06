import type { RouteName } from '@services/route-service';

export interface RouteGuardProps {
  routeName: RouteName;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
