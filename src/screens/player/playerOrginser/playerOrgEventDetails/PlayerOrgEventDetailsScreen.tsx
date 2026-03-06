import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

// Components
import { TextDs, FlexView } from '@components';
import { OrganiserProfileHeader } from './components/OrganiserProfileHeader';
import { TabNavigation } from './components/TabNavigation';
import { PackagesSection } from './components/PackagesSection';
import { DateFilter } from '@components/private/home/DateFilter';
import { EventDateGroup } from '@components/private/home/player-home-content/sections/EventDateGroup';

// Assets/Theme/Utils
import { PACKAGES } from './data/organiserEventDetails.data';
import { colors, spacing, getFontStyle, borderRadius } from '@theme';
import { logger } from '@dev-tools';
import { userService } from '@services/user-service';
import { useFilterOptions } from '@hooks';
import { getDateFilters } from '@screens/home/context/Home.data';
import { useHome } from '@screens/home/context/Home.context';

// Types
import type { DateFilter as DateFilterType } from '@screens/home/Home.types';
import type { EventData } from '@app-types';
import {
  CommunityDetailsResponse,
  PlayerOrgEventDetailsScreenNavigationProp,
} from './PlayerOrgEventDetailsScreen.types';

export const PlayerOrgEventDetailsScreen: React.FC = () => {
  const navigation = useNavigation<PlayerOrgEventDetailsScreenNavigationProp>();
  const route = useRoute();
  const params = route.params as { organiserId?: string; communityName?: string };
  const { organiserId, communityName } = params;

  const { topOrganisers } = useHome();

  // Component State
  const [activeTab, setActiveTab] = useState<'events' | 'packages'>('events');
  const [dateFilters, setDateFilters] = useState<DateFilterType[]>(getDateFilters());

  // Filter states
  const [sportsFilterStates, setSportsFilterStates] = useState<Record<string, boolean>>({});
  const [eventTypeFilterStates, setEventTypeFilterStates] = useState<Record<string, boolean>>({});
  const [locationFilterStates, setLocationFilterStates] = useState<Record<string, boolean>>({});
  const [priceFilterStates, setPriceFilterStates] = useState<Record<string, boolean>>({});

  const { data: filterOptionsData } = useFilterOptions();

  // --- Filter Memos ---
  const sportsFilters = useMemo(() => {
    if (!filterOptionsData?.sports) return [];

    const getSportIcon = (sportName: string): string | undefined => {
      const sportLower = sportName.toLowerCase().replace(/\s+/g, '');
      const iconMap: Record<string, string> = {
        'badminton': 'badmintonIcon',
        'cricket': 'cricketIcon',
        'football': 'footballIcon',
        'table-tennis': 'tableTennisIcon',
        'tennis': 'tennisIcon',
        'padel': 'padelIcon',
      };
      return iconMap[sportLower];
    };

    return filterOptionsData.sports.map((sport, index) => ({
      id: `sports-${index}`,
      label: sport,
      value: sport.toLowerCase(),
      isActive: sportsFilterStates[`sports-${index}`] ?? false,
      icon: getSportIcon(sport),
    }));
  }, [filterOptionsData, sportsFilterStates]);

  const eventTypeFilters = useMemo(() => {
    if (!filterOptionsData?.eventTypes) return [];
    return filterOptionsData.eventTypes.map((type, index) => ({
      id: `event-type-${index}`,
      label: type,
      value: type.toLowerCase(),
      isActive: eventTypeFilterStates[`event-type-${index}`] ?? false,
    }));
  }, [filterOptionsData, eventTypeFilterStates]);

  const locationFilters = useMemo(() => {
    if (!filterOptionsData?.locations) return [];
    return filterOptionsData.locations.map((loc, index) => ({
      id: `location-${index}`,
      label: loc,
      value: loc.toLowerCase(),
      isActive: locationFilterStates[`location-${index}`] ?? false,
    }));
  }, [filterOptionsData, locationFilterStates]);

  const priceFilters = useMemo(() => {
    if (!filterOptionsData?.prices) return [];
    return filterOptionsData.prices.map((p, index) => ({
      id: `price-${index}`,
      label: `${p} AED`,
      value: p.toString(),
      isActive: priceFilterStates[`price-${index}`] ?? false,
    }));
  }, [filterOptionsData, priceFilterStates]);

  // --- Handlers ---
  const toggleFilter = (setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>) => (id: string) => {
    setter(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const selectDate = (fullDate: string | null) => {
    setDateFilters(prev => prev.map(f => ({ ...f, isSelected: f.fullDate === fullDate })));
  };

  const handleEventPress = (eventId: string) => navigation.navigate('EventDetails', { eventId });
  const handlePackagePress = (packageId: string) => navigation.navigate('PlanDetails', { packageId });
  const handleBookmark = (eventId: string) => logger.info('Bookmark event:', eventId);

  // --- Data Fetching & Resolution Logic ---
  const [resolvedCommunityName, setResolvedCommunityName] = useState<string | undefined>(communityName);
  const organiserIdNum = useMemo(() => organiserId ? parseInt(organiserId.toString(), 10) : null, [organiserId]);

  // First fetch user data by organiserId to get communityName if not provided
  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['organiser-user', organiserId],
    queryFn: () => userService.getUserById(organiserId!),
    enabled: !!organiserId && !communityName,
    staleTime: 0, // Always fetch fresh data
  });

  // Extract communityName from user data

  React.useEffect(() => {
    if (userData?.data?.user?.communityName && !resolvedCommunityName) {
      setResolvedCommunityName(userData.data.user.communityName);
    }
  }, [userData, resolvedCommunityName]);

  const { data: communityDetailsResponse, isLoading: isLoadingCommunity, error } = useQuery<CommunityDetailsResponse>({
    queryKey: ['community-details', resolvedCommunityName],
    queryFn: () => userService.getCommunityDetails(resolvedCommunityName!, 1),
    enabled: !!resolvedCommunityName,
    staleTime: 0, // Always fetch fresh data to get latest profileVisibility
  });

  // Effect to resolve community name from topOrganisers if still missing
  React.useEffect(() => {
    if (!communityName && !resolvedCommunityName && organiserIdNum) {
      const found = topOrganisers.find(org => org.userId === organiserIdNum);
      if (found?.communityName) setResolvedCommunityName(found.communityName);
    }
  }, [communityName, resolvedCommunityName, organiserIdNum, topOrganisers]);

  const isLoading = isLoadingUser || isLoadingCommunity;

  const isPrivateCommunity = useMemo(() => {
    const visibility = communityDetailsResponse?.data?.organiser?.profileVisibility || communityDetailsResponse?.profileVisibility;
    return visibility === 'private';
  }, [communityDetailsResponse]);

  const organiserData = useMemo(() => {
    const org = communityDetailsResponse?.data?.organiser;
    if (!org) return null;
    return {
      name: org.communityName,
      creatorName: org.fullName,
      isVerified: false,
      profileImage: org.profilePic,
      hostedCount: org.totalEventsHosted || 0,
      followersCount: org.totalAttendees || 0,
      subscribersCount: org.totalSubscribers || 0,
      description: org.bio || '',
      tags: org.sports || [],
      userId: org.userId,
      instagramLink: org.instagramLink, // ADD THIS LINE
    };
  }, [communityDetailsResponse]);

  const allEvents = useMemo(() => {
    return (communityDetailsResponse?.data?.events || []) as unknown as EventData[];
  }, [communityDetailsResponse]);

  const selectedSportsValues = useMemo(
    () => sportsFilters.filter(f => f.isActive).map(f => f.value.toLowerCase()),
    [sportsFilters],
  );
  const selectedEventTypeValues = useMemo(
    () => eventTypeFilters.filter(f => f.isActive).map(f => f.value.toLowerCase()),
    [eventTypeFilters],
  );
  const selectedLocationValues = useMemo(
    () => locationFilters.filter(f => f.isActive).map(f => f.value.toLowerCase()),
    [locationFilters],
  );
  const selectedPriceValues = useMemo(
    () => priceFilters.filter(f => f.isActive).map(f => Number(f.value)),
    [priceFilters],
  );
  const selectedDateFullDate = useMemo(
    () => dateFilters.find(d => d.isSelected)?.fullDate ?? null,
    [dateFilters],
  );

  const filteredEvents = useMemo(() => {
    let filtered = allEvents;

    if (selectedDateFullDate) {
      filtered = filtered.filter(event => {
        const d1 = new Date(event.eventDateTime);
        const d2 = new Date(selectedDateFullDate);
        return (
          d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate()
        );
      });
    }

    if (selectedSportsValues.length > 0) {
      filtered = filtered.filter(event => {
        const eventSportsLower = event.eventSports.map(s => s.toLowerCase());
        return selectedSportsValues.some(s => eventSportsLower.includes(s));
      });
    }

    if (selectedEventTypeValues.length > 0) {
      filtered = filtered.filter(event =>
        selectedEventTypeValues.includes(String(event.eventType).toLowerCase()),
      );
    }

    if (selectedLocationValues.length > 0) {
      filtered = filtered.filter(event =>
        selectedLocationValues.some(loc => event.eventLocation.toLowerCase().includes(loc)),
      );
    }

    if (selectedPriceValues.length > 0) {
      filtered = filtered.filter(event =>
        selectedPriceValues.some(price => event.eventPricePerGuest <= price),
      );
    }

    return filtered;
  }, [allEvents, selectedDateFullDate, selectedSportsValues, selectedEventTypeValues, selectedLocationValues, selectedPriceValues]);

  const eventsByDate = useMemo(() => {
    const grouped: Record<string, EventData[]> = {};
    filteredEvents.forEach(event => {
      const d = new Date(event.eventDateTime);
      const key = `${d.getDate()} ${d.toLocaleString('en', { month: 'short' })}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(event);
    });
    return Object.entries(grouped).sort((a, b) => {
      const [dayA, monthA] = a[0].split(' ');
      const [dayB, monthB] = b[0].split(' ');
      if (monthA === monthB) return parseInt(dayA) - parseInt(dayB);
      return a[0].localeCompare(b[0]);
    });
  }, [filteredEvents]);

  const getDayLabel = (dateStr: string): string => {
    try {
      const [day, month] = dateStr.split(' ');
      const monthMap: Record<string, number> = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
      };
      if (day && month && monthMap[month] !== undefined) {
        const date = new Date(new Date().getFullYear(), monthMap[month], parseInt(day));
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()] || '';
      }
      return '';
    } catch { return ''; }
  };

  // --- Render Helpers ---
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (error || !organiserData) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <FlexView style={styles.errorContainer}>
          <TextDs style={styles.errorText}>
            {error ? 'Failed to load organiser details' : 'Organiser not found'}
          </TextDs>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <TextDs style={styles.backButtonText}>Go Back</TextDs>
          </TouchableOpacity>
        </FlexView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        removeClippedSubviews={false} // Android fix for dropdown clipping
      >
        <OrganiserProfileHeader
          {...organiserData}
          organiserId={organiserData.userId.toString()}
          isPrivateCommunity={isPrivateCommunity}
        />

        {!isPrivateCommunity && (
          <>
            {/* 1. TAB TOGGLE BUTTONS */}
            <FlexView style={styles.tabToggleWrapper}>
              <TouchableOpacity
                onPress={() => setActiveTab('events')}
                style={[styles.tabBtn, activeTab === 'events' && styles.tabBtnActive]}
              >
                <TextDs style={[styles.tabBtnText, activeTab === 'events' && styles.tabBtnTextActive]}>Events</TextDs>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveTab('packages')}
                style={[styles.tabBtn, activeTab === 'packages' && styles.tabBtnActive]}
              >
                <TextDs style={[styles.tabBtnText, activeTab === 'packages' && styles.tabBtnTextActive]}>Packages</TextDs>
              </TouchableOpacity>
            </FlexView>

            {/* 2. FILTER NAVIGATION (Reacts to Toggle) */}
            <TabNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
              sportsFilters={sportsFilters}
              eventTypeFilters={eventTypeFilters}
              locationFilters={locationFilters}
              priceFilters={priceFilters}
              toggleSportsFilter={toggleFilter(setSportsFilterStates)}
              toggleEventTypeFilter={toggleFilter(setEventTypeFilterStates)}
              toggleLocationFilter={toggleFilter(setLocationFilterStates)}
              togglePriceFilter={toggleFilter(setPriceFilterStates)}
            />
          </>
        )}

        {/* 3. CONTENT AREA */}
        {!isPrivateCommunity && (
          activeTab === 'events' ? (
            <FlexView style={styles.contentZIndex}>
              <DateFilter dates={dateFilters} onSelectDate={selectDate} />
              {eventsByDate.length > 0 ? (
                eventsByDate.map(([date, events], idx) => (
                  <EventDateGroup
                    key={date}
                    title={date}
                    dayLabel={getDayLabel(date)}
                    events={events}
                    isLast={idx === eventsByDate.length - 1}
                    onEventPress={handleEventPress}
                    onBookmark={handleBookmark}
                  />
                ))
              ) : (
                <FlexView style={styles.emptyBox}><TextDs>No events found</TextDs></FlexView>
              )}
            </FlexView>
          ) : (
            <PackagesSection packages={PACKAGES} onPackagePress={handlePackagePress} />
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gradient.main,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabToggleWrapper: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    zIndex: 10, // Ensure toggle is above list
  },
  tabBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.full,
    backgroundColor: colors.glass.background.white,
    borderWidth: 1,
    borderColor: colors.border.white,
  },
  tabBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabBtnText: {
    ...getFontStyle(14, 'medium'),
    color: colors.text.secondary,
  },
  tabBtnTextActive: {
    color: colors.text.white,
  },
  contentZIndex: {
    zIndex: 1, // Keep content below dropdowns
  },
  emptyBox: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  errorText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  backButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  backButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
});