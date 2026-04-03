import React, { useState, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useOrganiserEvents } from '@hooks/use-organiser-events';
import { useAuthStore } from '@store/auth-store';
import type { RootStackParamList } from '@navigation';
import type { CalendarTab } from './OrganiserCalendarScreen.types';
import { TabSelector, EventList } from '@components/calendar';
import { DateFilter } from '@components';
import { useGroupedEvents } from './hooks/useGroupedEvents';
import { styles } from './style/OrganiserCalendarScreen.styles';
import { HomeContainer } from '@components/global';
import { adaptEventDataToPlayerBooking } from './utils/eventAdapter';
import type { PlayerBooking } from '@services/booking-service';
import type { DateFilter as DateFilterType } from '@screens/home/Home.types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  toLocalDateString,
  generateDateFilters,
  addTime,
  getMaxDateFilterEndDate,
  canLoadMoreDates,
} from '@utils/date-utils';

import { DEFAULT_DISPLAY_TIME_ZONE } from '@constants/timezones';

const ORGANISER_CALENDAR_TABS = [
  { value: 'upcoming' as CalendarTab, label: 'Upcoming' },
  { value: 'past' as CalendarTab, label: 'Past' },
];

type OrganiserCalendarScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrganiserCalendar'>;

export const OrganiserCalendarScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<OrganiserCalendarScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<CalendarTab>('upcoming');
  const [dateFilters, setDateFilters] = useState<DateFilterType[]>(() => {
    const today = new Date();
    return generateDateFilters(today, 30);
  });
  const [dateFilterState, setDateFilterState] = useState({
    currentEndDate: addTime(new Date(), 29, 'days'),
    isLoadingMore: false,
  });

  const userId = useAuthStore((state) => state.user?.userId ?? state.user?.id ?? 0);
  const { data: organiserEventsData, isLoading, error } = useOrganiserEvents(userId, 1, 20, {
    enabled: userId > 0,
    includePrivateEvents: true,
  });

  const events = useMemo<PlayerBooking[]>(() => {
    const organiserEvents = organiserEventsData?.data?.events ?? [];
    return organiserEvents.map(adaptEventDataToPlayerBooking);
  }, [organiserEventsData]);

  // Derive selectedDate from active dateFilter to pass into useGroupedEvents
  const selectedDate = useMemo<Date | null>(() => {
    const active = dateFilters.find(d => d.isSelected);
    return active?.fullDate ? new Date(active.fullDate) : null;
  }, [dateFilters]);

  const { groupedEvents } = useGroupedEvents({ events, activeTab, selectedDate });

  const toDateKey = (s: string) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    const d = new Date(s);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const loadMoreDates = React.useCallback(() => {
    if (dateFilterState.isLoadingMore) return;
    if (!canLoadMoreDates(dateFilterState.currentEndDate)) return;

    setDateFilterState((prev) => ({ ...prev, isLoadingMore: true }));
    const nextStartDate = new Date(dateFilterState.currentEndDate);
    nextStartDate.setDate(nextStartDate.getDate() + 1);
    const maxDate = getMaxDateFilterEndDate();
    const daysToGenerate = Math.min(
      30,
      Math.floor((maxDate.getTime() - nextStartDate.getTime()) / (24 * 60 * 60 * 1000)) + 1,
    );
    if (daysToGenerate > 0) {
      const newDates = generateDateFilters(nextStartDate, daysToGenerate);
      setDateFilters((prev) => [...prev, ...newDates]);
      setDateFilterState((prev) => ({
        ...prev,
        currentEndDate: addTime(nextStartDate, daysToGenerate - 1, 'days'),
        isLoadingMore: false,
      }));
    } else {
      setDateFilterState((prev) => ({ ...prev, isLoadingMore: false }));
    }
  }, [dateFilterState]);

  const canLoadMore = canLoadMoreDates(dateFilterState.currentEndDate);

  const selectDate = (fullDate: string | null) => {
    setDateFilters((prev) => {
      if (!fullDate) {
        return prev.map((f) => ({ ...f, isSelected: false }));
      }
      const targetKey = toDateKey(fullDate);
      const exists = prev.some((f) => f.fullDate && toDateKey(f.fullDate) === targetKey);
      if (exists) {
        return prev.map((f) => ({
          ...f,
          isSelected: f.fullDate ? toDateKey(f.fullDate) === targetKey : false,
        }));
      }
      // Add the selected date from calendar popup when not in the list
      const d = new Date(fullDate);
      const newEntry = {
        date: d.getDate(),
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        isSelected: true,
        fullDate: toLocalDateString(d),
      };
      const updated = prev.map((f) => ({ ...f, isSelected: false }));
      return [...updated, newEntry];
    });
  };

  const handleEventPress = (id: string, occurrenceStart?: string, occurrenceEnd?: string) => {
    navigation.navigate('OrganiserEventDetails', {
      eventId: id,
      occurrenceStart,
      occurrenceEnd,
      isReadOnly: activeTab === 'past',
    });
  };

  const handleBookmark = (id: string) => {
    void id;
  };

  return (
    <HomeContainer activeTab="calendar" userType="organiser">
      <View style={{ paddingTop: insets.top }}>
        <DateFilter
          dates={dateFilters}
          onSelectDate={selectDate}
          onScrollNearEnd={loadMoreDates}
          canLoadMore={canLoadMore}
        />
      </View>

      <TabSelector
        title="Your Calendar"
        tabs={ORGANISER_CALENDAR_TABS}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as CalendarTab)}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <EventList
          groupedEvents={groupedEvents}
          isLoading={isLoading}
          error={error}
          activeTab={activeTab}
          onEventPress={handleEventPress}
          onBookmark={handleBookmark}
          showStatus={false}
          displayTimeZone={DEFAULT_DISPLAY_TIME_ZONE}
        />
      </ScrollView>
    </HomeContainer>
  );
};
