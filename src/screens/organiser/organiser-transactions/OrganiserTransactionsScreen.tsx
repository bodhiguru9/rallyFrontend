import React, { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextDs } from '@designSystem/atoms/TextDs';
import { FlexView } from '@designSystem/atoms/FlexView';
import { FilterDropdown } from '@components/global/filter-dropdown';
import { DateFilter } from '@components';
import { useOrganiserTransactions } from '@hooks/organiser';
import { colors, spacing } from '@theme';
import { TransactionItem } from '@screens/organiser/components/TransactionItem';
import { styles } from './style/OrganiserTransactionsScreen.styles';
import { getDateFilters } from '@screens/home/context/Home.data';
import type { DateFilter as DateFilterType } from '@screens/home/Home.types';

export const OrganiserTransactionsScreen: React.FC = () => {
  const { data: transactions, isLoading } = useOrganiserTransactions(1, 20, true);
  const [selectedSports, setSelectedSports] = useState<string[]>(['all-sports']);
  const [selectedSortBy, setSelectedSortBy] = useState<string[]>(['most-recent']);
  const [dateFilters, setDateFilters] = useState<DateFilterType[]>(getDateFilters());

  const sportsOptions = [
    { id: 'all-sports', label: 'All Sports', value: 'all-sports' },
    { id: 'football', label: 'Football', value: 'football' },
    { id: 'basketball', label: 'Basketball', value: 'basketball' },
    { id: 'cricket', label: 'Cricket', value: 'cricket' },
    { id: 'tennis', label: 'Tennis', value: 'tennis' },
    { id: 'badminton', label: 'Badminton', value: 'badminton' },
    { id: 'volleyball', label: 'Volleyball', value: 'volleyball' },
    { id: 'swimming', label: 'Swimming', value: 'swimming' },
    { id: 'running', label: 'Running', value: 'running' },
  ];

  const sortOptions = [
    { id: 'most-recent', label: 'Most Recent', value: 'most-recent' },
    { id: 'highest-amount', label: 'Highest Amount', value: 'highest-amount' },
    { id: 'lowest-amount', label: 'Lowest Amount', value: 'lowest-amount' },
    { id: 'alphabetical', label: 'A-Z', value: 'alphabetical' },
  ];

  const handleSportToggle = (sportId: string) => {
    setSelectedSports([sportId]);
  };

  const handleSortToggle = (sortId: string) => {
    setSelectedSortBy([sortId]);
  };

  const handleDateSelect = (fullDate: string | null) => {
    setDateFilters((prev) => prev.map((filter) => ({ ...filter, isSelected: filter.fullDate === fullDate })));
  };

  const selectedDateFilter = useMemo(
    () => dateFilters.find((filter) => filter.isSelected),
    [dateFilters],
  );

  const filteredTransactions = useMemo(() => {
    if (!transactions) { return []; }

    const filtered = [...transactions];

    // Sport filtering is intentionally not applied yet because transaction data has no sport field.
    void selectedSports;

    if (selectedDateFilter?.fullDate) {
      const selectedDate = new Date(selectedDateFilter.fullDate);
      const selectedDay = selectedDate.getDate().toString();
      const selectedMonth = selectedDate.toLocaleDateString('en-US', { month: 'short' }).toLowerCase();

      const dateFiltered = filtered.filter((transaction) => {
        const bookedDate = (transaction.bookedDate || '').toLowerCase();
        return bookedDate.includes(selectedDay) && bookedDate.includes(selectedMonth);
      });

      filtered.splice(0, filtered.length, ...dateFiltered);
    }

    // Sort transactions
    const sortBy = selectedSortBy[0];
    switch (sortBy) {
      case 'highest-amount':
        filtered.sort((a, b) => (b.amount ?? 0) - (a.amount ?? 0));
        break;
      case 'lowest-amount':
        filtered.sort((a, b) => (a.amount ?? 0) - (b.amount ?? 0));
        break;
      case 'alphabetical':
        filtered.sort((a, b) => (a.eventName || '').localeCompare(b.eventName || ''));
        break;
      case 'most-recent':
      default:
        // Keep original order (most recent)
        break;
    }

    return filtered;
  }, [transactions, selectedSortBy, selectedSports, selectedDateFilter]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {isLoading ? (
        <FlexView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </FlexView>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TextDs size={14} weight="regular" color="primary" style={styles.title}>
            Transactions
          </TextDs>

          <FlexView flexDirection="row" gap={spacing.sm} style={styles.filtersRow}>
            <FilterDropdown
              label="Sports"
              options={sportsOptions}
              selectedIds={selectedSports}
              onToggle={handleSportToggle}
              align="left"
              isMultiSelect={false}
            />
            <FilterDropdown
              label="Sort By"
              options={sortOptions}
              selectedIds={selectedSortBy}
              onToggle={handleSortToggle}
              align="left"
              isMultiSelect={false}
            />
          </FlexView>

          <FlexView style={styles.dateFilterSection}>
            <DateFilter
              dates={dateFilters}
              onSelectDate={handleDateSelect}
            />
          </FlexView>

          <FlexView style={styles.list}>
            {filteredTransactions && filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))
            ) : (
              <TextDs size={14} weight="regular" color="tertiary" align="center">
                No transactions found.
              </TextDs>
            )}
          </FlexView>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};
