import React from 'react';
import { TextDs, FlexView } from '@components';
import { ActivityIndicator } from 'react-native';
import { colors } from '@theme';
import { renderDashboard } from './pages/Dashboard';
import { renderEmptyState } from './pages/EmptyState';
import type { OrganiserHomeContentProps } from './OrganiserHomeContent.types';
import { styles } from './style/OrganiserHomeContent.styles';

export const OrganiserHomeContent: React.FC<OrganiserHomeContentProps> = ({
  dashboardData,
  isLoading,
  createdEvents,
  isLoadingCreatedEvents,
  userName,
  onCreatePress,
  onTotalRevenuePress,
  onTotalMembersPress,
  onEventsHostedPress,
  onMostBookedPress,
  onMemberPress,
  onRecentTransactionsPress,
  transactions,
  isLoadingTransactions,
  onRefresh,
  refreshing = false,
}) => {
  const safeCreatedEvents = Array.isArray(createdEvents) ? createdEvents : [];
  const hasCreatedEvents = safeCreatedEvents.length > 0;
  const isLoadingContent = isLoading || isLoadingCreatedEvents;

  return (
    <>
      <FlexView px={12} row alignItems='center' gap={2} mt={18}>
        <TextDs size={18} weight='regular'>Hi</TextDs>
        <TextDs size={18} weight='semibold'> {userName}!</TextDs>
      </FlexView>

      {isLoadingContent ? (
        <FlexView style={[styles.emptyContent, { justifyContent: 'center' }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </FlexView>
      ) : !hasCreatedEvents ? (
        renderEmptyState({ handleCreateEvent: onCreatePress })
      ) : (
        renderDashboard({
          dashboardData,
          createdEvents: safeCreatedEvents,
          handleTotalRevenuePress: onTotalRevenuePress,
          handleEventsHostedPress: onEventsHostedPress,
          handleTransactionsPress: onRecentTransactionsPress,
          handleMostBookedPress: onMostBookedPress,
          onMemberPress,
          handleTotalMembersPress: onTotalMembersPress,
          onMemberPress,
          transactions,
          isLoadingTransactions,
          onRefresh,
          refreshing,
        })
      )}
    </>
  );
};
