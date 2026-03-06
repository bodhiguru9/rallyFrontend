import type { OrganiserDashboardData } from '@screens/organiser/data/organiserDashboard.data';
import type { EventData } from '@app-types';

export interface OrganiserHomeContentProps {
  dashboardData: OrganiserDashboardData | undefined;
  isLoading: boolean;
  createdEvents: EventData[];
  isLoadingCreatedEvents: boolean;
  userName: string;
  onCreatePress: () => void;
  onTotalRevenuePress: () => void;
  onEventsHostedPress: () => void;
  onMostBookedPress: () => void;
  onRecentTransactionsPress: () => void;
  onTotalMembersPress: () => void;
  transactions: OrganiserDashboardData['transactions'];
  isLoadingTransactions: boolean;

  // Pull to refresh
  onRefresh?: () => void | Promise<void>;
  refreshing?: boolean;
}
