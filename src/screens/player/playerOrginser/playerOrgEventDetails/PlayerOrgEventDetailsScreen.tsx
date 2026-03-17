import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
import {
  useEvent,
  useFilterOptions,
  useOrganiserEventsByUserId,
} from '@hooks/use-events';
import { getDateFilters } from '@screens/home/context/Home.data';
import { useHome } from '@screens/home/context/Home.context';
import { expandRecurringEvents } from '@utils/recurrence-utils';
import { parseLocalDate } from '@utils/date-utils';

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

  // Filter states - Start with "All" checked for each
  const [sportsFilterStates, setSportsFilterStates] = useState<Record<string, boolean>>({ 'all-sports': true });
  const [eventTypeFilterStates, setEventTypeFilterStates] = useState<Record<string, boolean>>({ 'all-event-types': true });
  const [locationFilterStates, setLocationFilterStates] = useState<Record<string, boolean>>({ 'all-locations': true });
  const [priceFilterStates, setPriceFilterStates] = useState<Record<string, boolean>>({});

  const { data: filterOptionsData } = useFilterOptions();

  // --- Filter Memos ---
  const sportsFilters = useMemo(() => {
    // 1. Define the 11 primary sports for resilience
    const PRIMARY_SPORTS = [
      'Padel',
      'Badminton',
      'Cricket',
      'Indoor Cricket',
      'Pickleball',
      'Tennis',
      'Football',
      'Table-tennis',
      'Pilates',
      'Basketball',
      'Running',
    ];

    // 2. Map labels to their specific icons
    const iconMap: Record<string, string> = {
      'Padel': 'padelIcon',
      'Badminton': 'badmintonIcon',
      'Cricket': 'cricketIcon',
      'Indoor Cricket': 'indoorCricketIcon',
      'Pickleball': 'pickleballIcon',
      'Tennis': 'tennisIcon',
      'Football': 'footballIcon',
      'Table-tennis': 'tableTennisIcon',
      'Table Tennis': 'tableTennisIcon',
      'Pilates': 'pilatesIcon',
      'Basketball': 'basketballIcon',
      'Running': 'runningIcon',
    };

    // 3. Merge backend sports with our primary list
    const backendSports = filterOptionsData?.sports || [];
    const combinedSports = [...PRIMARY_SPORTS];
    backendSports.forEach(bs => {
      // deduplicate
      if (!combinedSports.some(cs => cs.toLowerCase() === bs.toLowerCase())) {
        combinedSports.push(bs);
      }
    });

    const mappedSports = combinedSports
      .sort((a, b) => {
        const indexA = PRIMARY_SPORTS.indexOf(a);
        const indexB = PRIMARY_SPORTS.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.localeCompare(b);
      })
      .map((sportLabel) => {
        const id = sportLabel.toLowerCase().replace(/\s+/g, '-');
        return {
          id,
          label: sportLabel,
          value: sportLabel.toLowerCase(),
          isActive: sportsFilterStates[id] ?? false,
          icon: iconMap[sportLabel],
        };
      });

    return [
      {
        id: 'all-sports',
        label: 'All Sports',
        value: 'all',
        isActive: sportsFilterStates['all-sports'] ?? false,
      },
      ...mappedSports
    ];
  }, [filterOptionsData, sportsFilterStates]);

  const eventTypeFilters = useMemo(() => {
    // Standardize onto these 4 default event types
    const defaultTypes = ['Social', 'Tournament', 'Class', 'Training'];
    const backendTypes = filterOptionsData?.eventTypes || [];
    const combinedTypes = [...defaultTypes];
    backendTypes.forEach(bt => {
      if (!combinedTypes.some(ct => ct.toLowerCase() === bt.toLowerCase())) {
        combinedTypes.push(bt);
      }
    });

    const getEventIcon = (eventType: string): string | undefined => {
      const typeLower = eventType.toLowerCase();
      const iconMap: Record<string, string> = {
        'tournament': 'tournamentIcon',
        'social': 'socialIcon',
        'class': 'classIcon',
        'training': 'trainingIcon',
      };
      return iconMap[typeLower];
    };

    const mappedTypes = combinedTypes.map((type, index) => {
      const id = `event-type-${index}`;
      return {
        id,
        label: type,
        value: type.toLowerCase(),
        isActive: eventTypeFilterStates[id] ?? false,
        icon: getEventIcon(type),
      };
    });

    return [
      {
        id: 'all-event-types',
        label: 'All Events',
        value: 'all',
        isActive: eventTypeFilterStates['all-event-types'] ?? false,
      },
      ...mappedTypes
    ];
  }, [filterOptionsData, eventTypeFilterStates]);

  const locationFilters = useMemo(() => {
    const defaultLocations = filterOptionsData?.locations || [];
    const mappedLocations = defaultLocations.map((loc, index) => {
      const id = `location-${index}`;
      return {
        id,
        label: loc,
        value: loc.toLowerCase(),
        isActive: locationFilterStates[id] ?? false,
      };
    });

    return [
      {
        id: 'all-locations',
        label: 'All Locations',
        value: 'all',
        isActive: locationFilterStates['all-locations'] ?? false,
      },
      ...mappedLocations
    ];
  }, [filterOptionsData, locationFilterStates]);

  const priceFilters = useMemo(() => {
    const prices = [0, 30, 50, 100, 150, 300];
    return prices.map((price: number, index: number) => ({
      id: `price-${index}`,
      label: price === 0 ? 'Free' : `${price} AED`,
      value: String(price),
      isActive: priceFilterStates[`price-${index}`] ?? false,
    }));
  }, [priceFilterStates]);

  // --- Handlers ---
  const toggleSportsFilter = (id: string) => {
    setSportsFilterStates((prev) => {
      if (id === 'all-sports') return { 'all-sports': true };
      const next = { ...prev };
      next[id] = !prev[id];
      delete next['all-sports'];
      if (!Object.values(next).some(v => v)) return { 'all-sports': true };
      return next;
    });
  };

  const toggleEventTypeFilter = (id: string) => {
    setEventTypeFilterStates((prev) => {
      if (id === 'all-event-types') return { 'all-event-types': true };
      const next = { ...prev };
      next[id] = !prev[id];
      delete next['all-event-types'];
      if (!Object.values(next).some(v => v)) return { 'all-event-types': true };
      return next;
    });
  };

  const toggleLocationFilter = (id: string) => {
    setLocationFilterStates((prev) => {
      if (id === 'all-locations') return { 'all-locations': true };
      const next = { ...prev };
      next[id] = !prev[id];
      delete next['all-locations'];
      if (!Object.values(next).some(v => v)) return { 'all-locations': true };
      return next;
    });
  };

  const togglePriceFilter = (id: string) => {
    setPriceFilterStates(prev => ({ ...prev, [id]: !prev[id] }));
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

  // Always fetch full user data by organiserId if available to get high-fidelity profile info (like instagramLink)
  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['organiser-user', organiserId],
    queryFn: () => userService.getUserById(organiserId as string),
    enabled: !!organiserId,
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
    queryFn: () => userService.getCommunityDetails(resolvedCommunityName as string, 1),
    enabled: !!resolvedCommunityName,
    staleTime: 0, // Always fetch fresh data to get latest profileVisibility
  });

  // Effect to resolve community name from topOrganisers if still missing
  React.useEffect(() => {
    if (!communityName && !resolvedCommunityName && organiserIdNum) {
      const found = topOrganisers.find(org => org.userId === organiserIdNum);
      if (found?.communityName) { setResolvedCommunityName(found.communityName); }
    }
  }, [communityName, resolvedCommunityName, organiserIdNum, topOrganisers]);

  const isLoading = isLoadingUser || isLoadingCommunity;

  const isPrivateCommunity = useMemo(() => {
    const visibility = communityDetailsResponse?.data?.organiser?.profileVisibility || communityDetailsResponse?.profileVisibility;
    return visibility === 'private';
  }, [communityDetailsResponse]);

  const organiserData = useMemo(() => {
    const org = communityDetailsResponse?.data?.organiser;
    const user = userData?.data?.user;

    if (!org && !user) { return null; }

    return {
      name: org?.communityName || user?.communityName || '',
      creatorName: org?.fullName || user?.fullName || '',
      isVerified: org?.isVerified || user?.isMobileVerified || user?.isEmailVerified || false,
      profileImage: org?.profilePic || user?.profilePic || '',
      hostedCount: org?.totalEventsHosted || user?.eventsCreated || 0,
      followersCount: org?.totalAttendees || user?.totalAttendees || 0,
      subscribersCount: org?.totalSubscribers || user?.followingCount || 0,
      description: org?.bio || user?.bio || '',
      tags: org?.sports || user?.sports || [],
      userId: org?.userId || user?.userId,
      instagramLink: user?.instagramLink || org?.instagramLink || (org as any)?.instagram_link || (org as any)?.social_link,
    };
  }, [communityDetailsResponse, userData]);

  const { data: organiserEventsResponse, isLoading: isEventsLoading } = useOrganiserEventsByUserId(
    organiserIdNum,
    !!organiserIdNum,
  );



  const allEvents = useMemo(() => {
    const orgPic = communityDetailsResponse?.data?.organiser?.profilePic;
    const orgName = communityDetailsResponse?.data?.organiser?.fullName;

    return (organiserEventsResponse?.events || []).map(event => {
      const e = event as any;

      // Normalize price
      const price = e.eventPricePerGuest ?? e.price ?? 0;

      // Ensure eventType is string and lowercase
      const eventType = String(e.eventType || '').toLowerCase();

      // Normalize spots info
      const participantsCount = e.participantsCount ?? e.eventTotalAttendNumber ?? 0;
      const totalSpots = e.eventMaxGuest ?? 0;
      const spotsLeft = Math.max(0, totalSpots - participantsCount);
      const spotsFull = spotsLeft === 0;

      return {
        ...event,
        id: e.eventId || e.id,
        eventPricePerGuest: price,
        eventType,
        spotsInfo: e.spotsInfo || {
          totalSpots,
          spotsBooked: participantsCount,
          spotsLeft,
          spotsFull,
        },
        eventImages: (e.eventImages && e.eventImages.length > 0)
          ? e.eventImages
          : (e.eventImage ? [e.eventImage] : (e.gameImages && e.gameImages.length > 0 ? e.gameImages : [])),
        // INJECT FALLBACKS FROM TOP-LEVEL ORG
        eventCreatorProfilePic: e.eventCreatorProfilePic || e.creator?.profilePic || orgPic,
        eventCreatorName: e.eventCreatorName || e.creator?.fullName || orgName,
        creator: e.creator || (orgPic || orgName ? {
          userId: organiserIdNum,
          fullName: orgName || '',
          profilePic: orgPic || null,
        } : null),
      } as unknown as EventData;
    });
  }, [organiserEventsResponse, communityDetailsResponse, organiserIdNum]);

  const selectedSportsValues = useMemo(
    () => sportsFilters.filter(f => f.isActive && f.id !== 'all-sports').map(f => f.value.toLowerCase()),
    [sportsFilters],
  );
  const selectedEventTypeValues = useMemo(
    () => eventTypeFilters.filter(f => f.isActive && f.id !== 'all-event-types').map(f => f.value.toLowerCase()),
    [eventTypeFilters],
  );
  const selectedLocationValues = useMemo(
    () => locationFilters.filter(f => f.isActive && f.id !== 'all-locations').map(f => f.value.toLowerCase()),
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

  const dateRangeStrings = useMemo(
    () => dateFilters.map(f => f.fullDate).filter((d): d is string => !!d),
    [dateFilters],
  );

  const filteredEvents = useMemo(() => {
    const expanded = expandRecurringEvents(allEvents, dateRangeStrings);
    let filtered = expanded;

    if (selectedDateFullDate) {
      const d2 = parseLocalDate(selectedDateFullDate);
      filtered = filtered.filter(event => {
        const d1 = new Date(event.eventDateTime);
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
  }, [allEvents, dateRangeStrings, selectedDateFullDate, selectedSportsValues, selectedEventTypeValues, selectedLocationValues, selectedPriceValues]);

  const eventsByDate = useMemo(() => {
    const grouped: Record<string, EventData[]> = {};
    filteredEvents.forEach(event => {
      const d = new Date(event.eventDateTime);
      const key = `${d.getDate()} ${d.toLocaleString('en', { month: 'short' })}`;
      if (!grouped[key]) { grouped[key] = []; }
      grouped[key].push(event);
    });

    // Sort events within each date group chronologically (oldest to newest)
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => new Date(a.eventDateTime).getTime() - new Date(b.eventDateTime).getTime());
    });

    // Sort the date groups chronologically (oldest to newest)
    return Object.entries(grouped).sort((a, b) => {
      return new Date(a[1][0].eventDateTime).getTime() - new Date(b[1][0].eventDateTime).getTime();
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
          organiserId={organiserData.userId!.toString()}
          isPrivateCommunity={isPrivateCommunity}
        />

        {!isPrivateCommunity && (
          <>
            {/* 1. TAB TOGGLE BUTTONS */}
            <FlexView style={styles.tabToggleWrapper}>
              <FlexView style={styles.pillContainer}>
                <TouchableOpacity
                  onPress={() => setActiveTab('events')}
                  style={[styles.pillBtn, activeTab === 'events' && styles.pillBtnActive]}
                >
                  <TextDs style={[styles.pillBtnText, activeTab === 'events' && styles.pillBtnTextActive]}>Events</TextDs>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setActiveTab('packages')}
                  style={[styles.pillBtn, activeTab === 'packages' && styles.pillBtnActive]}
                >
                  <TextDs style={[styles.pillBtnText, activeTab === 'packages' && styles.pillBtnTextActive]}>Packages</TextDs>
                </TouchableOpacity>
              </FlexView>
            </FlexView>

            {/* 2. FILTER NAVIGATION (Reacts to Toggle) */}
            <TabNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
              sportsFilters={sportsFilters}
              eventTypeFilters={eventTypeFilters}
              locationFilters={locationFilters}
              priceFilters={priceFilters}
              toggleSportsFilter={toggleSportsFilter}
              toggleEventTypeFilter={toggleEventTypeFilter}
              toggleLocationFilter={toggleLocationFilter}
              togglePriceFilter={togglePriceFilter}
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
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    zIndex: 10,
  },
  pillContainer: {
    flexDirection: 'row',
    backgroundColor: colors.glass.background.white,
    borderRadius: borderRadius.full,
    padding: 2,
    borderWidth: 1,
    borderColor: colors.border.white,
  },
  pillBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.full,
  },
  pillBtnActive: {
    backgroundColor: colors.primary,
  },
  pillBtnText: {
    ...getFontStyle(14, 'medium'),
    color: colors.text.secondary,
  },
  pillBtnTextActive: {
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
