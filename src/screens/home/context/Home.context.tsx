import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode, useCallback } from 'react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import type { Organiser, FilterOption, DateFilter, City } from '../Home.types';
import { usePlayerEvents, useFilterOptions } from '@hooks';
import { useTopOrganisers } from '@hooks/use-top-organisers';
import { usePlayerBookings } from '@hooks/use-bookings';
import type { PlayerBooking } from '@services/booking-service';
import { EventData } from '@app-types';
import { useAuthStore } from '@store/auth-store';
import { userService } from '@services/user-service';
import {
  generateDateFilters,
  getMaxDateFilterEndDate,
  canLoadMoreDates,
  addTime,
  getDateDifference,
} from '@utils/date-utils';

interface CommunityData {
  userId: number;
  profilePic: string;
  fullName: string;
  communityName: string;
  totalEvents: number;
  totalAttendees: number;
  sports: string[];
}

interface CommunitiesResponse {
  success: boolean;
  message: string;
  data: {
    communities: CommunityData[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      perPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

interface IHomeContextValue {
  // Location
  selectedCity: City;
  setSelectedCity: (city: City) => void;

  // Events
  events: EventData[] | undefined; // Raw events data from API
  featuredEvents: EventData[];
  pickedEvents: EventData[];
  bookAgainEvents: EventData[];
  calendarEvents: EventData[];
  isLoadingEvents: boolean;
  eventsError: Error | null;

  // Organisers
  topOrganisers: Organiser[];

  // Communities
  communities: CommunityData[];
  isLoadingCommunities: boolean;
  communitiesError: Error | null;

  // Filters
  sportsFilters: FilterOption[];
  eventTypeFilters: FilterOption[];
  locationFilters: FilterOption[];
  priceFilters: FilterOption[];
  dateFilters: DateFilter[];

  // Actions
  toggleSportsFilter: (id: string) => void;
  toggleEventTypeFilter: (id: string) => void;
  toggleLocationFilter: (id: string) => void;
  togglePriceFilter: (id: string) => void;
  selectDate: (fullDate: string | null) => void;
  loadMoreDates: () => void;
  canLoadMore: boolean;
  refetchEvents: () => void;
}

const HomeContext = createContext<IHomeContextValue | undefined>(undefined);
interface IHomeProviderProps {
  children: ReactNode;
}

export const HomeProvider: React.FC<IHomeProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const { isAuthenticated, user, selectedLocation } = useAuthStore();
  const [selectedCity, setSelectedCity] = useState<City>(() => ({
    id: '1',
    name: 'Dubai',
    country: 'UAE',
  }));

  // Fetch filter options from API
  const { data: filterOptionsData } = useFilterOptions();

  // Fetch player bookings (only if authenticated AND user is a player)
  const { data: playerBookingsData } = usePlayerBookings({
    status: 'all',
    page: 1,
    enabled: isAuthenticated && user?.userType === 'player',
  });

  // Fetch top organisers from API
  const { data: topOrganisersData } = useTopOrganisers({ page: 1 });

  // Fetch communities from API
  const {
    data: communitiesResponse,
    isLoading: isLoadingCommunities,
    error: communitiesError,
  } = useQuery<CommunitiesResponse>({
    queryKey: ['communities', 1],
    queryFn: () => userService.getCommunities(1),
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  });

  // Transform API data to FilterOption format using useMemo
  const [sportsFilterStates, setSportsFilterStates] = useState<Record<string, boolean>>({ 'all-sports': true });
  const [eventTypeFilterStates, setEventTypeFilterStates] = useState<Record<string, boolean>>({ 'all-event-types': true });
  const [locationFilterStates, setLocationFilterStates] = useState<Record<string, boolean>>({});
  const [priceFilterStates, setPriceFilterStates] = useState<Record<string, boolean>>({});

  // Initialize date filters with 30 days from today
  const [dateFilters, setDateFilters] = useState<DateFilter[]>(() => {
    const today = new Date();
    return generateDateFilters(today, 30);
  });

  // Track lazy loading state for date filters
  const [dateFilterState, setDateFilterState] = useState({
    startDate: new Date(),
    currentEndDate: addTime(new Date(), 29, 'days'), // 30 days inclusive (0-29)
    isLoadingMore: false,
  });

  // Derive filter arrays from API data and local state
  const sportsFilters = useMemo(() => {
    // 1. Define the requested sort order
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

    // 2. Map labels to their specific icons (White icons as requested)
    const iconMap: Record<string, string> = {
      'Padel': 'padelIcon',
      'Badminton': 'badmintonIcon',
      'Cricket': 'cricketIcon',
      'Indoor Cricket': 'indoorCricketIcon',
      'Pickleball': 'pickleballIcon',
      'Tennis': 'tennisIcon',
      'Football': 'footballIcon',
      'Table-tennis': 'tableTennisIcon',
      'Table Tennis': 'tableTennisIcon', // Handle both hyphen and space
      'Pilates': 'pilatesIcon',
      'Basketball': 'basketballIcon',
      'Running': 'runningIcon',
      'Volleyball': 'basketballIcon', // Placeholder icon if volleyball specific is missing
    };

    // 3. Merge backend sports with our primary list for resilience
    const backendSports = filterOptionsData?.sports || [];

    // Debug log to see what the backend is actually sending
    if (filterOptionsData?.sports) {
      console.log('⚽ [HOME CONTEXT] Received sports from backend:', filterOptionsData.sports);
    }

    // Combine and deduplicate (case-insensitive)
    const combinedSports = [...PRIMARY_SPORTS];
    backendSports.forEach(bs => {
      if (!combinedSports.some(cs => cs.toLowerCase() === bs.toLowerCase())) {
        combinedSports.push(bs);
      }
    });

    // 4. Create FilterOption objects and sort them
    const mappedSports = combinedSports
      .sort((a, b) => {
        const indexA = PRIMARY_SPORTS.indexOf(a);
        const indexB = PRIMARY_SPORTS.indexOf(b);

        // If both are in our ordered list, use that order
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        // If only one is in the list, that one comes first
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        // If neither is in the list, sort alphabetically
        return a.localeCompare(b);
      })
      .map((sportLabel) => ({
        id: sportLabel.toLowerCase().replace(/\s+/g, '-'),
        label: sportLabel,
        value: sportLabel.toLowerCase(),
        isActive: sportsFilterStates[sportLabel.toLowerCase().replace(/\s+/g, '-')] ?? false,
        icon: iconMap[sportLabel],
      }));

    // Inject "All Sports" at the beginning
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
    const defaultTypes = filterOptionsData?.eventTypes || [];
    const getEventIcon = (eventType: string): string | undefined => {
      const eventTypeLower = eventType.toLowerCase().replace(/\s+/g, '');
      const iconMap: Record<string, string> = {
        'tournament': 'tournamentIcon',
        'social': 'socialIcon',
        'class': 'classIcon',
        'training': 'trainingIcon',
      };
      return iconMap[eventTypeLower];
    };
    const mappedTypes = defaultTypes.map((eventType: string, index: number) => ({
      id: `event-type-${index}`,
      label: eventType,
      value: eventType.toLowerCase(),
      isActive: eventTypeFilterStates[`event-type-${index}`] ?? false,
      icon: getEventIcon(eventType),
    }));

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
    const distanceOptions = [
      { id: 'distance-2', label: 'Nearby (<2 kms)', value: '2' },
      { id: 'distance-5', label: 'Within 5 kms', value: '5' },
      { id: 'distance-10', label: 'Within 10 kms', value: '10' },
      { id: 'distance-20', label: 'Within 20 kms', value: '20' },
      { id: 'distance-50', label: 'Within 50 kms', value: '50' },
      { id: 'distance-everywhere', label: 'Everywhere', value: 'everywhere' },
    ];

    return distanceOptions.map((option) => ({
      ...option,
      isActive: locationFilterStates[option.id] ?? false,
    }));
  }, [locationFilterStates]);

  const priceFilters = useMemo(() => {
    const prices = [0, 30, 50, 100, 150, 300];
    return prices.map((price: number, index: number) => ({
      id: `price-${index}`,
      label: price === 0 ? 'Free' : `${price} AED`,
      value: String(price),
      isActive: priceFilterStates[`price-${index}`] ?? false,
    }));
  }, [priceFilterStates]);

  // Fetch events from API
  const {
    data: eventsData,
    isLoading: isLoadingEvents,
    error: eventsError,
    refetch: refetchEvents,
  } = usePlayerEvents();

  // Refetch events on component mount
  useEffect(() => {
    // Invalidate cache and fetch fresh events on mount
    queryClient.invalidateQueries({ queryKey: ['player-events'] });
    refetchEvents({ cancelRefetch: false });
  }, [refetchEvents, queryClient]);

  // Get events and organizers
  const featuredEvents = useMemo(() => {
    // Return first 3 events as featured
    if (eventsData?.events && eventsData.events.length > 0) {
      return eventsData.events.slice(0, 3).map((e) => ({ ...e, isFeatured: true }));
    }
    return [];
  }, [eventsData]);

  const pickedEvents = useMemo(() => {
    // Return all events as picked (excluding featured ones)
    if (eventsData?.events && eventsData.events.length > 0) {
      // Show all events, but mark featured ones differently if needed
      return eventsData.events.map((e) => ({ ...e, isFeatured: false }));
    }
    return [];
  }, [eventsData]);

  const bookAgainEvents = useMemo(() => {
    // Return events where user has joined/booked (for Book Again section)
    if (eventsData?.events && eventsData.events.length > 0) {
      // return eventsData.events.filter((e) => e.userJoinStatus?.hasJoined === true);
    }
    return [];
  }, [eventsData]);

  const calendarEvents = useMemo((): EventData[] => {
    // Return events from player bookings (for Your Calendar section)
    if (!isAuthenticated || !playerBookingsData || !playerBookingsData.data || !playerBookingsData.data.bookings) {
      return [];
    }

    const { bookings } = playerBookingsData.data;
    const allEvents = eventsData?.events ?? [];

    // Transform PlayerBooking[] to EventData[]
    return bookings.map((booking: PlayerBooking): EventData => {
      // Find matching event from allEvents to get participants
      const matchingEvent = allEvents.find(e => e.eventId === booking.eventId || e.mongoId === booking.mongoId);

      return {
        // BaseEntity fields
        id: booking.mongoId,

        // Core event fields
        eventId: booking.eventId,
        mongoId: booking.mongoId,
        eventName: booking.eventName,
        eventImages: booking.eventImages,
        eventVideo: booking.eventVideo,
        gameImages: booking.eventImages, // Fallback
        gameVideo: booking.eventVideo, // Fallback
        eventType: booking.eventType,
        eventSports: booking.eventSports,
        eventDateTime: booking.eventDateTime,
        eventLatitude: undefined,
        eventLongitude: undefined,
        eventFrequency: booking.eventFrequency,
        eventFrequencyEndDate: booking.eventFrequencyEndDate,
        eventLocation: booking.eventLocation,
        eventDescription: booking.eventDescription,
        eventGender: booking.eventGender,
        eventSportsLevel: booking.eventSportsLevel,
        eventMinAge: booking.eventMinAge,
        eventMaxAge: booking.eventMaxAge,
        eventLevelRestriction: booking.eventLevelRestriction,
        eventMaxGuest: booking.eventMaxGuest,
        eventPricePerGuest: booking.eventPricePerGuest,
        IsPrivateEvent: booking.IsPrivateEvent,
        eventOurGuestAllowed: booking.eventOurGuestAllowed,
        eventApprovalReq: booking.eventApprovalReq,
        eventRegistrationStartTime: booking.eventRegistrationStartTime,
        eventRegistrationEndTime: booking.eventRegistrationEndTime,
        eventStatus: booking.eventStatus,
        eventTotalAttendNumber: booking.eventTotalAttendNumber,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        timeUntilStart: booking.timeUntilStart,

        // Creator fields from booking response
        eventCreatorEmail: booking.creator?.email || '',
        eventCreatorName: booking.creator?.fullName || '',
        eventCreatorProfilePic: booking.creator?.profilePic ?? null,
        creator: booking.creator
          ? {
            userId: booking.creator.userId,
            fullName: booking.creator.fullName,
            email: booking.creator.email || '',
            profilePic: booking.creator.profilePic ?? null,
            communityName: '',
            eventsCreated: 0,
            totalAttendees: 0,
          }
          : null,

        // Participants (Enriched from matchingEvent if available)
        participants: matchingEvent?.participants ?? [],
        participantsCount: matchingEvent?.participantsCount ?? matchingEvent?.participants?.length ?? 0,
        waitlist: matchingEvent?.waitlist ?? [],
        waitlistCount: matchingEvent?.waitlistCount ?? matchingEvent?.waitlist?.length ?? 0,

        // Spots info (calculated from eventMaxGuest and eventTotalAttendNumber)
        spotsInfo: {
          totalSpots: booking.eventMaxGuest,
          spotsBooked: booking.eventTotalAttendNumber,
          spotsLeft: booking.eventMaxGuest - booking.eventTotalAttendNumber,
          spotsFull: booking.eventTotalAttendNumber >= booking.eventMaxGuest,
        },

        // Additional fields
        counts: null,
        userJoinStatus: {
          action: 'joined',
          requiresAuth: false,
        },
        availableSpots: booking.eventMaxGuest - booking.eventTotalAttendNumber,
        isFull: booking.eventTotalAttendNumber >= booking.eventMaxGuest,
        // Booking implies payment completed (or free) => treat as joined
        isJoined: true,
        isPending: false,
        isLeave: false,
      };
    });
  }, [isAuthenticated, playerBookingsData, eventsData]);

  const topOrganisers = useMemo(() => {
    const organisers = topOrganisersData?.data?.organisers ?? [];
    // Log to verify if communityName is in API response
    if (organisers.length > 0) {
      console.log('🔍 [Home.context] Top organisers from API (first item):', JSON.stringify(organisers[0], null, 2));
      console.log('🔍 [Home.context] Checking for communityName in response:', {
        hasCommunityName: !!(organisers[0] as any).communityName,
        communityName: (organisers[0] as any).communityName,
        allKeys: Object.keys(organisers[0] || {}),
      });
    }
    // Preserve all fields including communityName if it exists in API response
    return organisers.map(org => ({
      ...org,
      communityName: (org as any).communityName, // Explicitly preserve communityName
    }));
  }, [topOrganisersData]);

  // Extract communities data
  const communities = useMemo(() => {
    return communitiesResponse?.data?.communities ?? [];
  }, [communitiesResponse]);

  const toggleSportsFilter = (id: string) => {
    setSportsFilterStates((prev) => {
      if (id === 'all-sports') {
        return { 'all-sports': true };
      }
      const newState = { ...prev };
      newState[id] = !prev[id];
      delete newState['all-sports'];

      // If nothing left checked, re-enable all
      const hasActive = Object.values(newState).some(v => v);
      if (!hasActive) return { 'all-sports': true };

      return newState;
    });
  };
  // useEffect(() => {
  //   if (!selectedLocation || locationFilters.length === 0) return;

  //   locationFilters.forEach((filter) => {
  //     const shouldBeActive = filter.value.toLowerCase() === selectedLocation.toLowerCase();
  //     const isCurrentlyActive = filter.isActive;
  //     if (shouldBeActive && !isCurrentlyActive) {
  //       toggleLocationFilter(filter.id);
  //     } else if (!shouldBeActive && isCurrentlyActive) {
  //       toggleLocationFilter(filter.id);
  //     }
  //   });
  // }, [selectedLocation, locationFilters.length]); // locationFilters.length ensures it runs once filters are loaded

  const toggleEventTypeFilter = (id: string) => {
    setEventTypeFilterStates((prev) => {
      if (id === 'all-event-types') {
        return { 'all-event-types': true };
      }
      const newState = { ...prev };
      newState[id] = !prev[id];
      delete newState['all-event-types'];

      const hasActive = Object.values(newState).some(v => v);
      if (!hasActive) return { 'all-event-types': true };

      return newState;
    });
  };

  const toggleLocationFilter = (id: string) => {
    setLocationFilterStates((prev) => {
      const isAlreadyActive = !!prev[id];
      if (isAlreadyActive) {
        return {};
      }
      return { [id]: true };
    });
  };

  const togglePriceFilter = (id: string) => {
    setPriceFilterStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const selectDate = (fullDate: string | null) => {
    setDateFilters((prev) => {
      if (fullDate === null) {
        return prev.map((f) => ({ ...f, isSelected: false }));
      }
      return prev.map((f) => ({
        ...f,
        isSelected: f.fullDate === fullDate,
      }));
    });
  };

  const loadMoreDates = useCallback(() => {
    if (dateFilterState.isLoadingMore) { return; }

    const maxDate = getMaxDateFilterEndDate();
    if (dateFilterState.currentEndDate >= maxDate) { return; }

    setDateFilterState((prev) => ({ ...prev, isLoadingMore: true }));

    // Generate next 30 days
    const nextStartDate = new Date(dateFilterState.currentEndDate);
    nextStartDate.setDate(nextStartDate.getDate() + 1);

    const daysToGenerate = Math.min(
      30,
      getDateDifference(nextStartDate, maxDate, 'days') + 1, // +1 to include the end date
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

  const canLoadMore = useMemo(() => {
    return canLoadMoreDates(dateFilterState.currentEndDate);
  }, [dateFilterState.currentEndDate]);

  const value = useMemo(
    () => ({
      events: eventsData?.events,
      selectedCity,
      setSelectedCity,
      featuredEvents,
      pickedEvents,
      bookAgainEvents,
      calendarEvents,
      isLoadingEvents,
      eventsError: eventsError as Error | null,
      topOrganisers,
      communities,
      isLoadingCommunities,
      communitiesError: communitiesError as Error | null,
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
    }),
    [
      eventsData,
      selectedCity,
      featuredEvents,
      pickedEvents,
      bookAgainEvents,
      calendarEvents,
      isLoadingEvents,
      eventsError,
      topOrganisers,
      communities,
      isLoadingCommunities,
      communitiesError,
      sportsFilters,
      eventTypeFilters,
      locationFilters,
      priceFilters,
      dateFilters,
      loadMoreDates,
      canLoadMore,
      refetchEvents,
    ],
  );

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
};

export const useHome = (): IHomeContextValue => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHome must be used within HomeProvider');
  }
  return context;
};
