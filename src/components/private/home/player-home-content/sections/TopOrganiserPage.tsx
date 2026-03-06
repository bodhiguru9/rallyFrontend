import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation';
import type { Organiser } from '@screens/home/Home.types';
import { spacing } from '@theme';
import { PickedForYouSection } from '@components/private/home/player-orginser-content/components/PickedForYouSection/PickedForYouSection.tsx';
import { PICKED_ORGANISERS } from '@components/private/home/player-orginser-content/data/playerOrginser.data';
import { useHome } from '@screens';
import { FlexView, TextDs } from '@components';
import { ArrowIcon } from '@components/global/ArrowIcon';

type TopOrganiserPageNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface TopOrganiserPageProps {
    topOrganisers?: Organiser[];
    isAuthenticated?: boolean;
    onOrganiserPress?: (id: number | string, communityName?: string) => void;
}

export const TopOrganiserPage: React.FC<TopOrganiserPageProps> = () => {
    const navigation = useNavigation<TopOrganiserPageNavigationProp>();
    const { communities, isLoadingCommunities, communitiesError } = useHome();

    const handleOrganiserPress = (id: string | number, communityName?: string) => {
        // Extract the userId from the id (which may be in format "community-123")
        const organiserId = String(id).replace('community-', '');
        console.log('[TopOrganiserPage] Navigating to organiser:', { 
            originalId: id, 
            cleanedId: organiserId, 
            communityName 
        });
        navigation.navigate('PlayerOrgEventDetails', { 
            organiserId, 
            communityName 
        });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <FlexView style={styles.header}>
                <ArrowIcon variant="left" onClick={() => navigation.goBack()} />
                <TextDs style={styles.headerTitle}>Top Organisers</TextDs>
                <FlexView style={styles.headerRight} />
            </FlexView>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Picked for you Section */}
                <PickedForYouSection
                    organisers={PICKED_ORGANISERS}
                    communities={communities}
                    isLoadingCommunities={isLoadingCommunities}
                    communitiesError={communitiesError}
                    onOrganiserPress={handleOrganiserPress}
                />

                <FlexView width={"100%"} height={100} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C9E9E6', // Match your app theme
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.md,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000000',
        flex: 1,
        textAlign: 'center',
    },
    headerRight: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    featuredCardContainer: {
        paddingHorizontal: spacing.base,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
    },
});