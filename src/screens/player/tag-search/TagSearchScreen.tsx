import React, { useMemo } from 'react';
import { StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation';
import { colors, spacing } from '@theme';
import { TextDs } from '@designSystem/atoms/TextDs';
import { ArrowIcon } from '@components/global/ArrowIcon';
import { EventCard } from '@components/global/EventCard';
import { FlexView } from '@components';
import { usePlayerEvents } from '@hooks/use-events';
import type { EventData } from '@app-types';

type TagSearchScreenRouteProp = RouteProp<RootStackParamList, 'TagSearch'>;
type TagSearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TagSearch'>;

/** Normalize for comparison: lowercase, no spaces/special chars */
const normalize = (s: string) => String(s ?? '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

export const TagSearchScreen: React.FC = () => {
    const route = useRoute<TagSearchScreenRouteProp>();
    const navigation = useNavigation<TagSearchScreenNavigationProp>();
    const { searchType, value } = route.params ?? { searchType: undefined, value: undefined };

    const { data, isLoading, isError } = usePlayerEvents();
    const allEvents = data?.events ?? [];

    const events = useMemo(() => {
        const searchValue = (value ?? '').trim();
        if (!searchValue) return [];

        const normalizedSearch = normalize(searchValue);

        let filtered: EventData[] = allEvents;
        if (searchType === 'sport') {
            filtered = allEvents.filter((e) =>
                (e.eventSports ?? []).some((s) => normalize(s) === normalizedSearch || normalize(s).includes(normalizedSearch) || normalizedSearch.includes(normalize(s)))
            );
        } else if (searchType === 'eventType') {
            filtered = allEvents.filter((e) => {
                const type = String(e.eventType ?? '').trim();
                return normalize(type) === normalizedSearch || normalize(type).includes(normalizedSearch) || normalizedSearch.includes(normalize(type));
            });
        } else {
            // Fallback: try both sport and eventType
            filtered = allEvents.filter((e) => {
                const matchSport = (e.eventSports ?? []).some((s) => normalize(s) === normalizedSearch || normalize(s).includes(normalizedSearch) || normalizedSearch.includes(normalize(s)));
                const type = String(e.eventType ?? '').trim();
                const matchType = normalize(type) === normalizedSearch || normalize(type).includes(normalizedSearch) || normalizedSearch.includes(normalize(type));
                return matchSport || matchType;
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return filtered.filter((event) => new Date(event.eventDateTime) >= today);
    }, [allEvents, searchType, value]);

    const handleBack = () => navigation.goBack();
    const handleEventPress = (eventId: string) => {
        if (eventId) {
            navigation.navigate('EventDetails', { eventId });
        }
    };
    const handleBookmark = (eventId: string) => {
        console.log('Bookmark event:', eventId);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <FlexView row alignItems="center" gap={12} style={styles.header}>
                <ArrowIcon variant="left" onClick={handleBack} />
                <FlexView row gap={8} alignItems="center">
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
            ) : events.length === 0 ? (
                <FlexView style={styles.centered}>
                    <TextDs style={styles.emptyText}>No events found</TextDs>
                </FlexView>
            ) : (
                <FlatList
                    data={events}
                    keyExtractor={(item) => item.eventId}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <EventCard
                            id={item.eventId}
                            event={item}
                            onPress={handleEventPress}
                            onBookmark={handleBookmark}
                        />
                    )}
                />
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
    emptyText: {
        color: colors.text.secondary,
        fontSize: 16,
    },
    listContent: {
        padding: spacing.base,
        paddingBottom: spacing.xxl,
        gap: 12,
    },
});
