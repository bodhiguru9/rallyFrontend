import React, { useMemo, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation';
import { colors, spacing } from '@theme';
import { TextDs } from '@designSystem/atoms/TextDs';
import { ArrowIcon } from '@components/global/ArrowIcon';
import { EventCard } from '@components/global/EventCard';
import { FlexView, Seperator } from '@components';
import { usePlayerEvents, useTagSearchEvents } from '@hooks/use-events';
import { FeaturedEventsSection } from '@components/private/home/player-home-content/sections/FeaturedEventsSection';
import { PickedEventsSection } from '@components/private/home/player-home-content/sections/PickedEventsSection';
import { TopOrganisersSection } from '@components/private/home/player-home-content/sections/TopOrganisersSection';
import { useHome } from '../../home/context/Home.context';
import { useAuthStore } from '@store/auth-store';
import { ScrollView } from 'react-native';
import type { EventData } from '@app-types';

type TagSearchScreenRouteProp = RouteProp<RootStackParamList, 'TagSearch'>;
type TagSearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TagSearch'>;

/** Normalize for comparison: lowercase, no spaces/special chars */
const normalize = (s: string) => String(s ?? '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

export const TagSearchScreen: React.FC = () => {
    const route = useRoute<TagSearchScreenRouteProp>();
    const navigation = useNavigation<TagSearchScreenNavigationProp>();
    const { searchType, value } = route.params ?? { searchType: undefined, value: undefined };
    const { isAuthenticated, user } = useAuthStore();
    const isOrganiser = isAuthenticated && user?.userType === 'organiser';
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const params =
        searchType === 'sport'
            ? { eventSports: value }
            : searchType === 'eventType'
                ? { eventType: value }
                : {};
    const { data: searchData, isLoading: isSearchLoading, isError: isSearchError } = useTagSearchEvents({
        eventSports: searchType === 'sport' ? value : undefined,
        eventType: searchType === 'eventType' ? value : undefined,
    });
    
    const { data: dashboardData, isLoading: isDashboardLoading, isError: isDashboardError } = usePlayerEvents();
    
    // Use search results if available, otherwise fallback to dashboard data (e.g. while loading search)
    const allEvents = searchData?.events ?? dashboardData?.events ?? [];
    const isLoading = isSearchLoading && isDashboardLoading;
    const isError = isSearchError && isDashboardError;

    const featuredEvents = useMemo(() => {
        return allEvents.slice(0, 3);
    }, [allEvents]);

    const {
        sportsFilters: globalSportsFilters,
        eventTypeFilters: globalEventTypeFilters,
        locationFilters,
        priceFilters,
        dateFilters,
        toggleSportsFilter,
        toggleEventTypeFilter,
        toggleLocationFilter,
        togglePriceFilter,
        selectDate: globalSelectDate,
        loadMoreDates,
        canLoadMore,
        refetchEvents,
        topOrganisers,
    } = useHome();

    // Lock filters based on search tag
    const lockedSportsFilters = useMemo(() => {
        if (searchType === 'sport' && value) {
            return globalSportsFilters.map(f => ({
                ...f,
                isActive: f.label.toLowerCase() === value.toLowerCase() || f.value.toLowerCase() === value.toLowerCase(),
            }));
        }
        return globalSportsFilters;
    }, [globalSportsFilters, searchType, value]);

    const lockedEventTypeFilters = useMemo(() => {
        if (searchType === 'eventType' && value) {
            return globalEventTypeFilters.map(f => ({
                ...f,
                isActive: f.label.toLowerCase() === value.toLowerCase() || f.value.toLowerCase() === value.toLowerCase(),
            }));
        }
        return globalEventTypeFilters;
    }, [globalEventTypeFilters, searchType, value]);

    const handleBack = () => navigation.goBack();
    const handleEventPress = (eventId: string) => {
        if (eventId) {
            navigation.navigate('EventDetails', { eventId });
        }
    };
    const handleBookmark = (eventId: string) => {
        console.log('Bookmark event:', eventId);
    };

    const handleOrganiserPress = (id: string) => {
        navigation.navigate('PlayerOrgEventDetails', { organiserId: id });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <FlexView row alignItems="center" gap={12} style={styles.header}>
                <ArrowIcon variant="left" onClick={handleBack} />
                <FlexView flex={1} row gap={8} alignItems="center" justifyContent="center" style={{ marginRight: 40 }}>
                    <TextDs size={20} color="blueGray" style={styles.hash}>
                        #
                    </TextDs>
                    <TextDs size={20} weight="bold" style={styles.value}>
                        {value ?? 'Search'}
                    </TextDs>
                </FlexView>
            </FlexView>

            {isLoading ? (
                <FlexView style={styles.centered}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </FlexView>
            ) : isError ? (
                <FlexView style={styles.centered}>
                    <TextDs style={styles.emptyText}>Error loading events</TextDs>
                </FlexView>
            ) : (
                <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
                    {featuredEvents.length > 0 && (
                        <FeaturedEventsSection
                            events={featuredEvents}
                            onEventPress={handleEventPress}
                            onBookmark={handleBookmark}
                        />
                    )}

                    <PickedEventsSection
                        pickedEvents={allEvents}
                        sportsFilters={lockedSportsFilters}
                        eventTypeFilters={lockedEventTypeFilters}
                        locationFilters={locationFilters}
                        priceFilters={priceFilters}
                        dateFilters={dateFilters}
                        toggleSportsFilter={searchType === 'sport' ? () => { } : toggleSportsFilter}
                        toggleEventTypeFilter={searchType === 'eventType' ? () => { } : toggleEventTypeFilter}
                        toggleLocationFilter={toggleLocationFilter}
                        togglePriceFilter={togglePriceFilter}
                        selectDate={globalSelectDate}
                        loadMoreDates={loadMoreDates}
                        canLoadMore={canLoadMore}
                        onEventPress={handleEventPress}
                        onBookmark={handleBookmark}
                    />

                    {!isOrganiser && (
                        <TopOrganisersSection
                            topOrganisers={topOrganisers}
                            onOrganiserPress={handleOrganiserPress}
                            isAuthenticated={isAuthenticated}
                        />
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        experimental_backgroundImage: colors.gradient.mainBackground,
    },
    header: {
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.sm,
    },
    hash: {
        fontStyle: 'italic',
    },
    value: {
        textTransform: 'capitalize',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.base,
    },
    emptyCentered: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.base,
        marginTop: spacing.xl,
    },
    emptyText: {
        color: colors.text.secondary,
        fontSize: 16,
    },
    listContent: {
        paddingBottom: spacing.xxl,
        gap: 12,
    },
});
