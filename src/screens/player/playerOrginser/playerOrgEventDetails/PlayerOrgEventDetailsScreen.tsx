import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
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
import type { PackageData } from './data/organiserEventDetails.data';
import { colors, spacing, getFontStyle, borderRadius } from '@theme';
import { logger } from '@dev-tools';
import { userService } from '@services/user-service';
import {
  useEvent,
  useFilterOptions,
  useOrganiserEventsByUserId,
} from '@hooks/use-events';
import { useOrganiserPackages } from '@hooks/organiser';
import { getDateFilters } from '@screens/home/context/Home.data';
import { useHome } from '@screens/home/context/Home.context';
import { expandRecurringEvents } from '@utils/recurrence-utils';
import { useAsyncExpandedEvents } from '@hooks/use-async-expanded-events';
import { parseLocalDate } from '@utils/date-utils';
import { useLocationStore } from '@store/location-store';
import { locationSearchService } from '@services/location-search-service';

// --- Distance Calculation Utilities ---
const EARTH_RADIUS_KM = 6371;
const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;
const getDistanceKm = (fromLat: number, fromLng: number, toLat: number, toLng: number): number => {
  const dLat = toRadians(toLat - fromLat);
  const dLng = toRadians(toLng - fromLng);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadians(fromLat)) * Math.cos(toRadians(toLat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
};
const getEventKey = (event: EventData): string => String(event.mongoId ?? event.eventId ?? event.id);
const parseCoordinatesFromLocationText = (locationText: string | null | undefined): { latitude: number; longitude: number } | null => {
  if (!locationText) return null;
  const simplePair = locationText.match(/(-?\d{1,2}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)/);
  if (simplePair) {
    const latitude = Number(simplePair[1]), longitude = Number(simplePair[2]);
    if (Number.isFinite(latitude) && Number.isFinite(longitude)) return { latitude, longitude };
  }
  const latLngPair = locationText.match(/(?:lat|latitude)\s*[:=]\s*(-?\d{1,2}(?:\.\d+)?).*?(?:lng|lon|longitude)\s*[:=]\s*(-?\d{1,3}(?:\.\d+)?)/i);
  if (latLngPair) {
    const latitude = Number(latLngPair[1]), longitude = Number(latLngPair[2]);
    if (Number.isFinite(latitude) && Number.isFinite(longitude)) return { latitude, longitude };
  }
  return null;
};
const toFiniteNumber = (value: unknown): number | null => {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};
const getEventCoordinates = (event: EventData): { latitude: number; longitude: number } | null => {
  const e = event as EventData & { latitude?: unknown; longitude?: unknown; lat?: unknown; lng?: unknown; geojson?: { coordinates?: unknown }; coordinates?: unknown; };
  const latitude = toFiniteNumber(event.eventLatitude ?? e.latitude ?? e.lat);
  const longitude = toFiniteNumber(event.eventLongitude ?? e.longitude ?? e.lng);
  if (latitude == null || longitude == null) {
    const textCoords = parseCoordinatesFromLocationText(event.eventLocation);
    if (textCoords) return textCoords;
    const candidate = (e.geojson as { coordinates?: unknown } | undefined)?.coordinates ?? e.coordinates;
    if (Array.isArray(candidate) && candidate.length >= 2) {
      const clang = toFiniteNumber(candidate[0]), clat = toFiniteNumber(candidate[1]);
      if (clat != null && clang != null) return { latitude: clat, longitude: clang };
    }
    return null;
  }
  return { latitude, longitude };
};


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
  const [locationFilterStates, setLocationFilterStates] = useState<Record<string, boolean>>({});
  const [priceFilterStates, setPriceFilterStates] = useState<Record<string, boolean>>({});

  const { data: filterOptionsData } = useFilterOptions();
  
  const { lastCoordinates } = useLocationStore();
  const [resolvedEventCoordinates, setResolvedEventCoordinates] = useState<Record<string, { latitude: number; longitude: number }>>({});
  const geocodeCacheRef = useRef<Record<string, { latitude: number; longitude: number } | null>>({});

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
      const isAlreadyActive = !!prev[id];
      if (isAlreadyActive) return {};
      return { [id]: true };
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

  const {
    data: packagesData,
    isLoading: isLoadingPackages,
    error: packagesError,
  } = useOrganiserPackages(organiserIdNum ?? 0, {
    enabled: !!organiserIdNum && !isPrivateCommunity && activeTab === 'packages',
  });

  const packages: PackageData[] = useMemo(() => {
    const raw: any = packagesData as any;
    const list: any[] =
      raw?.data?.packages ??
      raw?.data?.data?.packages ??
      raw?.packages ??
      [];
    if (!Array.isArray(list)) {
      return [];
    }
    return list.map((pkg) => {
      const validityMonths = pkg.validityMonths;
      const validity =
        typeof validityMonths === 'number' && validityMonths > 0
          ? `${validityMonths} ${validityMonths === 1 ? 'month' : 'months'}`
          : typeof pkg.validity === 'string'
            ? pkg.validity
            : '—';
      const eventTypeRaw = pkg.eventType ?? pkg.eventTypes;
      const eventTypeStr = Array.isArray(eventTypeRaw)
        ? eventTypeRaw.filter(Boolean).map(String).join(', ')
        : String(eventTypeRaw || 'All Events');
      return {
        id: String(pkg.packageId ?? pkg.id ?? ''),
        title: String(pkg.packageName ?? pkg.name ?? 'Package'),
        validity,
        sport:
          Array.isArray(pkg.sports) && pkg.sports.length > 0 ? pkg.sports.join(', ') : 'All Sports',
        eventType: eventTypeStr,
        numberOfEvents: Number(pkg.maxEvents ?? pkg.credits ?? 0),
        price: Number(pkg.packagePrice ?? pkg.price ?? 0),
        currency: String(pkg.currency ?? 'AED'),
      };
    });
  }, [packagesData]);

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
  const selectedDistanceKm = useMemo(() => {
    const activeLocationFilter = locationFilters.find(f => f.isActive);
    if (!activeLocationFilter || activeLocationFilter.value === 'everywhere') {
      return null;
    }
    const parsed = Number(activeLocationFilter.value);
    return Number.isFinite(parsed) ? parsed : null;
  }, [locationFilters]);
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

  const { expandedEvents = [] } = useAsyncExpandedEvents(allEvents);

  // Base filtering (everything except distance)
  const eventsBeforeDistance = useMemo(() => {
    let filtered = expandedEvents;
    
    // Filter out past events
    const now = new Date();
    filtered = filtered.filter(event => {
      if (event.eventEndDateTime) {
        return new Date(event.eventEndDateTime) >= now;
      }
      // Fallback: assume 1-hour duration if missing
      const implicitEnd = new Date(new Date(event.eventDateTime).getTime() + 60 * 60 * 1000);
      return implicitEnd >= now;
    });

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

    if (selectedPriceValues.length > 0) {
      filtered = filtered.filter(event =>
        selectedPriceValues.some(price => event.eventPricePerGuest <= price),
      );
    }

    return filtered;
  }, [expandedEvents, dateRangeStrings, selectedDateFullDate, selectedSportsValues, selectedEventTypeValues, selectedPriceValues]);

  // Find events strictly missing coordinates to geocode
  const eventsNeedingGeocode = useMemo(() => {
    if (selectedDistanceKm == null || lastCoordinates?.latitude == null || lastCoordinates?.longitude == null) {
      return [] as EventData[];
    }
    return eventsBeforeDistance.filter((event) => {
      if (getEventCoordinates(event)) return false;
      const key = getEventKey(event);
      if (resolvedEventCoordinates[key]) return false;
      return Boolean(event.eventLocation?.trim());
    });
  }, [selectedDistanceKm, lastCoordinates?.latitude, lastCoordinates?.longitude, eventsBeforeDistance, resolvedEventCoordinates]);

  // Execute async geocoding
  useEffect(() => {
    if (eventsNeedingGeocode.length === 0) return;
    let isCancelled = false;

    const geocodeMissingEvents = async () => {
      for (const event of eventsNeedingGeocode) {
        if (isCancelled) return;
        const locationText = event.eventLocation?.trim();
        if (!locationText) continue;

        const eventKey = getEventKey(event);
        const cached = geocodeCacheRef.current[locationText];
        if (cached !== undefined) {
          if (cached) {
            setResolvedEventCoordinates((prev) => {
              if (prev[eventKey]) return prev;
              return { ...prev, [eventKey]: cached };
            });
          }
          continue;
        }

        try {
          const results = await locationSearchService.search({ query: locationText });
          const first = results[0];
          const coords = first ? { latitude: first.latitude, longitude: first.longitude } : null;
          geocodeCacheRef.current[locationText] = coords;

          if (coords && !isCancelled) {
            setResolvedEventCoordinates((prev) => ({ ...prev, [eventKey]: coords }));
          }
        } catch {
          geocodeCacheRef.current[locationText] = null;
        }
        await new Promise((resolve) => setTimeout(resolve, 1100));
      }
    };
    geocodeMissingEvents();
    return () => { isCancelled = true; };
  }, [eventsNeedingGeocode]);

  // Final filtered result encompassing standard filters + distance filter
  const filteredEvents = useMemo(() => {
    let filtered = eventsBeforeDistance;

    if (selectedDistanceKm != null && lastCoordinates?.latitude != null && lastCoordinates?.longitude != null) {
      filtered = filtered.filter((event) => {
        const eventCoordinates = getEventCoordinates(event) ?? resolvedEventCoordinates[getEventKey(event)];
        if (!eventCoordinates) return false;

        const distanceKm = getDistanceKm(
          lastCoordinates.latitude,
          lastCoordinates.longitude,
          eventCoordinates.latitude,
          eventCoordinates.longitude,
        );
        return distanceKm <= selectedDistanceKm;
      });
    }

    return filtered;
  }, [eventsBeforeDistance, selectedDistanceKm, resolvedEventCoordinates, lastCoordinates?.latitude, lastCoordinates?.longitude]);

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
            <FlexView style={styles.contentZIndex}>
              {isLoadingPackages ? (
                <FlexView style={styles.emptyBox}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <TextDs style={{ marginTop: spacing.sm }}>Loading packages...</TextDs>
                </FlexView>
              ) : packagesError ? (
                <FlexView style={styles.emptyBox}>
                  <TextDs>Failed to load packages</TextDs>
                </FlexView>
              ) : packages.length === 0 ? (
                <FlexView style={styles.emptyBox}>
                  <TextDs>No packages available</TextDs>
                </FlexView>
              ) : (
                <PackagesSection packages={packages} onPackagePress={handlePackagePress} />
              )}
            </FlexView>
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
