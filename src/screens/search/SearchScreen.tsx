import React, { useState, useMemo, useEffect } from 'react';
import { TextDs, FlexView } from '@components';
import { ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing } from '@theme';
import { SearchInput, EventCard } from '@components/global';
import type { RootStackParamList } from '@navigation';
import { usePlayerEvents } from '@hooks/use-events';
import { useTopOrganisers } from '@hooks/use-top-organisers';
import type { Organiser } from '@screens/home/Home.types';
import { styles } from './style/SearchScreen.styles';
import { FlatList } from 'react-native-gesture-handler';
import { OrganiserAvatar } from '@components/private/home/player-home-content/sections';
import { ArrowIcon } from '@components/global/ArrowIcon';
import { useAuthStore } from '@store/auth-store';

type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Search'>;

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const { isAuthenticated } = useAuthStore();
  const [searchInput, setSearchInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch all events and organisers (no search parameter)
  const {
    data: allEventsData,
    isLoading: isLoadingEvents,
    isError: isErrorEvents,
  } = usePlayerEvents();

  const {
    data: allOrganisersData,
    isLoading: isLoadingOrganisers,
    isError: isErrorOrganisers,
  } = useTopOrganisers();

  // Client-side filtering for events
  const events = useMemo(() => {
    if (!allEventsData?.events) { return []; }

    // If no search query, return all events
    if (!debouncedQuery.trim()) {
      return allEventsData.events;
    }

    const lowerQuery = debouncedQuery.toLowerCase();

    return allEventsData.events.filter((event) => {
      // Match 1: Event name contains query
      const eventNameMatch = (event.eventName || '').toLowerCase().includes(lowerQuery);

      // Match 2: Event creator name contains query
      const creatorNameMatch = (event.eventCreatorName || '').toLowerCase().includes(lowerQuery);

      // Match 3: Creator full name contains query (if creator object exists)
      const creatorFullNameMatch = (event.creator?.fullName || '').toLowerCase().includes(lowerQuery);

      return eventNameMatch || creatorNameMatch || creatorFullNameMatch;
    });
  }, [allEventsData, debouncedQuery]);

  // Client-side filtering for organisers
  const organisers: Organiser[] = useMemo(() => {
    if (!allOrganisersData?.data?.organisers) { return []; }

    // If no search query, return all organisers
    if (!debouncedQuery.trim()) {
      return allOrganisersData.data.organisers.map((org) => ({
        userId: org.userId,
        fullName: org.fullName,
        profilePic: org.profilePic,
        isVerified: org.isVerified,
        communityName: org.communityName,
      }));
    }

    const lowerQuery = debouncedQuery.toLowerCase();

    return allOrganisersData.data.organisers
      .filter((org) => {
        // Match 1: Full name contains query
        const nameMatch = (org.fullName || '').toLowerCase().includes(lowerQuery);

        // Match 2: Community name contains query
        const communityMatch = (org.communityName || '').toLowerCase().includes(lowerQuery);

        return nameMatch || communityMatch;
      })
      .map((org) => ({
        userId: org.userId,
        fullName: org.fullName,
        profilePic: org.profilePic,
        isVerified: org.isVerified,
        communityName: org.communityName,
      }));
  }, [allOrganisersData, debouncedQuery]);

  const handleOrganiserPress = (id: string) => {
    if (!id) {
      console.warn('Organiser ID is missing');
      return;
    }
    // Navigate to organiser profile screen
    navigation.navigate('EventOrginserProfilePlayer', { organiserId: id });
  };

  const handleEventPress = (id: string) => {
    if (!id) {
      console.warn('Event ID is missing');
      return;
    }
    // Navigate to event details screen
    navigation.navigate('EventDetails', { eventId: id });
  };

  const handleBookmark = (id: string) => {
    // Handle bookmark functionality
    console.log('Bookmark event:', id);
  };

  const handleViewAllOrganisers = () => {
    // Navigate to all organisers screen
    navigation.navigate('PlayerOrginser');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Search Input */}
      <FlexView style={styles.searchContainer}>
        <SearchInput
          placeholder="Search..."
          value={searchInput}
          onChangeText={setSearchInput}
          autoFocus
        />
      </FlexView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Organisers Section */}
        <FlexView style={styles.section}>
          {organisers.length > 0 && <FlexView style={styles.sectionHeader}>
            <TextDs style={styles.sectionTitle}>Organisers</TextDs>
            {organisers.length > 0 && isAuthenticated && (
              <ArrowIcon variant='right' onClick={handleViewAllOrganisers} />
            )}
          </FlexView>}

          {isLoadingOrganisers ? (
            <FlexView style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
            </FlexView>
          ) : isErrorOrganisers ? (
            <FlexView style={styles.emptyState}>
              <TextDs style={styles.emptyStateText}>Error loading organisers</TextDs>
            </FlexView>
          ) : organisers.length > 0 ? (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={organisers}
              keyExtractor={(item) => String(item.userId ?? item.id ?? '')}
              contentContainerStyle={{
                marginTop: spacing.sm,
                paddingHorizontal: spacing.base,
                gap: spacing.xl,
              }}
              renderItem={({ item }) => (
                <OrganiserAvatar organiser={item} onPress={handleOrganiserPress} />
              )}
            />
          ) : debouncedQuery.trim().length > 0 ? (
            <FlexView style={styles.emptyState}>
              <TextDs style={styles.emptyStateText}>No organisers found</TextDs>
            </FlexView>
          ) : null}
        </FlexView>

        {/* Events Section */}
        <FlexView style={styles.section}>
          {events.length > 0 && (
            <FlexView style={styles.sectionHeader}>
              <TextDs style={styles.sectionTitle}>Events</TextDs>
            </FlexView>
          )}

          {isLoadingEvents ? (
            <FlexView style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
            </FlexView>
          ) : isErrorEvents ? (
            <FlexView style={styles.emptyState}>
              <TextDs style={styles.emptyStateText}>Error loading events</TextDs>
            </FlexView>
          ) : events.length > 0 ? (
            <FlexView style={styles.eventsContainer}>
              {events.map((event) => (
                <EventCard
                  key={event.eventId}
                  id={event.eventId}
                  event={event}
                  onPress={handleEventPress}
                  onBookmark={handleBookmark}
                />
              ))}
            </FlexView>
          ) : debouncedQuery.trim().length > 0 ? (
            <FlexView style={styles.emptyState}>
              <TextDs style={styles.emptyStateText}>No events found</TextDs>
            </FlexView>
          ) : null}
        </FlexView>
      </ScrollView>
    </SafeAreaView >
  );
};
