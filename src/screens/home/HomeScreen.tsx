import React, { useState, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation';
import { PlayerHomeContent, OrganiserHomeContent } from '@components/private/home';
import { HomeContainer } from '@components/global';
import { useAuthStore } from '@store/auth-store';
import { useOrganiserCreatedEvents, useOrganiserDashboard, useOrganiserTransactions } from '@hooks/organiser';
import { useHome } from './context/Home.context';
import { getUserFirstName } from '@utils';
import { logger } from '@dev-tools';

type THomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<THomeScreenNavigationProp>();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isOrganiserUser = isAuthenticated && user?.userType === 'organiser';

  // Conditionally fetch organiser dashboard data (only for organiser users)
  const { data: dashboardData, isLoading: isLoadingOrganiserData } = useOrganiserDashboard({
    enabled: isOrganiserUser,
  });
  const { data: createdEventsData, isLoading: isLoadingCreatedEvents } = useOrganiserCreatedEvents(
    1,
    10,
    {
      enabled: isOrganiserUser,
    },
  );
  const { data: organiserTransactions, isLoading: isLoadingTransactions } = useOrganiserTransactions(
    1,
    20,
    false,
    {
      enabled: isOrganiserUser,
    },
  );

  // Player-specific state (only load if player or unauthenticated)
  const {
    events,
    selectedCity,
    featuredEvents,
    pickedEvents,
    bookAgainEvents,
    calendarEvents,
    isLoadingEvents,
    eventsError,
    topOrganisers,
    sportsFilters,
    eventTypeFilters,
    locationFilters,
    priceFilters,
    dateFilters,
    toggleSportsFilter,
    toggleEventTypeFilter,
    toggleLocationFilter,
    togglePriceFilter,
    selectDate,
    loadMoreDates,
    canLoadMore,
    refetchEvents,
  } = useHome();

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      if (isOrganiserUser) {
        await Promise.all([
          queryClient.refetchQueries({ queryKey: ['organiserDashboard'] }),
          queryClient.refetchQueries({ queryKey: ['organiser-events'] }),
          queryClient.refetchQueries({ queryKey: ['organiser-created-events'] }),
          queryClient.refetchQueries({ queryKey: ['organiser-transactions'] }),
        ]);
      } else {
        await Promise.all([
          refetchEvents(),
          queryClient.refetchQueries({ queryKey: ['top-organisers'] }),
          queryClient.refetchQueries({ queryKey: ['communities'] }),
        ]);
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [isOrganiserUser, queryClient, refetchEvents]);

  // Refetch events when Home screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ['player-events'] });
      refetchEvents();
    }, [refetchEvents, queryClient]),
  );

  // Event handlers
  const handleEventPress = (id: string) => {
    navigation.navigate('EventDetails', { eventId: id });
  };

  const handleOrganiserPress = (id: string) => {
    navigation.navigate('PlayerOrgEventDetails', { organiserId: id });
  };

  const handleBookmark = (id: string) => {
    logger.info('Bookmark event:', id);
  };

  // Organiser handlers
  const handleCreateEvent = () => {
    navigation.navigate('CreateEvent');
  };

  const handleTotalRevenuePress = () => {
    navigation.navigate('OrganiserAnalytics');
  };
  const handleTotalMembersPress = () => {
    console.log('Navigate to Total Members');
    navigation.navigate('OrganiserMembers');
  }

  const handleEventsHostedPress = () => {
    navigation.navigate('OrganiserEventsHosted');
  };

  const handleMostBookedPress = () => {
    navigation.navigate('OrganiserMembers');
  };

  const handleMemberPress = (member: { userId: number; fullName: string; profilePic?: string }) => {
    navigation.navigate('OrganiserMemberJoinedEvents', {
      userId: member.userId,
      fullName: member.fullName,
      profilePic: member.profilePic,
    });
  };

  const handleRecentTransactionsPress = () => {
    navigation.navigate('OrganiserTransactions');
  };

  // Filter "Your Calendar" to show only today and upcoming events, sorted by date (nearest first).
  // Recurring events are always included (they recur on future dates).
  const upcomingCreatedEvents = React.useMemo(() => {
    const events = createdEventsData?.data?.events ?? [];
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const filtered = events.filter((e) => {
      const isRecurring = e.eventFrequency && e.eventFrequency.length > 0 && e.eventFrequency[0] !== 'custom';
      if (isRecurring) return true;
      const eventDate = new Date(e.eventDateTime);
      return eventDate >= todayStart;
    });
    return filtered.sort((a, b) => new Date(a.eventDateTime).getTime() - new Date(b.eventDateTime).getTime());
  }, [createdEventsData?.data?.events]);

  // State 2: Organiser user - Show organiser UI
  if (isOrganiserUser) {
    return (
      <HomeContainer activeTab="home" userType="organiser">
        <OrganiserHomeContent
          dashboardData={dashboardData}
          isLoading={isLoadingOrganiserData}
          createdEvents={upcomingCreatedEvents}
          isLoadingCreatedEvents={isLoadingCreatedEvents}
          userName={getUserFirstName(user.fullName, user.userType)}
          onCreatePress={handleCreateEvent}
          onTotalRevenuePress={handleTotalRevenuePress}
          onTotalMembersPress={handleTotalMembersPress}
          onEventsHostedPress={handleEventsHostedPress}
          onMostBookedPress={handleMostBookedPress}
          onMemberPress={handleMemberPress}
          onRecentTransactionsPress={handleRecentTransactionsPress}
          transactions={organiserTransactions || []}
          isLoadingTransactions={isLoadingTransactions}
          onRefresh={handleRefresh}
          refreshing={isRefreshing}
        />
      </HomeContainer>
    );
  }

  if (events === undefined) {
    return;
  }

  // State 3: Player (authenticated or unauthenticated) - Show full player home UI
  return (
    <HomeContainer activeTab="explore" userType="player">
      <PlayerHomeContent
        events={events}
        selectedCity={selectedCity}
        featuredEvents={featuredEvents}
        pickedEvents={pickedEvents}
        bookAgainEvents={bookAgainEvents}
        calendarEvents={calendarEvents}
        isLoadingEvents={isLoadingEvents}
        eventsError={eventsError}
        topOrganisers={topOrganisers}
        isAuthenticated={isAuthenticated}
        sportsFilters={sportsFilters}
        eventTypeFilters={eventTypeFilters}
        locationFilters={locationFilters}
        priceFilters={priceFilters}
        dateFilters={dateFilters}
        toggleSportsFilter={toggleSportsFilter}
        toggleEventTypeFilter={toggleEventTypeFilter}
        toggleLocationFilter={toggleLocationFilter}
        togglePriceFilter={togglePriceFilter}
        selectDate={selectDate}
        loadMoreDates={loadMoreDates}
        canLoadMore={canLoadMore}
        onEventPress={handleEventPress}
        onOrganiserPress={handleOrganiserPress}
        onBookmark={handleBookmark}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
      />
    </HomeContainer>
  );
};
