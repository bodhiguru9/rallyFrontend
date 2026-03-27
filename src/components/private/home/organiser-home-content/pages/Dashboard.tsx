import { ActivityIndicator, ScrollView, Pressable, RefreshControl } from 'react-native';
import { FlexView } from '@designSystem/atoms/FlexView';
import { TextDs } from '@designSystem/atoms/TextDs';
import { colors, spacing } from '@theme';
import { styles } from '../style/OrganiserHomeContent.styles';
import { SummaryCard } from '@screens/organiser/components/SummaryCard';
import { ImageDs } from '@components';
import type { EventData } from '@app-types';
import { MostBookedSection } from '@screens/organiser/components/MostBookedSection';
import { TransactionItem } from '@screens/organiser/components/TransactionItem';
import type { OrganiserDashboardData } from '@screens/organiser/data/organiserDashboard.data';
import { OrganiserCreateEventHome } from '../sections/OrganiserCreateEventHome';
import { ArrowIcon } from '@components/global/ArrowIcon';

interface DashboardProps {
  dashboardData: OrganiserDashboardData | undefined;
  createdEvents: EventData[];
  handleTotalRevenuePress: () => void;
  handleEventsHostedPress: () => void;
  handleTotalMembersPress: () => void;
  handleTransactionsPress: () => void;
  handleMostBookedPress: () => void;
  onMemberPress?: (member: { userId: number; fullName: string; profilePic?: string }) => void;
  transactions: OrganiserDashboardData['transactions'];
  isLoadingTransactions: boolean;
  onRefresh?: () => void | Promise<void>;
  refreshing?: boolean;
}

export const renderDashboard = ({
  dashboardData,
  createdEvents,
  handleTotalRevenuePress,
  handleTotalMembersPress,
  handleEventsHostedPress,
  handleTransactionsPress,
  handleMostBookedPress,
  onMemberPress,
  transactions,
  isLoadingTransactions,
  onRefresh,
  refreshing = false,
}: DashboardProps) => {
  if (!dashboardData) {
    return (
      <FlexView flex={1} justifyContent="center" alignItems="center" padding={spacing.xl} gap={spacing.sm}>
        <TextDs size={14} weight="regular" color="secondary" align="center">
          No dashboard data available
        </TextDs>
        <TextDs size={14} weight="regular" color="tertiary" align="center">
          Please try refreshing or check back later
        </TextDs>
      </FlexView>
    );
  }

  const hasSummaryCards = dashboardData.summaryCards && dashboardData.summaryCards.length > 0;
  const isRevenueCard = (label: string) => label.toLowerCase().includes('revenue');
  const isEventsHostedCard = (label: string) => label.toLowerCase().includes('events hosted');
  const isTotalMembersCard = (label: string) => label.toLowerCase().includes('member');
  const safeTransactions = (transactions || []).slice(0, 3);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        ) : undefined
      }
    >
      {/* Summary Cards */}
      {hasSummaryCards ? (
        <FlexView mt={10} mb={12} flexDirection="row" gap={14}>
          {dashboardData.summaryCards.map((card, index) => {
            const isRevenue = isRevenueCard(card.label);
            const isEventsHosted = isEventsHostedCard(card.label);
            const isTotalMembers = isTotalMembersCard(card.label);

            const cardContent = (
              <SummaryCard 
                value={card.value} 
                label={card.label} 
                prefixIcon={isRevenue ? <ImageDs image="DhiramIcon" size={16} /> : undefined}
              />
            );

            const isClickable = isRevenue || isEventsHosted || isTotalMembers;

            const handlePress = isRevenue
              ? handleTotalRevenuePress
              : isEventsHosted
                ? handleEventsHostedPress
                : isTotalMembers
                  ? handleTotalMembersPress
                  : undefined;

            return (
              <Pressable
                key={`${card.label}-${index}`}
                style={{ flex: 1 }}
                disabled={!isClickable}
                onPress={isClickable ? handlePress : undefined}
              >
                {cardContent}
              </Pressable>
            );
          })}
        </FlexView>
      ) : (
        <FlexView padding={spacing.md} alignItems="center">
          <TextDs size={14} weight="regular" color="tertiary" align="center">
            No summary data available
          </TextDs>
        </FlexView>
      )}

      {/* Calendar Section */}
      <OrganiserCreateEventHome events={createdEvents} />

      {/* Most Booked Section */}
      <FlexView style={styles.section}>
        <MostBookedSection onPress={handleMostBookedPress} onMemberPress={onMemberPress} />
      </FlexView>

      {/* Recent Transactions */}
      <FlexView style={styles.section}>
        <FlexView style={styles.sectionHeader}>
          <TextDs size={16} weight="semibold">Recent Transactions</TextDs>
          <ArrowIcon variant="right" onClick={handleTransactionsPress} size='small' />
        </FlexView>
        <FlexView gap={spacing.lg}>
          {isLoadingTransactions ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : safeTransactions.length > 0 ? (
            safeTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))
          ) : (
            <TextDs size={14} weight="regular" color="tertiary">
              No transactions found
            </TextDs>
          )}
        </FlexView>
      </FlexView>
    </ScrollView>
  );
};
